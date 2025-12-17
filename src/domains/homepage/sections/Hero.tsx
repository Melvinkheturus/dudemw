import { supabase } from '@/lib/supabase/supabase'
import HeroClient from "./HeroClient"

export default async function Hero() {
  const { data: banners } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (!banners || banners.length === 0) {
    return null
  }

  return <HeroClient banners={banners} />
}

