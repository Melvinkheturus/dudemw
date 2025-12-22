import { getCMSPage } from '@/lib/actions/cms'
import FAQClient from './faq-client'

export default async function FAQPage() {
    const page = await getCMSPage('faq')

    return <FAQClient cmsContent={page?.is_published ? page.content : undefined} />
}
