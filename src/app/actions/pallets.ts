'use server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function addPallet(formData: FormData) {
  const session = await getSession()
  if (!session) return

  const productId = formData.get('productId') as string
  const quantity = parseInt(formData.get('quantity') as string)
  const location = formData.get('location') as string

  await db.pallet.create({
    data: {
      userId: session.user.id,
      productId,
      quantity,
      location,
      status: 'AVAILABLE'
    }
  })
  revalidatePath('/dashboard/pallets')
}

export async function getPallets() {
  const session = await getSession()
  if (!session) return { pallets: [], products: [] }

  const pallets = await db.pallet.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: 'desc' }
  })

  const products = await db.product.findMany({
    where: { userId: session.user.id }
  })

  return { pallets, products }
}
