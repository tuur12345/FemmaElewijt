'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Users, Edit, X } from 'lucide-react'
import Link from 'next/link'
import { getRegistrationsForActivity } from '@/actions/registrations'

interface ManagerControlsProps {
    activityId: string
    activityTitle: string
}

export default function ManagerControls({ activityId, activityTitle }: ManagerControlsProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [registrations, setRegistrations] = useState<{ name: string | null, email: string, created_at: string }[]>([])
    const [loading, setLoading] = useState(false)

    const handleOpen = async () => {
        setIsOpen(true)
        setLoading(true)
        try {
            const data = await getRegistrationsForActivity(activityId)
            setRegistrations(data)
        } catch (error) {
            console.error(error)
            alert('Kon inschrijvingen niet ophalen.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="bg-pink-50 p-6 rounded-xl border border-pink-100 space-y-4 mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Beheerder Opties</h3>
                <div className="grid grid-cols-1 gap-3">
                    <Button onClick={handleOpen} variant="outline" className="w-full justify-start gap-2 bg-white">
                        <Users size={18} />
                        Zie Inschrijvingen
                    </Button>
                    <Link href={`/activiteiten/${activityId}/edit`}>
                        <Button variant="outline" className="w-full justify-start gap-2 bg-white">
                            <Edit size={18} />
                            Bewerk Activiteit
                        </Button>
                    </Link>
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Inschrijvingen: {activityTitle}</h2>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {loading ? (
                                <div className="text-center py-8 text-gray-500">Laden...</div>
                            ) : registrations.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">Nog geen inschrijvingen.</div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 font-bold text-gray-700 border-b pb-2">
                                        <div>Naam</div>
                                        <div>Email</div>
                                    </div>
                                    {registrations.map((reg, i) => (
                                        <div key={i} className="grid grid-cols-2 py-2 border-b last:border-0 text-gray-600">
                                            <div>{reg.name || 'Onbekend'}</div>
                                            <div className="truncate">{reg.email}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t bg-gray-50 rounded-b-xl flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                                Totaal: {registrations.length} inschrijvingen
                            </div>
                            <Button onClick={() => setIsOpen(false)} variant="secondary">
                                Sluiten
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
