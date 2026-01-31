import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface HeroSection {
  id: string
  title: string
  description: string
  cta_primary_text: string
  cta_secondary_text: string
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  title: string
  description: string
  points: string[]
  button_title: string
  modal_content: string
  icon_emoji: string
  color_scheme: string
  display_order: number
  created_at: string
  updated_at: string
}

export interface Workshop {
  id: string
  title: string
  description: string
  image_url: string
  display_order: number
  created_at: string
  updated_at: string
}

export interface Gallery {
  id: string
  image_url: string
  alt_text: string
  description?: string
  display_order: number
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  name: string
  rating: number
  text: string
  therapy: string
  display_order: number
  created_at: string
  updated_at: string
}