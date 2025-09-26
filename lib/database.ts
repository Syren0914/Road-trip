import { supabase } from './supabase'
import type { Database } from './supabase'

type Roadmap = Database['public']['Tables']['roadmaps']['Row']
type RoadmapInsert = Database['public']['Tables']['roadmaps']['Insert']
type RoadmapUpdate = Database['public']['Tables']['roadmaps']['Update']

type RoadmapItem = Database['public']['Tables']['roadmap_items']['Row']
type RoadmapItemInsert = Database['public']['Tables']['roadmap_items']['Insert']
type RoadmapItemUpdate = Database['public']['Tables']['roadmap_items']['Update']

type Expense = Database['public']['Tables']['expenses']['Row']
type ExpenseInsert = Database['public']['Tables']['expenses']['Insert']
type ExpenseUpdate = Database['public']['Tables']['expenses']['Update']

// Roadmap operations
export const roadmapService = {
  // Get all roadmaps for a user
  async getRoadmaps(userId: string): Promise<Roadmap[]> {
    const { data, error } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get a single roadmap
  async getRoadmap(id: string): Promise<Roadmap | null> {
    const { data, error } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Create a new roadmap
  async createRoadmap(roadmap: RoadmapInsert): Promise<Roadmap> {
    const { data, error } = await supabase
      .from('roadmaps')
      .insert(roadmap)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update a roadmap
  async updateRoadmap(id: string, updates: RoadmapUpdate): Promise<Roadmap> {
    const { data, error } = await supabase
      .from('roadmaps')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete a roadmap
  async deleteRoadmap(id: string): Promise<void> {
    const { error } = await supabase
      .from('roadmaps')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Roadmap items operations
export const roadmapItemService = {
  // Get all items for a roadmap
  async getRoadmapItems(roadmapId: string): Promise<RoadmapItem[]> {
    const { data, error } = await supabase
      .from('roadmap_items')
      .select('*')
      .eq('roadmap_id', roadmapId)
      .order('order_index', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Create a new roadmap item
  async createRoadmapItem(item: RoadmapItemInsert): Promise<RoadmapItem> {
    const { data, error } = await supabase
      .from('roadmap_items')
      .insert(item)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update a roadmap item
  async updateRoadmapItem(id: string, updates: RoadmapItemUpdate): Promise<RoadmapItem> {
    const { data, error } = await supabase
      .from('roadmap_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete a roadmap item
  async deleteRoadmapItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('roadmap_items')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Reorder roadmap items
  async reorderRoadmapItems(roadmapId: string, items: { id: string; order_index: number }[]): Promise<void> {
    const updates = items.map(item => 
      supabase
        .from('roadmap_items')
        .update({ order_index: item.order_index, updated_at: new Date().toISOString() })
        .eq('id', item.id)
    )

    const results = await Promise.all(updates)
    const errors = results.filter(result => result.error)
    
    if (errors.length > 0) {
      throw new Error('Failed to reorder items')
    }
  }
}

// Expenses operations
export const expenseService = {
  // Get all expenses for a roadmap
  async getExpenses(roadmapId: string): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('roadmap_id', roadmapId)
      .order('date', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Create a new expense
  async createExpense(expense: ExpenseInsert): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .insert(expense)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update an expense
  async updateExpense(id: string, updates: ExpenseUpdate): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete an expense
  async deleteExpense(id: string): Promise<void> {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Real-time subscriptions
export const realtimeService = {
  // Subscribe to roadmap changes
  subscribeToRoadmap(roadmapId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`roadmap-${roadmapId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'roadmap_items', filter: `roadmap_id=eq.${roadmapId}` },
        callback
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'expenses', filter: `roadmap_id=eq.${roadmapId}` },
        callback
      )
      .subscribe()
  },

  // Subscribe to roadmap items changes
  subscribeToRoadmapItems(roadmapId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`roadmap-items-${roadmapId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'roadmap_items', filter: `roadmap_id=eq.${roadmapId}` },
        callback
      )
      .subscribe()
  },

  // Subscribe to expenses changes
  subscribeToExpenses(roadmapId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`expenses-${roadmapId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'expenses', filter: `roadmap_id=eq.${roadmapId}` },
        callback
      )
      .subscribe()
  }
}
