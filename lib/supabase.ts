// @ts-nocheck
import { createClient } from '@supabase/supabase-js'

// ✅ المشروع الجديد في London (Europe)
const supabaseUrl = 'https://fqwbfisrcidyikssm.supabase.co'
const supabaseKey = 'sb_publishable_eN2-t1lk8Cpx3TCwzhCWw_3rSVv...'

export const supabase = createClient(supabaseUrl, supabaseKey)

export const createClientSupabase = () => {
  return createClient(supabaseUrl, supabaseKey)
}