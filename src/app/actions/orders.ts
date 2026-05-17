'use server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createMultiItemOrder(data: { customerId: string, items: { productId: string, quantity: number }[] }) {
  const session = await getSession()
  if (!session) return

  const { customerId, items } = data
  if (!customerId || !items || items.length === 0) return

  let totalAmount = 0
  const orderItemsData = []

  for (const item of items) {
    const product = await db.product.findUnique({ where: { id: item.productId } })
    if (!product) continue

    totalAmount += product.price * item.quantity
    orderItemsData.push({
      productId: item.productId,
      quantity: item.quantity,
      price: product.price
    })

    await db.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } }
    })
  }

  if (orderItemsData.length === 0) return

  const order = await db.order.create({
    data: {
      userId: session.user.id,
      customerId,
      totalAmount,
      status: 'PENDING',
      items: {
        create: orderItemsData
      }
    }
  })

  await db.invoice.create({
    data: {
      userId: session.user.id,
      orderId: order.id,
      invoiceNumber: `INV-${Date.now()}`,
      total: totalAmount
    }
  })

  await db.customer.update({
    where: { id: customerId },
    data: { balance: { increment: totalAmount } }
  })

  revalidatePath('/dashboard/orders')
  revalidatePath('/dashboard/customers')
  revalidatePath('/dashboard/products')
}

export async function updateOrderStatus(formData: FormData) {
  const session = await getSession()
  if (!session) return

  const orderId = formData.get('orderId') as string
  const status = formData.get('status') as string

  await db.order.update({
    where: { id: orderId, userId: session.user.id },
    data: { status }
  })

  revalidatePath('/dashboard/orders')
}

export async function getOrders() {
  const session = await getSession()
  if (!session) return { orders: [], customers: [], products: [] }

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: { customer: true, items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  })

  const customers = await db.customer.findMany({ where: { userId: session.user.id } })
  const products = await db.product.findMany({ where: { userId: session.user.id } })

  return { orders, customers, products }
}
