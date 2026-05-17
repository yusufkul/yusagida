import { getPallets, addPallet } from '@/app/actions/pallets'

export default async function PalletsPage() {
  const { pallets, products } = await getPallets()

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Palet Yönetimi</h1>
      
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Yeni Palet Girişi</h2>
        {products.length === 0 ? (
          <p style={{ color: 'var(--warning)' }}>Önce ürün eklemelisiniz.</p>
        ) : (
          <form action={addPallet} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Ürün</label>
              <select name="productId" className="form-input" required style={{ background: 'var(--bg-secondary)' }}>
                {products.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Adet</label>
              <input type="number" name="quantity" defaultValue="1" min="1" className="form-input" required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Depo Konumu (Opsiyonel)</label>
              <input type="text" name="location" placeholder="Örn: A-12" className="form-input" />
            </div>
            <button type="submit" className="btn">Kaydet</button>
          </form>
        )}
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '1rem' }}>Palet ID</th>
              <th style={{ padding: '1rem' }}>Ürün</th>
              <th style={{ padding: '1rem' }}>Adet</th>
              <th style={{ padding: '1rem' }}>Konum</th>
              <th style={{ padding: '1rem' }}>Durum</th>
            </tr>
          </thead>
          <tbody>
            {pallets.length === 0 && <tr><td colSpan={5} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>Kayıtlı palet yok.</td></tr>}
            {pallets.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{p.id.split('-')[0]}</td>
                <td style={{ padding: '1rem' }}>{p.product.name}</td>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{p.quantity}</td>
                <td style={{ padding: '1rem' }}>{p.location || '-'}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: p.status === 'AVAILABLE' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.1)', color: p.status === 'AVAILABLE' ? 'var(--success)' : 'inherit', borderRadius: '4px' }}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
