'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getCustomerDetails } from '@/app/actions/customers'

function CustomerDetailContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      getCustomerDetails(id).then((data) => {
        setCustomer(data)
        setLoading(false)
      }).catch(err => {
        console.error(err)
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [id])

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>
  }

  if (!customer) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Müşteri bulunamadı veya ID eksik.</h2>
        <Link href="/dashboard/customers" className="btn" style={{ background: 'var(--bg-secondary)', marginTop: '1rem', display: 'inline-block' }}>Geri Dön</Link>
      </div>
    )
  }

  // Combine orders and payments into a timeline
  const activities = [
    ...customer.orders.map((order: any) => ({
      id: `order-${order.id}`,
      date: new Date(order.createdAt),
      type: 'Sipariş / Fatura',
      description: order.invoices && order.invoices.length > 0 ? `Fatura No: ${order.invoices[0].invoiceNumber}` : 'Sipariş',
      amount: order.totalAmount,
      isDebt: true
    })),
    ...customer.payments.map((payment: any) => ({
      id: `payment-${payment.id}`,
      date: new Date(payment.date),
      type: 'Tahsilat (Ödeme)',
      description: 'Nakit/Banka Tahsilatı',
      amount: payment.amount,
      isDebt: false
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Hesap Hareketleri: {customer.name}</h1>
        <Link href="/dashboard/customers" className="btn" style={{ background: 'var(--bg-secondary)', width: 'auto' }}>Geri Dön</Link>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Müşteri Özeti</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Telefon:</span> {customer.phone || '-'}
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>E-posta:</span> {customer.email || '-'}
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Güncel Bakiye:</span> 
            <span style={{ marginLeft: '0.5rem', fontWeight: 'bold', color: customer.balance < 0 ? 'var(--danger)' : 'var(--success)' }}>
              ₺{customer.balance.toLocaleString('tr-TR')}
            </span>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '1rem' }}>Tarih</th>
              <th style={{ padding: '1rem' }}>İşlem Türü</th>
              <th style={{ padding: '1rem' }}>Açıklama</th>
              <th style={{ padding: '1rem' }}>Tutar</th>
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 && <tr><td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>Kayıtlı hareket yok.</td></tr>}
            {activities.map((act) => (
              <tr key={act.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '1rem' }}>{act.date.toLocaleDateString('tr-TR')} {act.date.toLocaleTimeString('tr-TR')}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px',
                    background: act.isDebt ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', 
                    color: act.isDebt ? 'var(--danger)' : 'var(--success)'
                  }}>
                    {act.type}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{act.description}</td>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: act.isDebt ? 'var(--danger)' : 'var(--success)' }}>
                  {act.isDebt ? '+' : '-'}₺{act.amount.toLocaleString('tr-TR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function CustomerDetailsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>}>
      <CustomerDetailContent />
    </Suspense>
  )
}
