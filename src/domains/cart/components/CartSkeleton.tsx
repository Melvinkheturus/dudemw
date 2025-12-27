
import { Skeleton } from "@/components/ui/skeleton"

export function CartSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column - Cart Items Skeleton */}
                <div className="lg:col-span-8 space-y-4">
                    <Skeleton className="h-12 w-full rounded-lg mb-6" /> {/* Shipping banner */}

                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex gap-4 p-4 border border-gray-200 rounded-xl">
                            <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
                            <div className="flex-1 space-y-3">
                                <div className="flex justify-between">
                                    <Skeleton className="h-6 w-1/3" />
                                    <Skeleton className="h-6 w-20" />
                                </div>
                                <div className="flex gap-2">
                                    <Skeleton className="h-5 w-16" />
                                    <Skeleton className="h-5 w-16" />
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <Skeleton className="h-8 w-24" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-8 w-8 rounded" />
                                        <Skeleton className="h-8 w-8 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Column - Order Summary Skeleton */}
                <div className="lg:col-span-4">
                    <div className="sticky top-8 space-y-4">
                        <Skeleton className="h-[400px] w-full rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    )
}
