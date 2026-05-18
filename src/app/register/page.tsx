'use client'

import { useActionState, useEffect } from 'react'
import { register } from '@/app/actions/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const initialState = {
  error: ''
}

export default function RegisterPage() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await register(formData)
      if (result?.error) {
        return { error: result.error, success: false }
      }
      return { error: '', success: true }
    },
    initialState
  )

  useEffect(() => {
    if (state.success) {
      router.push('/dashboard')
    }
  }, [state.success, router])

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
