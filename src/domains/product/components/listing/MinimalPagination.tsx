"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface MinimalPaginationProps {
  current: number
  total: number
}

export default function MinimalPagination({ current, total }: MinimalPaginationProps) {
  const searchParams = useSearchParams()
  
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    return `?${params.toString()}`
  }

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      {current > 1 && (
        <Link
          href={createPageUrl(current - 1)}
          className="rounded-lg border border-gray-300 px-4 py-2 font-body text-sm transition-colors hover:border-red-600 hover:text-red-600"
        >
          Previous
        </Link>
      )}
      
      <div className="flex gap-2">
        {Array.from({ length: Math.min(total, 5) }, (_, i) => i + 1).map((page) => (
          <Link
            key={page}
            href={createPageUrl(page)}
            className={`h-10 w-10 rounded-lg border font-body text-sm transition-colors ${
              page === current
                ? "border-red-600 bg-red-600 text-white"
                : "border-gray-300 hover:border-red-600 hover:text-red-600"
            } flex items-center justify-center`}
          >
            {page}
          </Link>
        ))}
      </div>

      {current < total && (
        <Link
          href={createPageUrl(current + 1)}
          className="rounded-lg border border-gray-300 px-4 py-2 font-body text-sm transition-colors hover:border-red-600 hover:text-red-600"
        >
          Next
        </Link>
      )}
    </div>
  )
}
