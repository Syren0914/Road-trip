"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export function DebugInfo() {
  const [checks, setChecks] = useState<{
    envVars: boolean
    supabaseConnection: boolean
    tables: boolean
    sampleData: boolean
  }>({
    envVars: false,
    supabaseConnection: false,
    tables: false,
    sampleData: false
  })

  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    runChecks()
  }, [])

  const runChecks = async () => {
    const newErrors: string[] = []
    const newChecks = { ...checks }

    // Check environment variables
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        newErrors.push("Missing Supabase environment variables")
      } else {
        newChecks.envVars = true
      }
    } catch (err) {
      newErrors.push("Environment variables check failed")
    }

    // Check Supabase connection
    try {
      const { data, error } = await supabase.from('roadmaps').select('count').limit(1)
      if (error) {
        newErrors.push(`Supabase connection failed: ${error.message}`)
      } else {
        newChecks.supabaseConnection = true
      }
    } catch (err) {
      newErrors.push(`Supabase connection error: ${err}`)
    }

    // Check if tables exist
    try {
      const { data: roadmaps, error: roadmapsError } = await supabase.from('roadmaps').select('*').limit(1)
      const { data: items, error: itemsError } = await supabase.from('roadmap_items').select('*').limit(1)
      const { data: expenses, error: expensesError } = await supabase.from('expenses').select('*').limit(1)

      if (roadmapsError || itemsError || expensesError) {
        newErrors.push("Database tables not found. Please run the schema.sql file in Supabase.")
      } else {
        newChecks.tables = true
      }
    } catch (err) {
      newErrors.push(`Table check failed: ${err}`)
    }

    // Check for sample data
    try {
      const { data, error } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('id', '550e8400-e29b-41d4-a716-446655440000')
        .single()

      if (error) {
        newErrors.push("Sample data not found. Please run the schema.sql file in Supabase.")
      } else {
        newChecks.sampleData = true
      }
    } catch (err) {
      newErrors.push(`Sample data check failed: ${err}`)
    }

    setChecks(newChecks)
    setErrors(newErrors)
  }

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Debug Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            {getStatusIcon(checks.envVars)}
            <span className="text-sm">Environment Variables</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(checks.supabaseConnection)}
            <span className="text-sm">Supabase Connection</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(checks.tables)}
            <span className="text-sm">Database Tables</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(checks.sampleData)}
            <span className="text-sm">Sample Data</span>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-red-600">Issues Found:</h4>
            {errors.map((error, index) => (
              <Alert key={index} variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        <div className="pt-4">
          <Button onClick={runChecks} className="w-full">
            Re-run Checks
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Environment Variables Needed:</strong></p>
          <p>NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url</p>
          <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key</p>
          <p>SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key</p>
          <p>NEXT_PUBLIC_APP_URL=http://localhost:3000</p>
        </div>
      </CardContent>
    </Card>
  )
}
