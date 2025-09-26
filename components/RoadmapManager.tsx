"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { roadmapService } from "@/lib/database"
import { Plus, Edit3, Trash2, Calendar, DollarSign, Users } from "lucide-react"
import type { Database } from "@/lib/supabase"

type Roadmap = Database['public']['Tables']['roadmaps']['Row']

interface RoadmapManagerProps {
  onRoadmapSelect: (roadmapId: string) => void
  currentRoadmapId?: string
}

export function RoadmapManager({ onRoadmapSelect, currentRoadmapId }: RoadmapManagerProps) {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingRoadmap, setEditingRoadmap] = useState<Roadmap | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: 500
  })

  // Demo user ID for no-auth mode
  const demoUserId = "00000000-0000-0000-0000-000000000000"

  const loadRoadmaps = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await roadmapService.getRoadmaps(demoUserId)
      setRoadmaps(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load roadmaps')
    } finally {
      setLoading(false)
    }
  }

  const createRoadmap = async () => {
    if (!formData.title.trim()) return

    try {
      const newRoadmap = await roadmapService.createRoadmap({
        user_id: demoUserId,
        title: formData.title,
        description: formData.description,
        budget: formData.budget
      })
      
      setRoadmaps(prev => [newRoadmap, ...prev])
      setFormData({ title: "", description: "", budget: 500 })
      setShowCreateForm(false)
      onRoadmapSelect(newRoadmap.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create roadmap')
    }
  }

  const updateRoadmap = async () => {
    if (!editingRoadmap || !formData.title.trim()) return

    try {
      const updatedRoadmap = await roadmapService.updateRoadmap(editingRoadmap.id, {
        title: formData.title,
        description: formData.description,
        budget: formData.budget
      })
      
      setRoadmaps(prev => prev.map(r => r.id === editingRoadmap.id ? updatedRoadmap : r))
      setEditingRoadmap(null)
      setFormData({ title: "", description: "", budget: 500 })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update roadmap')
    }
  }

  const deleteRoadmap = async (id: string) => {
    if (!confirm('Are you sure you want to delete this roadmap? This action cannot be undone.')) return

    try {
      await roadmapService.deleteRoadmap(id)
      setRoadmaps(prev => prev.filter(r => r.id !== id))
      
      // If we deleted the current roadmap, select the first available one
      if (currentRoadmapId === id && roadmaps.length > 1) {
        const remaining = roadmaps.filter(r => r.id !== id)
        onRoadmapSelect(remaining[0].id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete roadmap')
    }
  }

  const startEditing = (roadmap: Roadmap) => {
    setEditingRoadmap(roadmap)
    setFormData({
      title: roadmap.title,
      description: roadmap.description || "",
      budget: roadmap.budget
    })
  }

  const cancelEdit = () => {
    setEditingRoadmap(null)
    setFormData({ title: "", description: "", budget: 500 })
  }

  // Load roadmaps on mount
  React.useEffect(() => {
    loadRoadmaps()
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            My Roadmaps
          </CardTitle>
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button size="sm" type="button">
                <Plus className="h-4 w-4 mr-2" />
                New Roadmap
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Roadmap</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    placeholder="Enter roadmap title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Enter roadmap description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Budget ($)</label>
                  <Input
                    type="number"
                    placeholder="500"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setShowCreateForm(false)} type="button">
                    Cancel
                  </Button>
                  <Button onClick={createRoadmap} disabled={!formData.title.trim()} type="button">
                    Create Roadmap
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Loading roadmaps...</p>
          </div>
        ) : roadmaps.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No roadmaps found</p>
            <Button onClick={() => setShowCreateForm(true)} type="button">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Roadmap
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {roadmaps.map((roadmap) => (
              <div
                key={roadmap.id}
                className={`p-4 border rounded-lg transition-colors ${
                  currentRoadmapId === roadmap.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold truncate">{roadmap.title}</h3>
                      {currentRoadmapId === roadmap.id && (
                        <Badge variant="secondary">Active</Badge>
                      )}
                    </div>
                    {roadmap.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {roadmap.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>${roadmap.budget}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(roadmap.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRoadmapSelect(roadmap.id)}
                      disabled={currentRoadmapId === roadmap.id}
                      type="button"
                    >
                      {currentRoadmapId === roadmap.id ? 'Active' : 'Select'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(roadmap)}
                      type="button"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteRoadmap(roadmap.id)}
                      className="text-red-500 hover:text-red-600"
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingRoadmap} onOpenChange={() => cancelEdit()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Roadmap</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  placeholder="Enter roadmap title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Enter roadmap description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget ($)</label>
                <Input
                  type="number"
                  placeholder="500"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) || 0 })}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={cancelEdit} type="button">
                  Cancel
                </Button>
                <Button onClick={updateRoadmap} disabled={!formData.title.trim()} type="button">
                  Update Roadmap
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
