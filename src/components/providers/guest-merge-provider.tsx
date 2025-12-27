"use client"

import { useGuestMerge } from '@/hooks/useGuestMerge'

/**
 * Client component wrapper that triggers guest data merge on mount
 * Used in root layout to ensure merge happens early in app lifecycle
 */
export function GuestMergeHandler() {
    useGuestMerge()
    return null
}
