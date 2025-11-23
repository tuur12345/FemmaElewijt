import { getUserRegistrations, unregisterFromActivity } from '@/actions/registrations'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/utils/supabase/server'
import { Calendar, Clock, MapPin } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const registrations = await getUserRegistrations()

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h1 className="text-3xl font-bold text-pink-800 mb-2">Mijn Account</h1>
                <p className="text-lg text-gray-600">Welkom terug, {user.user_metadata.name || user.email}</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">Mijn Inschrijvingen</h2>

            {registrations.length === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm text-center border border-gray-100">
                    <p className="text-xl text-gray-500 mb-6">Je bent nog niet ingeschreven voor activiteiten.</p>
                    <Link href="/activiteiten">
                        <Button className="text-lg">Bekijk aanbod</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {registrations.map((activity: any) => (
                        <div key={activity.registration_id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
                            {activity.cover_image_url && (
                                <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                        src={activity.cover_image_url}
                                        alt={activity.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="flex-grow">
                                <h3 className="text-2xl font-bold text-pink-700 mb-2">{activity.title}</h3>
                                <div className="space-y-1 text-gray-600 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(activity.date).toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{activity.start_time.slice(0, 5)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{activity.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center gap-3 min-w-[150px]">
                                <Link href={`/activiteiten/${activity.id}`}>
                                    <Button variant="outline" className="w-full">Details</Button>
                                </Link>
                                <form action={async () => {
                                    'use server'
                                    await unregisterFromActivity(activity.id)
                                }}>
                                    <Button variant="destructive" size="sm" className="w-full bg-red-100 text-red-700 hover:bg-red-200 border-none">
                                        Uitschrijven
                                    </Button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
