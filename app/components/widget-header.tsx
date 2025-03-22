"use client"

import type React from "react"

import { Maximize2, Minimize2, X, GripHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WidgetHeaderProps {
  title: string
  icon: React.ReactNode
  isExpanded: boolean
  isEditMode?: boolean
  onExpand: () => void
  onRemove: () => void
}

export function WidgetHeader({ title, icon, isExpanded, isEditMode = false, onExpand, onRemove }: WidgetHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between p-3 bg-muted/30 widget-drag-handle ${isEditMode ? "cursor-move" : ""}`}
    >
      <div className="flex items-center gap-2">
        {isEditMode && <GripHorizontal className="h-4 w-4 text-muted-foreground" />}
        {icon}
        <h3 className="font-medium text-sm">{title}</h3>
      </div>
      <div className="flex items-center gap-1">
        {!isEditMode && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onExpand}>
            {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </Button>
        )}
        {isEditMode && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={onRemove}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}

