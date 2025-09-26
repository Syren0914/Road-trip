import { useState, useEffect, useCallback } from 'react'
import { roadmapService, roadmapItemService, expenseService, realtimeService } from '@/lib/database'
import type { Database } from '@/lib/supabase'

type Roadmap = Database['public']['Tables']['roadmaps']['Row']
type RoadmapItem = Database['public']['Tables']['roadmap_items']['Row']
type Expense = Database['public']['Tables']['expenses']['Row']

interface UseRoadmapProps {
  roadmapId: string
  userId: string
}

export function useRoadmap({ roadmapId, userId }: UseRoadmapProps) {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [roadmapData, itemsData, expensesData] = await Promise.all([
        roadmapService.getRoadmap(roadmapId),
        roadmapItemService.getRoadmapItems(roadmapId),
        expenseService.getExpenses(roadmapId)
      ])

      setRoadmap(roadmapData)
      setRoadmapItems(itemsData)
      setExpenses(expensesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [roadmapId])

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [loadData])

  // Set up real-time subscriptions
  useEffect(() => {
    if (!roadmapId) return

    const subscription = realtimeService.subscribeToRoadmap(roadmapId, (payload) => {
      console.log('Real-time update:', payload)
      // Reload data when changes occur
      loadData()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [roadmapId, loadData])

  // Roadmap operations
  const updateRoadmap = useCallback(async (updates: Partial<Roadmap>) => {
    if (!roadmap) return

    try {
      const updatedRoadmap = await roadmapService.updateRoadmap(roadmap.id, updates)
      setRoadmap(updatedRoadmap)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update roadmap')
      throw err
    }
  }, [roadmap])

  // Roadmap item operations
  const addRoadmapItem = useCallback(async (item: Omit<RoadmapItem, 'id' | 'roadmap_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newItem = await roadmapItemService.createRoadmapItem({
        ...item,
        roadmap_id: roadmapId,
        order_index: roadmapItems.length
      })
      setRoadmapItems(prev => [...prev, newItem])
      return newItem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add roadmap item')
      throw err
    }
  }, [roadmapId, roadmapItems.length])

  const updateRoadmapItem = useCallback(async (id: string, updates: Partial<RoadmapItem>) => {
    try {
      const updatedItem = await roadmapItemService.updateRoadmapItem(id, updates)
      setRoadmapItems(prev => prev.map(item => item.id === id ? updatedItem : item))
      return updatedItem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update roadmap item')
      throw err
    }
  }, [])

  const deleteRoadmapItem = useCallback(async (id: string) => {
    try {
      await roadmapItemService.deleteRoadmapItem(id)
      setRoadmapItems(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete roadmap item')
      throw err
    }
  }, [])

  const toggleRoadmapItemComplete = useCallback(async (id: string) => {
    const item = roadmapItems.find(item => item.id === id)
    if (!item) return

    try {
      await updateRoadmapItem(id, { completed: !item.completed })
    } catch (err) {
      // Error is already handled in updateRoadmapItem
    }
  }, [roadmapItems, updateRoadmapItem])

  const reorderRoadmapItems = useCallback(async (items: { id: string; order_index: number }[]) => {
    try {
      await roadmapItemService.reorderRoadmapItems(roadmapId, items)
      // Update local state
      setRoadmapItems(prev => {
        const updated = [...prev]
        items.forEach(({ id, order_index }) => {
          const index = updated.findIndex(item => item.id === id)
          if (index !== -1) {
            updated[index] = { ...updated[index], order_index }
          }
        })
        return updated.sort((a, b) => a.order_index - b.order_index)
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder items')
      throw err
    }
  }, [roadmapId])

  // Expense operations
  const addExpense = useCallback(async (expense: Omit<Expense, 'id' | 'roadmap_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newExpense = await expenseService.createExpense({
        ...expense,
        roadmap_id: roadmapId
      })
      setExpenses(prev => [...prev, newExpense])
      return newExpense
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add expense')
      throw err
    }
  }, [roadmapId])

  const updateExpense = useCallback(async (id: string, updates: Partial<Expense>) => {
    try {
      const updatedExpense = await expenseService.updateExpense(id, updates)
      setExpenses(prev => prev.map(expense => expense.id === id ? updatedExpense : expense))
      return updatedExpense
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update expense')
      throw err
    }
  }, [])

  const deleteExpense = useCallback(async (id: string) => {
    try {
      await expenseService.deleteExpense(id)
      setExpenses(prev => prev.filter(expense => expense.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete expense')
      throw err
    }
  }, [])

  // Computed values
  const completedCount = roadmapItems.filter(item => item.completed).length
  const totalRoadmapCost = roadmapItems.reduce((sum, item) => sum + (item.cost || 0), 0)
  const completedRoadmapCost = roadmapItems
    .filter(item => item.completed)
    .reduce((sum, item) => sum + (item.cost || 0), 0)
  const totalExpenses = expenses.filter(expense => expense.completed).reduce((sum, expense) => sum + expense.amount, 0)
  const totalSpent = completedRoadmapCost + totalExpenses
  const remainingBudget = (roadmap?.budget || 0) - totalSpent
  const progressPercentage = roadmapItems.length > 0 ? (completedCount / roadmapItems.length) * 100 : 0

  return {
    // Data
    roadmap,
    roadmapItems,
    expenses,
    loading,
    error,
    
    // Computed values
    completedCount,
    totalRoadmapCost,
    completedRoadmapCost,
    totalExpenses,
    totalSpent,
    remainingBudget,
    progressPercentage,
    
    // Actions
    updateRoadmap,
    addRoadmapItem,
    updateRoadmapItem,
    deleteRoadmapItem,
    toggleRoadmapItemComplete,
    reorderRoadmapItems,
    addExpense,
    updateExpense,
    deleteExpense,
    reload: loadData
  }
}
