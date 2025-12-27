
import { Skeleton } from "@/components/ui/skeleton"

export function WishlistSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                    {/* Image skeleton */}
                    <Skeleton className="h-[250px] w-full rounded-xl" />

                    {/* Content skeleton */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>

                    {/* Button skeleton */}
                    <Skeleton className="h-10 w-full rounded-lg" />
                </div>
            ))}
        </div>
    )
}
