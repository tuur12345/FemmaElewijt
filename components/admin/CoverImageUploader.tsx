'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/Button'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'

interface CoverImageUploaderProps {
    onUploadComplete: (url: string) => void
    initialImage?: string | null
}

export default function CoverImageUploader({ onUploadComplete, initialImage }: CoverImageUploaderProps) {
    const [image, setImage] = useState<string | null>(initialImage || null)
    const [uploading, setUploading] = useState(false)
    const supabase = createClient()

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        const file = e.target.files[0]
        setUploading(true)

        try {
            // Upload to Supabase directly
            const fileName = `covers/${Date.now()}-${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`

            const { error: uploadError } = await supabase.storage
                .from('activity_covers')
                .upload(fileName, file, {
                    upsert: true
                })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('activity_covers')
                .getPublicUrl(fileName)

            setImage(publicUrl)
            onUploadComplete(publicUrl)

        } catch (error: any) {
            console.error('Error uploading cover:', error)
            alert('Fout bij uploaden cover: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const removeImage = () => {
        setImage(null)
        onUploadComplete('')
    }

    return (
        <div className="space-y-4">
            {image ? (
                <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <img src={image} alt="Cover Preview" className="w-full h-full object-cover" />
                    <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md text-red-500 hover:text-red-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors relative max-w-md">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    {uploading ? (
                        <div className="flex flex-col items-center text-gray-500">
                            <Loader2 className="w-10 h-10 animate-spin mb-2" />
                            <span>Uploaden...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-gray-500">
                            <ImageIcon className="w-10 h-10 mb-2 text-gray-400" />
                            <span className="font-medium text-gray-700">Cover Afbeelding Kiezen</span>
                            <span className="text-sm text-gray-400 mt-1">Klik of sleep bestand hierheen</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
