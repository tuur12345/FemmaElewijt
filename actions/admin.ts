'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// --- ACTIVITIES ---

export async function createActivity(formData: FormData) {
    const supabase = await createClient()

    // Check admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Basic validation could be added here

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const date = formData.get('date') as string
    const start_time = formData.get('start_time') as string
    const location = formData.get('location') as string
    const price_text = formData.get('price_text') as string
    const max_participants = formData.get('max_participants') ? parseInt(formData.get('max_participants') as string) : null
    const manager_id = formData.get('manager_id') as string || null
    const cover_image_url = formData.get('cover_image_url') as string || null

    const { error } = await supabase
        .from('activities')
        .insert({
            title,
            description,
            date,
            start_time,
            location,
            price_text,
            max_participants,
            cover_image_url,
            manager_id
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/activiteiten')
    revalidatePath('/activiteiten')
    revalidatePath('/')
    redirect('/admin/activiteiten')
}

export async function deleteActivity(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('activities').delete().eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/admin/activiteiten')
    revalidatePath('/activiteiten')
    return { success: true }
}

// --- PHOTOS ---

export async function uploadActivityPhotos(formData: FormData) {
    const supabase = await createClient()
    const activityId = formData.get('activity_id') as string
    const files = formData.getAll('photos') as File[]

    if (!files || files.length === 0) return { error: 'No files provided' }

    let successCount = 0
    let errors = []

    for (const file of files) {
        if (file.size === 0) continue

        try {
            // Upload directly without compression
            const fileName = `photos/${activityId}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`

            const { error: uploadError } = await supabase.storage
                .from('activity_photos')
                .upload(fileName, file, {
                    contentType: 'image/jpeg'
                })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('activity_photos')
                .getPublicUrl(fileName)

            const { error: dbError } = await supabase
                .from('activity_photos')
                .insert({
                    activity_id: activityId,
                    url: publicUrl
                })

            if (dbError) throw dbError

            successCount++
        } catch (e: any) {
            errors.push(e.message)
        }
    }

    revalidatePath(`/galerij/${activityId}`)
    revalidatePath('/galerij')

    return { success: true, count: successCount, errors }
}

export async function saveActivityPhotos(activityId: string, urls: string[]) {
    const supabase = await createClient()

    // Check admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Verify admin role (double check)
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') return { error: 'Unauthorized' }

    const records = urls.map(url => ({
        activity_id: activityId,
        url
    }))

    const { error } = await supabase
        .from('activity_photos')
        .insert(records)

    if (error) return { error: error.message }

    revalidatePath(`/galerij/${activityId}`)
    revalidatePath('/galerij')
    return { success: true }
}

export async function getUsers() {
    const supabase = await createClient()

    // Check admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    // Verify admin role
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') return []

    const { data: users } = await supabase
        .from('users')
        .select('id, name, email')
        .order('name')

    return users || []
}

export async function updateActivity(id: string, formData: FormData) {
    const supabase = await createClient()

    // Check auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Check permissions (manager or admin)
    const { data: activity } = await supabase
        .from('activities')
        .select('manager_id')
        .eq('id', id)
        .single()

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (activity?.manager_id !== user.id && profile?.role !== 'admin') {
        return { error: 'Unauthorized' }
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const date = formData.get('date') as string
    const start_time = formData.get('start_time') as string
    const location = formData.get('location') as string
    const price_text = formData.get('price_text') as string
    const max_participants = formData.get('max_participants') ? parseInt(formData.get('max_participants') as string) : null
    const manager_id = formData.get('manager_id') as string || null
    const cover_image_url = formData.get('cover_image_url') as string || null

    const updateData: any = {
        title,
        description,
        date,
        start_time,
        location,
        price_text,
        max_participants,
        manager_id,
        updated_at: new Date().toISOString()
    }

    if (cover_image_url) {
        updateData.cover_image_url = cover_image_url
    }

    const { error } = await supabase
        .from('activities')
        .update(updateData)
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath(`/activiteiten/${id}`)
    revalidatePath('/admin/activiteiten')
    revalidatePath('/activiteiten')
    revalidatePath('/')

    // Redirect based on role
    if (profile?.role === 'admin') {
        redirect('/admin/activiteiten')
    } else {
        redirect(`/activiteiten/${id}`)
    }
}
