'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'
import Link from 'next/link'

const initialState = {
  error: ''
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await login(formData)
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
        <h1>Giriş Yap</h1>
        <p>Depo yönetim sistemine hoş geldiniz</p>

        {state.error && <div className="error-message">{state.error}</div>}

        <form action={formAction}>
          <div className="form-group">
            <label htmlFor="username">Kullanıcı Adı</label>
            <input type="text" id="username" name="username" className="form-input" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input type="password" id="password" name="password" className="form-input" required />
          </div>

          <button type="submit" className="btn" disabled={isPending}>
            {isPending ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p style={{ marginTop: '2rem', marginBottom: 0, fontSize: '0.875rem' }}>
          Hesabınız yok mu? <Link href="/register" className="link">Kayıt Ol</Link>
        </p>
      </div>
    </div>
  )
}
