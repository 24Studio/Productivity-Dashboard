"use client"

import { useState, useEffect } from "react"
import { Music, X } from "lucide-react"

interface MeditationWidgetProps {
  id: string
  title: string
  subtitle: string
  isExpanded: boolean
  isEditMode?: boolean
  isTimer?: boolean
  onExpand: () => void
  onRemove: () => void
}

export function MeditationWidget({
  id,
  title,
  subtitle,
  isExpanded,
  isEditMode = false,
  isTimer = false,
  onExpand,
  onRemove,
}: MeditationWidgetProps) {
  const [time, setTime] = useState(1005) // 16:45 in seconds
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && !isEditMode) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0) {
            setIsRunning(false)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, isEditMode])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const toggleTimer = () => {
    if (isEditMode) return
    setIsRunning(!isRunning)
  }

  if (isTimer) {
    return (
      <div className={`widget h-full flex flex-col ${isExpanded ? "fixed inset-4 z-50" : ""}`}>
        {isEditMode && (
          <button className="absolute top-2 right-2 z-10 p-1 rounded-full bg-destructive text-white" onClick={onRemove}>
            <X className="h-3 w-3" />
          </button>
        )}

        <div className="widget-header widget-drag-handle bg-blue-500 text-white">
          <div>
            <div className="widget-title">{title}</div>
            <div className="text-xs opacity-80">{subtitle}</div>
          </div>
        </div>

        <div className="widget-content flex-1 flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/30">
          <div className="text-sm text-center mb-4">Remaining time</div>
          <div className="text-4xl font-bold mb-6">{formatTime(time)}</div>

          <button
            className="bg-white dark:bg-gray-800 rounded-full px-6 py-2 shadow-sm hover:shadow"
            onClick={toggleTimer}
          >
            {isRunning ? "Pause" : "Start"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`widget h-full flex flex-col ${isExpanded ? "fixed inset-4 z-50" : ""}`}>
      {isEditMode && (
        <button className="absolute top-2 right-2 z-10 p-1 rounded-full bg-destructive text-white" onClick={onRemove}>
          <X className="h-3 w-3" />
        </button>
      )}

      <div className="widget-header widget-drag-handle">
        <div>
          <div className="widget-title">{title}</div>
          <div className="widget-subtitle">{subtitle}</div>
        </div>
      </div>

      <div className="widget-content flex-1 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className={`rounded-full w-${item % 3 === 0 ? "16" : "12"} h-${item % 3 === 0 ? "16" : "12"} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}
            >
              <Music
                className={`h-${item % 3 === 0 ? "6" : "4"} w-${item % 3 === 0 ? "6" : "4"} text-gray-500 dark:text-gray-400`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

