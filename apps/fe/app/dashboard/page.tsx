"use client"

import React, { useState, useEffect } from "react"
import { Plus, Sun, Moon, LogOut, Loader2 } from "lucide-react"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

interface WebsiteTick {
  id: string
  status: "Up" | "Down" | "Unknown"
  response_time: number
  createdAt: string
  region_id: string
  website_id: string
}

interface Website {
  id: string
  url: string
  timeAdded: string
  userId: string
  tickes: WebsiteTick[]
}

interface AddWebsiteForm {
  url: string
}

export default function Dashboard() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [websites, setWebsites] = useState<Website[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addingWebsiteId, setAddingWebsiteId] = useState<string | null>(null)
  const [formData, setFormData] = useState<AddWebsiteForm>({
    url: "",
  })

  useEffect(() => {
    const initTheme = localStorage.getItem("theme") || "dark"
    setTheme(initTheme as "light" | "dark")
    if (initTheme === "dark") {
      document.documentElement.classList.add("dark")
    }
    fetchWebsites()
  }, [])

  const fetchWebsites = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem("token")
      if (!token) {
        window.location.href = "/"
        return
      }

      const response = await fetch(`${BACKEND_URL}/website`, {
        headers: {
          "Authorization": token
        }
      })

      if (!response.ok) {
        throw new Error("Failed to fetch websites")
      }

      const data = await response.json()
      console.log("Fetched websites:", data)
      setWebsites(data.website || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load websites")
      console.error("Error fetching websites:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)

    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme)
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.url.trim()) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        window.location.href = "/"
        return
      }

      const response = await fetch(`${BACKEND_URL}/website`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({
          url: formData.url
        })
      })

      if (!response.ok) {
        throw new Error("Failed to add website")
      }

      const data = await response.json()
      setAddingWebsiteId(data.id)

      setFormData({ url: "" })
      setIsModalOpen(false)

      // Poll for status update every 2 seconds for up to 20 seconds
      let attempts = 0
      const pollInterval = setInterval(async () => {
        attempts++
        try {
          await fetchWebsites()
          
          // Check if we got the status
          const updatedWebsites = await fetch(`${BACKEND_URL}/website`, {
            headers: { "Authorization": token }
          }).then(r => r.json())
          
          const foundWebsite = updatedWebsites.website?.find((w: Website) => w.id === data.id)
          if (foundWebsite && foundWebsite.tickes && foundWebsite.tickes.length > 0) {
            setAddingWebsiteId(null)
            clearInterval(pollInterval)
          }
        } catch (error) {
          console.error("Polling error:", error)
        }

        if (attempts >= 10) {
          setAddingWebsiteId(null)
          clearInterval(pollInterval)
        }
      }, 2000)
    } catch (err) {
      console.error("Error adding website:", err)
      alert("Failed to add website. Please try again.")
    }
  }

  const handleRemoveWebsite = async (id: string) => {
    setWebsites(websites.filter((site) => site.id !== id))
  }

  const handleSignOut = () => {
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  const getLatestStatus = (website: Website) => {
    console.log(`Website ${website.url}:`, {
      hasTicks: !!website.tickes,
      tickCount: website.tickes?.length || 0,
      firstTick: website.tickes?.[0]
    })
    
    if (!website.tickes || website.tickes.length === 0) {
      return { status: "unknown", responseTime: null, lastChecked: null }
    }
    
    const latestTick = website.tickes[0]
    
    return {
      status: latestTick.status.toLowerCase(),
      responseTime: latestTick.response_time,
      lastChecked: new Date(latestTick.createdAt)
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "Never"
    
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <div className="text-sm font-bold">BU</div>
                </div>
                <span className="font-serif text-xl font-semibold">Better Uptime</span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleThemeToggle}
                  className="rounded-lg p-2 transition-colors hover:bg-secondary"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors hover:bg-secondary"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-semibold">Monitored Websites</h1>
              <p className="mt-2 text-muted-foreground">Track the uptime and status of all your websites</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-5 w-5" />
              Add Website
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-500 bg-red-500/10 p-4 text-center">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchWebsites}
                className="mt-2 text-sm text-red-400 hover:text-red-300"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && websites.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-border bg-card">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/20">
                    <th className="px-6 py-4 text-left font-semibold">URL</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-left font-semibold">Response Time</th>
                    <th className="px-6 py-4 text-left font-semibold">Last Check</th>
                    <th className="px-6 py-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {websites.map((website) => {
                    const { status, responseTime, lastChecked } = getLatestStatus(website)
                    const isChecking = addingWebsiteId === website.id
                    
                    return (
                      <tr
                        key={website.id}
                        className="border-b border-border last:border-b-0 transition-colors hover:bg-secondary/10"
                      >
                        <td className="px-6 py-4 text-sm">
                          <a
                            href={website.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors text-muted-foreground"
                          >
                            {website.url}
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {isChecking ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin text-yellow-500" />
                                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                                  Checking
                                </span>
                              </>
                            ) : (
                              <>
                                <div
                                  className={`h-3 w-3 rounded-full ${
                                    status === "up" 
                                      ? "bg-green-500" 
                                      : status === "down"
                                      ? "bg-red-500"
                                      : "bg-gray-500"
                                  }`}
                                />
                                <span className="text-sm capitalize font-medium">
                                  {status === "up" ? "Up" : status === "down" ? "Down" : "Unknown"}
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {isChecking ? "—" : (status === "up" || status === "down") && responseTime ? `${responseTime}ms` : "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {formatDate(lastChecked)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleRemoveWebsite(website.id)}
                            className="text-sm text-red-500 transition-colors hover:text-red-600"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && websites.length === 0 && (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">No websites added yet. Add one to get started!</p>
            </div>
          )}
        </main>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg border border-border bg-card p-8">
              <h2 className="font-serif text-2xl font-semibold mb-6">Add New Website</h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Website URL</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddWebsite(e)
                      }
                    }}
                    placeholder="e.g., https://example.com"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground transition-colors focus:border-foreground focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-lg border border-border px-4 py-2 transition-colors hover:bg-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddWebsite}
                    className="flex-1 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Add Website
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}