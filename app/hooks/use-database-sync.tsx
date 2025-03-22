"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface SyncOptions {
  autoSync?: boolean
  syncInterval?: number
}

export function useDatabaseSync<T, U>(data: T, layouts: U, options: SyncOptions = {}) {
  const { autoSync = false, syncInterval = 60000 } = options
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSynced, setLastSynced] = useState<number | null>(null)
  const [error, setError] = useState<Error | null>(null)

  // Use refs to avoid dependency changes triggering effects
  const dataRef = useRef(data)
  const layoutsRef = useRef(layouts)

  // Update refs when props change
  useEffect(() => {
    dataRef.current = data
    layoutsRef.current = layouts
  }, [data, layouts])

  // Load last synced time from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLastSynced = localStorage.getItem("dashboard-last-synced")
      if (storedLastSynced) {
        setLastSynced(Number.parseInt(storedLastSynced))
      }
    }
  }, [])

  // This is a mock function that would normally connect to Supabase/Firebase
  const syncToDatabase = useCallback(async () => {
    if (isSyncing) return false // Prevent multiple syncs

    setIsSyncing(true)
    setError(null)

    try {
      // In a real implementation, this would be a call to your database
      // Example: await supabase.from('dashboard').upsert({ user_id: userId, data, layouts })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update last synced timestamp
      const timestamp = Date.now()
      setLastSynced(timestamp)

      // Store last synced time in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("dashboard-last-synced", timestamp.toString())
      }

      return true
    } catch (err) {
      setError(err as Error)
      return false
    } finally {
      setIsSyncing(false)
    }
  }, [isSyncing]) // Only depend on isSyncing, use refs for data and layouts

  // Set up auto-sync if enabled
  useEffect(() => {
    if (!autoSync) return

    const interval = setInterval(() => {
      syncToDatabase()
    }, syncInterval)

    return () => clearInterval(interval)
  }, [autoSync, syncInterval, syncToDatabase])

  return {
    isSyncing,
    lastSynced,
    error,
    syncData: syncToDatabase,
  }
}

