import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-white text-xl font-bold mb-4">Femma Elewijt</h3>
                        <p className="text-lg">
                            Samen activiteiten beleven, <br />
                            voor jong en oud.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-white text-xl font-bold mb-4">Snelle links</h3>
                        <ul className="space-y-2 text-lg">
                            <li><Link href="/activiteiten" className="hover:text-white">Activiteiten</Link></li>
                            <li><Link href="/galerij" className="hover:text-white">Fotogalerij</Link></li>
                            <li><Link href="/privacy" className="hover:text-white">Privacybeleid</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white text-xl font-bold mb-4">Contact</h3>
                        <p className="text-lg">
                            Heb je vragen? <br />
                            <a href="mailto:info@femmaelewijt.be" className="hover:text-white underline">
                                info@femmaelewijt.be
                            </a>
                        </p>
                    </div>
                </div>
                <div className="border-t border-slate-800 mt-8 pt-8 text-center text-base">
                    <p>&copy; {new Date().getFullYear()} Femma Elewijt. Alle rechten voorbehouden.</p>
                </div>
            </div>
        </footer>
    )
}
