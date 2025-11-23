import { getActivities } from '@/actions/activities'
import ActivityCard from '@/components/ActivityCard'
import { Calendar } from 'lucide-react'

export default async function ActivitiesPage() {
    const activities = await getActivities()

    // Group activities by month
    const activitiesByMonth = activities.reduce((acc, activity) => {
        const date = new Date(activity.date)
        const monthKey = date.toLocaleString('nl-BE', { month: 'long', year: 'numeric' })
        if (!acc[monthKey]) {
            acc[monthKey] = []
        }
        acc[monthKey].push(activity)
        return acc
    }, {} as Record<string, typeof activities>)

    return (
        <div className="space-y-8">
            <div className="bg-pink-50 p-8 rounded-2xl border border-pink-100">
                <h1 className="text-4xl font-bold text-pink-800 mb-4 flex items-center gap-3">
                    <Calendar className="w-10 h-10" />
                    Jaarprogramma
                </h1>
                <p className="text-xl text-gray-700">
                    Ontdek hier al onze geplande activiteiten. Klik op een activiteit voor meer details en om in te schrijven.
                </p>
            </div>

            {Object.keys(activitiesByMonth).length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <p className="text-xl text-gray-500">Er zijn momenteel geen activiteiten gepland.</p>
                </div>
            ) : (
                Object.entries(activitiesByMonth).map(([month, monthActivities]) => (
                    <section key={month} className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-800 capitalize border-b-2 border-pink-200 pb-2 inline-block">
                            {month}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {monthActivities.map((activity) => (
                                <ActivityCard key={activity.id} activity={activity} />
                            ))}
                        </div>
                    </section>
                ))
            )}
        </div>
    )
}
