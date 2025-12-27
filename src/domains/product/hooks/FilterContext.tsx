"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type FilterType = "size" | "color" | "price" | "sort" | "fit"

export interface FilterChip {
  type: FilterType
  label: string
  value: string
}

interface FilterContextType {
  selectedSizes: string[]
  selectedColors: string[]
  selectedFits: string[]
  priceRange: [number, number]
  sortBy: string
  toggleSize: (size: string) => void
  toggleColor: (color: string) => void
  toggleFit: (fit: string) => void
  setPriceRange: (range: [number, number]) => void
  setSortBy: (sort: string) => void
  clearAll: () => void
  removeFilter: (type: FilterType, value: string) => void
  getAppliedFilters: () => FilterChip[]
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

const MIN_PRICE = 299
const MAX_PRICE = 1999

export function FilterProvider({ children }: { children: ReactNode }) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedFits, setSelectedFits] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([MIN_PRICE, MAX_PRICE])
  const [sortBy, setSortBy] = useState("Newest First")

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    )
  }

  const toggleFit = (fit: string) => {
    setSelectedFits((prev) =>
      prev.includes(fit) ? prev.filter((f) => f !== fit) : [...prev, fit]
    )
  }

  const clearAll = () => {
    setSelectedSizes([])
    setSelectedColors([])
    setSelectedFits([])
    setPriceRange([MIN_PRICE, MAX_PRICE])
    setSortBy("Newest First")
  }

  const removeFilter = (type: FilterType, value: string) => {
    switch (type) {
      case "size":
        toggleSize(value)
        break
      case "color":
        toggleColor(value)
        break
      case "fit":
        toggleFit(value)
        break
      case "price":
        setPriceRange([MIN_PRICE, MAX_PRICE])
        break
      case "sort":
        setSortBy("Newest First")
        break
    }
  }

  const getAppliedFilters = (): FilterChip[] => {
    const filters: FilterChip[] = []

    // Add size filters
    selectedSizes.forEach((size) => {
      filters.push({ type: "size", label: size, value: size })
    })

    // Add color filters
    selectedColors.forEach((color) => {
      filters.push({ type: "color", label: color, value: color })
    })

    // Add fit filters
    selectedFits.forEach((fit) => {
      filters.push({ type: "fit", label: fit, value: fit })
    })

    // Add price filter if not at minimum (user has moved the slider)
    if (priceRange[0] !== MIN_PRICE || priceRange[1] !== MAX_PRICE) {
      filters.push({
        type: "price",
        label: `₹${priceRange[0]}–₹${priceRange[1]}`,
        value: `${priceRange[0]}-${priceRange[1]}`,
      })
    }

    // Add sort filter if not default
    if (sortBy !== "Newest First") {
      filters.push({ type: "sort", label: sortBy, value: sortBy })
    }

    return filters
  }

  return (
    <FilterContext.Provider
      value={{
        selectedSizes,
        selectedColors,
        selectedFits,
        priceRange,
        sortBy,
        toggleSize,
        toggleColor,
        toggleFit,
        setPriceRange,
        setSortBy,
        clearAll,
        removeFilter,
        getAppliedFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider")
  }
  return context
}
