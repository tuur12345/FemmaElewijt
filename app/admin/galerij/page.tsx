'use client'

import { uploadActivityPhotos } from '@/actions/admin'
import { getActivities } from '@/actions/activities'
import { Button } from '@/components/ui/Button'
import { useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" className="w-full text-lg py-4" disabled={pending}>
            {pending ? 'Bezig met uploaden...' : 'Foto\'s Uploaden'}
        </Button>
    )
}

export default function PhotoUploadPage() {
    const [activities, setActivities] = useState<any[]>([])
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        getActivities().then(setActivities)
    }, [])

    async function handleSubmit(formData: FormData) {
        setMessage(null)
        const result = await uploadActivityPhotos(formData)

        if (result?.error) {
            setMessage({ type: 'error', text: result.error })
        } else if (result?.success) {
            setMessage({
                type: 'success',
                text: `${result.count} foto('s) succesvol geüpload.` + (result.errors?.length ? ` (${result.errors.length} mislukt)` : '')
            })
            // Reset form logic would go here if using a controlled form or ref
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Foto's Uploaden</h1>

            <form action={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <div>
                    <label className="block font-medium text-gray-700 mb-2">Selecteer Activiteit</label>
                    <select name="activity_id" required className="w-full p-3 border rounded-lg bg-white">
                        <option value="">-- Kies een activiteit --</option>
                        {activities.map(a => (
                            <option key={a.id} value={a.id}>
                                {a.title} ({new Date(a.date).toLocaleDateString('nl-BE')})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-2">Selecteer Foto's</label>
                    <input
                        type="file"
                        name="photos"
                        multiple
                        accept="image/*"
                        required
                        className="w-full p-3 border rounded-lg"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Je kan meerdere foto's tegelijk selecteren. Ze worden automatisch verkleind.
                    </p>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <SubmitButton />
            </form>
        </div>
    )
}
