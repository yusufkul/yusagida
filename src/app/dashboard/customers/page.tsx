import { getCustomers, addCustomer, addPayment } from '@/app/actions/customers'

export default async function CustomersPage() {
  const customers = await getCustomers()

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Müşteri ve Cari Yönetimi</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Yeni Müşteri Ekle</h2>
          <form action={addCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Müşteri / Firma Adı</label>
              <input type="text" name="name" className="form-input" required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>E-posta</label>
              <input type="email" name="email" className="form-input" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Telefon</label>
              <input type="text" name="phone" className="form-input" />
            </div>
            <button type="submit" className="btn">Ekle</button>
          </form>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Tahsilat Gir (Ödeme Al)</h2>
          {customers.length === 0 ? (
            <p style={{ color: 'var(--warning)' }}>Önce müşteri eklemelisiniz.</p>
          ) : (
            <form action={addPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Müşteri</label>
                <select name="customerId" className="form-input" required style={{ background: 'var(--bg-secondary)' }}>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Tutar (₺)</label>
                <input type="number" step="0.01" name="amount" className="form-input" required />
              </div>
              <button type="submit" className="btn" style={{ background: 'var(--success)' }}>Tahsilatı Kaydet</button>
            </form>
          )}
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '1rem' }}>Firma Adı</th>
              <th style={{ padding: '1rem' }}>Telefon</th>
              <th style={{ padding: '1rem' }}>E-posta</th>
              <th style={{ padding: '1rem' }}>Güncel Bakiye</th>
              <th style={{ padding: '1rem' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && <tr><td colSpan={5} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>Kayıtlı müşteri yok.</td></tr>}
            {customers.map((c: any) => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '1rem' }}>{c.name}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{c.phone || '-'}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{c.email || '-'}</td>
                <td style={{ padding: '1rem', color: c.balance < 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 'bold' }}>
                  ₺{c.balance.toLocaleString('tr-TR')}
                </td>
                <td style={{ padding: '1rem' }}>
                  <a href={`/dashboard/customers/detail?id=${c.id}`} className="link" style={{ fontSize: '0.875rem' }}>Hesap Hareketleri</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
