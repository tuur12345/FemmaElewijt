'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import sharp from 'sharp'

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

    // Handle Cover Image
    const coverImage = formData.get('cover_image') as File
    let cover_image_url = null

    if (coverImage && coverImage.size > 0) {
        const buffer = Buffer.from(await coverImage.arrayBuffer())
        // Compress image
        const compressedBuffer = await sharp(buffer)
            .resize(1200, 800, { fit: 'cover', withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toBuffer()

        const fileName = `covers/${Date.now()}-${coverImage.name.replace(/[^a-zA-Z0-9.]/g, '')}`

        const { error: uploadError } = await supabase.storage
            .from('activity_covers')
            .upload(fileName, compressedBuffer, {
                contentType: 'image/jpeg',
                upsert: true
            })

        if (uploadError) {
            return { error: 'Upload failed: ' + uploadError.message }
        }

        const { data: { publicUrl } } = supabase.storage
            .from('activity_covers')
            .getPublicUrl(fileName)

        cover_image_url = publicUrl
    }

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
            cover_image_url
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
            const buffer = Buffer.from(await file.arrayBuffer())
            // Compress
            const compressedBuffer = await sharp(buffer)
                .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: 80 })
                .toBuffer()

            const fileName = `photos/${activityId}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`

            const { error: uploadError } = await supabase.storage
                .from('activity_photos')
                .upload(fileName, compressedBuffer, {
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
