import Link from "next/link"

interface RelatedSearchesProps {
  query: string
}

export default function RelatedSearches({ query }: RelatedSearchesProps) {
  const relatedSearches = [
    `${query} t-shirt`,
    `${query} track pants`,
    `${query} combo`,
    `oversized ${query}`,
    `${query} sale`,
  ]

  return (
    <section className="border-b border-gray-200 bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h3 className="mb-4 font-body text-sm font-medium text-gray-600">
          Related Searches:
        </h3>
        <div className="flex flex-wrap gap-2">
          {relatedSearches.map((search) => (
            <Link
              key={search}
              href={`/collections/all?q=${encodeURIComponent(search)}`}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 font-body text-sm transition-colors hover:border-red-600 hover:text-red-600"
            >
              {search}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
