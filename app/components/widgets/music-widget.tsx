"use client"

import { useState } from "react"
import { Music, SkipBack, Play, Pause, SkipForward, X } from "lucide-react"

interface MusicWidgetProps {
  id: string
  title: string
  subtitle: string
  isExpanded: boolean
  isEditMode?: boolean
  onExpand: () => void
  onRemove: () => void
}

export function MusicWidget({
  id,
  title,
  subtitle,
  isExpanded,
  isEditMode = false,
  onExpand,
  onRemove,
}: MusicWidgetProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    if (isEditMode) return
    setIsPlaying(!isPlaying)
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

      <div className="widget-content flex flex-col items-center justify-between flex-1">
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="relative w-32 h-32 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=128&width=128')] bg-cover rounded-full opacity-30"></div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Music className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-4">
          <button className="text-gray-600 dark:text-gray-300 hover:text-primary">
            <SkipBack className="h-5 w-5" />
          </button>
          <button
            className="bg-gray-200 dark:bg-gray-700 hover:bg-primary hover:text-white rounded-full p-3"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button className="text-gray-600 dark:text-gray-300 hover:text-primary">
            <SkipForward className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

