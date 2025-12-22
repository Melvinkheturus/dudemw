import { getCMSPage } from '@/lib/actions/cms'
import AboutClient from './about-client'

export default async function AboutPage() {
    const page = await getCMSPage('about-us')

    return <AboutClient cmsContent={page?.is_published ? page.content : undefined} />
}
