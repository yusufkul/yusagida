'use server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function addProduct(formData: FormData) {
  const session = await getSession()
  if (!session) return

  const name = formData.get('name') as string
  const sku = formData.get('sku') as string
  const minStockAlert = parseInt(formData.get('minStockAlert') as string)
  const price = parseFloat(formData.get('price') as string)
  const stock = parseInt(formData.get('stock') as string) || 0

  await db.product.create({
    data: {
      userId: session.user.id,
      name,
      sku,
      minStockAlert,
      price,
      stock
    }
  })
  revalidatePath('/dashboard/products')
}

export async function addStock(formData: FormData) {
  const session = await getSession()
  if (!session) return

  const productId = formData.get('productId') as string
  const quantity = parseInt(formData.get('quantity') as string)

  if (!productId || isNaN(quantity)) return

  await db.product.update({
    where: { id: productId },
    data: { stock: { increment: quantity } }
  })
  
  revalidatePath('/dashboard/products')
}

export async function getProducts() {
  const session = await getSession()
  if (!session) return []

  return await db.product.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })
}
