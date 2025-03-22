"use client"

import { useState, useCallback, useMemo } from "react"
import { Responsive, WidthProvider } from "react-grid-layout"
import { Plus, Settings, X, Menu, Search } from "lucide-react"
import { useTheme } from "next-themes"
import { WidgetSelector } from "./components/widget-selector"
import { NotesWidget } from "./components/widgets/notes-widget"
import { MusicWidget } from "./components/widgets/music-widget"
import { HealthWidget } from "./components/widgets/health-widget"
import { MeditationWidget } from "./components/widgets/meditation-widget"
import { SleepWidget } from "./components/widgets/sleep-widget"
import { ThemeCustomizer } from "./components/theme-customizer"
import { useLocalStorage } from "./hooks/use-local-storage"
import { useDatabaseSync } from "./hooks/use-database-sync"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

const ResponsiveGridLayout = WidthProvider(Responsive)

// Define default layouts and widgets
const DEFAULT_LAYOUTS = {
  lg: [
    { i: "music-1", x: 0, y: 0, w: 1, h: 2, minW: 1, minH: 2 },
    { i: "notes-1", x: 1, y: 0, w: 1, h: 2, minW: 1, minH: 1 },
    { i: "meditation-1", x: 2, y: 0, w: 1, h: 2, minW: 1, minH: 1 },
    { i: "sleep-1", x: 0, y: 2, w: 1, h: 2, minW: 1, minH: 1 },
    { i: "meditation-timer-1", x: 1, y: 2, w: 1, h: 2, minW: 1, minH: 1 },
    { i: "health-1", x: 2, y: 2, w: 1, h: 2, minW: 1, minH: 1 },
  ],
  md: [
    { i: "music-1", x: 0, y: 0, w: 1, h: 2, minW: 1, minH: 2 },
    { i: "notes-1", x: 1, y: 0, w: 1, h: 2, minW: 1, minH: 1 },
    { i: "meditation-1", x: 0, y: 2, w: 1, h: 2, minW: 1, minH: 1 },
    { i: "sleep-1", x: 1, y: 2, w: 1, h: 2, minW: 1, minH: 1 },
    { i: "meditation-timer-1", x: 0, y: 4, w: 1, h: 2, minW: 1, minH: 1 },
    { i: "health-1", x: 1, y: 4, w: 1, h: 2, minW: 1, minH: 1 },
  ],
  sm: [
    { i: "music-1", x: 0, y: 0, w: 1, h: 2, minW: 1, minH: 2 },
    { i: "notes-1", x: 1, y: 0, w: 1, h: 2, minW: 1, minH: 1 },
    { i: "meditation-1", x: 0, y: 2, w: 1, h: 2, minW: 1, minH: 1 },
    { i: "sleep-1", x: 1, y: 2, w: 1, h: 2, minW: 1, minH: 1 },
    { i: "meditation-timer-1", x: 0, y: 4, w: 1, h: 2, minW: 1, minH: 1 },
    { i: "health-1", x: 1, y: 4, w: 1, h: 2, minW: 1, minH: 1 },
  ],
  xs: [
    { i: "music-1", x: 0, y: 0, w: 1, h: 2, minW: 1, minH: 2 },
    { i: "notes-1", x: 0, y: 2, w: 1, h: 2, minW: 1, minH: 1 },
    { i: "meditation-1", x: 0, y: 4, w: 1, h: 2, minW: 1, minH: 1 },
    { i: "sleep-1", x: 0, y: 6, w: 1, h: 2, minW: 1, minH: 1 },
    { i: "meditation-timer-1", x: 0, y: 8, w: 1, h: 2, minW: 1, minH: 1 },
    { i: "health-1", x: 0, y: 10, w: 1, h: 2, minW: 1, minH: 1 },
  ],
}

const DEFAULT_WIDGETS = [
  { id: "music-1", type: "music", title: "Ocean", subtitle: "Nature Sounds" },
  { id: "notes-1", type: "notes", title: "Journal", subtitle: "Today's thoughts" },
  { id: "meditation-1", type: "meditation", title: "Meditation songs", subtitle: "you can listen" },
  { id: "sleep-1", type: "sleep", title: "Sleep", subtitle: "Last night" },
  { id: "meditation-timer-1", type: "meditation-timer", title: "MEDITATION", subtitle: "" },
  { id: "health-1", type: "health", title: "Health", subtitle: "Today's activity" },
]

// Dashboard version
const DASHBOARD_VERSION = "v2.0.0"

export default function Dashboard() {
  const { theme } = useTheme()
  const [isAddingWidget, setIsAddingWidget] = useState(false)
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  // Load layouts from local storage
  const [layouts, setLayouts] = useLocalStorage("dashboard-layouts", DEFAULT_LAYOUTS)

  // Load widgets from local storage
  const [widgets, setWidgets] = useLocalStorage("dashboard-widgets", DEFAULT_WIDGETS)

  // Load custom theme from local storage
  const [customTheme] = useLocalStorage("custom-theme", {
    primaryColor: "blue",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    borderRadius: "0.5rem",
    backgroundColor: theme === "dark" ? "220 40% 10%" : "0 0% 100%",
    backgroundPattern: "none",
  })

  // Sync with database - use memoized values to prevent unnecessary re-renders
  const memoizedData = useMemo(() => ({ widgets, layouts }), [widgets, layouts])
  const { isSyncing, lastSynced, syncData } = useDatabaseSync(memoizedData.widgets, memoizedData.layouts)

  // Get background pattern class
  const getPatternClass = useCallback((pattern: string) => {
    switch (pattern) {
      case "dots":
        return "bg-pattern-dots"
      case "grid":
        return "bg-pattern-grid"
      case "waves":
        return "bg-pattern-waves"
      default:
        return ""
    }
  }, [])

  // Handle layout changes
  const handleLayoutChange = useCallback(
    (currentLayout: any, allLayouts: any) => {
      // Only update layouts if they've actually changed
      const layoutsString = JSON.stringify(allLayouts)
      const currentLayoutsString = JSON.stringify(layouts)

      if (layoutsString !== currentLayoutsString) {
        setLayouts(allLayouts)
      }
    },
    [layouts, setLayouts],
  )

  // Helper functions
  const getWidgetTitle = useCallback((type: string) => {
    switch (type) {
      case "music":
        return "Ocean"
      case "notes":
        return "Journal"
      case "meditation":
        return "Meditation songs"
      case "sleep":
        return "Sleep"
      case "meditation-timer":
        return "MEDITATION"
      case "health":
        return "Health"
      default:
        return "Widget"
    }
  }, [])

  const getWidgetSubtitle = useCallback((type: string) => {
    switch (type) {
      case "music":
        return "Nature Sounds"
      case "notes":
        return "Today's thoughts"
      case "meditation":
        return "you can listen"
      case "sleep":
        return "Last night"
      case "meditation-timer":
        return ""
      case "health":
        return "Today's activity"
      default:
        return ""
    }
  }, [])

  const getDefaultWidth = useCallback((type: string) => {
    return 1
  }, [])

  const getDefaultHeight = useCallback((type: string) => {
    return 2
  }, [])

  // Add a new widget
  const addWidget = useCallback(
    (type: string) => {
      const id = `${type}-${Date.now()}`
      const newWidget = {
        id,
        type,
        title: getWidgetTitle(type),
        subtitle: getWidgetSubtitle(type),
      }

      setWidgets((prevWidgets) => [...prevWidgets, newWidget])

      // Add widget to layout
      setLayouts((prevLayouts) => {
        const newLayouts = { ...prevLayouts }
        const y = Math.max(0, ...prevLayouts.lg.map((item: any) => item.y + item.h))

        const widgetLayout = {
          i: id,
          x: 0,
          y,
          w: getDefaultWidth(type),
          h: getDefaultHeight(type),
          minW: 1,
          minH: 1,
        }

        Object.keys(newLayouts).forEach((breakpoint) => {
          newLayouts[breakpoint] = [...newLayouts[breakpoint], widgetLayout]
        })

        return newLayouts
      })

      setIsAddingWidget(false)
    },
    [getWidgetTitle, getWidgetSubtitle, getDefaultWidth, getDefaultHeight, setWidgets, setLayouts],
  )

  // Remove a widget
  const removeWidget = useCallback(
    (id: string) => {
      setWidgets((prevWidgets) => prevWidgets.filter((widget) => widget.id !== id))

      // Remove from layouts
      setLayouts((prevLayouts) => {
        const newLayouts = { ...prevLayouts }
        Object.keys(newLayouts).forEach((breakpoint) => {
          newLayouts[breakpoint] = newLayouts[breakpoint].filter((item: any) => item.i !== id)
        })

        return newLayouts
      })

      if (expandedWidget === id) {
        setExpandedWidget(null)
      }
    },
    [expandedWidget, setWidgets, setLayouts],
  )

  // Toggle widget expansion
  const toggleWidgetExpansion = useCallback((id: string) => {
    setExpandedWidget((prevExpanded) => (prevExpanded === id ? null : id))
  }, [])

  // Toggle edit mode
  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => !prev)
  }, [])

  // Render widget based on type
  const renderWidget = useCallback(
    (widget: any) => {
      const isExpanded = expandedWidget === widget.id

      switch (widget.type) {
        case "music":
          return (
            <MusicWidget
              id={widget.id}
              title={widget.title}
              subtitle={widget.subtitle}
              isExpanded={isExpanded}
              isEditMode={isEditMode}
              onExpand={() => toggleWidgetExpansion(widget.id)}
              onRemove={() => removeWidget(widget.id)}
            />
          )
        case "notes":
          return (
            <NotesWidget
              id={widget.id}
              title={widget.title}
              subtitle={widget.subtitle}
              isExpanded={isExpanded}
              isEditMode={isEditMode}
              onExpand={() => toggleWidgetExpansion(widget.id)}
              onRemove={() => removeWidget(widget.id)}
            />
          )
        case "meditation":
          return (
            <MeditationWidget
              id={widget.id}
              title={widget.title}
              subtitle={widget.subtitle}
              isExpanded={isExpanded}
              isEditMode={isEditMode}
              onExpand={() => toggleWidgetExpansion(widget.id)}
              onRemove={() => removeWidget(widget.id)}
            />
          )
        case "sleep":
          return (
            <SleepWidget
              id={widget.id}
              title={widget.title}
              subtitle={widget.subtitle}
              isExpanded={isExpanded}
              isEditMode={isEditMode}
              onExpand={() => toggleWidgetExpansion(widget.id)}
              onRemove={() => removeWidget(widget.id)}
            />
          )
        case "meditation-timer":
          return (
            <MeditationWidget
              id={widget.id}
              title={widget.title}
              subtitle={widget.subtitle}
              isExpanded={isExpanded}
              isEditMode={isEditMode}
              onExpand={() => toggleWidgetExpansion(widget.id)}
              onRemove={() => removeWidget(widget.id)}
              isTimer={true}
            />
          )
        case "health":
          return (
            <HealthWidget
              id={widget.id}
              title={widget.title}
              subtitle={widget.subtitle}
              isExpanded={isExpanded}
              isEditMode={isEditMode}
              onExpand={() => toggleWidgetExpansion(widget.id)}
              onRemove={() => removeWidget(widget.id)}
            />
          )
        default:
          return <div>Unknown widget type</div>
      }
    },
    [expandedWidget, toggleWidgetExpansion, removeWidget, isEditMode],
  )

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${getPatternClass(customTheme.backgroundPattern)}`}
      style={{ backgroundColor: `hsl(${customTheme.backgroundColor})` }}
    >
      {/* Modern header with centered title and buttons on both sides */}
      <header className="dashboard-header border-b border-black/5 dark:border-white/5 backdrop-blur-md bg-white/50 dark:bg-black/50">
        <div className="flex items-center space-x-4">
          <button className="btn-icon">
            <Menu className="h-5 w-5" />
          </button>
          <button className="btn-icon">
            <Search className="h-5 w-5" />
          </button>
        </div>

        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <h1 className="dashboard-title">PRODUCTIVITY DASHBOARD</h1>
          <div className="text-xs text-muted-foreground mt-1">{DASHBOARD_VERSION}</div>
        </div>

        <div className="flex items-center space-x-4">
          <button className={`btn-icon ${isEditMode ? "bg-black/5 dark:bg-white/5" : ""}`} onClick={toggleEditMode}>
            {isEditMode ? <X className="h-5 w-5" /> : <Settings className="h-5 w-5" />}
          </button>
          <ThemeCustomizer />
          <button
            className="btn-minimal flex items-center"
            onClick={() => setIsAddingWidget(true)}
            disabled={isEditMode}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Widget
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {expandedWidget ? (
          <div className="mb-6">{renderWidget(widgets.find((w) => w.id === expandedWidget))}</div>
        ) : (
          <div className={`transition-all duration-300 ${isEditMode ? "wiggle-animation" : ""}`}>
            <ResponsiveGridLayout
              className="layout"
              layouts={layouts}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
              cols={{ lg: 3, md: 2, sm: 2, xs: 1 }}
              rowHeight={200}
              onLayoutChange={handleLayoutChange}
              isDraggable={isEditMode}
              isResizable={isEditMode}
              compactType="vertical"
              margin={[20, 20]}
              containerPadding={[10, 10]}
              draggableHandle=".widget-drag-handle"
            >
              {widgets.map((widget) => (
                <div key={widget.id} className={`transition-all duration-200 ${isEditMode ? "widget-edit-mode" : ""}`}>
                  {renderWidget(widget)}
                </div>
              ))}
            </ResponsiveGridLayout>
          </div>
        )}
      </main>

      <WidgetSelector isOpen={isAddingWidget} onClose={() => setIsAddingWidget(false)} onSelect={addWidget} />
    </div>
  )
}

