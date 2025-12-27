import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

const GUEST_ID_COOKIE = 'guest_id'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

export async function getGuestId(): Promise<string> {
  const cookieStore = await cookies()
  let guestId = cookieStore.get(GUEST_ID_COOKIE)?.value

  if (!guestId) {
    guestId = uuidv4()
    cookieStore.set(GUEST_ID_COOKIE, guestId, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
  }

  return guestId
}

export async function clearGuestId(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(GUEST_ID_COOKIE)
}
