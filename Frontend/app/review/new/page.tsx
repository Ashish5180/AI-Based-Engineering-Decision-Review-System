"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Layout, Database, Network, Cpu, CheckCircle2, ChevronRight, AlertTriangle } from "lucide-react"
import Navbar from "@/components/Navbar"
import { cn } from "@/lib/utils"

export default function NewReviewPage() {
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showResult, setShowResult] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate AI processing
        setTimeout(() => {
            setIsSubmitting(false)
            setShowResult(true)
        }, 2500)
    }

    const steps = [
        { id: 1, name: "Architecture", icon: Layout },
        { id: 2, name: "API Design", icon: Network },
        { id: 3, name: "Data Model", icon: Database },
        { id: 4, name: "Tech Stack", icon: Cpu },
    ]

    return (
        <main className="min-h-screen bg-[#030014]">
            <Navbar />

            <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                {!showResult ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass p-10 rounded-[32px] gradient-border"
                    >
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">New Engineering Review</h1>
                                <p className="text-slate-400">Phase {step} of 4: Submit your design details for AI analysis</p>
                            </div>
                            <div className="flex gap-2">
                                {steps.map((s) => (
                                    <div
                                        key={s.id}
                                        className={cn(
                                            "w-3 h-3 rounded-full transition-all duration-300",
                                            step >= s.id ? "bg-primary w-8" : "bg-white/10"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="min-h-[400px]">
                                {step === 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Project Title</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Next-Gen Real-time Analytics System"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Architecture Description</label>
                                            <textarea
                                                rows={8}
                                                placeholder="Describe the overall system architecture, service communication patterns, and high-level components..."
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">API Design & Patterns</label>
                                            <textarea
                                                rows={10}
                                                placeholder="Define major endpoints, authentication strategies, and communication protocols (REST, GraphQl, gRPC)..."
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Data Models & Schema</label>
                                            <textarea
                                                rows={10}
                                                placeholder="Describe key entities, relationships, and indexing strategies..."
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {step === 4 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            {['Microservices', 'Serverless', 'Event-Driven', 'Monolithic', 'Cloud Native', 'On-Premise'].map((tech) => (
                                                <div
                                                    key={tech}
                                                    className="p-4 rounded-2xl glass-hover border border-white/10 flex items-center gap-3 cursor-pointer group"
                                                >
                                                    <div className="w-4 h-4 rounded-full border border-primary/50 group-hover:bg-primary transition-colors" />
                                                    <span className="text-sm font-medium">{tech}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Additional Tech Stack Details</label>
                                            <input
                                                type="text"
                                                placeholder="Language, Database, Cloud Provider..."
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setStep(Math.max(1, step - 1))}
                                    className={cn(
                                        "px-6 py-2 rounded-xl text-slate-400 hover:text-white transition-colors",
                                        step === 1 && "invisible"
                                    )}
                                >
                                    Back
                                </button>

                                {step < 4 ? (
                                    <button
                                        type="button"
                                        onClick={() => setStep(step + 1)}
                                        className="px-8 py-3 rounded-2xl bg-white/5 hover:bg-white/10 font-bold flex items-center gap-2 transition-all"
                                    >
                                        Next Step <ChevronRight className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-10 py-3 rounded-2xl bg-primary text-white font-bold flex items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                Analyze Design <Send className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-4xl font-bold">Analysis Results</h2>
                            <div className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-sm font-bold flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Comprehensive Review Complete
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass p-8 rounded-3xl border-l-4 border-amber-500">
                                <div className="flex items-center gap-3 mb-4">
                                    <AlertTriangle className="text-amber-500 w-6 h-6" />
                                    <h3 className="font-bold text-xl">High Risks</h3>
                                </div>
                                <div className="text-3xl font-bold mb-1">2</div>
                                <p className="text-slate-400 text-sm">Potential bottlenecks detected</p>
                            </div>
                            <div className="glass p-8 rounded-3xl border-l-4 border-blue-500">
                                <div className="flex items-center gap-3 mb-4">
                                    <Network className="text-blue-500 w-6 h-6" />
                                    <h3 className="font-bold text-xl">Scalability</h3>
                                </div>
                                <div className="text-3xl font-bold mb-1">Moderate</div>
                                <p className="text-slate-400 text-sm">Growth potential is stable</p>
                            </div>
                            <div className="glass p-8 rounded-3xl border-l-4 border-emerald-500">
                                <div className="flex items-center gap-3 mb-4">
                                    <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                                    <h3 className="font-bold text-xl">Maintainability</h3>
                                </div>
                                <div className="text-3xl font-bold mb-1">Good</div>
                                <p className="text-slate-400 text-sm">Foundations are decoupled</p>
                            </div>
                        </div>

                        <div className="glass p-10 rounded-[32px] space-y-8">
                            <section>
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                    </div>
                                    Key Insights
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        "Detected potential tight coupling between User Service and Billing Service via direct API calls. Recommend switching to an Event-Driven pattern.",
                                        "The proposed data schema for Analytics might face performance issues at scale. Consider using a partitioned table or a specialized Time-Series database.",
                                        "Authentication flow lacks a refresh token mechanism, which could lead to poor UX once access tokens expire."
                                    ].map((insight, i) => (
                                        <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4">
                                            <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                                            <p className="text-slate-300 leading-relaxed">{insight}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="pt-8 border-t border-white/5">
                                <h4 className="font-bold mb-4 uppercase tracking-widest text-xs text-slate-500">Suggested Action Plan</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                        <h5 className="font-bold text-emerald-500 mb-2">Immediate Fix</h5>
                                        <p className="text-sm text-slate-400">Implement an asynchronous message queue (RabbitMQ/Kafka) for cross-service communication.</p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                                        <h5 className="font-bold text-blue-500 mb-2">Optimization</h5>
                                        <p className="text-sm text-slate-400">Refactor the 'orders' collection to use sharding based on user_id for better load distribution.</p>
                                    </div>
                                </div>
                            </section>

                            <div className="flex justify-center pt-10">
                                <button
                                    onClick={() => setShowResult(false)}
                                    className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all"
                                >
                                    Perform Another Review
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none -z-10" />
        </main>
    )
}

function Sparkles({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    )
}
