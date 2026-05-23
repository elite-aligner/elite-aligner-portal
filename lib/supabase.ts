// @ts-nocheck
import { createClient } from '@supabase/supabase-js'

// ✅ استخدام Direct URL (الذي يعمل في Browser)
const supabaseUrl = 'https://sknybbyxencuhbenshk.supabase.co'
const supabaseKey = 'sb_publishable_TqgzIZUYsHn9jy1AXUC0g_9T1CXIN0'

export const supabase = createClient(supabaseUrl, supabaseKey)

export const createClientSupabase = () => {
  return createClient(supabaseUrl, supabaseKey)
}