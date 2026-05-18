'use server'

import { db } from '@/lib/db'
import { encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { error: 'Kullanıcı adı ve şifre gerekli' }
  }

  const user = await db.user.findUnique({ where: { username } })

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: 'Geçersiz kullanıcı adı veya şifre' }
  }

  const expires = new Date(Date.now() + 10 * 60 * 60 * 1000)
  const session = await encrypt({ user, expires })
  
  const cookieStore = await cookies()
  cookieStore.set('session', session, { expires, httpOnly: true })
  
  return { success: true }
}

export async function register(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const companyName = formData.get('companyName') as string

  if (!username || !password || !companyName) {
    return { error: 'Tüm alanları doldurunuz' }
  }

  const existing = await db.user.findUnique({ where: { username } })
  if (existing) {
    return { error: 'Bu kullanıcı adı zaten alınmış' }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await db.user.create({
    data: {
      username,
      passwordHash,
      companyName,
    },
  })

  const expires = new Date(Date.now() + 10 * 60 * 60 * 1000)
  const session = await encrypt({ user, expires })
  
  const cookieStore = await cookies()
  cookieStore.set('session', session, { expires, httpOnly: true })
  
  return { success: true }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.set('session', '', { expires: new Date(0) })
  redirect('/login')
}
