"use client"
import { Droplet, Footprints, Clock, X } from "lucide-react"
import { useLocalStorage } from "../../hooks/use-local-storage"

interface HealthWidgetProps {
  id: string
  title: string
  subtitle: string
  isExpanded: boolean
  isEditMode?: boolean
  onExpand: () => void
  onRemove: () => void
}

export function HealthWidget({
  id,
  title,
  subtitle,
  isExpanded,
  isEditMode = false,
  onExpand,
  onRemove,
}: HealthWidgetProps) {
  const [healthData] = useLocalStorage(`health-data-${id}`, {
    water: 6,
    steps: 1246,
    minutes: 45,
  })

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

      <div className="widget-content flex-1 pt-0">
        <div className="mb-4">
          <div className="text-sm text-muted-foreground mb-1">Water</div>
          <div className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-blue-500" />
            <div className="text-lg font-semibold">{healthData.water} glasses</div>
          </div>
          <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(healthData.water / 8) * 100}%` }}></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <Footprints className="h-5 w-5 text-orange-500" />
              <div className="bg-white dark:bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-xs">👟</span>
              </div>
            </div>
            <div className="mt-2 text-lg font-semibold">{healthData.steps} steps</div>
          </div>

          <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <Clock className="h-5 w-5 text-green-500" />
              <div className="bg-white dark:bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-xs">🏃</span>
              </div>
            </div>
            <div className="mt-2 text-lg font-semibold">{healthData.minutes} minutes</div>
          </div>
        </div>
      </div>
    </div>
  )
}

