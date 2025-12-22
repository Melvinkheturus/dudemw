'use client'

import { useState } from 'react'
import { CMSPage, updateCMSPage } from '@/lib/actions/cms'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2, Save } from 'lucide-react'

export function CMSEditForm({ page }: { page: CMSPage }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const title = formData.get('title') as string
        const content = formData.get('content') as string
        const is_published = formData.get('is_published') === 'on'

        try {
            await updateCMSPage(page.slug, { title, content, is_published })
            toast.success('Page updated successfully')
            router.refresh()
        } catch (error) {
            toast.error('Failed to update page')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8 max-w-4xl">
            <div className="grid gap-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="grid gap-2">
                    <Label htmlFor="title">Page Title</Label>
                    <Input id="title" name="title" defaultValue={page.title} required />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="slug">Slug (Read-only)</Label>
                    <Input id="slug" value={page.slug} disabled className="bg-gray-50" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="content">Content (Markdown)</Label>
                    <Textarea
                        id="content"
                        name="content"
                        defaultValue={page.content}
                        className="min-h-[400px] font-mono text-sm"
                        required
                    />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-0.5">
                        <Label htmlFor="is_published">Published Status</Label>
                        <p className="text-sm text-gray-500">Make this page visible to the public</p>
                    </div>
                    <Switch id="is_published" name="is_published" defaultChecked={page.is_published} />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white min-w-[150px]">
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
            </div>
        </form>
    )
}
