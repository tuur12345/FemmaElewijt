'use client'

import { useFontSize } from '@/components/providers/FontSizeProvider'
import { Type } from 'lucide-react'

export default function FontSizeToggle() {
    const { fontSize, setFontSize } = useFontSize()

    return (
        <div className="flex items-center gap-2 bg-white/10 p-1 rounded-lg">
            <button
                onClick={() => setFontSize('normal')}
                className={`p-2 rounded transition-colors ${fontSize === 'normal' ? 'bg-white text-pink-600' : 'text-white hover:bg-white/20'
                    }`}
                aria-label="Normale tekstgrootte"
                title="Normale tekstgrootte"
            >
                <span className="text-sm font-bold">A</span>
            </button>
            <button
                onClick={() => setFontSize('large')}
                className={`p-2 rounded transition-colors ${fontSize === 'large' ? 'bg-white text-pink-600' : 'text-white hover:bg-white/20'
                    }`}
                aria-label="Grote tekstgrootte"
                title="Grote tekstgrootte"
            >
                <span className="text-base font-bold">A+</span>
            </button>
            <button
                onClick={() => setFontSize('extra-large')}
                className={`p-2 rounded transition-colors ${fontSize === 'extra-large' ? 'bg-white text-pink-600' : 'text-white hover:bg-white/20'
                    }`}
                aria-label="Extra grote tekstgrootte"
                title="Extra grote tekstgrootte"
            >
                <span className="text-lg font-bold">A++</span>
            </button>
        </div>
    )
}
