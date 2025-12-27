import Image from "next/image"
import Link from "next/link"

interface MegaMenuProductCardProps {
  product: {
    id: number
    name: string
    price: number
    image: string
    slug: string
  }
  badge?: string
}

export default function MegaMenuProductCard({ product, badge }: MegaMenuProductCardProps) {
  return (
    <Link
      href={`/${product.slug}`}
      className="group block"
    >
      <div className="overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-b-2 hover:border-red-600">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {badge && (
            <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-bold uppercase text-white">
              {badge}
            </span>
          )}
        </div>
        <div className="p-3">
          <h4 className="mb-1 line-clamp-1 font-body text-sm font-medium text-black">
            {product.name}
          </h4>
          <p className="font-heading text-base font-bold text-black">
            ₹{product.price}
          </p>
        </div>
      </div>
    </Link>
  )
}
