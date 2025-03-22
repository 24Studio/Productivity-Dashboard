"use client"

import type React from "react"

import { useState } from "react"
import { CheckSquare, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useLocalStorage } from "../../hooks/use-local-storage"
import { WidgetHeader } from "../widget-header"

interface TodoWidgetProps {
  id: string
  title: string
  isExpanded: boolean
  isEditMode?: boolean
  onExpand: () => void
  onRemove: () => void
}

interface TodoItem {
  id: string
  text: string
  completed: boolean
}

export function TodoWidget({ id, title, isExpanded, isEditMode = false, onExpand, onRemove }: TodoWidgetProps) {
  const storageKey = `todo-items-${id}`
  const [todos, setTodos] = useLocalStorage<TodoItem[]>(storageKey, [])
  const [newTodo, setNewTodo] = useState("")

  const addTodo = () => {
    if (newTodo.trim() === "") return

    const newItem: TodoItem = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
    }

    setTodos((prev) => [...prev, newItem])
    setNewTodo("")
  }

  const toggleTodo = (todoId: string) => {
    setTodos(todos.map((todo) => (todo.id === todoId ? { ...todo, completed: !todo.completed } : todo)))
  }

  const removeTodo = (todoId: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== todoId))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo()
    }
  }

  return (
    <div
      className={`bg-card text-card-foreground rounded-lg border shadow-sm overflow-hidden flex flex-col h-full ${
        isExpanded ? "fixed inset-4 z-50" : ""
      }`}
    >
      <WidgetHeader
        title={title}
        icon={<CheckSquare className="h-4 w-4" />}
        isExpanded={isExpanded}
        isEditMode={isEditMode}
        onExpand={onExpand}
        onRemove={onRemove}
      />

      <div className="flex-1 overflow-auto p-3">
        {!isEditMode && (
          <>
            <div className="flex items-center space-x-2 mb-3">
              <Input
                placeholder="Add a new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-sm"
              />
              <Button size="sm" onClick={addTodo} className="shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-1.5">
              {todos.length === 0 ? (
                <p className="text-center text-muted-foreground py-4 text-sm">No tasks yet. Add one above!</p>
              ) : (
                todos.map((todo) => (
                  <div key={todo.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted group">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`todo-${todo.id}`}
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                      />
                      <label
                        htmlFor={`todo-${todo.id}`}
                        className={`text-sm ${todo.completed ? "line-through text-muted-foreground" : ""}`}
                      >
                        {todo.text}
                      </label>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                      onClick={() => removeTodo(todo.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {isEditMode && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">
              {todos.length} task{todos.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

