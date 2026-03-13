"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle2, AlertTriangle, Network, Shield, Cpu, MessageSquare, ExternalLink, Calendar, Code, Layout, Loader2, Sparkles, AlertCircle } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import { cn } from "@/lib/utils"
import { getDecision, Decision } from "@/lib/api"

export default function ReviewDetailsPage() {
    const { id } = useParams()
    const [decision, setDecision] = useState<Decision | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return
        const fetchDecision = async () => {
            try {
                const data = await getDecision(id as string)
                setDecision(data)
            } catch (err) {
                console.error("Error fetching decision:", err)
                setError("Failed to load decision details.")
            } finally {
                setIsLoading(false)
            }
        }
        fetchDecision()
    }, [id])

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#030014]">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[70vh]">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-slate-400">Fetching analysis reports...</p>
                </div>
            </main>
        )
    }

    if (error || !decision) {
        return (
            <main className="min-h-screen bg-[#030014]">
                <Navbar />
                <div className="pt-32 px-6 max-w-5xl mx-auto text-center">
                    <div className="glass p-12 rounded-[40px] border-rose-500/10">
                        <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold mb-4">Oops! Decision Not Found</h2>
                        <p className="text-slate-400 mb-8">{error || "The decision report you're looking for doesn't exist or has been removed."}</p>
                        <Link href="/dashboard">
                            <button className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all">
                                Return to Dashboard
                            </button>
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    const feedback = decision.ai_feedback
    const hasAIReview = decision.status === "reviewed" && feedback

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
                                feedback?.risk_level === "High" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                                    feedback?.risk_level === "Medium" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                        "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            )}>
                                {hasAIReview ? `${feedback.risk_level} Risk` : decision.status}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Calendar className="w-3 h-3" /> {new Date(decision.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold">{decision.title}</h1>
                        <p className="text-slate-400 max-w-2xl leading-relaxed whitespace-pre-wrap">{decision.architecture}</p>
                    </div>

                    {hasAIReview && (
                        <div className="p-1 rounded-[24px] bg-gradient-to-tr from-primary/50 to-secondary/50">
                            <div className="bg-black rounded-[23px] p-6 text-center w-32 aspect-square flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold">{100 - (feedback.high_risks * 15 || 0)}</span>
                                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Health Score</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* AI Insights */}
                        {hasAIReview ? (
                            <section className="glass p-8 rounded-[32px] border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Cpu className="w-24 h-24" />
                                </div>
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-primary" />
                                    </div>
                                    Strategic AI Insights
                                </h3>
                                <div className="space-y-4 relative z-10">
                                    {feedback.insights.map((insight, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="w-3 h-3 text-primary" />
                                            </div>
                                            <p className="text-sm text-slate-300">{insight}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ) : (
                            <section className="glass p-8 rounded-[32px] border-white/5 flex flex-col items-center justify-center py-20 text-center">
                                <Sparkles className="w-12 h-12 text-slate-600 mb-4" />
                                <h3 className="text-xl font-bold mb-2">Analysis in Progress</h3>
                                <p className="text-slate-400 text-sm max-w-sm">
                                    Our AI engine is currently reviewing your architectural design. This typically takes 30-60 seconds.
                                </p>
                            </section>
                        )}

                        {/* Architecture Details */}
                        <section className="glass p-8 rounded-[32px] border-white/5">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                    <Layout className="w-4 h-4 text-blue-500" />
                                </div>
                                Design Specifications
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">API Design Pattern</h4>
                                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap bg-white/5 p-4 rounded-2xl border border-white/5">
                                        {decision.api_design || "No specific API design patterns provided."}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Data Models & Schema</h4>
                                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap bg-white/5 p-4 rounded-2xl border border-white/5">
                                        {decision.data_model || "No specific data modeling details provided."}
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        {/* Risk Assessment */}
                        {hasAIReview && feedback.action_plan && (
                            <section className="glass p-6 rounded-[28px] border-white/10">
                                <h3 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-500">Action Plan</h3>
                                <div className="space-y-4">
                                    {feedback.action_plan.map((item, i) => (
                                        <div key={i} className={cn("p-4 rounded-2xl border border-white/5 bg-white/5")}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={cn("w-2 h-2 rounded-full",
                                                    item.category === "Immediate Fix" ? "bg-rose-500" : "bg-blue-500"
                                                )} />
                                                <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">{item.category}</span>
                                            </div>
                                            <p className="text-xs text-slate-300 leading-normal">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Tech Stack */}
                        <section className="glass p-6 rounded-[28px] border-white/10">
                            <h3 className="font-bold mb-4 text-sm uppercase tracking-widest text-slate-500">Technology Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {decision.tech_choices.map((t) => (
                                    <span key={t} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium">
                                        {t}
                                    </span>
                                ))}
                                {decision.tech_stack && (
                                    <div className="w-full mt-2 pt-2 border-t border-white/5 text-[10px] text-slate-500 italic">
                                        {decision.tech_stack}
                                    </div>
                                )}
                            </div>
                        </section>

                        <button className="w-full py-4 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                            Export PDF Report <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}

