'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getActivities() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('date', { ascending: true })

    if (error) {
        console.error('Error fetching activities:', error)
        return []
    }

    return data
}

export async function getActivity(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching activity:', error)
        return null
    }

    return data
}
