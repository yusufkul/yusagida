import { getDashboardStats } from '@/app/actions/dashboard'

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  if (!stats) return <div>Yükleniyor...</div>

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Ana Ekran</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>Toplam Alacaklar</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)', marginTop: '0.5rem' }}>
            ₺{stats.totalDebt.toLocaleString('tr-TR')}
          </p>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>Kayıtlı Ürün</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
            {stats.totalProducts}
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>Kayıtlı Müşteri</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
            {stats.totalCustomers}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--warning)', fontSize: '1.25rem' }}>Kritik Stok Uyarıları</h2>
          {stats.lowStockAlerts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Şu anda kritik seviyede ürün yok.</p>
          ) : (
            <ul style={{ listStyle: 'none' }}>
              {stats.lowStockAlerts.map(alert => (
                <li key={alert.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                  <span>{alert.name}</span>
                  <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>
                    {alert.totalQuantity} / {alert.minStockAlert}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Son Siparişler</h2>
          {stats.recentOrders.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Henüz sipariş yok.</p>
          ) : (
            <ul style={{ listStyle: 'none' }}>
              {stats.recentOrders.map(order => (
                <li key={order.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                  <span>{order.customer.name}</span>
                  <span style={{ color: 'var(--success)' }}>₺{order.totalAmount.toLocaleString('tr-TR')}</span>
                  <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                    {order.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
