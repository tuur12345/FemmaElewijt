'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type FontSize = 'normal' | 'large' | 'extra-large'

interface FontSizeContextType {
    fontSize: FontSize
    setFontSize: (size: FontSize) => void
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined)

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
    const [fontSize, setFontSize] = useState<FontSize>('normal')

    useEffect(() => {
        const savedSize = localStorage.getItem('femma-font-size') as FontSize
        if (savedSize) {
            setFontSize(savedSize)
        }
    }, [])

    const handleSetFontSize = (size: FontSize) => {
        setFontSize(size)
        localStorage.setItem('femma-font-size', size)

        // Remove old classes
        document.documentElement.classList.remove('text-base', 'text-lg', 'text-xl')

        // Add new class to root
        switch (size) {
            case 'normal':
                document.documentElement.classList.add('text-base')
                break
            case 'large':
                document.documentElement.classList.add('text-lg')
                break
            case 'extra-large':
                document.documentElement.classList.add('text-xl')
                break
        }
    }

    // Initialize on mount
    useEffect(() => {
        handleSetFontSize(fontSize)
    }, [fontSize])

    return (
        <FontSizeContext.Provider value={{ fontSize, setFontSize: handleSetFontSize }}>
            {children}
        </FontSizeContext.Provider>
    )
}

export function useFontSize() {
    const context = useContext(FontSizeContext)
    if (context === undefined) {
        throw new Error('useFontSize must be used within a FontSizeProvider')
    }
    return context
}
