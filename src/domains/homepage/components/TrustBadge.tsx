"use client"

interface TrustBadgeProps {
  icon: string
  text: string
}

export default function TrustBadge({ icon, text }: TrustBadgeProps) {
  return (
    <div className="flex items-center gap-2 text-gray-800">
      <span className="text-xl">{icon}</span>
      <span className="font-body text-xs md:text-sm">{text}</span>
    </div>
  )
}
