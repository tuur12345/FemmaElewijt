'use server'

import { createClient } from '@/utils/supabase/server'

export async function getActivitiesWithPhotos() {
    const supabase = await createClient()

    // Get activities that have at least one photo
    // This is a bit tricky with Supabase simple queries, so we might just fetch all and filter, 
    // or use a join. For now, let's fetch activities and count photos.

    const { data, error } = await supabase
        .from('activities')
        .select(`
      *,
      activity_photos (count)
    `)
        .order('date', { ascending: false })

    if (error) {
        console.error(error)
        return []
    }

    // Filter activities that have photos
    return data.filter((a: any) => a.activity_photos[0].count > 0)
}

export async function getActivityPhotos(activityId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('activity_photos')
        .select('*')
        .eq('activity_id', activityId)
        .order('created_at', { ascending: true })

    if (error) {
        console.error(error)
        return []
    }

    return data
}
