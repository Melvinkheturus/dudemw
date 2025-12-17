import { DataDrivenHomepage } from "@/domains/homepage"
import FloatingWhatsApp from "@/lib/layout/media/FloatingWhatsApp"
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/utils/seo"

export default function HomePage() {
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebsiteSchema()

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      
      {/* Data-Driven Homepage Content */}
      <DataDrivenHomepage />
      
      {/* Keep floating WhatsApp for now */}
      <FloatingWhatsApp />
    </>
  )
}
