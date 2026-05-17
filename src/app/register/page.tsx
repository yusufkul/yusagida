'use client'

import { useActionState } from 'react'
import { register } from '@/app/actions/auth'
import Link from 'next/link'

const initialState = {
  error: ''
}

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await register(formData)
      if (result?.error) {
        return { error: result.error }
      }
      return prevState
    },
    initialState
  )

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card">
        <h1>Kayıt Ol</h1>
        <p>Yeni bir şirket hesabı oluşturun</p>

        {state.error && <div className="error-message">{state.error}</div>}

        <form action={formAction}>
          <div className="form-group">
            <label htmlFor="companyName">Şirket Adı</label>
            <input type="text" id="companyName" name="companyName" className="form-input" required />
          </div>

          <div className="form-group">
            <label htmlFor="username">Kullanıcı Adı</label>
            <input type="text" id="username" name="username" className="form-input" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input type="password" id="password" name="password" className="form-input" required />
          </div>

          <button type="submit" className="btn" disabled={isPending}>
            {isPending ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p style={{ marginTop: '2rem', marginBottom: 0, fontSize: '0.875rem' }}>
          Zaten hesabınız var mı? <Link href="/login" className="link">Giriş Yap</Link>
        </p>
      </div>
    </div>
  )
}
