"use client"

import { useState } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns"
import { Button } from "@/components/ui/button"
import { useLocalStorage } from "../../hooks/use-local-storage"
import { WidgetHeader } from "../widget-header"

interface CalendarWidgetProps {
  id: string
  title: string
  isExpanded: boolean
  isEditMode?: boolean
  onExpand: () => void
  onRemove: () => void
}

interface Event {
  id: string
  date: string
  title: string
}

export function CalendarWidget({ id, title, isExpanded, isEditMode = false, onExpand, onRemove }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useLocalStorage<Event[]>(`calendar-events-${id}`, [])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [newEventTitle, setNewEventTitle] = useState("")

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handleDateClick = (date: Date) => {
    if (isEditMode) return
    setSelectedDate(isSameDay(date, selectedDate as Date) ? null : date)
  }

  const addEvent = () => {
    if (!selectedDate || newEventTitle.trim() === "") return

    const newEvent: Event = {
      id: Date.now().toString(),
      date: selectedDate.toISOString(),
      title: newEventTitle,
    }

    setEvents((prev) => [...prev, newEvent])
    setNewEventTitle("")
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), date))
  }

  const removeEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
  }

  return (
    <div
      className={`bg-card text-card-foreground rounded-lg border shadow-sm overflow-hidden flex flex-col h-full ${
        isExpanded ? "fixed inset-4 z-50" : ""
      }`}
    >
      <WidgetHeader
        title={title}
        icon={<CalendarIcon className="h-4 w-4" />}
        isExpanded={isExpanded}
        isEditMode={isEditMode}
        onExpand={onExpand}
        onRemove={onRemove}
      />

      <div className="flex-1 p-3 overflow-auto">
        {!isEditMode ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <Button variant="outline" size="icon" onClick={previousMonth} className="h-7 w-7">
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <h3 className="font-medium text-sm">{format(currentDate, "MMMM yyyy")}</h3>
              <Button variant="outline" size="icon" onClick={nextMonth} className="h-7 w-7">
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map((day) => {
                const dayEvents = getEventsForDate(day)
                const isSelected = selectedDate && isSameDay(day, selectedDate)

                return (
                  <Button
                    key={day.toString()}
                    variant="ghost"
                    className={`h-8 w-8 p-0 text-xs relative ${
                      !isSameMonth(day, currentDate) ? "text-muted-foreground opacity-50" : ""
                    } ${isSelected ? "bg-primary text-primary-foreground" : ""} ${
                      isToday(day) && !isSelected ? "border border-primary" : ""
                    }`}
                    onClick={() => handleDateClick(day)}
                  >
                    <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
                    {dayEvents.length > 0 && (
                      <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2">
                        <div className="h-1 w-1 rounded-full bg-primary" />
                      </div>
                    )}
                  </Button>
                )
              })}
            </div>

            {selectedDate && (
              <div className="mt-3 border-t pt-3">
                <h4 className="font-medium text-xs mb-2">{format(selectedDate, "MMMM d, yyyy")}</h4>

                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="text"
                    placeholder="Add event..."
                    className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addEvent()}
                  />
                  <Button size="sm" onClick={addEvent} className="h-8">
                    Add
                  </Button>
                </div>

                <div className="space-y-1.5">
                  {getEventsForDate(selectedDate).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-1.5 rounded-md bg-muted">
                      <span className="text-xs">{event.title}</span>
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => removeEvent(event.id)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">
              {events.length} event{events.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

