import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Calendar, Users, Image as ImageIcon, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { signout } from '@/actions/auth'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check role
    const { data: profile, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (error) {
        console.error('Error fetching profile:', error)
    }

    if (profile?.role !== 'admin') {
        console.log('Not admin, role:', profile?.role)
        redirect('/')
    }

    const navItems = [
        { href: '/admin', label: 'Overzicht', icon: LayoutDashboard },
        { href: '/admin/activiteiten', label: 'Activiteiten', icon: Calendar },
        // { href: '/admin/inschrijvingen', label: 'Inschrijvingen', icon: Users }, // Can be part of activities
        { href: '/admin/galerij', label: 'Foto\'s Uploaden', icon: ImageIcon },
    ]

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col fixed h-full">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold">Femma Admin</h1>
                </div>

                <nav className="flex-grow p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <form action={signout}>
                        <Button variant="ghost" className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-slate-800">
                            <LogOut className="w-5 h-5" />
                            Uitloggen
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Mobile Header (visible only on small screens) */}
            <div className="md:hidden fixed top-0 w-full bg-slate-900 text-white z-40 p-4 flex justify-between items-center">
                <span className="font-bold">Femma Admin</span>
                {/* Mobile menu toggle could go here */}
            </div>

            {/* Main Content */}
            <main className="flex-grow md:ml-64 p-8 mt-16 md:mt-0">
                {children}
            </main>
        </div>
    )
}
