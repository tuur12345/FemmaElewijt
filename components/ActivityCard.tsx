import Link from 'next/link'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { Button } from './ui/Button'
import { Database } from '@/types/database.types'

type Activity = Database['public']['Tables']['activities']['Row']

export default function ActivityCard({ activity }: { activity: Activity }) {
    const date = new Date(activity.date).toLocaleDateString('nl-BE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col h-full">
            {activity.cover_image_url && (
                <div className="h-48 overflow-hidden">
                    <img
                        src={activity.cover_image_url}
                        alt={activity.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-pink-700 mb-3">{activity.title}</h3>

                <div className="space-y-2 mb-4 text-gray-600 flex-grow">
                    <div className="flex items-center gap-2 text-lg">
                        <Calendar className="w-5 h-5 text-pink-500" />
                        <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-lg">
                        <Clock className="w-5 h-5 text-pink-500" />
                        <span>{activity.start_time.slice(0, 5)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-lg">
                        <MapPin className="w-5 h-5 text-pink-500" />
                        <span>{activity.location}</span>
                    </div>
                </div>

                <Link href={`/activiteiten/${activity.id}`} className="mt-auto">
                    <Button className="w-full text-lg">Meer info & Inschrijven</Button>
                </Link>
            </div>
        </div>
    )
}
