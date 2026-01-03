"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Plus, Sun, Moon, LogOut } from "lucide-react"

interface Website {
  id: string
  name: string
  url: string
  status: "up" | "down"
  uptime: number
  lastChecked: string
}

interface AddWebsiteForm {
  name: string
  url: string
}

export default function Dashboard() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [websites, setWebsites] = useState<Website[]>([])

  const [formData, setFormData] = useState<AddWebsiteForm>({
    name: "",
    url: "",
  })

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

  const handleAddWebsite = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.url.trim()) {
      return
    }

    const newWebsite: Website = {
      id: Date.now().toString(),
      name: formData.name,
      url: formData.url,
      status: "up",
      uptime: 100,
      lastChecked: "Just now",
    }

    setWebsites([...websites, newWebsite])
    setFormData({ name: "", url: "" })
    setIsModalOpen(false)
  }

  const handleRemoveWebsite = (id: string) => {
    setWebsites(websites.filter((site) => site.id !== id))
  }

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
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

                <Link
                  href="/"
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors hover:bg-secondary"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Page Header */}
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

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/20">
                  <th className="px-6 py-4 text-left font-semibold">Website</th>
                  <th className="px-6 py-4 text-left font-semibold">URL</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Uptime</th>
                  <th className="px-6 py-4 text-left font-semibold">Last Checked</th>
                  <th className="px-6 py-4 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {websites.map((website) => (
                  <tr
                    key={website.id}
                    className="border-b border-border last:border-b-0 transition-colors hover:bg-secondary/10"
                  >
                    <td className="px-6 py-4 font-medium">{website.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      <a
                        href={website.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground transition-colors"
                      >
                        {website.url}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded-full ${website.status === "up" ? "bg-green-500" : "bg-red-500"}`}
                        />
                        <span className="text-sm capitalize font-medium">
                          {website.status === "up" ? "Up" : "Down"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{website.uptime.toFixed(2)}%</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{website.lastChecked}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleRemoveWebsite(website.id)}
                        className="text-sm text-red-500 transition-colors hover:text-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {websites.length === 0 && (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">No websites added yet. Add one to get started!</p>
            </div>
          )}
        </main>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg border border-border bg-card p-8">
              <h2 className="font-serif text-2xl font-semibold mb-6">Add New Website</h2>

              <form onSubmit={handleAddWebsite} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Website Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Main Website"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground transition-colors focus:border-foreground focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Website URL</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="e.g., https://example.com"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground transition-colors focus:border-foreground focus:outline-none"
                    required
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
                    type="submit"
                    className="flex-1 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Add Website
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
