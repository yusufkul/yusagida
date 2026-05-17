'use server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function addCustomer(formData: FormData) {
  const session = await getSession()
  if (!session) return

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string

  await db.customer.create({
    data: {
      userId: session.user.id,
      name,
      email,
      phone
    }
  })
  revalidatePath('/dashboard/customers')
}

export async function addPayment(formData: FormData) {
  const session = await getSession()
  if (!session) return

  const customerId = formData.get('customerId') as string
  const amount = parseFloat(formData.get('amount') as string)

  await db.payment.create({
    data: {
      userId: session.user.id,
      customerId,
      amount
    }
  })

  // Decrease customer balance
  await db.customer.update({
    where: { id: customerId },
    data: { balance: { decrement: amount } }
  })
  
  revalidatePath('/dashboard/customers')
}

export async function getCustomers() {
  const session = await getSession()
  if (!session) return []

  return await db.customer.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getCustomerDetails(id: string) {
  const session = await getSession()
  if (!session) return null

  const customer = await db.customer.findUnique({
    where: { id, userId: session.user.id },
    include: {
      orders: {
        include: { invoices: true }
      },
      payments: true
    }
  })
  
  if (!customer) return null;
  return customer;
}
