// Environment variable checker
export function checkEnvironmentVariables() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]

  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    console.error('Missing environment variables:', missing)
    return {
      valid: false,
      missing,
      message: `Missing environment variables: ${missing.join(', ')}`
    }
  }

  return {
    valid: true,
    missing: [],
    message: 'All environment variables are set'
  }
}

// Check if we're in development
export function isDevelopment() {
  return process.env.NODE_ENV === 'development'
}

// Get environment info for debugging
export function getEnvironmentInfo() {
  return {
    nodeEnv: process.env.NODE_ENV,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    appUrl: process.env.NEXT_PUBLIC_APP_URL
  }
}
