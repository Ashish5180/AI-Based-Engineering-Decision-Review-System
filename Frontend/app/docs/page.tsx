"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Book, 
    ChevronRight, 
    Shield, 
    Zap, 
    Search, 
    Code, 
    Layers, 
    Cpu, 
    Terminal,
    MessageSquare,
    ArrowRight,
    Server,
    Database,
    Globe,
    Activity,
    AlertCircle,
    CheckCircle2
} from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/Navbar"

const p = {
    purple50: "#EEEDFE",
    purple100: "#CECBF6",
    purple600: "#7C3AED",
    purple900: "#4C1D95",
    slate50: "#F8FAFC",
    slate100: "#F1F5F9",
    slate600: "#475569",
    slate900: "#0F172A",
}

const CATEGORIES = [
    {
        title: "Getting Started",
        icon: Zap,
        items: [
            { title: "Introduction", slug: "intro" },
            { title: "Quick Start Guide", slug: "quickstart" },
            { title: "Core Concepts", slug: "concepts" },
        ]
    },
    {
        title: "Architecture Reviews",
        icon: Shield,
        items: [
            { title: "Submitting Designs", slug: "submitting" },
            { title: "Understanding Scores", slug: "scores" },
            { title: "Risk Dimensions", slug: "risks" },
        ]
    },
    {
        title: "Knowledge Base",
        icon: Book,
        items: [
            { title: "Design Patterns", slug: "patterns" },
            { title: "Anti-Patterns", slug: "anti-patterns" },
            { title: "Best Practices", slug: "best-practices" },
        ]
    },
    {
        title: "Integrations",
        icon: Terminal,
        items: [
            { title: "REST API", slug: "api" },
            { title: "CLI Tooling", slug: "cli" },
            { title: "Webhooks", slug: "webhooks" },
        ]
    }
]

const DOCS_CONTENT: Record<string, any> = {
    "intro": {
        title: "Introduction to ArchGuard",
        tag: "Introduction",
        description: "ArchGuard is an AI-powered architectural review platform designed to help engineering teams validate designs early and build scalable systems.",
        sections: [
            {
                title: "Why ArchGuard?",
                icon: Activity,
                content: "Traditional architectural reviews are often manual, slow, and prone to oversight. ArchGuard automates this process by applying deep architectural reasoning to your designs, catching bottlenecks before a single line of code is written.",
                color: "bg-violet-50",
                iconColor: "text-violet-600",
                borderColor: "border-violet-100"
            },
            {
                title: "Strategic Insights",
                icon: Globe,
                content: "Beyond simple linting, ArchGuard understands complex service interactions, data propagation, and technology compatibility to give you strategic feedback that aligns with modern cloud-native standards.",
                color: "bg-blue-50",
                iconColor: "text-blue-600",
                borderColor: "border-blue-100"
            }
        ],
        checklist: [
            "Validate service boundaries",
            "Identify single points of failure",
            "Optimize communication protocols",
            "Ensure data consistency models"
        ]
    },
    "quickstart": {
        title: "Quick Start Guide",
        tag: "Tutorial",
        description: "Get your first architectural review running in under 5 minutes with our streamlined submission process.",
        sections: [
            {
                title: "1. Create a Review",
                icon: Code,
                content: "Navigate to the 'New Review' section. You can describe your architecture in plain English or provide a more technical specification. The AI handles both with ease.",
                color: "bg-violet-50",
                iconColor: "text-violet-600",
                borderColor: "border-violet-100"
            },
            {
                title: "2. Add Tech Details",
                icon: Layers,
                content: "Provide information about your database choices, communication styles (REST/gRPC), and infrastructure targets (K8s, Serverless).",
                color: "bg-emerald-50",
                iconColor: "text-emerald-600",
                borderColor: "border-emerald-100"
            }
        ],
        checklist: [
            "Title your project descriptively",
            "Define at least 2 service interactions",
            "Select a primary data storage type",
            "Briefly mention scale requirements"
        ]
    },
    "concepts": {
        title: "Core Concepts",
        tag: "Principles",
        description: "Understanding the underlying philosophy of ArchGuard's analysis engine.",
        sections: [
            {
                title: "Reasoning Pillars",
                icon: Cpu,
                content: "We evaluate designs based on 4 pillars: Scalability, Maintainability, Security, and Resilience. Each pillar contributes to the final Architecture Score.",
                color: "bg-orange-50",
                iconColor: "text-orange-600",
                borderColor: "border-orange-100"
            }
        ],
        checklist: [
            "Stateless vs Stateful components",
            "Synchronous vs Asynchronous patterns",
            "Tight vs Loose coupling",
            "Resilience strategies (Circuit breakers)"
        ]
    },
    "submitting": {
        title: "Submitting Designs",
        tag: "User Guide",
        description: "Learn how to format your architectural descriptions for the highest precision AI feedback.",
        sections: [
            {
                title: "Descriptive Accuracy",
                icon: Terminal,
                content: "When describing data flows, specify the medium (e.g., 'messages via Kafka' vs 'HTTP calls'). Specificity helps the AI detect latency risks and protocol mismatches.",
                color: "bg-slate-50",
                iconColor: "text-slate-600",
                borderColor: "border-slate-200"
            }
        ],
        checklist: [
            "Mention message schemas (Protobuf/JSON)",
            "Define retry policies",
            "Clarify database indexing needs",
            "Specify traffic volume estimates"
        ]
    },
    "scores": {
        title: "Understanding Scores",
        tag: "Analysis",
        description: "How ArchGuard calculates the 0-100 Architecture Score and what it means for your project.",
        sections: [
            {
                title: "The Scoring Math",
                icon: Activity,
                content: "Scores above 80 are 'Production Ready'. 60-80 indicates 'Iterative Improvements Needed'. Below 60 suggests 'Critical Design Flaws' that could cause production outages.",
                color: "bg-violet-50",
                iconColor: "text-violet-600",
                borderColor: "border-violet-100"
            }
        ],
        checklist: [
            "Risk density impact",
            "Best practice alignment bonus",
            "Anti-pattern penalties",
            "Complexity overhead reduction"
        ]
    },
    "risks": {
        title: "Risk Dimensions",
        tag: "Security",
        description: "Detailed breakdown of the risk categories evaluated during 🛡️ Arch-Reviews.",
        sections: [
            {
                title: "Risk Categories",
                icon: AlertCircle,
                content: "We track Reliability risks (uptime), Scalability risks (deadlocks/bottlenecks), and Compliance risks (PII data exposure).",
                color: "bg-red-50",
                iconColor: "text-red-600",
                borderColor: "border-red-100"
            }
        ],
        checklist: [
            "Single Point of Failure (SPOF)",
            "Data race conditions",
            "Insecure egress patterns",
            "Z-component failures"
        ]
    },
    "patterns": {
        title: "Design Patterns",
        tag: "Library",
        description: "A curated library of cloud-native patterns that ArchGuard recognizes and recommends.",
        sections: [
            {
                title: "Pattern Recognition",
                icon: Layers,
                content: "From CQRS to Event Sourcing, our library provides implementation blueprints tailored to your specific language and database choices.",
                color: "bg-blue-50",
                iconColor: "text-blue-600",
                borderColor: "border-blue-100"
            }
        ],
        checklist: [
            "CQRS Implementation",
            "Event Sourcing",
            "Sidecar Patterns",
            "Database-per-service"
        ]
    },
    "anti-patterns": {
        title: "Anti-Patterns",
        tag: "Prevention",
        description: "Common mistakes that lead to legacy debt and performance misery.",
        sections: [
            {
                title: "The 'Distributed Monolith'",
                icon: AlertCircle,
                content: "One of the most common issues we detect is the 'Distributed Monolith'—where services are physically separate but logically tightly coupled.",
                color: "bg-orange-50",
                iconColor: "text-orange-600",
                borderColor: "border-orange-100"
            }
        ],
        checklist: [
            "Shared Database schemas",
            "Synchronous chain calls",
            "Excessive chatty APIs",
            "Bloated API Gateways"
        ]
    },
    "best-practices": {
        title: "Best Practices",
        tag: "Excellence",
        description: "A gold standard checklist for modern distributed system design.",
        sections: [
            {
                title: "Engineering Pillars",
                icon: CheckCircle2,
                content: "Build with observability from day one. Implement comprehensive tracing, logging, and metrics at the architectural level.",
                color: "bg-emerald-50",
                iconColor: "text-emerald-600",
                borderColor: "border-emerald-100"
            }
        ],
        checklist: [
            "Health Check endpoints",
            "Correlation IDs for tracing",
            "Graceful degradation",
            "Exponential backoff"
        ]
    },
    "api": {
        title: "REST API Integration",
        tag: "Developer",
        description: "Programmatically submit reviews and fetch results directly into your CI/CD pipelines.",
        sections: [
            {
                title: "Standard Auth",
                icon: Shield,
                content: "All API requests require a Bearer Token generated from your Project Settings page. Scope tokens to specific read/write permissions.",
                color: "bg-violet-100/30",
                iconColor: "text-violet-600",
                borderColor: "border-violet-200"
            }
        ],
        checklist: [
            "Endpoint: /api/v1/reviews",
            "JSON Request Payload",
            "Status Webhooks",
            "Rate Limiting policies"
        ]
    },
    "cli": {
        title: "CLI Tooling",
        tag: "Developer",
        description: "The 'arch-cli' allows engineers to validate designs locally before pushing to central repositories.",
        sections: [
            {
                title: "Installation",
                icon: Terminal,
                content: "Install via npm or go: `npm install -g @archguard/cli`. Then run `arch-cli init` to link your local environment to your project.",
                color: "bg-slate-900",
                iconColor: "text-violet-400",
                borderColor: "border-slate-800"
            }
        ],
        checklist: [
            "arch-cli validate <file>",
            "arch-cli sync",
            "Pre-commit hooks",
            "CI/CD Integration scripts"
        ]
    },
    "webhooks": {
        title: "Webhooks",
        tag: "Integrations",
        description: "Trigger external system actions when reviews are completed or critical risks are found.",
        sections: [
            {
                title: "Response Payload",
                icon: Globe,
                content: "Receive real-time JSON payloads whenever a review score changes or an AI Insight is generated for your team.",
                color: "bg-blue-50",
                iconColor: "text-blue-600",
                borderColor: "border-blue-100"
            }
        ],
        checklist: [
            "Slack Notifications",
            "Jira Issue creation",
            "GitHub PR comments",
            "Custom HTTP targets"
        ]
    }
}

export default function DocsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeSection, setActiveSection] = useState("intro")

    const content = DOCS_CONTENT[activeSection] || DOCS_CONTENT["intro"]

    const filteredCategories = CATEGORIES.map(cat => ({
        ...cat,
        items: cat.items.filter(item => 
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cat.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.items.length > 0)

    const nextSection = () => {
        const allItems = CATEGORIES.flatMap(c => c.items)
        const idx = allItems.findIndex(i => i.slug === activeSection)
        if (idx < allItems.length - 1) setActiveSection(allItems[idx+1].slug)
    }

    const prevSection = () => {
        const allItems = CATEGORIES.flatMap(c => c.items)
        const idx = allItems.findIndex(i => i.slug === activeSection)
        if (idx > 0) setActiveSection(allItems[idx-1].slug)
    }

    return (
        <main style={{ minHeight: "100vh", background: "linear-gradient(160deg,#FAFAF7 0%,#F3F0FB 45%,#EEF5FF 100%)", fontFamily: "'DM Sans',sans-serif" }}>
            <Navbar />

            {/* Ambient Blobs */}
            <div className="fixed top-[-200px] right-[-150px] w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
            <div className="fixed bottom-[-100px] left-[-80px] w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 relative z-10">
                
                {/* Sidebar */}
                <aside className="w-full lg:w-64 lg:shrink-0">
                    <div className="lg:sticky lg:top-32 space-y-8">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search docs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-black/[0.08] text-sm focus:outline-none focus:border-violet-300 shadow-sm transition-all"
                            />
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-6">
                            {filteredCategories.map((cat) => (
                                <div key={cat.title}>
                                    <div className="flex items-center gap-2 mb-3 px-1">
                                        <cat.icon className="w-4 h-4 text-violet-600" />
                                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                            {cat.title}
                                        </h3>
                                    </div>
                                    <div className="space-y-1">
                                        {cat.items.map((item) => (
                                            <button
                                                key={item.slug}
                                                onClick={() => {
                                                    setActiveSection(item.slug)
                                                    window.scrollTo({ top: 32, behavior: 'smooth' })
                                                }}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                                                    activeSection === item.slug 
                                                    ? "bg-violet-50 text-violet-700 font-semibold border border-violet-100 shadow-sm" 
                                                    : "text-slate-600 hover:bg-black/[0.03] hover:text-slate-900 border border-transparent"
                                                }`}
                                            >
                                                {item.title}
                                                {activeSection === item.slug && <ChevronRight className="w-3 h-3" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Content Area */}
                <div className="flex-1 lg:max-w-3xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-[32px] p-8 md:p-12 border border-black/[0.06] shadow-[0_12px_50px_rgba(0,0,0,0.03)]"
                        >
                            <div className="mb-10">
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-[10px] font-bold uppercase tracking-widest mb-4 border border-violet-100">
                                    {content.tag}
                                </span>
                                <h1 className="text-[32px] md:text-[45px] font-bold text-slate-900 leading-[1.1] tracking-tight mb-5">
                                    {content.title}
                                </h1>
                                <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
                                    {content.description}
                                </p>
                            </div>

                            <div className="space-y-10 text-slate-600 leading-relaxed">
                                {content.sections.map((section: any, i: number) => (
                                    <section key={i}>
                                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-xl ${section.color} flex items-center justify-center border ${section.borderColor}`}>
                                                <section.icon className={`w-4 h-4 ${section.iconColor}`} />
                                            </div>
                                            {section.title}
                                        </h2>
                                        <p className="mb-4 leading-relaxed">
                                            {section.content}
                                        </p>
                                    </section>
                                ))}

                                {activeSection === 'cli' && (
                                    <div className="bg-slate-900 rounded-2xl p-6 font-mono text-xs text-white overflow-x-auto">
                                        <p className="text-slate-400 mb-2"># Install ArchGuard CLI</p>
                                        <p className="text-violet-400">npm <span className="text-white">install -g @archguard/cli</span></p>
                                        <p className="text-slate-400 mt-4 mb-2"># Initialize project</p>
                                        <p className="text-violet-400">arch-cli <span className="text-white">init --token &lt;YOUR_API_TOKEN&gt;</span></p>
                                        <p className="text-slate-400 mt-4 mb-2"># Run analysis locally</p>
                                        <p className="text-violet-400">arch-cli <span className="text-white">analyze ./src/architecture.md</span></p>
                                    </div>
                                )}

                                <section>
                                    <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100">
                                            <Layers className="w-4 h-4 text-orange-600" />
                                        </div>
                                        Key Evaluation Points
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {content.checklist.map((item: string, i: number) => (
                                            <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-700">
                                                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                                </div>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Footer Nav */}
                    <div className="mt-12 flex items-center justify-between px-4">
                        <button 
                            onClick={prevSection}
                            className="text-sm font-bold text-slate-400 hover:text-slate-900 flex items-center gap-2 transition-colors disabled:opacity-0"
                            disabled={activeSection === CATEGORIES[0].items[0].slug}
                        >
                            <ChevronRight className="w-4 h-4 rotate-180" /> Previous
                        </button>
                        <button 
                            onClick={nextSection}
                            className="text-sm font-bold text-violet-600 hover:text-violet-800 flex items-center gap-2 transition-colors disabled:opacity-0"
                            disabled={activeSection === CATEGORIES[CATEGORIES.length-1].items[CATEGORIES[CATEGORIES.length-1].items.length-1].slug}
                        >
                            Next Section <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Right Sidebar - In Page Navigation */}
                <aside className="hidden xl:block w-48 shrink-0">
                    <div className="sticky top-32">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                            Resources
                        </h3>
                        <div className="space-y-4 border-l border-slate-100 pl-4">
                            {[
                                { label: "Slack Community", href: "#" },
                                { label: "GitHub Repo", href: "#" },
                                { label: "API Reference", href: "#" },
                                { label: "System Status", href: "#" }
                            ].map((item) => (
                                <a key={item.label} href={item.href} className="block text-xs font-medium text-slate-500 hover:text-violet-600 transition-colors">
                                    {item.label}
                                </a>
                            ))}
                        </div>
                        
                        <div className="mt-12 p-6 rounded-[24px] bg-slate-900 text-white shadow-xl shadow-slate-200/50 group overflow-hidden relative">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-600/20 rounded-full blur-2xl group-hover:bg-violet-600/30 transition-all" />
                            <MessageSquare className="w-6 h-6 text-violet-400 mb-3 relative z-10" />
                            <h4 className="text-xs font-bold mb-1 relative z-10">Premium Support</h4>
                            <p className="text-[10px] text-slate-400 leading-normal mb-4 relative z-10">
                                Get direct access to architectural consultants.
                            </p>
                            <button className="text-[10px] font-bold text-white bg-violet-600 px-3 py-1.5 rounded-lg hover:bg-violet-500 transition-all relative z-10">
                                Talk to Expert
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    )
}
