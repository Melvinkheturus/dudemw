import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty"
import { Search, Package } from "lucide-react"

interface ProductEmptyStateProps {
  query?: string
  category?: string
}

export default function ProductEmptyState({ query, category }: ProductEmptyStateProps) {
  if (query) {
    return (
      <Empty>
        <EmptyHeader>
          <Search className="w-12 h-12 text-gray-400" />
          <EmptyTitle>No products found</EmptyTitle>
          <EmptyDescription>
            We couldn't find any products matching "{query}". Try adjusting your search terms.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }
  
  if (category) {
    return (
      <Empty>
        <EmptyHeader>
          <Package className="w-12 h-12 text-gray-400" />
          <EmptyTitle>No products in this category</EmptyTitle>
          <EmptyDescription>
            There are no products available in the "{category}" category at the moment.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }
  
  return (
    <Empty>
      <EmptyHeader>
        <Package className="w-12 h-12 text-gray-400" />
        <EmptyTitle>No products available</EmptyTitle>
        <EmptyDescription>
          There are no products available at the moment. Please check back later.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
