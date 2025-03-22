"use client"

import { useState } from "react"
import { BarChart3, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLocalStorage } from "../../hooks/use-local-storage"
import { WidgetHeader } from "../widget-header"
import { format, startOfWeek, addDays, isSameDay } from "date-fns"

interface HabitTrackerProps {
  id: string
  title: string
  isExpanded: boolean
  isEditMode?: boolean
  onExpand: () => void
  onRemove: () => void
}

interface Habit {
  id: string
  name: string
  completedDates: string[]
}

export function HabitTrackerWidget({
  id,
  title,
  isExpanded,
  isEditMode = false,
  onExpand,
  onRemove,
}: HabitTrackerProps) {
  const [habits, setHabits] = useLocalStorage<Habit[]>(`habits-${id}`, [])
  const [newHabit, setNewHabit] = useState("")

  const today = new Date()
  const startOfCurrentWeek = startOfWeek(today)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i))

  const addHabit = () => {
    if (newHabit.trim() === "") return

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit,
      completedDates: [],
    }

    setHabits((prev) => [...prev, habit])
    setNewHabit("")
  }

  const removeHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId))
  }

  const toggleHabitCompletion = (habit: Habit, date: Date) => {
    if (isEditMode) return

    const dateString = date.toISOString().split("T")[0]
    const isCompleted = habit.completedDates.includes(dateString)

    const updatedHabit = {
      ...habit,
      completedDates: isCompleted
        ? habit.completedDates.filter((d) => d !== dateString)
        : [...habit.completedDates, dateString],
    }

    setHabits(habits.map((h) => (h.id === habit.id ? updatedHabit : h)))
  }

  const isHabitCompletedOnDate = (habit: Habit, date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return habit.completedDates.includes(dateString)
  }

  return (
    <div
      className={`bg-card text-card-foreground rounded-lg border shadow-sm overflow-hidden flex flex-col h-full ${
        isExpanded ? "fixed inset-4 z-50" : ""
      }`}
    >
      <WidgetHeader
        title={title}
        icon={<BarChart3 className="h-4 w-4" />}
        isExpanded={isExpanded}
        isEditMode={isEditMode}
        onExpand={onExpand}
        onRemove={onRemove}
      />

      <div className="flex-1 p-3 overflow-auto">
        {!isEditMode ? (
          <>
            <div className="flex items-center space-x-2 mb-3">
              <Input
                placeholder="Add a new habit..."
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addHabit()}
                className="text-sm"
              />
              <Button size="sm" onClick={addHabit} className="shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {habits.length === 0 ? (
              <p className="text-center text-muted-foreground py-4 text-sm">No habits yet. Add one above!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left font-medium p-1.5 text-xs">Habit</th>
                      {weekDays.map((day) => (
                        <th key={day.toString()} className="text-center p-1.5">
                          <div className="text-xs font-normal text-muted-foreground">{format(day, "E")}</div>
                          <div className={`text-xs ${isSameDay(day, today) ? "font-bold" : ""}`}>
                            {format(day, "d")}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {habits.map((habit) => (
                      <tr key={habit.id} className="border-t">
                        <td className="p-1.5 flex items-center justify-between">
                          <span className="text-xs">{habit.name}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 opacity-50 hover:opacity-100"
                            onClick={() => removeHabit(habit.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </td>
                        {weekDays.map((day) => (
                          <td key={day.toString()} className="text-center p-1.5">
                            <Button
                              variant="outline"
                              size="icon"
                              className={`h-5 w-5 rounded-md ${
                                isHabitCompletedOnDate(habit, day) ? "bg-primary text-primary-foreground" : ""
                              }`}
                              onClick={() => toggleHabitCompletion(habit, day)}
                            >
                              {isHabitCompletedOnDate(habit, day) && (
                                <div className="h-1.5 w-1.5 rounded-full bg-current" />
                              )}
                            </Button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">
              {habits.length} habit{habits.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

