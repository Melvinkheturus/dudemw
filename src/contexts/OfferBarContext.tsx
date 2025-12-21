"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface OfferBarContextType {
    isOfferBarVisible: boolean
    setIsOfferBarVisible: (visible: boolean) => void
}

const OfferBarContext = createContext<OfferBarContextType | undefined>(undefined)

export function OfferBarProvider({ children }: { children: ReactNode }) {
    const [isOfferBarVisible, setIsOfferBarVisible] = useState(false)

    return (
        <OfferBarContext.Provider value={{ isOfferBarVisible, setIsOfferBarVisible }}>
            {children}
        </OfferBarContext.Provider>
    )
}

export function useOfferBar() {
    const context = useContext(OfferBarContext)
    if (context === undefined) {
        throw new Error("useOfferBar must be used within an OfferBarProvider")
    }
    return context
}
