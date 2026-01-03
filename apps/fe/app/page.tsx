"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, TrendingUp, Clock, Moon, Sun } from "lucide-react"
import { useRouter } from "next/navigation"
// import { useRouter } from "next/router"

export default function Home() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
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

  if (!mounted) return null

  return (
    <div className="w-full">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold font-serif text-foreground">Better Uptime</div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#features" className="text-foreground/70 hover:text-foreground transition text-sm">
              Features
            </a>
            <a href="#pricing" className="text-foreground/70 hover:text-foreground transition text-sm">
              Pricing
            </a>
            <a href="#testimonials" className="text-foreground/70 hover:text-foreground transition text-sm">
              Testimonials
            </a>
          </div>
          <div className="flex gap-3 items-center">
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Button 
            onClick={()=>{
              router.push("/signup")
            }}  
            variant="outline" className="hidden sm:flex bg-transparent border-border hover:bg-secondary">
              SignUp
            </Button>
            <Button
            onClick={()=>{
              router.push("/signin") 
            }}
             className="bg-foreground text-background hover:bg-foreground/90">SignIn</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="max-w-5xl mx-auto">
          <div className="inline-block mb-8 px-4 py-2 bg-secondary border border-border rounded-full">
            <span className="text-xs font-medium text-foreground/80">99.99% uptime guarantee</span>
          </div>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-serif font-bold text-foreground mb-8 leading-tight text-balance">
            Stop worrying about downtime
          </h1>
          <p className="text-xl text-foreground/60 mb-12 max-w-2xl text-balance leading-relaxed">
            Monitor your website uptime with real-time alerting, beautiful status pages, and comprehensive incident
            management. Keep your customers informed 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 font-medium">
              Start monitoring free
            </Button>
            <Button size="lg" variant="outline" className="border-border hover:bg-secondary bg-transparent">
              View demo
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Metrics */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: "Uptime monitored", value: "500M+" },
              { label: "Alert delivered", value: "10B+" },
              { label: "Active users", value: "50K+" },
              { label: "Website tracked", value: "100K+" },
            ].map((metric, idx) => (
              <div key={idx}>
                <div className="text-4xl font-serif font-bold text-foreground mb-2">{metric.value}</div>
                <p className="text-foreground/60 text-sm">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl sm:text-6xl font-serif font-bold text-center text-foreground mb-6 text-balance">
            Everything you need to monitor uptime
          </h2>
          <p className="text-center text-foreground/60 mb-20 max-w-2xl mx-auto text-lg leading-relaxed">
            Powerful monitoring tools designed for teams of all sizes. From startups to enterprises.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              {
                icon: Clock,
                title: "Real-time Monitoring",
                description: "Check your website every 30 seconds from multiple locations worldwide.",
              },
              {
                icon: AlertCircle,
                title: "Instant Alerts",
                description: "Get notified via SMS, email, Slack, or Discord within seconds of an outage.",
              },
              {
                icon: TrendingUp,
                title: "Performance Metrics",
                description: "Track response times, uptime trends, and performance metrics in real-time.",
              },
              {
                icon: CheckCircle2,
                title: "Status Pages",
                description: "Create beautiful, branded status pages to keep customers informed.",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="p-8 border border-border rounded-xl bg-card/50 hover:bg-card transition">
                  <Icon className="w-8 h-8 text-foreground mb-6" />
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-foreground/60 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl sm:text-6xl font-serif font-bold text-center text-foreground mb-20 text-balance">
            Set up in minutes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Add Monitor", desc: "Enter your website URL and configure monitoring intervals." },
              { step: "02", title: "Set Alerts", desc: "Choose how and when you want to be notified about issues." },
              {
                step: "03",
                title: "Monitor & Relax",
                desc: "Rest assured knowing your uptime is being monitored 24/7.",
              },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="text-5xl font-serif font-bold text-foreground/20 mb-4">{item.step}</div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-foreground/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl sm:text-6xl font-serif font-bold text-center text-foreground mb-6 text-balance">
            Simple, transparent pricing
          </h2>
          <p className="text-center text-foreground/60 mb-20 max-w-2xl mx-auto text-lg">
            No hidden fees. Scale as you grow.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "29",
                description: "For small websites",
                features: ["Up to 5 monitors", "Email & SMS alerts", "Basic status page", "API access"],
              },
              {
                name: "Professional",
                price: "99",
                description: "For growing teams",
                features: [
                  "Unlimited monitors",
                  "All alert channels",
                  "Custom status page",
                  "Team collaboration",
                  "Advanced analytics",
                  "Priority support",
                ],
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large organizations",
                features: [
                  "Everything in Pro",
                  "Custom integrations",
                  "SLA guarantees",
                  "Dedicated support",
                  "Custom contracts",
                ],
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-xl border transition ${
                  plan.highlighted
                    ? "border-foreground/30 bg-card scale-105 shadow-lg"
                    : "border-border bg-card/50 hover:bg-card"
                }`}
              >
                <h3 className="text-2xl font-serif font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-foreground/60 mb-6 text-sm">{plan.description}</p>
                <div className="mb-8">
                  <span className="text-5xl font-serif font-bold text-foreground">${plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-foreground/60 ml-2">/month</span>}
                </div>
                <Button
                  className={`w-full mb-8 font-medium ${
                    plan.highlighted
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  Get started
                </Button>
                <ul className="space-y-4">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex gap-3 text-foreground/70 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl sm:text-6xl font-serif font-bold text-center text-foreground mb-20 text-balance">
            Trusted by teams worldwide
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Better Uptime has been crucial for our team. We caught an outage in 30 seconds and were able to fix it before most customers noticed.",
                author: "Sarah Chen",
                role: "CTO at TechStartup",
                initials: "SC",
              },
              {
                quote:
                  "The status page feature alone is worth it. Our customers love seeing the real-time updates during incidents.",
                author: "Marcus Johnson",
                role: "Founder at APIHub",
                initials: "MJ",
              },
              {
                quote:
                  "Switched from manual monitoring to Better Uptime and immediately gained peace of mind. Highly recommended.",
                author: "Lisa Wang",
                role: "DevOps Lead at DataCorp",
                initials: "LW",
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="p-8 bg-card border border-border rounded-xl">
                <p className="text-foreground/70 mb-8 italic leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-foreground">{testimonial.initials}</span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-foreground/60">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-foreground text-background">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-serif font-bold mb-8 text-balance">Ready to monitor your uptime?</h2>
          <p className="text-xl mb-12 opacity-80 text-balance leading-relaxed">
            Join thousands of teams already using Better Uptime to protect their websites.
          </p>
          <Button size="lg" className="bg-background text-foreground hover:bg-background/90 font-medium">
            Start your free trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wide">Product</h4>
              <ul className="space-y-3 text-foreground/60 text-sm">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Status
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wide">Company</h4>
              <ul className="space-y-3 text-foreground/60 text-sm">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wide">Resources</h4>
              <ul className="space-y-3 text-foreground/60 text-sm">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Help
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wide">Legal</h4>
              <ul className="space-y-3 text-foreground/60 text-sm">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-foreground/60 text-sm">
            <p>© 2026 Better Uptime. All rights reserved.</p>
            <div className="flex gap-6 mt-6 md:mt-0">
              <a href="#" className="hover:text-foreground transition">
                Twitter
              </a>
              <a href="#" className="hover:text-foreground transition">
                GitHub
              </a>
              <a href="#" className="hover:text-foreground transition">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
