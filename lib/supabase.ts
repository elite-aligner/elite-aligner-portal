import { createClient } from '@supabase/supabase-js'
import { Case } from '@/types'

// المفاتيح مباشرة في الكود
const supabaseUrl = 'https://ogysyioeyyszdzhciau.supabase.co'
const supabaseAnonKey = 'sb_publishable_0drLNWdB48knxLuh7bzlVQ_nWRCaiXT'

// Client-side supabase
export const createClientSupabase = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Server-side supabase
export const createServerSupabase = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Admin supabase
export const createAdminSupabase = () => {
  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

// Case operations
export async function getCases(status?: string): Promise<Case[]> {
  const supabase = createClientSupabase()
  let query = supabase
    .from('cases')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching cases:', error)
    return []
  }

  return data || []
}

export async function getCaseById(id: string): Promise<Case | null> {
  const supabase = createClientSupabase()
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching case:', error)
    return null
  }

  return data
}

export async function uploadImage(file: File, folder: string): Promise<string | null> {
  const supabase = createClientSupabase()
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${folder}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('case-images')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Error uploading image:', uploadError)
    return null
  }

  const { data } = supabase.storage.from('case-images').getPublicUrl(filePath)
  return data.publicUrl
}