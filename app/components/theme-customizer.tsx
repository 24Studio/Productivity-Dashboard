"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Paintbrush, Moon, Sun, Laptop, Check } from "lucide-react"
import { useLocalStorage } from "../hooks/use-local-storage"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const THEME_COLORS = [
  { name: "slate", value: "slate", hue: "215 20% 65%" },
  { name: "zinc", value: "zinc", hue: "240 5% 65%" },
  { name: "stone", value: "stone", hue: "25 5% 65%" },
  { name: "gray", value: "gray", hue: "220 10% 65%" },
  { name: "neutral", value: "neutral", hue: "0 0% 65%" },
  { name: "red", value: "red", hue: "0 75% 60%" },
  { name: "rose", value: "rose", hue: "330 70% 60%" },
  { name: "orange", value: "orange", hue: "25 95% 55%" },
  { name: "green", value: "green", hue: "140 60% 50%" },
  { name: "blue", value: "blue", hue: "210 100% 60%" },
  { name: "indigo", value: "indigo", hue: "240 70% 60%" },
  { name: "violet", value: "violet", hue: "260 70% 60%" },
  { name: "purple", value: "purple", hue: "270 70% 60%" },
  { name: "fuchsia", value: "fuchsia", hue: "290 90% 60%" },
  { name: "pink", value: "pink", hue: "330 85% 60%" },
]

const FONT_FAMILIES = [
  {
    name: "Monospace",
    value: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
  { name: "System", value: "system-ui, sans-serif" },
  {
    name: "Sans Serif",
    value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  { name: "Serif", value: "Georgia, Cambria, 'Times New Roman', Times, serif" },
]

const BACKGROUND_COLORS = [
  { name: "White", value: "0 0% 100%" },
  { name: "Light Gray", value: "0 0% 98%" },
  { name: "Light Blue", value: "210 40% 98%" },
  { name: "Light Purple", value: "252 100% 98%" },
  { name: "Light Green", value: "142 76% 95%" },
  { name: "Dark Gray", value: "0 0% 10%" },
  { name: "Dark Blue", value: "220 40% 10%" },
  { name: "Dark Purple", value: "252 30% 15%" },
  { name: "Black", value: "0 0% 0%" },
]

const BACKGROUND_PATTERNS = [
  { name: "None", value: "none" },
  { name: "Dots", value: "dots" },
  { name: "Grid", value: "grid" },
  { name: "Waves", value: "waves" },
]

export function ThemeCustomizer() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [customTheme, setCustomTheme] = useLocalStorage("custom-theme", {
    primaryColor: "blue",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    borderRadius: "0.5rem",
    backgroundColor: theme === "dark" ? "220 40% 10%" : "0 0% 100%",
    backgroundPattern: "none",
  })

  // Apply theme changes when component mounts and when customTheme changes
  useEffect(() => {
    applyThemeChanges()
  }, [customTheme])

  // Update background color when theme changes
  useEffect(() => {
    if (theme === "dark" && customTheme.backgroundColor === "0 0% 100%") {
      updateThemeProperty("backgroundColor", "220 40% 10%")
    } else if (theme === "light" && customTheme.backgroundColor === "220 40% 10%") {
      updateThemeProperty("backgroundColor", "0 0% 100%")
    }
  }, [theme])

  const applyThemeChanges = () => {
    document.documentElement.style.setProperty("--font-family", customTheme.fontFamily)
    document.documentElement.style.setProperty("--radius", customTheme.borderRadius)
    document.documentElement.style.setProperty("--dashboard-bg", customTheme.backgroundColor)
    document.documentElement.style.setProperty("--dashboard-pattern", customTheme.backgroundPattern)

    // Set primary color
    const selectedColor = THEME_COLORS.find((color) => color.value === customTheme.primaryColor)
    if (selectedColor) {
      document.documentElement.style.setProperty("--primary", selectedColor.hue)
    }
  }

  const updateThemeProperty = (property: string, value: string) => {
    setCustomTheme({
      ...customTheme,
      [property]: value,
    })
  }

  const getPatternClass = (pattern: string) => {
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
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="btn-icon">
          <Paintbrush className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 border border-black/10 dark:border-white/10 shadow-lg rounded-xl p-4 backdrop-blur-md bg-white/90 dark:bg-black/80">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Customize Theme</h4>
          <Tabs defaultValue="theme" className="w-full">
            <TabsList className="grid grid-cols-4 h-9 rounded-lg">
              <TabsTrigger value="theme" className="text-xs rounded-lg">
                Theme
              </TabsTrigger>
              <TabsTrigger value="color" className="text-xs rounded-lg">
                Color
              </TabsTrigger>
              <TabsTrigger value="font" className="text-xs rounded-lg">
                Font
              </TabsTrigger>
              <TabsTrigger value="bg" className="text-xs rounded-lg">
                Background
              </TabsTrigger>
            </TabsList>
            <TabsContent value="theme" className="space-y-4 py-4">
              <RadioGroup defaultValue={theme} onValueChange={setTheme} className="flex flex-col space-y-2">
                <div className="flex items-center justify-between space-x-2 rounded-lg border p-3 hover:bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Sun className="h-4 w-4" />
                    <Label htmlFor="theme-light" className="font-medium text-sm">
                      Light
                    </Label>
                  </div>
                  <span className="text-xs text-muted-foreground">Light theme</span>
                </div>
                <div className="flex items-center justify-between space-x-2 rounded-lg border p-3 hover:bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Moon className="h-4 w-4" />
                    <Label htmlFor="theme-dark" className="font-medium text-sm">
                      Dark
                    </Label>
                  </div>
                  <span className="text-xs text-muted-foreground">Dark theme</span>
                </div>
                <div className="flex items-center justify-between space-x-2 rounded-lg border p-3 hover:bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Laptop className="h-4 w-4" />
                    <Label htmlFor="theme-system" className="font-medium text-sm">
                      System
                    </Label>
                  </div>
                  <span className="text-xs text-muted-foreground">Follow system</span>
                </div>
              </RadioGroup>
            </TabsContent>
            <TabsContent value="color" className="py-4">
              <div className="space-y-4">
                <h5 className="text-xs font-medium mb-3">Primary Color</h5>
                <div className="grid grid-cols-5 gap-3">
                  {THEME_COLORS.map((color) => (
                    <button
                      key={color.value}
                      className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                        customTheme.primaryColor === color.value
                          ? "ring-2 ring-offset-2 ring-offset-background ring-primary"
                          : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: `hsl(${color.hue})` }}
                      onClick={() => updateThemeProperty("primaryColor", color.value)}
                    >
                      {customTheme.primaryColor === color.value && <Check className="h-4 w-4 text-white" />}
                      <span className="sr-only">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="font" className="space-y-4 py-4">
              <div className="space-y-4">
                <h5 className="text-xs font-medium mb-2">Font Family</h5>
                <RadioGroup
                  value={customTheme.fontFamily}
                  onValueChange={(value) => updateThemeProperty("fontFamily", value)}
                  className="flex flex-col space-y-2"
                >
                  {FONT_FAMILIES.map((font) => (
                    <div
                      key={font.name}
                      className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/50"
                    >
                      <RadioGroupItem value={font.value} id={`font-${font.name}`} />
                      <Label
                        htmlFor={`font-${font.name}`}
                        className="font-medium text-sm"
                        style={{ fontFamily: font.value }}
                      >
                        {font.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2 pt-2">
                <h5 className="text-xs font-medium mb-2">Border Radius</h5>
                <RadioGroup
                  value={customTheme.borderRadius}
                  onValueChange={(value) => updateThemeProperty("borderRadius", value)}
                  className="grid grid-cols-3 gap-2"
                >
                  <div className="flex items-center justify-center">
                    <RadioGroupItem value="0" id="radius-none" className="sr-only" />
                    <Label
                      htmlFor="radius-none"
                      className={`w-full text-center py-2 px-3 rounded-none border ${
                        customTheme.borderRadius === "0" ? "bg-primary text-primary-foreground" : "hover:bg-muted/50"
                      }`}
                    >
                      None
                    </Label>
                  </div>
                  <div className="flex items-center justify-center">
                    <RadioGroupItem value="0.5rem" id="radius-md" className="sr-only" />
                    <Label
                      htmlFor="radius-md"
                      className={`w-full text-center py-2 px-3 rounded-md border ${
                        customTheme.borderRadius === "0.5rem"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      Medium
                    </Label>
                  </div>
                  <div className="flex items-center justify-center">
                    <RadioGroupItem value="1rem" id="radius-lg" className="sr-only" />
                    <Label
                      htmlFor="radius-lg"
                      className={`w-full text-center py-2 px-3 rounded-lg border ${
                        customTheme.borderRadius === "1rem" ? "bg-primary text-primary-foreground" : "hover:bg-muted/50"
                      }`}
                    >
                      Large
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>
            <TabsContent value="bg" className="space-y-4 py-4">
              <div className="space-y-4">
                <h5 className="text-xs font-medium mb-2">Background Color</h5>
                <div className="grid grid-cols-3 gap-3">
                  {BACKGROUND_COLORS.map((bg) => (
                    <button
                      key={bg.value}
                      className={`h-12 rounded-lg flex items-center justify-center transition-all ${
                        customTheme.backgroundColor === bg.value ? "ring-2 ring-primary" : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: `hsl(${bg.value})` }}
                      onClick={() => updateThemeProperty("backgroundColor", bg.value)}
                    >
                      {customTheme.backgroundColor === bg.value && (
                        <Check
                          className={`h-4 w-4 ${
                            bg.value.includes("0%") || bg.value.includes("98%") ? "text-black" : "text-white"
                          }`}
                        />
                      )}
                      <span className="sr-only">{bg.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <h5 className="text-xs font-medium mb-2">Background Pattern</h5>
                <RadioGroup
                  value={customTheme.backgroundPattern}
                  onValueChange={(value) => updateThemeProperty("backgroundPattern", value)}
                  className="grid grid-cols-2 gap-2"
                >
                  {BACKGROUND_PATTERNS.map((pattern) => (
                    <div key={pattern.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={pattern.value} id={`pattern-${pattern.value}`} />
                      <Label
                        htmlFor={`pattern-${pattern.value}`}
                        className={`flex-1 py-2 px-3 rounded-lg ${getPatternClass(pattern.value)}`}
                      >
                        {pattern.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  )
}

