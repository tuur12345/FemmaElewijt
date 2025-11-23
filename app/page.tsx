import { getActivities } from '@/actions/activities'
import ActivityCard from '@/components/ActivityCard'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Calendar, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

export default async function HomePage() {
  const activities = await getActivities()
  // Get upcoming 3 activities
  const upcomingActivities = activities
    .filter(a => new Date(a.date) >= new Date())
    .slice(0, 3)

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-pink-700 text-white rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden relative">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Welkom bij <br /> Femma Elewijt
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-pink-100 max-w-2xl">
            Samen genieten, ontdekken en beleven. Wij organiseren activiteiten voor jong en oud in een warme sfeer.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/activiteiten">
              <Button size="lg" className="bg-white text-pink-700 hover:bg-pink-50 font-bold text-xl px-8 py-6 h-auto">
                Bekijk activiteiten
              </Button>
            </Link>
            <Link href="/galerij">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 font-bold text-xl px-8 py-6 h-auto bg-transparent">
                Naar fotogalerij
              </Button>
            </Link>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-pink-600 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-pink-800 rounded-full opacity-50 blur-3xl"></div>
      </section>

      {/* Upcoming Activities */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-pink-600" />
            Binnenkort
          </h2>
          <Link href="/activiteiten" className="text-pink-600 hover:text-pink-700 font-medium text-lg flex items-center">
            Alle activiteiten <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>

        {upcomingActivities.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-xl text-gray-500">Er zijn momenteel geen geplande activiteiten.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </section>

      {/* Quick Links / Info */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-md border-l-8 border-pink-500">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Lid worden?</h3>
          <p className="text-lg text-gray-600 mb-6">
            Wil je deel uitmaken van onze bruisende vereniging? Iedereen is welkom!
            Als lid geniet je van korting op onze activiteiten.
          </p>
          <Button variant="outline" className="text-lg border-pink-600 text-pink-600 hover:bg-pink-50">
            Meer informatie
          </Button>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-md border-l-8 border-blue-500">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Vrijwilliger worden</h3>
          <p className="text-lg text-gray-600 mb-6">
            Heb je zin om mee te helpen bij onze activiteiten? We zijn altijd op zoek naar enthousiaste helpende handen.
          </p>
          <Button variant="outline" className="text-lg border-blue-600 text-blue-600 hover:bg-blue-50">
            Contacteer ons
          </Button>
        </div>
      </section>
    </div>
  )
}
