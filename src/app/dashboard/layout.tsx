import Link from 'next/link'
import { logout } from '@/app/actions/auth'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ marginBottom: '2rem', color: 'var(--primary)' }}>Depo Yönetimi</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link href="/dashboard" className="link" style={{ color: 'var(--text)' }}>Ana Ekran</Link>
          <Link href="/dashboard/products" className="link" style={{ color: 'var(--text)' }}>Ürünler</Link>
          <Link href="/dashboard/orders" className="link" style={{ color: 'var(--text)' }}>Siparişler</Link>
          <Link href="/dashboard/customers" className="link" style={{ color: 'var(--text)' }}>Müşteriler</Link>
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <form action={logout}>
            <button className="btn" style={{ background: 'var(--danger)', width: '100%' }}>Çıkış Yap</button>
          </form>
        </div>
      </aside>
      <main className="main-content">
        <div className="container" style={{ padding: 0 }}>
          {children}
        </div>
      </main>
    </div>
  )
}
