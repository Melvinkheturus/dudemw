import { getCMSPage } from '@/lib/actions/cms'
import { CMSEditForm } from '@/domains/admin/settings/cms-edit-form'
import { notFound } from 'next/navigation'

export default async function CMSPageEditPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const page = await getCMSPage(slug)

    if (!page) notFound()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit {page.title}</h1>
                <p className="text-gray-500 mt-2">Update content and settings for this page.</p>
            </div>
            <CMSEditForm page={page} />
        </div>
    )
}
