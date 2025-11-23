import { getActivitiesWithPhotos } from '@/actions/gallery'
import { Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

export default async function GalleryPage() {
    const activities = await getActivitiesWithPhotos()

    return (
        <div className="space-y-8">
            <div className="bg-pink-50 p-8 rounded-2xl border border-pink-100">
                <h1 className="text-4xl font-bold text-pink-800 mb-4 flex items-center gap-3">
                    <ImageIcon className="w-10 h-10" />
                    Fotogalerij
                </h1>
                <p className="text-xl text-gray-700">
                    Herbeleef onze activiteiten via deze fotoalbums.
                </p>
            </div>

            {activities.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <p className="text-xl text-gray-500">Er zijn nog geen fotoalbums beschikbaar.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activities.map((activity: any) => (
                        <Link key={activity.id} href={`/galerij/${activity.id}`} className="group">
                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                                <div className="h-56 overflow-hidden relative">
                                    {activity.cover_image_url ? (
                                        <img
                                            src={activity.cover_image_url}
                                            alt={activity.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <ImageIcon className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                        <ImageIcon className="w-4 h-4" />
                                        {activity.activity_photos[0].count} foto's
                                    </div>
                                </div>
                                <div className="p-6 flex-grow">
                                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-pink-700 transition-colors mb-2">
                                        {activity.title}
                                    </h3>
                                    <p className="text-gray-500 text-lg">
                                        {new Date(activity.date).toLocaleDateString('nl-BE', { month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
