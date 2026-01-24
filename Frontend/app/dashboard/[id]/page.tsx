"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle2, AlertTriangle, Network, Shield, Cpu, MessageSquare, ExternalLink, Calendar, Code, Layout } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import { cn } from "@/lib/utils"

export default function ReviewDetailsPage() {
    const { id } = useParams()

    // Mock data for specific reviews
    const reviewData = {
        "1": {
            title: "E-Commerce Microservices",
            status: "Critical Risks",
            score: 64,
            date: "Oct 24, 2026",
            tech: "Go, Kafka, MongoDB",
            description: "Proposed transition from a monolithic architecture to a distributed microservices ecosystem designed to handle 50k concurrent users.",
            risks: [
                { type: "High", msg: "Direct synchronous communication between Order and Inventory services.", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
                { type: "Medium", msg: "Undefined retry logic for failed payment gateway transactions.", icon: MessageSquare, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" }
            ],
            insights: [
                "Implement a 'Transactional Outbox' pattern to ensure data consistency across service boundaries.",
                "Consider using Redis as a distributed cache for the Product Catalog to reduce database load by 70%.",
                "API rate limiting is missing for guest checkout endpoints."
            ],
            architecture: "Event-driven architecture with sidecar proxying for cross-cutting concerns like logging and telemetry."
        },
        // Fallback data
        default: {
            title: "Architectural Review #" + id,
            status: "Approved",
            score: 88,
            date: "Oct 22, 2026",
            tech: "React, Node.js, PostgreSQL",
            description: "Review of the internal dashboard design and data aggregation pipeline.",
            risks: [
                { type: "Low", msg: "Small latency in dashboard metric updates.", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" }
            ],
            insights: [
                "Use indexed views for complex aggregation queries.",
                "Ensure TLS 1.3 is enforced for all internal service communication."
            ],
            architecture: "Standard layered architecture with clearly defined service and repository layers."
        }
    }

    const data = reviewData[id as keyof typeof reviewData] || reviewData.default

    return (
        <main className="min-h-screen bg-[#030014]">
            <Navbar />

            <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                </Link>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                                data.status === "Critical Risks" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            )}>
                                {data.status}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Calendar className="w-3 h-3" /> {data.date}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold">{data.title}</h1>
                        <p className="text-slate-400 max-w-2xl leading-relaxed">{data.description}</p>
                    </div>

                    <div className="p-1 rounded-[24px] bg-gradient-to-tr from-primary/50 to-secondary/50">
                        <div className="bg-black rounded-[23px] p-6 text-center w-32 aspect-square flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold">{data.score}</span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 ont-bold">Health Score</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* AI Insights */}
                        <section className="glass p-8 rounded-[32px] border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Cpu className="w-24 h-24" />
                            </div>
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-primary" />
                                </div>
                                Strategic Insights
                            </h3>
                            <div className="space-y-4 relative z-10">
                                {data.insights.map((insight, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-3 h-3 text-primary" />
                                        </div>
                                        <p className="text-sm text-slate-300">{insight}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Architecture Details */}
                        <section className="glass p-8 rounded-[32px] border-white/5">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                    <Layout className="w-4 h-4 text-blue-500" />
                                </div>
                                Architecture Breakdown
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-blue-500/50 pl-6 py-2 italic font-mono">
                                "{data.architecture}"
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                                {["Scalability", "Maintainability", "Security"].map((cat) => (
                                    <div key={cat} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{cat}</div>
                                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 w-3/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        {/* Risk Assessment */}
                        <section className="glass p-6 rounded-[28px] border-white/10">
                            <h3 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-500">Risk Assessment</h3>
                            <div className="space-y-4">
                                {data.risks.map((risk, i) => (
                                    <div key={i} className={cn("p-4 rounded-2xl border", risk.bg, risk.border || "border-white/5")}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <risk.icon className={cn("w-4 h-4", risk.color)} />
                                            <span className={cn("text-xs font-bold", risk.color)}>{risk.type} Priority</span>
                                        </div>
                                        <p className="text-xs text-slate-300 leading-normal">{risk.msg}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Tech Stack */}
                        <section className="glass p-6 rounded-[28px] border-white/10">
                            <h3 className="font-bold mb-4 text-sm uppercase tracking-widest text-slate-500">Proposed Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.tech.split(', ').map((t) => (
                                    <span key={t} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </section>

                        <button className="w-full py-4 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                            Generate Implementation Plan <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}
