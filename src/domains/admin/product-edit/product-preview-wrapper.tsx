"use client"

import { ProductPreview } from "@/domains/admin/product-creation/product-preview"

interface ProductPreviewWrapperProps {
    title: string
    subtitle: string
    description: string
    price: number
    comparePrice: number
    images: any[]
    status: string
    variantCount: number
}

export function ProductPreviewWrapper({
    title,
    subtitle,
    description,
    price,
    comparePrice,
    images,
    status,
    variantCount
}: ProductPreviewWrapperProps) {

    // Adapt images format to match ProductPreview expectation
    const previewImages = images?.map((img: any) => ({
        id: img.id,
        url: img.image_url,
        alt: img.alt_text || title,
        isPrimary: img.is_primary
    })) || []

    return (
        <div className="sticky top-6">
            <ProductPreview
                productName={title}
                productSubtitle={subtitle}
                price={price?.toString()}
                comparePrice={comparePrice?.toString()}
                images={previewImages}
                status={status}
                hasVariants={variantCount > 0}
                variantCount={variantCount}
            />
        </div>
    )
}
