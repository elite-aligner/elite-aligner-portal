// @ts-nocheck
import { createClient } from '@supabase/supabase-js'

// ✅ استخدام Pooler URL بدلاً من Direct URL (لحل مشكلة DNS)
const supabaseUrl = 'https://aws-1-us-east-1.pooler.supabase.com'
const supabaseKey = 'sb_publishable_TqgzIZUYsHn9jy1AXUC0g_9T1CXIN0'

export const supabase = createClient(supabaseUrl, supabaseKey)

export const createClientSupabase = () => {
  return createClient(supabaseUrl, supabaseKey)
}