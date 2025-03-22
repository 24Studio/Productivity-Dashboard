"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Music, FileText, Clock, Activity, Moon } from "lucide-react"

interface WidgetSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (type: string) => void
}

const widgets = [
  {
    type: "music",
    title: "Music Player",
    description: "Play your favorite sounds",
    icon: Music,
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300",
  },
  {
    type: "notes",
    title: "Notes",
    description: "Quick notes and journal",
    icon: FileText,
    color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300",
  },
  {
    type: "meditation",
    title: "Meditation",
    description: "Meditation sounds collection",
    icon: Music,
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300",
  },
  {
    type: "meditation-timer",
    title: "Meditation Timer",
    description: "Timer for meditation sessions",
    icon: Clock,
    color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300",
  },
  {
    type: "sleep",
    title: "Sleep Tracker",
    description: "Track your sleep quality",
    icon: Moon,
    color: "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-300",
  },
  {
    type: "health",
    title: "Health",
    description: "Track daily health metrics",
    icon: Activity,
    color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300",
  },
]

export function WidgetSelector({ isOpen, onClose, onSelect }: WidgetSelectorProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] border border-black/10 dark:border-white/10 shadow-lg rounded-xl p-6 backdrop-blur-md bg-white/90 dark:bg-black/80">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">Add Widget</DialogTitle>
          <DialogDescription className="text-sm">Select a widget to add to your dashboard</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-6">
          {widgets.map((widget) => (
            <button
              key={widget.type}
              className="h-auto flex flex-col items-center justify-center p-6 gap-3 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all hover:scale-105"
              onClick={() => onSelect(widget.type)}
            >
              <div className={`w-12 h-12 rounded-full ${widget.color} flex items-center justify-center mb-2`}>
                <widget.icon className="h-6 w-6" />
              </div>
              <span className="font-medium text-base">{widget.title}</span>
              <span className="text-xs text-center text-muted-foreground">{widget.description}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

