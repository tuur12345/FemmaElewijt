'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/Button'
import { Upload, X, Loader2 } from 'lucide-react'
import imageCompression from 'browser-image-compression'
import { saveActivityPhotos } from '@/actions/admin'
import { useRouter } from 'next/navigation'

export default function PhotoUploader({ activities }: { activities: any[] }) {
    const [selectedActivityId, setSelectedActivityId] = useState('')
    const [files, setFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState('')
    const router = useRouter()
    const supabase = createClient()

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files))
        }
    }

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index))
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedActivityId || files.length === 0) return

        setUploading(true)
        setProgress('Starten...')

        try {
            const uploadedUrls: string[] = []
            let successCount = 0

            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                setProgress(`Verwerken foto ${i + 1} van ${files.length}...`)

                // Compress
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true
                }

                try {
                    const compressedFile = await imageCompression(file, options)

                    // Upload to Supabase
                    const fileName = `photos/${selectedActivityId}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`

                    const { error: uploadError } = await supabase.storage
                        .from('activity_photos')
                        .upload(fileName, compressedFile)

                    if (uploadError) throw uploadError

                    const { data: { publicUrl } } = supabase.storage
                        .from('activity_photos')
                        .getPublicUrl(fileName)

                    uploadedUrls.push(publicUrl)
                    successCount++

                } catch (err) {
                    console.error('Error uploading file:', file.name, err)
                }
            }

            if (uploadedUrls.length > 0) {
                setProgress('Opslaan in database...')
                await saveActivityPhotos(selectedActivityId, uploadedUrls)

                setFiles([])
                alert(`Succesvol ${successCount} foto's geüpload!`)
                router.refresh()
            } else {
                alert('Er is iets misgegaan bij het uploaden.')
            }

        } catch (error: any) {
            console.error(error)
            alert('Fout: ' + error.message)
        } finally {
            setUploading(false)
            setProgress('')
        }
    }

    return (
        <form onSubmit={handleUpload} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div>
                <label className="block font-medium text-gray-700 mb-2">Selecteer Activiteit</label>
                <select
                    value={selectedActivityId}
                    onChange={(e) => setSelectedActivityId(e.target.value)}
                    required
                    className="w-full p-3 border rounded-lg bg-white"
                >
                    <option value="">-- Kies een activiteit --</option>
                    {activities.map((a) => (
                        <option key={a.id} value={a.id}>
                            {a.title} ({new Date(a.date).toLocaleDateString('nl-BE')})
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block font-medium text-gray-700 mb-2">Foto's Kiezen</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors relative">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Klik om foto's te selecteren of sleep ze hierheen</p>
                    <p className="text-sm text-gray-400 mt-1">JPG, PNG (max 50MB)</p>
                </div>
            </div>

            {files.length > 0 && (
                <div className="space-y-2">
                    <p className="font-medium text-gray-700">{files.length} bestanden geselecteerd:</p>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                        {files.map((file, i) => (
                            <div key={i} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                                <span className="truncate">{file.name}</span>
                                <button type="button" onClick={() => removeFile(i)} className="text-red-500 hover:text-red-700">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Button type="submit" disabled={uploading || files.length === 0} className="w-full">
                {uploading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {progress}
                    </>
                ) : (
                    'Uploaden Starten'
                )}
            </Button>
        </form>
    )
}
