'use client'
import { useState } from 'react'
import { createMultiItemOrder } from '@/app/actions/orders'

export default function OrderForm({ customers, products }: { customers: any[], products: any[] }) {
  const [customerId, setCustomerId] = useState(customers[0]?.id || '')
  const [items, setItems] = useState([{ productId: products[0]?.id || '', quantity: 1 }])
  const [loading, setLoading] = useState(false)

  if (customers.length === 0 || products.length === 0) {
    return <p style={{ color: 'var(--warning)' }}>Sipariş oluşturmak için önce müşteri ve ürün eklemelisiniz.</p>
  }

  const addItem = () => {
    setItems([...items, { productId: products[0]?.id || '', quantity: 1 }])
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerId || items.length === 0) return

    setLoading(true)
    const formattedItems = items.map(item => ({
      ...item,
      quantity: parseInt(item.quantity as any) || 1
    }))

    await createMultiItemOrder({ customerId, items: formattedItems })
    
    setItems([{ productId: products[0]?.id || '', quantity: 1 }])
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Müşteri</label>
        <select value={customerId} onChange={e => setCustomerId(e.target.value)} className="form-input" required style={{ background: 'var(--bg-secondary)', maxWidth: '300px' }}>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--text-muted)' }}>Ürünler</h3>
        {items.map((item, index) => (
          <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 100px auto', gap: '1rem', alignItems: 'end', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Ürün</label>
              <select 
                value={item.productId} 
                onChange={e => updateItem(index, 'productId', e.target.value)} 
                className="form-input" 
                required 
                style={{ background: 'var(--bg-secondary)' }}
              >
                {products.map(p => <option key={p.id} value={p.id}>{p.name} - ₺{p.price} (Stok: {p.stock})</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Adet</label>
              <input 
                type="number" 
                value={item.quantity} 
                onChange={e => updateItem(index, 'quantity', e.target.value)} 
                min="1" 
                className="form-input" 
                required 
              />
            </div>
            {items.length > 1 && (
              <button 
                type="button" 
                onClick={() => removeItem(index)} 
                className="btn" 
                style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.5rem' }}
                title="Ürünü Çıkar"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addItem} className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
          + Başka Ürün Ekle
        </button>
      </div>

      <button type="submit" disabled={loading} className="btn" style={{ background: 'var(--primary)', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
        {loading ? 'İşleniyor...' : 'Siparişi Tamamla & Fatura Kes'}
      </button>
    </form>
  )
}
