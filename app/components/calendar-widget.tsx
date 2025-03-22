"use client"

import { format, isSameDay, isSameMonth, isToday } from "date-fns"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface CalendarWidgetProps {
  events?: { date: Date }[]
  onDateSelect?: (date: Date) => void
}

export function CalendarWidget({ events, onDateSelect }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [date, setDate] = useState<Date | undefined>(new Date())

  const handleDateClick = (day: Date) => {
    setDate(day)
    onDateSelect?.(day)
  }

  const dayEvents = (day: Date) => {
    return events?.filter((event) => isSameDay(event.date, day)) || []
  }

  return (
    <div className="border rounded-md p-4 w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            onMonthChange={setCurrentDate}
            className="rounded-md border"
          />
          <div className="grid grid-cols-7 gap-1 mt-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const day = i + 1
              const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)

              return (
                <Button
                  key={day.toString()}
                  variant="ghost"
                  className={`h-10 p-0 relative ${
                    !isSameMonth(dayDate, currentDate) ? "text-muted-foreground opacity-50" : ""
                  } ${isSameDay(dayDate, date) ? "bg-primary text-primary-foreground" : ""} ${
                    isToday(dayDate) && !isSameDay(dayDate, date) ? "border border-primary" : ""
                  }`}
                  onClick={() => handleDateClick(dayDate)}
                >
                  <time dateTime={format(dayDate, "yyyy-MM-dd")}>{format(dayDate, "d")}</time>
                  {dayEvents(dayDate).length > 0 && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className="h-1 w-1 rounded-full bg-primary" />
                    </div>
                  )}
                </Button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

