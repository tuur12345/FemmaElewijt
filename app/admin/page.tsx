import { createClient } from '@/utils/supabase/server'
import { Calendar, Users, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Fetch stats
    const { count: activitiesCount } = await supabase
        .from('activities')
        .select('*', { count: 'exact', head: true })

    const { count: registrationsCount } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })

    const { count: photosCount } = await supabase
        .from('activity_photos')
        .select('*', { count: 'exact', head: true })

    const stats = [
        { label: 'Activiteiten', value: activitiesCount || 0, icon: Calendar, color: 'bg-blue-500', href: '/admin/activiteiten' },
        { label: 'Inschrijvingen', value: registrationsCount || 0, icon: Users, color: 'bg-green-500', href: '/admin/activiteiten' }, // Link to activities to see registrations
        { label: 'Foto\'s', value: photosCount || 0, icon: ImageIcon, color: 'bg-purple-500', href: '/admin/galerij' },
    ]

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Overzicht</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <Link key={stat.label} href={stat.href} className="block group">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex items-center gap-4">
                            <div className={`p-4 rounded-lg ${stat.color} text-white`}>
                                <stat.icon className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Snel aan de slag</h2>
                <div className="flex flex-wrap gap-4">
                    <Link href="/admin/activiteiten/create" className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium">
                        Nieuwe activiteit aanmaken
                    </Link>
                    <Link href="/admin/galerij" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
                        Foto's uploaden
                    </Link>
                </div>
            </div>
        </div>
    )
}
