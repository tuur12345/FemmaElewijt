import { getActivity } from '@/actions/activities'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/utils/supabase/server'
import { Calendar, Clock, MapPin, Euro, Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { registerForActivity, unregisterFromActivity, getRegistrationStatus } from '@/actions/registrations'

export default async function ActivityDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const activity = await getActivity(id)

    if (!activity) {
        notFound()
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let isRegistered = false
    let registrationCount = 0

    if (user) {
        const status = await getRegistrationStatus(activity.id, user.id)
        isRegistered = status.isRegistered
    }

    // Fetch registration count (this would ideally be a separate function/query)
    const { count } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .eq('activity_id', activity.id)

    registrationCount = count || 0
    const isFull = activity.max_participants ? registrationCount >= activity.max_participants : false

    return (
        <div className="max-w-4xl mx-auto">
            <Link href="/activiteiten" className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-6 text-lg font-medium">
                <ArrowLeft className="mr-2" />
                Terug naar overzicht
            </Link>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {activity.cover_image_url && (
                    <div className="h-64 md:h-96 overflow-hidden relative">
                        <img
                            src={activity.cover_image_url}
                            alt={activity.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                            <h1 className="text-4xl md:text-5xl font-bold text-white p-8 shadow-sm">{activity.title}</h1>
                        </div>
                    </div>
                )}

                {!activity.cover_image_url && (
                    <div className="bg-pink-600 p-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-white">{activity.title}</h1>
                    </div>
                )}

                <div className="p-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div className="prose prose-lg max-w-none text-gray-700">
                                <p className="whitespace-pre-wrap">{activity.description}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-pink-50 p-6 rounded-xl border border-pink-100 space-y-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-6 h-6 text-pink-600 mt-1" />
                                    <div>
                                        <span className="block font-bold text-gray-900">Datum</span>
                                        <span className="text-lg text-gray-700">
                                            {new Date(activity.date).toLocaleDateString('nl-BE', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Clock className="w-6 h-6 text-pink-600 mt-1" />
                                    <div>
                                        <span className="block font-bold text-gray-900">Tijd</span>
                                        <span className="text-lg text-gray-700">
                                            {activity.start_time.slice(0, 5)} uur
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="w-6 h-6 text-pink-600 mt-1" />
                                    <div>
                                        <span className="block font-bold text-gray-900">Locatie</span>
                                        <span className="text-lg text-gray-700">{activity.location}</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Euro className="w-6 h-6 text-pink-600 mt-1" />
                                    <div>
                                        <span className="block font-bold text-gray-900">Prijs</span>
                                        <span className="text-lg text-gray-700">{activity.price_text}</span>
                                    </div>
                                </div>

                                {activity.max_participants && (
                                    <div className="flex items-start gap-3">
                                        <Users className="w-6 h-6 text-pink-600 mt-1" />
                                        <div>
                                            <span className="block font-bold text-gray-900">Plaatsen</span>
                                            <span className={`text-lg ${isFull ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
                                                {registrationCount} / {activity.max_participants} ingeschreven
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                {user ? (
                                    isRegistered ? (
                                        <form action={async () => {
                                            'use server'
                                            await unregisterFromActivity(activity.id)
                                        }}>
                                            <Button variant="destructive" className="w-full text-lg py-6" type="submit">
                                                Uitschrijven
                                            </Button>
                                        </form>
                                    ) : isFull ? (
                                        <Button disabled className="w-full text-lg py-6 bg-gray-300 text-gray-500 cursor-not-allowed">
                                            Volzet
                                        </Button>
                                    ) : (
                                        <form action={async () => {
                                            'use server'
                                            await registerForActivity(activity.id)
                                        }}>
                                            <Button className="w-full text-lg py-6" type="submit">
                                                Inschrijven
                                            </Button>
                                        </form>
                                    )
                                ) : (
                                    <Link href={`/login?next=/activiteiten/${activity.id}`}>
                                        <Button variant="secondary" className="w-full text-lg py-6">
                                            Log in om in te schrijven
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
