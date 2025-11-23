import { getActivities } from '@/actions/activities'
import { deleteActivity } from '@/actions/admin'
import { Button } from '@/components/ui/Button'
import { Calendar, Edit, Plus, Trash2, Users } from 'lucide-react'
import Link from 'next/link'

export default async function AdminActivitiesPage() {
    const activities = await getActivities()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Activiteiten Beheer</h1>
                <Link href="/admin/activiteiten/create">
                    <Button className="gap-2">
                        <Plus className="w-5 h-5" />
                        Nieuwe Activiteit
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Titel</th>
                            <th className="p-4 font-semibold text-gray-600">Datum</th>
                            <th className="p-4 font-semibold text-gray-600">Locatie</th>
                            <th className="p-4 font-semibold text-gray-600">Acties</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {activities.map((activity) => (
                            <tr key={activity.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-900">{activity.title}</td>
                                <td className="p-4 text-gray-600">
                                    {new Date(activity.date).toLocaleDateString('nl-BE')}
                                </td>
                                <td className="p-4 text-gray-600">{activity.location}</td>
                                <td className="p-4 flex items-center gap-2">
                                    {/* Edit link would go here */}
                                    <Link href={`/activiteiten/${activity.id}`} target="_blank">
                                        <Button variant="ghost" size="icon" title="Bekijk">
                                            <Calendar className="w-4 h-4 text-blue-600" />
                                        </Button>
                                    </Link>
                                    <form action={deleteActivity.bind(null, activity.id)}>
                                        <Button variant="ghost" size="icon" className="hover:bg-red-50" title="Verwijderen">
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </Button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {activities.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    Geen activiteiten gevonden.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
