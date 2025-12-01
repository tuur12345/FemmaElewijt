'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, User as UserIcon } from "lucide-react";
import { Button } from './ui/Button'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function Navbar({ user }: { user: any }) {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    const navLinks = [
        { href: '/', label: 'Start' },
        { href: '/activiteiten', label: 'Activiteiten' },
        { href: '/galerij', label: 'Fotogalerij' },
    ]

    return (
        <nav className="bg-pink-700 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo / Title */}
                    <Link href="/" className="text-2xl font-bold tracking-tight hover:text-pink-100 transition-colors">
                        Femma Elewijt
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-lg font-medium hover:text-pink-200 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side: Font Toggle & Auth */}
                    <div className="hidden md:flex items-center space-x-4">

                        {user ? (
                            <div className="flex items-center gap-4 ml-4">
                                <Link href="/account">
                                    <Button variant="secondary" size="sm" className="gap-2">
                                        <UserIcon size={18} />
                                        Mijn Account
                                    </Button>
                                </Link>
                                {user.role === 'admin' && (
                                    <Link href="/admin">
                                        <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                                            Admin
                                        </Button>
                                    </Link>
                                )}
                                <Button variant="ghost" size="sm" onClick={handleSignOut} className="hover:bg-pink-600">
                                    Uitloggen
                                </Button>
                            </div>
                        ) : (
                            <Link href="/login">
                                <Button variant="secondary" className="font-bold">
                                    Inloggen
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md hover:bg-pink-600 transition-colors"
                            aria-label="Menu openen"
                        >
                            {isOpen ? <X size={32} /> : <Menu size={32} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-pink-800 border-t border-pink-600">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block px-3 py-4 text-xl font-medium hover:bg-pink-700 rounded-md"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-pink-600">
                            {user ? (
                                <div className="space-y-3">
                                    <Link href="/account" onClick={() => setIsOpen(false)}>
                                        <Button variant="secondary" className="w-full justify-start gap-2 text-lg h-12">
                                            <UserIcon /> Mijn Account
                                        </Button>
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link href="/admin" onClick={() => setIsOpen(false)}>
                                            <Button variant="outline" className="w-full justify-start text-lg h-12 bg-white/10 border-white/20 text-white">
                                                Admin Dashboard
                                            </Button>
                                        </Link>
                                    )}
                                    <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start text-lg h-12 hover:bg-pink-700 text-white">
                                        Uitloggen
                                    </Button>
                                </div>
                            ) : (
                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="secondary" className="w-full text-lg h-12 font-bold">
                                        Inloggen
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
