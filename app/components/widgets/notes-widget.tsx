"use client"
import { X } from "lucide-react"
import { useLocalStorage } from "../../hooks/use-local-storage"
import { format } from "date-fns"

interface NotesWidgetProps {
  id: string
  title: string
  subtitle: string
  isExpanded: boolean
  isEditMode?: boolean
  onExpand: () => void
  onRemove: () => void
}

export function NotesWidget({
  id,
  title,
  subtitle,
  isExpanded,
  isEditMode = false,
  onExpand,
  onRemove,
}: NotesWidgetProps) {
  const storageKey = `notes-content-${id}`
  const [content, setContent] = useLocalStorage(
    storageKey,
    "Today was a day of unexpected inspiration. I started out with a simple routine, but as the day unfolded, I found myself drawn to new ideas and possibilities.",
  )
  const today = new Date()

  return (
    <div className={`widget h-full flex flex-col ${isExpanded ? "fixed inset-4 z-50" : ""}`}>
      {isEditMode && (
        <button className="absolute top-2 right-2 z-10 p-1 rounded-full bg-destructive text-white" onClick={onRemove}>
          <X className="h-3 w-3" />
        </button>
      )}

      <div className="widget-header widget-drag-handle">
        <div className="flex items-center gap-2">
          <div className="bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300 rounded-full p-2 w-10 h-10 flex items-center justify-center font-semibold">
            {format(today, "d")}
          </div>
          <div>
            <div className="widget-title">{title}</div>
            <div className="widget-subtitle">{subtitle}</div>
          </div>
        </div>
      </div>

      <div className="widget-content flex-1 pt-0">
        {!isEditMode ? (
          <textarea
            className="w-full h-full resize-none border-none bg-transparent focus:outline-none text-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts here..."
          />
        ) : (
          <div className="text-sm line-clamp-4 opacity-70">{content || "Empty note"}</div>
        )}
      </div>
    </div>
  )
}

