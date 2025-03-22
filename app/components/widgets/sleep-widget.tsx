"use client"
import { Moon, X } from "lucide-react"
import { useLocalStorage } from "../../hooks/use-local-storage"

interface SleepWidgetProps {
  id: string
  title: string
  subtitle: string
  isExpanded: boolean
  isEditMode?: boolean
  onExpand: () => void
  onRemove: () => void
}

export function SleepWidget({
  id,
  title,
  subtitle,
  isExpanded,
  isEditMode = false,
  onExpand,
  onRemove,
}: SleepWidgetProps) {
  const [sleepData] = useLocalStorage(`sleep-data-${id}`, {
    hours: 5.44,
    quality: 72,
    improvement: 16,
    timeline: [30, 45, 60, 80, 70, 65, 50, 40, 30, 35, 45, 60, 70, 75],
  })

  return (
    <div className={`widget h-full flex flex-col ${isExpanded ? "fixed inset-4 z-50" : ""}`}>
      {isEditMode && (
        <button className="absolute top-2 right-2 z-10 p-1 rounded-full bg-destructive text-white" onClick={onRemove}>
          <X className="h-3 w-3" />
        </button>
      )}

      <div className="widget-header widget-drag-handle">
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4" />
          <div>
            <div className="widget-title">{title}</div>
            <div className="widget-subtitle">{subtitle}</div>
          </div>
        </div>
      </div>

      <div className="widget-content flex-1 pt-0">
        <div className="flex justify-between mb-4">
          <div>
            <div className="text-2xl font-bold">{sleepData.hours}</div>
            <div className="text-xs text-muted-foreground">Total Sleep</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{sleepData.quality}%</div>
            <div className="text-xs text-muted-foreground">Quality</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">+{sleepData.improvement}%</div>
            <div className="text-xs text-muted-foreground">from yesterday</div>
          </div>
        </div>

        <div className="h-16 flex items-end gap-1">
          {sleepData.timeline.map((value, index) => (
            <div
              key={index}
              className="bg-blue-500 dark:bg-blue-600 rounded-sm w-full"
              style={{ height: `${value}%` }}
            ></div>
          ))}
        </div>

        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>10 PM</span>
          <span>2 AM</span>
          <span>6 AM</span>
        </div>

        <div className="flex justify-between mt-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span className="text-xs">Restless</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-xs">REM</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs">Deep</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span className="text-xs">Light</span>
          </div>
        </div>
      </div>
    </div>
  )
}

