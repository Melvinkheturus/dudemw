"use client"

import { useState, useEffect } from "react"
import { X, ChevronDown } from "lucide-react"
import { useFilters } from "../../hooks/FilterContext"

const sizes = ["S", "M", "L", "XL", "XXL", "3XL"]
const colors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#FF0000" },
  { name: "Grey", hex: "#666666" },
  { name: "Navy", hex: "#1e293b" },
  { name: "Green", hex: "#22c55e" },
]

const fitTypes = ["Oversized", "Slim Fit", "Regular"]
const sortOptions = ["Newest First", "Price: Low to High", "Price: High to Low", "Bestsellers"]
const MIN_PRICE = 299
const MAX_PRICE = 1999

const SidebarFilterContent = () => {
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [minInput, setMinInput] = useState("")
  const [maxInput, setMaxInput] = useState("")
  const {
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
  } = useFilters()

  // Sync inputs with actual price range when it changes externally (e.g., clear all)
  useEffect(() => {
    setMinInput("")
    setMaxInput("")
  }, [priceRange])

  const handlePriceUpdate = () => {
    const min = minInput ? Number(minInput) : MIN_PRICE
    const max = maxInput ? Number(maxInput) : MAX_PRICE
    if (min >= MIN_PRICE && max <= MAX_PRICE && min < max) {
      setPriceRange([min, max])
    }
  }

  return (
    <div className="space-y-6">
      {/* Sort By - Custom Dropdown */}
      <div className="relative">
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-600">
          Sort By
        </label>
        <button
          onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
          className="flex w-full items-center justify-between rounded-lg border border-gray-300 px-3 py-2 text-xs transition-colors hover:border-red-600 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
        >
          <span>{sortBy}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${sortDropdownOpen ? "rotate-180" : ""}`} />
        </button>
        {sortDropdownOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
            {sortOptions.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setSortBy(option)
                  setSortDropdownOpen(false)
                }}
                className={`w-full px-3 py-2 text-left text-xs transition-colors hover:bg-gray-50 ${sortBy === option ? "bg-red-50 text-red-600" : ""
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-600">
          Price Range
        </label>
        <div className="mt-3 space-y-2">
          <button
            onClick={() => {
              setPriceRange([MIN_PRICE, 900])
              setMinInput("")
              setMaxInput("")
            }}
            className={`w-full rounded-lg border px-4 py-2 text-left text-sm transition-colors ${priceRange[1] === 900 && priceRange[0] === MIN_PRICE
              ? "border-red-600 bg-red-50 text-red-600"
              : "border-gray-300 hover:border-red-600"
              }`}
          >
            Under ₹900
          </button>
          <button
            onClick={() => {
              setPriceRange([900, MAX_PRICE])
              setMinInput("")
              setMaxInput("")
            }}
            className={`w-full rounded-lg border px-4 py-2 text-left text-sm transition-colors ${priceRange[0] === 900 && priceRange[1] === MAX_PRICE
              ? "border-red-600 bg-red-50 text-red-600"
              : "border-gray-300 hover:border-red-600"
              }`}
          >
            Over ₹900
          </button>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="₹ Min"
              value={minInput}
              onChange={(e) => setMinInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePriceUpdate()}
              className="w-20 rounded-lg border border-gray-300 px-2 py-2 text-xs focus:outline-none focus:ring-0"
            />
            <input
              type="number"
              placeholder="₹ Max"
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePriceUpdate()}
              className="w-20 rounded-lg border border-gray-300 px-2 py-2 text-xs focus:outline-none focus:ring-0"
            />
            <button
              onClick={handlePriceUpdate}
              className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-xs font-medium transition-colors hover:bg-red-600 hover:text-white"
            >
              Go
            </button>
          </div>
        </div>
      </div>

      {/* Size */}
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-600">
          Size
        </label>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`rounded-lg border-2 py-2 text-xs font-medium transition-all ${selectedSizes.includes(size)
                ? "border-red-600 bg-red-600 text-white"
                : "border-gray-300 hover:border-red-600"
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-600">
          Color
        </label>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => toggleColor(color.name)}
              className={`h-8 w-8 rounded-full border-2 transition-all ${selectedColors.includes(color.name)
                ? "border-red-600 ring-2 ring-red-600 ring-offset-2"
                : "border-gray-300 hover:border-red-600"
                }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={color.name}
            />
          ))}
        </div>
      </div>

      {/* Fit Type */}
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-600">
          Fit Type
        </label>
        <div className="space-y-2">
          {fitTypes.map((fit) => (
            <label
              key={fit}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 transition-colors hover:border-red-600"
            >
              <input
                type="checkbox"
                checked={selectedFits.includes(fit)}
                onChange={() => toggleFit(fit)}
                className="h-3 w-3 rounded border-gray-300 text-red-600 focus:ring-2 focus:ring-red-600"
              />
              <span className="text-xs font-medium">{fit}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function SidebarFilters() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { clearAll } = useFilters()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 space-y-6 border-r border-gray-200 pr-6 lg:block">
        <h3 className="font-heading text-lg font-medium">FILTERS</h3>
        <div className="h-px bg-gray-200" />
        <SidebarFilterContent />
        <div className="space-y-2 pt-3">
          <button className="w-full rounded-full bg-red-600 py-3 font-heading text-xs font-medium tracking-wider text-white transition-all hover:bg-black">
            APPLY FILTERS
          </button>
          <button
            onClick={clearAll}
            className="w-full text-xs text-red-600 underline transition-colors hover:no-underline"
          >
            Clear All
          </button>
        </div>
      </aside>

      {/* Mobile Trigger Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-full border-2 border-black bg-white px-8 py-4 font-heading text-sm font-medium shadow-xl transition-all hover:bg-black hover:text-white lg:hidden"
      >
        FILTERS & SORT
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-white lg:hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <h3 className="font-heading text-xl font-medium">FILTERS</h3>
            <button onClick={() => setMobileOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="h-full overflow-y-auto p-6 pb-32">
            <SidebarFilterContent />
          </div>

          {/* Fixed Bottom Actions */}
          <div className="fixed bottom-0 left-0 right-0 flex gap-4 border-t bg-white p-4">
            <button
              onClick={clearAll}
              className="flex-1 text-sm text-red-600 underline"
            >
              Clear All
            </button>
            <button
              onClick={() => setMobileOpen(false)}
              className="flex-1 rounded-full bg-red-600 py-4 font-heading text-sm font-medium text-white"
            >
              APPLY
            </button>
          </div>
        </div>
      )}
    </>
  )
}
