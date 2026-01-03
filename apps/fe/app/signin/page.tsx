"use client"

import type React from "react"
import axios from "axios";
import { useState, useEffect } from "react"
import Link from "next/link"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BACKEND_URL } from "@/lib/utils";
import { useRouter } from "next/navigation";


export default function SignInPage() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign in logic here
    try{
   const response = await axios.post(`${BACKEND_URL}/user/signin`,{
      username,
      password
    })
    
    localStorage.setItem("token",response.data.token);
    router.push("/dashboard")
  }catch(e:any){
    console.error(e);
    alert(e.response?.data?.message || "Signin failed");
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
              Monitor your uptime with confidence
            </h1>

            <p className="text-xl text-foreground/60 mb-12 leading-relaxed text-balance">
              Welcome back. Access your monitoring dashboard and stay on top of your website's performance 24/7.
            </p>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-foreground/80 mb-3">Security First</p>
                <p className="text-foreground/60">Your data is encrypted and secure with industry-leading standards.</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground/80 mb-3">Always Available</p>
                <p className="text-foreground/60">
                  Access your account anytime, anywhere with our global infrastructure.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-12">
              <h2 className="text-4xl font-serif font-bold text-foreground mb-2">Sign in</h2>
              <p className="text-foreground/60">
                Don't have an account?{" "}
                <Link href="/signup" className="text-foreground font-semibold hover:text-foreground/80 transition">
                  Sign up
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                   username
                </label>
                <Input
                  id="username"
                  type="text"
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

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border border-border bg-card accent-foreground"
                    defaultChecked
                  />
                  <span className="text-sm text-foreground/70">Remember me</span>
                </label>
                <Link href="#" className="text-sm text-foreground font-medium hover:text-foreground/80 transition">
                  Forgot?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium py-3 rounded-lg transition"
              >
                Sign in
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-center text-sm text-foreground/60">
                By signing in, you agree to our{" "}
                <Link href="#" className="text-foreground font-medium hover:text-foreground/80 transition">
                  Terms of Service
                </Link>
                {" and "}
                <Link href="#" className="text-foreground font-medium hover:text-foreground/80 transition">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
