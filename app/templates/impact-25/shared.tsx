"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect } from "react"

export function useFonts() {
  useEffect(() => {
    if (document.getElementById("impact-25-fonts")) return
    const style = document.createElement("style")
    style.id = "impact-25-fonts"
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');`
    document.head.appendChild(style)
  }, [])
}

export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export const metrics = [
  { label: "Sessions", value: "2.4M", change: "+18.2%", up: true },
  { label: "Conversion Rate", value: "4.7%", change: "+0.9pts", up: true },
  { label: "Avg. Revenue", value: "$84", change: "-2.1%", up: false },
  { label: "Active Users", value: "128K", change: "+31%", up: true },
]

export const integrations = [
  "Stripe", "Shopify", "HubSpot", "Salesforce", "Segment", "BigQuery",
  "PostgreSQL", "Snowflake", "Mixpanel", "Amplitude", "Google Analytics", "Intercom"
]

export const plans = [
  {
    name: "Starter", price: "$49", period: "/mo",
    features: ["Up to 100K events/mo", "3 dashboards", "7-day retention", "Email support"],
    cta: "Start free", highlight: false,
  },
  {
    name: "Growth", price: "$199", period: "/mo",
    features: ["Up to 5M events/mo", "Unlimited dashboards", "90-day retention", "Funnels & cohorts", "Slack support"],
    cta: "Start free trial", highlight: true,
  },
  {
    name: "Enterprise", price: "Custom", period: "",
    features: ["Unlimited events", "Custom retention", "SSO & SAML", "SLA guarantee", "Dedicated CSM"],
    cta: "Contact sales", highlight: false,
  },
]

export const faqs = [
  { q: "How is event volume calculated?", a: "Each unique user action tracked via our SDK counts as one event. Page views, clicks, and custom events all count." },
  { q: "Can I self-host Prism?", a: "Yes — our Enterprise plan includes a self-hosted option with Docker/Kubernetes deployment guides." },
  { q: "Is there a free trial?", a: "Growth plan comes with a 14-day free trial. No credit card required. Starter is free up to 10K events." },
  { q: "How does data retention work?", a: "Raw events are retained per your plan. Aggregated metrics and dashboards are always available regardless of retention." },
]
