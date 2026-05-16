import { createClient } from '@supabase/supabase-js'

// ✅ استخدم المفاتيح مباشرة (Hardcoded) - يعمل في Client و Server
const supabaseUrl = 'https://sknybbyxencuhbenshk.supabase.co'
const supabaseKey = 'sb_publishable_TqgzlZUYs9Hn9jy1AXUC0g_9T1CXlN0'

export const supabase = createClient(supabaseUrl, supabaseKey)

// ✅ Auth Client-side
export const createClientSupabase = () => {
  return createClient(supabaseUrl, supabaseKey)
}