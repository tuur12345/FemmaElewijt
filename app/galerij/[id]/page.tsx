import { getActivityPhotos } from '@/actions/gallery'
import { getActivity } from '@/actions/activities'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function GalleryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const activity = await getActivity(id)

    if (!activity) {
        notFound()
    }

    const photos = await getActivityPhotos(id)

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/galerij" className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-2 text-lg font-medium">
                        <ArrowLeft className="mr-2" />
                        Terug naar albums
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{activity.title}</h1>
                    <p className="text-xl text-gray-600 mt-1">
                        {new Date(activity.date).toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
            </div>

            {photos.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <p className="text-xl text-gray-500">Er zijn nog geen foto's in dit album.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map((photo: any) => (
                        <div key={photo.id} className="aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative">
                            <img
                                src={photo.url}
                                alt={`Foto van ${activity.title}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                            />
                            {/* Simple lightbox link could go here, or just view full size */}
                            <a
                                href={photo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"
                                aria-label="Bekijk foto in volledig scherm"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
