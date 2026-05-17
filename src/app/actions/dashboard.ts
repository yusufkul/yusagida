'use server'

import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function getDashboardStats() {
  const session = await getSession()
  if (!session) return null

  const userId = session.user.id

  const products = await db.product.findMany({
    where: { userId }
  })

  // Calculate low stock
  const lowStockAlerts = products.map((p: any) => {
    return {
      id: p.id,
      name: p.name,
      totalQuantity: p.stock,
      minStockAlert: p.minStockAlert,
      isLow: p.stock < p.minStockAlert
    }
  }).filter((p: any) => p.isLow)

  const customers = await db.customer.findMany({
    where: { userId }
  })

  const totalDebt = customers.reduce((acc: number, c: any) => acc + c.balance, 0)

  const recentOrders = await db.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { customer: true }
  })

  return {
    lowStockAlerts,
    totalDebt,
    recentOrders,
    totalProducts: products.length,
    totalCustomers: customers.length
  }
}
