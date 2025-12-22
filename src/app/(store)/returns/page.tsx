import { getCMSPage } from '@/lib/actions/cms'
import ReturnsClient from './returns-client'

export default async function ReturnsPage() {
    const page = await getCMSPage('returns')

    return <ReturnsClient cmsContent={page?.is_published ? page.content : undefined} />
}
