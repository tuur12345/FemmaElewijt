'use client'

import { updateActivity, getUsers } from '@/actions/admin'
import { getActivity } from '@/actions/activities'
import { Button } from '@/components/ui/Button'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import CoverImageUploader from '@/components/admin/CoverImageUploader'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useFormStatus } from 'react-dom'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" className="w-full text-lg py-4" disabled={pending}>
            {pending ? 'Bezig met opslaan...' : 'Wijzigingen Opslaan'}
        </Button>
    )
}

export default function EditActivityPage({ params }: { params: Promise<{ id: string }> }) {
    const [id, setId] = useState<string>('')
    const [activity, setActivity] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [users, setUsers] = useState<{ id: string, name: string | null, email: string }[]>([])
    const [selectedManager, setSelectedManager] = useState("")
    const [coverImageUrl, setCoverImageUrl] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        params.then(p => {
            setId(p.id)
            Promise.all([
                getActivity(p.id),
                getUsers()
            ]).then(([act, usrs]) => {
                setActivity(act)
                setUsers(usrs)
                if (act?.manager_id) {
                    setSelectedManager(act.manager_id)
                }
                if (act?.cover_image_url) {
                    setCoverImageUrl(act.cover_image_url)
                }
                setLoading(false)
            })
        })
    }, [params])

    async function handleSubmit(formData: FormData) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setError(null)
        if (selectedManager) {
            formData.append('manager_id', selectedManager)
        } else {
            // If cleared, send empty string or handle in backend to set null
            formData.append('manager_id', '')
        }
        if (coverImageUrl) {
            formData.append('cover_image_url', coverImageUrl)
        }

        const result = await updateActivity(id, formData)
        if (result?.error) {
            setError(result.error)
        }
    }

    if (loading) return <div className="p-8 text-center">Laden...</div>
    if (!activity) return <div className="p-8 text-center">Activiteit niet gevonden.</div>

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <Link href={`/activiteiten/${id}`} className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Terug naar activiteit
            </Link>

            <h1 className="text-3xl font-bold text-gray-800 mb-8">Activiteit Bewerken</h1>

            <form action={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <div>
                    <label className="block font-medium text-gray-700 mb-2">Titel</label>
                    <input name="title" defaultValue={activity.title} required className="w-full p-3 border rounded-lg" />
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-2">Beschrijving</label>
                    <textarea name="description" defaultValue={activity.description} required rows={5} className="w-full p-3 border rounded-lg" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium text-gray-700 mb-2">Datum</label>
                        <input type="date" name="date" defaultValue={activity.date} required className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700 mb-2">Starttijd</label>
                        <input type="time" name="start_time" defaultValue={activity.start_time} required className="w-full p-3 border rounded-lg" />
                    </div>
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-2">Locatie</label>
                    <input name="location" defaultValue={activity.location} required className="w-full p-3 border rounded-lg" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium text-gray-700 mb-2">Prijs (tekst)</label>
                        <input name="price_text" defaultValue={activity.price_text} required className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700 mb-2">Max. deelnemers (optioneel)</label>
                        <input type="number" name="max_participants" defaultValue={activity.max_participants || ''} className="w-full p-3 border rounded-lg" />
                    </div>
                </div>

                {/* Only show manager selection if users are loaded (meaning admin) */}
                {users.length > 0 && (
                    <div>
                        <label className="block font-medium text-gray-700 mb-2">Beheerder toewijzen (optioneel)</label>
                        <SearchableSelect
                            options={users.map(u => ({ label: u.name || u.email, value: u.id }))}
                            value={selectedManager}
                            onChange={setSelectedManager}
                            placeholder="Selecteer een beheerder..."
                            searchPlaceholder="Zoek op naam..."
                        />
                    </div>
                )}

                <div>
                    <label className="block font-medium text-gray-700 mb-2">Nieuwe Cover Afbeelding (optioneel)</label>
                    <CoverImageUploader onUploadComplete={setCoverImageUrl} initialImage={coverImageUrl} />
                    <input type="hidden" name="cover_image_url" value={coverImageUrl} />
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg">
                        {error}
                    </div>
                )}

                <SubmitButton />
            </form>
        </div>
    )
}
