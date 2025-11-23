'use client'

import { createActivity } from '@/actions/admin'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useFormStatus } from 'react-dom'
import { useState } from 'react'

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

    async function handleSubmit(formData: FormData) {
        setError(null)
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
                    <label className="block font-medium text-gray-700 mb-2">Cover Afbeelding</label>
                    <input type="file" name="cover_image" accept="image/*" className="w-full p-3 border rounded-lg" />
                    <p className="text-sm text-gray-500 mt-1">Wordt automatisch gecomprimeerd.</p>
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
