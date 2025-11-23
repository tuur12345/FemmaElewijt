'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendEmail, getRegistrationEmailHtml, getUnregistrationEmailHtml } from '@/utils/emails'

export async function registerForActivity(activityId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Je moet ingelogd zijn om in te schrijven.' }
    }

    // Check if already registered
    const { data: existing } = await supabase
        .from('registrations')
        .select('id')
        .eq('activity_id', activityId)
        .eq('user_id', user.id)
        .single()

    if (existing) {
        return { error: 'Je bent al ingeschreven voor deze activiteit.' }
    }

    // Check max participants
    const { data: activity } = await supabase
        .from('activities')
        .select('title, date, max_participants')
        .eq('id', activityId)
        .single()

    if (activity?.max_participants) {
        const { count } = await supabase
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .eq('activity_id', activityId)

        if (count !== null && count >= activity.max_participants) {
            return { error: 'Deze activiteit is volzet.' }
        }
    }

    const { error } = await supabase
        .from('registrations')
        .insert({
            activity_id: activityId,
            user_id: user.id,
        })

    if (error) {
        return { error: error.message }
    }

    // Send Confirmation Email
    if (activity && user.email) {
        const userName = user.user_metadata.name || 'Lid'
        const dateStr = new Date(activity.date).toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' })
        const html = getRegistrationEmailHtml(activity.title, dateStr, userName)
        await sendEmail(user.email, `Inschrijving: ${activity.title}`, html)
    }

    revalidatePath(`/activiteiten/${activityId}`)
    revalidatePath('/account')
    return { success: true }
}

export async function unregisterFromActivity(activityId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Je moet ingelogd zijn.' }
    }

    // Get activity details first for email
    const { data: activity } = await supabase
        .from('activities')
        .select('title')
        .eq('id', activityId)
        .single()

    const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('activity_id', activityId)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    // Send Unregistration Email
    if (activity && user.email) {
        const userName = user.user_metadata.name || 'Lid'
        const html = getUnregistrationEmailHtml(activity.title, userName)
        await sendEmail(user.email, `Uitschrijving: ${activity.title}`, html)
    }

    revalidatePath(`/activiteiten/${activityId}`)
    revalidatePath('/account')
    return { success: true }
}

export async function getRegistrationStatus(activityId: string, userId: string) {
    const supabase = await createClient()

    const { data } = await supabase
        .from('registrations')
        .select('id')
        .eq('activity_id', activityId)
        .eq('user_id', userId)
        .single()

    return { isRegistered: !!data }
}

export async function getUserRegistrations() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('registrations')
        .select(`
      id,
      created_at,
      activities (
        *
      )
    `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error(error)
        return []
    }

    return data.map((reg: any) => ({
        ...reg.activities,
        registration_id: reg.id,
        registration_date: reg.created_at
    }))
}
