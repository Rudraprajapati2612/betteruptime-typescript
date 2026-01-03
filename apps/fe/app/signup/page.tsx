"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { BACKEND_URL } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    setMounted(true)
    const isDarkMode =
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
    setIsDark(isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    localStorage.setItem("theme", newIsDark ? "dark" : "light")
    if (newIsDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign up logic here
    try{
      axios.post(`${BACKEND_URL}/user/signup`,{
      username ,
      password 
    })

    router.push("/signin")
    }catch(e:any){
      alert(e.message)
    }
  }

  if (!mounted) return null

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex h-screen">
        {/* Left Side - Content */}
        <div className="hidden lg:flex lg:w-1/2 bg-secondary/40 flex-col justify-center px-12">
          <div className="max-w-md">
            <Link href="/" className="inline-block mb-16">
              <div className="text-3xl font-bold font-serif text-foreground">Better Uptime</div>
            </Link>

            <h1 className="text-6xl font-serif font-bold text-foreground mb-6 leading-tight text-balance">
              Start monitoring today
            </h1>

            <p className="text-xl text-foreground/60 mb-12 leading-relaxed text-balance">
              Join thousands of teams protecting their websites with real-time uptime monitoring and status pages.
            </p>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-foreground/80 mb-3">Free Trial</p>
                <p className="text-foreground/60">No credit card required. Start monitoring in minutes.</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground/80 mb-3">Expert Support</p>
                <p className="text-foreground/60">Our team is here to help you get the most out of Better Uptime.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-12">
              <h2 className="text-4xl font-serif font-bold text-foreground mb-2">Create account</h2>
              <p className="text-foreground/60">
                Already have an account?{" "}
                <Link href="/signin" className="text-foreground font-semibold hover:text-foreground/80 transition">
                  Sign in
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="usernmae" className="block text-sm font-medium text-foreground mb-2">
                  usernmae
                </label>
                <Input
                  id="username"
                  type="username"
                  placeholder="you@example.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  required
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border border-border bg-card accent-foreground mt-1"
                  defaultChecked
                  required
                />
                <span className="text-sm text-foreground/70">
                  I agree to the{" "}
                  <Link href="#" className="text-foreground font-medium hover:text-foreground/80 transition">
                    Terms of Service
                  </Link>
                  {" and "}
                  <Link href="#" className="text-foreground font-medium hover:text-foreground/80 transition">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <Button
                type="submit"
                className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium py-3 rounded-lg transition"
              >
                Create account
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-border text-center">
              <p className="text-sm text-foreground/60">Get started free. No credit card required.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
