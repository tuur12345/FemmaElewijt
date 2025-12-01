'use client'

import { createActivity, getUsers } from '@/actions/admin'
import { Button } from '@/components/ui/Button'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import CoverImageUploader from '@/components/admin/CoverImageUploader'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useFormStatus } from 'react-dom'
import { useState, useEffect } from 'react'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" className="w-full text-lg py-4" disabled={pending}>
            {pending ? 'Bezig met aanmaken...' : 'Activiteit Aanmaken'}
        </Button>
    )
}

export default function CreateActivityPage() {
    const [error, setError] = useState<string | null>(null)
    const [users, setUsers] = useState<{ id: string, name: string | null, email: string }[]>([])
    const [selectedManager, setSelectedManager] = useState("")
    const [coverImageUrl, setCoverImageUrl] = useState("")

    useEffect(() => {
        getUsers().then(setUsers)
    }, [])

    async function handleSubmit(formData: FormData) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setError(null)
        if (selectedManager) {
            formData.append('manager_id', selectedManager)
        }
        if (coverImageUrl) {
            formData.append('cover_image_url', coverImageUrl)
        }
        const result = await createActivity(formData)
        if (result?.error) {
            setError(result.error)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Link href="/admin/activiteiten" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Terug naar overzicht
            </Link>

            <h1 className="text-3xl font-bold text-gray-800 mb-8">Nieuwe Activiteit</h1>

            <form action={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <div>
                    <label className="block font-medium text-gray-700 mb-2">Titel</label>
                    <input name="title" required className="w-full p-3 border rounded-lg" placeholder="Bijv. Kookworkshop" />
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-2">Beschrijving</label>
                    <textarea name="description" required rows={5} className="w-full p-3 border rounded-lg" placeholder="Uitgebreide beschrijving..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium text-gray-700 mb-2">Datum</label>
                        <input type="date" name="date" required className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700 mb-2">Starttijd</label>
                        <input type="time" name="start_time" required className="w-full p-3 border rounded-lg" />
                    </div>
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-2">Locatie</label>
                    <input name="location" required className="w-full p-3 border rounded-lg" placeholder="Bijv. Zaal De Kring" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium text-gray-700 mb-2">Prijs (tekst)</label>
                        <input name="price_text" required className="w-full p-3 border rounded-lg" placeholder="€5 leden / €7 niet-leden" />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700 mb-2">Max. deelnemers (optioneel)</label>
                        <input type="number" name="max_participants" className="w-full p-3 border rounded-lg" />
                    </div>
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-2">Beheerder toewijzen (optioneel)</label>
                    <SearchableSelect
                        options={users.map(u => ({ label: u.name || u.email, value: u.id }))}
                        value={selectedManager}
                        onChange={setSelectedManager}
                        placeholder="Selecteer een beheerder..."
                        searchPlaceholder="Zoek op naam..."
                    />
                    <p className="text-sm text-gray-500 mt-1">Deze gebruiker kan de inschrijvingen zien en de activiteit bewerken.</p>
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-2">Cover Afbeelding</label>
                    <CoverImageUploader onUploadComplete={setCoverImageUrl} />
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
