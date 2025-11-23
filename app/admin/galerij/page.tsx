import { createClient } from '@/utils/supabase/server'
import PhotoUploader from '@/components/admin/PhotoUploader'

export default async function AdminGalleryPage() {
    const supabase = await createClient()

    // Fetch activities for the dropdown
    const { data: activities } = await supabase
        .from('activities')
        .select('id, title, date')
        .order('date', { ascending: false })

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Foto's Uploaden</h1>
            <PhotoUploader activities={activities || []} />
        </div>
    )
}
