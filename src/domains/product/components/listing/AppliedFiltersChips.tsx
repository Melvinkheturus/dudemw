"use client"

import { X } from "lucide-react"
import { useFilters } from "../../hooks/FilterContext"

export default function AppliedFiltersChips() {
  const { getAppliedFilters, removeFilter, clearAll } = useFilters()
  const appliedFilters = getAppliedFilters()

  if (appliedFilters.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-3 border-b py-4">
      <span className="text-sm font-medium text-gray-600">Applied Filters:</span>

      {/* Filter Chips - Horizontal scroll on mobile */}
      <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide">
        {appliedFilters.map((filter, i) => (
          <button
            key={i}
            onClick={() => removeFilter(filter.type, filter.value)}
            className="group flex items-center gap-2 rounded-full border border-red-600 px-4 py-2 text-sm font-medium text-black transition-all hover:bg-red-600 hover:text-white"
          >
            {filter.label}
            <X className="h-4 w-4 text-red-600 transition-colors group-hover:text-white" />
          </button>
        ))}
      </div>

      {/* Clear All */}
      <button
        onClick={clearAll}
        className="ml-auto text-sm text-red-600 underline transition-colors hover:no-underline"
      >
        Clear All
      </button>
    </div>
  )
}
