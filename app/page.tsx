"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthModal } from "@/components/auth/AuthModal"
import { useAuth } from "@/hooks/useAuth"
import { useRoadmap } from "@/hooks/useRoadmap"
import {
  CheckCircle2,
  Circle,
  MapPin,
  Clock,
  Navigation,
  Edit3,
  Save,
  X,
  Plus,
  DollarSign,
  Trash2,
  Route,
  Target,
  TrendingUp,
  User,
  LogOut,
  Loader2,
} from "lucide-react"

interface RoadmapItem {
  id: string
  title: string
  address: string
  description: string
  hours?: string
  completed: boolean
  category: "pickup" | "stop" | "fuel" | "food" | "hotel" | "visit"
  cost?: number
}

interface CostItem {
  id: string
  title: string
  amount: number
  category: "fuel" | "food" | "hotel" | "misc" | "emergency"
  date?: string
  completed: boolean
}

const initialRoadmap: RoadmapItem[] = [
  {
    id: "1",
    title: "Air up tires",
    address: "21398 Price Cascades Plz, Sterling, VA 20164",
    description: "Costco Sterling gas area - Gas opens 6:00 AM daily (air is by the pumps)",
    hours: "6:00 AM daily",
    completed: false,
    category: "stop",
    cost: 0,
  },
  {
    id: "2",
    title: "Pick up Diego",
    address: "44060 Gala Cir, Ashburn, VA 20147",
    description: "Costco Sterling → Diego ~15 min in normal morning traffic",
    completed: false,
    category: "pickup",
    cost: 0,
  },
  {
    id: "3",
    title: "Pick up Esteban",
    address: "12666 Willow Spring Ct, Herndon, VA 20170",
    description: "From Diego → Esteban ~13 min per your note; typical Ashburn↔Herndon drive is ~9 miles/15–20 min",
    completed: false,
    category: "pickup",
    cost: 0,
  },
  {
    id: "4",
    title: "Breakfast at Panera Bread",
    address: "460 Elden St, Herndon, VA 20170",
    description: "Panera Bread (Herndon)",
    hours: "6:00 AM–9:00 PM",
    completed: false,
    category: "food",
    cost: 25,
  },
  {
    id: "5",
    title: "Fuel & snack stop",
    address: "1830 Reservoir St, Harrisonburg, VA 22801",
    description:
      "Costco Harrisonburg - Gas hours 6:00 AM–10:00 PM (Mon–Fri); warehouse typically 10:00 AM open on weekdays",
    hours: "Gas: 6:00 AM–10:00 PM (Mon–Fri)",
    completed: false,
    category: "fuel",
    cost: 60,
  },
  {
    id: "6",
    title: "Hotel Check-in",
    address: "2430 Roanoke St, Christiansburg, VA 24073",
    description: "Econo Lodge Christiansburg–Blacksburg I-81 - Check-in 3:00 PM, check-out 11:00 AM",
    hours: "Check-in: 3:00 PM",
    completed: false,
    category: "hotel",
    cost: 120,
  },
  {
    id: "7",
    title: "VT Campus Visit (Optional)",
    address: "800 Drillfield Dr, Blacksburg, VA 24061",
    description: "Main campus hub near Burruss Hall (≈10–15 min from the hotel)",
    completed: false,
    category: "visit",
    cost: 0,
  },
]

const categoryColors = {
  pickup: "bg-primary text-primary-foreground",
  stop: "bg-accent text-accent-foreground",
  fuel: "bg-chart-1 text-white",
  food: "bg-chart-2 text-white",
  hotel: "bg-chart-4 text-white",
  visit: "bg-chart-5 text-white",
}

const categoryIcons = {
  pickup: "👥",
  stop: "🛠️",
  fuel: "⛽",
  food: "🍽️",
  hotel: "🏨",
  visit: "🎓",
}

export default function TravelRoadmap() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<RoadmapItem>>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItemForm, setNewItemForm] = useState<Partial<RoadmapItem>>({
    title: "",
    address: "",
    description: "",
    hours: "",
    category: "stop",
    cost: 0,
  })

  const [editingBudget, setEditingBudget] = useState(false)
  const [showAddCostForm, setShowAddCostForm] = useState(false)
  const [newCostForm, setNewCostForm] = useState<Partial<CostItem>>({
    title: "",
    amount: 0,
    category: "misc",
    date: new Date().toISOString().split("T")[0],
  })

  // Use the default roadmap ID for demo purposes
  const roadmapId = "550e8400-e29b-41d4-a716-446655440000"
  const userId = user?.id || "00000000-0000-0000-0000-000000000000"

  const {
    roadmap,
    roadmapItems,
    expenses,
    loading: dataLoading,
    error,
    completedCount,
    totalRoadmapCost,
    completedRoadmapCost,
    totalExpenses,
    totalSpent,
    remainingBudget,
    progressPercentage,
    updateRoadmap,
    addRoadmapItem,
    updateRoadmapItem,
    deleteRoadmapItem,
    toggleRoadmapItemComplete,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useRoadmap({ roadmapId, userId })

  const loading = authLoading || dataLoading

  const startEditing = (item: RoadmapItem) => {
    setEditingItem(item.id)
    setEditForm({
      title: item.title,
      address: item.address,
      description: item.description,
      hours: item.hours,
      cost: item.cost,
    })
  }

  const saveEdit = async () => {
    if (!editingItem) return

    try {
      await updateRoadmapItem(editingItem, {
        title: editForm.title,
        address: editForm.address,
        description: editForm.description,
        hours: editForm.hours,
        cost: editForm.cost,
      })
      setEditingItem(null)
      setEditForm({})
    } catch (err) {
      console.error('Failed to update item:', err)
    }
  }

  const cancelEdit = () => {
    setEditingItem(null)
    setEditForm({})
  }

  const addNewItem = async () => {
    if (!newItemForm.title || !newItemForm.address) return

    try {
      await addRoadmapItem({
        title: newItemForm.title,
        address: newItemForm.address,
        description: newItemForm.description || "",
        hours: newItemForm.hours,
        category: newItemForm.category as RoadmapItem["category"],
        completed: false,
        cost: newItemForm.cost || 0,
        order_index: roadmapItems.length,
      })
      setNewItemForm({
        title: "",
        address: "",
        description: "",
        hours: "",
        category: "stop",
        cost: 0,
      })
      setShowAddForm(false)
    } catch (err) {
      console.error('Failed to add item:', err)
    }
  }

  const deleteItem = async (id: string) => {
    try {
      await deleteRoadmapItem(id)
    } catch (err) {
      console.error('Failed to delete item:', err)
    }
  }

  const toggleComplete = async (id: string) => {
    try {
      await toggleRoadmapItemComplete(id)
    } catch (err) {
      console.error('Failed to toggle item:', err)
    }
  }

  const openGoogleMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`
    window.open(url, "_blank")
  }

  const addCostItem = async () => {
    if (!newCostForm.title || !newCostForm.amount) return

    try {
      await addExpense({
        title: newCostForm.title,
        amount: newCostForm.amount,
        category: newCostForm.category as CostItem["category"],
        date: newCostForm.date || new Date().toISOString().split("T")[0],
        completed: true, // Cost items are marked as spent when added
      })
      setNewCostForm({
        title: "",
        amount: 0,
        category: "misc",
        date: new Date().toISOString().split("T")[0],
      })
      setShowAddCostForm(false)
    } catch (err) {
      console.error('Failed to add expense:', err)
    }
  }

  const deleteCostItem = async (id: string) => {
    try {
      await deleteExpense(id)
    } catch (err) {
      console.error('Failed to delete expense:', err)
    }
  }

  const saveBudget = async () => {
    if (!roadmap) return

    try {
      await updateRoadmap({ budget: roadmap.budget })
      setEditingBudget(false)
    } catch (err) {
      console.error('Failed to update budget:', err)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your roadmap...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full mt-4"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-5xl">
        <div className="text-center mb-6 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Route className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-2xl sm:text-4xl font-bold text-foreground text-balance">Travel Roadmap</h1>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg mb-2">Your journey from Sterling, VA to Blacksburg, VA</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Track your progress and manage costs efficiently</p>
          
          {/* Auth Section */}
          <div className="flex items-center justify-center gap-4 mt-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-xs"
                >
                  <LogOut className="h-3 w-3 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <AuthModal>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </AuthModal>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-2">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Journey Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {completedCount} of {roadmapItems.length} stops completed
                  </span>
                  <Badge variant="secondary" className="font-semibold">
                    {Math.round(progressPercentage)}%
                  </Badge>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <div className="text-xs text-muted-foreground text-center">
                  {roadmapItems.length - completedCount} stops remaining
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Budget Overview
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingBudget(!editingBudget)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium text-foreground">Total Budget</span>
                  {editingBudget ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={roadmap?.budget || 0}
                        onChange={(e) => {
                          if (roadmap) {
                            updateRoadmap({ budget: Number.parseFloat(e.target.value) || 0 })
                          }
                        }}
                        className="w-24 h-8 text-right"
                      />
                      <Button size="sm" onClick={saveBudget}>
                        <Save className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-foreground">${roadmap?.budget || 0}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="text-center p-2 sm:p-3 bg-red-50/50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                      <span className="text-xs font-medium text-muted-foreground">Spent</span>
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-red-500">${totalSpent}</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-green-50/50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Circle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                      <span className="text-xs font-medium text-muted-foreground">Remaining</span>
                    </div>
                    <div className={`text-lg sm:text-xl font-bold ${remainingBudget >= 0 ? "text-green-500" : "text-red-500"}`}>
                      ${remainingBudget}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Budget Usage</span>
                    <span>{roadmap?.budget ? Math.round((totalSpent / roadmap.budget) * 100) : 0}%</span>
                  </div>
                  <Progress
                    value={roadmap?.budget ? Math.min((totalSpent / roadmap.budget) * 100, 100) : 0}
                    className={`h-2 ${roadmap?.budget && totalSpent > roadmap.budget ? "[&>div]:bg-red-500" : ""}`}
                  />
                </div>

                <Dialog open={showAddCostForm} onOpenChange={setShowAddCostForm}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Expense
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                      <DialogTitle>Add New Expense</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Description *</label>
                        <Input
                          placeholder="e.g., Gas, Snacks, Parking"
                          value={newCostForm.title || ""}
                          onChange={(e) => setNewCostForm({ ...newCostForm, title: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Amount *</label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={newCostForm.amount || ""}
                            onChange={(e) =>
                              setNewCostForm({ ...newCostForm, amount: Number.parseFloat(e.target.value) || 0 })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Category</label>
                          <Select
                            value={newCostForm.category}
                            onValueChange={(value) =>
                              setNewCostForm({ ...newCostForm, category: value as CostItem["category"] })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fuel">⛽ Fuel</SelectItem>
                              <SelectItem value="food">🍽️ Food</SelectItem>
                              <SelectItem value="hotel">🏨 Hotel</SelectItem>
                              <SelectItem value="misc">📝 Miscellaneous</SelectItem>
                              <SelectItem value="emergency">🚨 Emergency</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Date</label>
                        <Input
                          type="date"
                          value={newCostForm.date || ""}
                          onChange={(e) => setNewCostForm({ ...newCostForm, date: e.target.value })}
                        />
                      </div>

                      <div className="flex gap-3 justify-end pt-4">
                        <Button variant="outline" onClick={() => setShowAddCostForm(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addCostItem} disabled={!newCostForm.title || !newCostForm.amount}>
                          <Save className="h-4 w-4 mr-2" />
                          Add Expense
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Dialog open={showAddCostForm} onOpenChange={setShowAddCostForm}>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="flex-1 h-10 sm:h-12 text-sm sm:text-base font-medium bg-transparent">
                <DollarSign className="h-5 w-5 mr-2" />
                Quick Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Description *</label>
                  <Input
                    placeholder="e.g., Gas, Snacks, Parking"
                    value={newCostForm.title || ""}
                    onChange={(e) => setNewCostForm({ ...newCostForm, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Amount *</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={newCostForm.amount || ""}
                      onChange={(e) =>
                        setNewCostForm({ ...newCostForm, amount: Number.parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Category</label>
                    <Select
                      value={newCostForm.category}
                      onValueChange={(value) =>
                        setNewCostForm({ ...newCostForm, category: value as CostItem["category"] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fuel">⛽ Fuel</SelectItem>
                        <SelectItem value="food">🍽️ Food</SelectItem>
                        <SelectItem value="hotel">🏨 Hotel</SelectItem>
                        <SelectItem value="misc">📝 Miscellaneous</SelectItem>
                        <SelectItem value="emergency">🚨 Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Date</label>
                  <Input
                    type="date"
                    value={newCostForm.date || ""}
                    onChange={(e) => setNewCostForm({ ...newCostForm, date: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <Button variant="outline" onClick={() => setShowAddCostForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addCostItem} disabled={!newCostForm.title || !newCostForm.amount}>
                    <Save className="h-4 w-4 mr-2" />
                    Add Expense
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button size="lg" className="flex-1 h-10 sm:h-12 text-sm sm:text-base font-medium">
                <Plus className="h-5 w-5 mr-2" />
                Add New Stop
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-xl">Add New Roadmap Stop</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Title *</label>
                    <Input
                      placeholder="Enter stop title"
                      value={newItemForm.title || ""}
                      onChange={(e) => setNewItemForm({ ...newItemForm, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Category</label>
                    <Select
                      value={newItemForm.category}
                      onValueChange={(value) =>
                        setNewItemForm({ ...newItemForm, category: value as RoadmapItem["category"] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pickup">👥 Pickup</SelectItem>
                        <SelectItem value="stop">🛠️ Stop</SelectItem>
                        <SelectItem value="fuel">⛽ Fuel</SelectItem>
                        <SelectItem value="food">🍽️ Food</SelectItem>
                        <SelectItem value="hotel">🏨 Hotel</SelectItem>
                        <SelectItem value="visit">🎓 Visit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Address *</label>
                  <Input
                    placeholder="Enter full address"
                    value={newItemForm.address || ""}
                    onChange={(e) => setNewItemForm({ ...newItemForm, address: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <Textarea
                    placeholder="Add any additional details or notes"
                    value={newItemForm.description || ""}
                    onChange={(e) => setNewItemForm({ ...newItemForm, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Hours</label>
                    <Input
                      placeholder="e.g., 9:00 AM - 5:00 PM"
                      value={newItemForm.hours || ""}
                      onChange={(e) => setNewItemForm({ ...newItemForm, hours: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Estimated Cost</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newItemForm.cost || ""}
                      onChange={(e) => setNewItemForm({ ...newItemForm, cost: Number.parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addNewItem} disabled={!newItemForm.title || !newItemForm.address}>
                    <Save className="h-4 w-4 mr-2" />
                    Add Stop
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Expense History Section */}
        {expenses.length > 0 && (
          <Card className="mb-4 sm:mb-6 border-2">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Expense History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-2 sm:p-3 bg-muted/30 rounded-lg border"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="text-base sm:text-lg">
                        {expense.category === "fuel" && "⛽"}
                        {expense.category === "food" && "🍽️"}
                        {expense.category === "hotel" && "🏨"}
                        {expense.category === "misc" && "📝"}
                        {expense.category === "emergency" && "🚨"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm sm:text-base text-foreground truncate">{expense.title}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          {new Date(expense.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="font-bold text-sm sm:text-base text-foreground">${expense.amount}</span>
                      <Button
                        onClick={() => deleteCostItem(expense.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {roadmapItems.map((item, index) => (
            <Card
              key={item.id}
              className={`transition-all duration-300 hover:shadow-lg border-2 px-0 mt-3 sm:mt-4 ${
                item.completed ? "bg-green-50/50 border-green-200" : "hover:border-primary/50"
              }`}
            >
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleComplete(item.id)}
                    className="p-0 h-auto hover:bg-transparent mt-1"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-green-500" />
                    ) : (
                      <Circle className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground hover:text-primary transition-colors" />
                    )}
                  </Button>

                  <div className="flex-1 space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-xl sm:text-2xl">{categoryIcons[item.category]}</span>
                        {editingItem === item.id ? (
                          <Input
                            value={editForm.title || ""}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="text-lg sm:text-xl font-semibold"
                          />
                        ) : (
                          <h3
                            className={`text-lg sm:text-xl font-semibold ${
                              item.completed ? "line-through text-muted-foreground" : "text-foreground"
                            }`}
                          >
                            {item.title}
                          </h3>
                        )}
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2">
                        <Badge variant="secondary" className="font-medium text-xs sm:text-sm">
                          Step {index + 1}
                        </Badge>
                        {(item.cost || 0) > 0 && (
                          <Badge variant="outline" className="font-medium text-xs sm:text-sm">
                            ${item.cost}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {editingItem === item.id ? (
                      <Textarea
                        value={editForm.description || ""}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="resize-none text-sm sm:text-base"
                        rows={2}
                      />
                    ) : (
                      <p
                        className={`text-xs sm:text-sm leading-relaxed ${
                          item.completed ? "text-muted-foreground" : "text-foreground"
                        }`}
                      >
                        {item.description}
                      </p>
                    )}

                    {(item.hours || editingItem === item.id) && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        {editingItem === item.id ? (
                          <Input
                            value={editForm.hours || ""}
                            onChange={(e) => setEditForm({ ...editForm, hours: e.target.value })}
                            placeholder="Hours (optional)"
                            className="text-xs sm:text-sm"
                          />
                        ) : (
                          <span>{item.hours}</span>
                        )}
                      </div>
                    )}

                    {editingItem === item.id && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                        <Input
                          type="number"
                          value={editForm.cost || ""}
                          onChange={(e) => setEditForm({ ...editForm, cost: Number.parseFloat(e.target.value) || 0 })}
                          placeholder="Cost ($)"
                          className="text-xs sm:text-sm"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2">
                    {editingItem === item.id ? (
                      <>
                        <Button
                          onClick={saveEdit}
                          size="sm"
                          variant="outline"
                          className="border-green-500 text-green-600 hover:bg-green-50 bg-transparent"
                        >
                          <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-600 hover:bg-red-50 bg-transparent"
                        >
                          <X className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => startEditing(item)}
                          size="sm"
                          variant="ghost"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          onClick={() => deleteItem(item.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <Separator className="mb-3 sm:mb-4" />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground flex-1 min-w-0">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                    {editingItem === item.id ? (
                      <Input
                        value={editForm.address || ""}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        className="flex-1 text-xs sm:text-sm"
                      />
                    ) : (
                      <span className="flex-1 break-words text-xs sm:text-sm">{item.address}</span>
                    )}
                  </div>
                  {editingItem !== item.id && (
                    <Button onClick={() => openGoogleMaps(item.address)} size="sm" className="shrink-0 w-full sm:w-auto">
                      <Navigation className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm">Directions</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 sm:mt-12 border-2">
          <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8">
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                <Route className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">Journey Summary</h3>
              </div>

              <p className="text-muted-foreground text-base sm:text-lg">
                Complete all {roadmapItems.length} stops for your trip from Northern Virginia to Virginia Tech
              </p>

              {completedCount === roadmapItems.length ? (
                <Alert className="max-w-md mx-auto border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  <AlertDescription className="text-green-700 font-medium text-sm sm:text-base">
                    🎉 Congratulations! You've completed your entire roadmap!
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span>{completedCount} completed</span>
                  <Separator orientation="vertical" className="h-3 sm:h-4" />
                  <span>{roadmapItems.length - completedCount} remaining</span>
                  <Separator orientation="vertical" className="h-3 sm:h-4" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
