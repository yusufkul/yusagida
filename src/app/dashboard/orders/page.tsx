import { getOrders, updateOrderStatus } from '@/app/actions/orders'
import OrderForm from './OrderForm'

export default async function OrdersPage() {
  const { orders, customers, products } = await getOrders()

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Sipariş ve Fatura Yönetimi</h1>
      
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Yeni Sipariş Oluştur</h2>
        <OrderForm customers={customers} products={products} />
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '1rem' }}>Sipariş Tarihi</th>
              <th style={{ padding: '1rem' }}>Firma</th>
              <th style={{ padding: '1rem' }}>Ürünler</th>
              <th style={{ padding: '1rem' }}>Toplam Tutar</th>
              <th style={{ padding: '1rem' }}>Durum</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && <tr><td colSpan={5} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>Henüz sipariş yok.</td></tr>}
            {orders.map((o: any) => (
              <tr key={o.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '1rem' }}>{o.createdAt.toLocaleDateString('tr-TR')}</td>
                <td style={{ padding: '1rem' }}>{o.customer.name}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                  {o.items.map((item: any) => (
                    <div key={item.id}>- {item.product.name} ({item.quantity} adet)</div>
                  ))}
                </td>
                <td style={{ padding: '1rem', color: 'var(--success)' }}>₺{o.totalAmount.toLocaleString('tr-TR')}</td>
                <td style={{ padding: '1rem' }}>
                  {o.status === 'PENDING' ? (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(234,179,8,0.1)', color: 'var(--warning)', borderRadius: '4px' }}>
                        Yola Çıkmadı
                      </span>
                      <form action={updateOrderStatus}>
                        <input type="hidden" name="orderId" value={o.id} />
                        <input type="hidden" name="status" value="DELIVERED" />
                        <button type="submit" className="btn" style={{ background: 'var(--success)', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                          Teslim Edildi
                        </button>
                      </form>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(16,185,129,0.1)', color: 'var(--success)', borderRadius: '4px' }}>
                      Götürüldü (Teslim Edildi)
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
