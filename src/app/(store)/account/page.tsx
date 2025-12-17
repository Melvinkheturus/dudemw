import { ProfilePage } from '@/domains/profile'

export const metadata = {
  title: 'My Account - Dude Menswear',
  description: 'Manage your account, orders, addresses, and preferences.',
}

export default function AccountPage() {
  return (
    <div className="account-page-wrapper">
      <ProfilePage />
    </div>
  )
}
