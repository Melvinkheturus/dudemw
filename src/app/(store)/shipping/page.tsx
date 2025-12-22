import { getCMSPage } from '@/lib/actions/cms'
import ShippingClient from './shipping-client'

export default async function ShippingPage() {
    const page = await getCMSPage('shipping-policy')

    return <ShippingClient cmsContent={page?.is_published ? page.content : undefined} />
}
