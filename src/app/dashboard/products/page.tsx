import { getProducts, addProduct, addStock } from '@/app/actions/products'

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Ürün ve Stok Yönetimi</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Yeni Ürün Ekle</h2>
          <form action={addProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Ürün Adı</label>
              <input type="text" name="name" className="form-input" required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>SKU</label>
              <input type="text" name="sku" className="form-input" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Birim Fiyat (₺)</label>
              <input type="number" step="0.01" name="price" defaultValue="0.00" className="form-input" required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Min Stok Uyarısı</label>
              <input type="number" name="minStockAlert" defaultValue="10" className="form-input" required />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Başlangıç Stoğu (Adet)</label>
              <input type="number" name="stock" defaultValue="0" min="0" className="form-input" required />
            </div>
            <button type="submit" className="btn" style={{ gridColumn: '1 / -1' }}>Ürünü Ekle</button>
          </form>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Mevcut Ürüne Stok Ekle</h2>
          {products.length === 0 ? (
            <p style={{ color: 'var(--warning)' }}>Önce ürün eklemelisiniz.</p>
          ) : (
            <form action={addStock} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Ürün Seç</label>
                <select name="productId" className="form-input" required style={{ background: 'var(--bg-secondary)' }}>
                  {products.map((p: any) => <option key={p.id} value={p.id}>{p.name} (Mevcut: {p.stock})</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Eklenecek Adet</label>
                <input type="number" name="quantity" defaultValue="1" min="1" className="form-input" required />
              </div>
              <button type="submit" className="btn" style={{ background: 'var(--success)' }}>Stoğu Güncelle</button>
            </form>
          )}
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '1rem' }}>Ürün Adı</th>
              <th style={{ padding: '1rem' }}>SKU</th>
              <th style={{ padding: '1rem' }}>Fiyat</th>
              <th style={{ padding: '1rem' }}>Mevcut Adet</th>
              <th style={{ padding: '1rem' }}>Durum</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && <tr><td colSpan={5} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>Kayıtlı ürün yok.</td></tr>}
            {products.map((p: any) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '1rem' }}>{p.name}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{p.sku || '-'}</td>
                <td style={{ padding: '1rem' }}>₺{p.price.toLocaleString('tr-TR')}</td>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{p.stock}</td>
                <td style={{ padding: '1rem' }}>
                  {p.stock < p.minStockAlert ? (
                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', borderRadius: '4px' }}>Kritik Seviye</span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(16,185,129,0.1)', color: 'var(--success)', borderRadius: '4px' }}>Yeterli</span>
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
