import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Browser client for SSR
export const createClientComponentClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Database types
export interface Database {
  public: {
    Tables: {
      roadmaps: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          budget: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          budget: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          budget?: number
          created_at?: string
          updated_at?: string
        }
      }
      roadmap_items: {
        Row: {
          id: string
          roadmap_id: string
          title: string
          address: string
          description: string
          hours: string | null
          completed: boolean
          category: 'pickup' | 'stop' | 'fuel' | 'food' | 'hotel' | 'visit'
          cost: number
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          roadmap_id: string
          title: string
          address: string
          description: string
          hours?: string | null
          completed?: boolean
          category: 'pickup' | 'stop' | 'fuel' | 'food' | 'hotel' | 'visit'
          cost?: number
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          roadmap_id?: string
          title?: string
          address?: string
          description?: string
          hours?: string | null
          completed?: boolean
          category?: 'pickup' | 'stop' | 'fuel' | 'food' | 'hotel' | 'visit'
          cost?: number
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          roadmap_id: string
          title: string
          amount: number
          category: 'fuel' | 'food' | 'hotel' | 'misc' | 'emergency'
          date: string
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          roadmap_id: string
          title: string
          amount: number
          category: 'fuel' | 'food' | 'hotel' | 'misc' | 'emergency'
          date: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          roadmap_id?: string
          title?: string
          amount?: number
          category?: 'fuel' | 'food' | 'hotel' | 'misc' | 'emergency'
          date?: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
