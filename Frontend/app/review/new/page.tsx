"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Layout, Database, Network, Cpu, CheckCircle2, ChevronRight, AlertTriangle, Sparkles, Loader2, RefreshCcw } from "lucide-react"
import Navbar from "@/components/Navbar"
import { cn } from "@/lib/utils"
import { createDecision, Decision, CreateDecisionRequest } from "@/lib/api"
import Link from "next/link"

export default function NewReviewPage() {
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [result, setResult] = useState<Decision | null>(null)
    const [formData, setFormData] = useState<CreateDecisionRequest>({
        title: "",
        architecture: "",
        api_design: "",
        data_model: "",
        tech_stack: "",
        tech_choices: [],
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const toggleTechChoice = (tech: string) => {
        setFormData(prev => ({
            ...prev,
            tech_choices: prev.tech_choices.includes(tech)
                ? prev.tech_choices.filter(t => t !== tech)
                : [...prev.tech_choices, tech]
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title) {
            alert("Please provide a project title.")
            setStep(1)
            return
        }
        setIsSubmitting(true)
        try {
            const data = await createDecision(formData)
            setResult(data)
        } catch (err) {
            console.error("Submission failed:", err)
            alert("Failed to submit review. Please ensure the backend is running.")
        } finally {
            setIsSubmitting(false)
        }
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
                {!result ? (
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
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Next-Gen Real-time Analytics System"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Architecture Description</label>
                                            <textarea
                                                rows={8}
                                                name="architecture"
                                                value={formData.architecture}
                                                onChange={handleInputChange}
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
                                                name="api_design"
                                                value={formData.api_design}
                                                onChange={handleInputChange}
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
                                                name="data_model"
                                                value={formData.data_model}
                                                onChange={handleInputChange}
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
                                                    onClick={() => toggleTechChoice(tech)}
                                                    className={cn(
                                                        "p-4 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer group",
                                                        formData.tech_choices.includes(tech)
                                                            ? "bg-primary/20 border-primary/50 shadow-[0_0_15px_rgba(124,58,237,0.2)]"
                                                            : "bg-white/5 border-white/10 hover:border-white/20"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-4 h-4 rounded-full border transition-colors",
                                                        formData.tech_choices.includes(tech) ? "bg-primary border-primary" : "border-primary/50"
                                                    )} />
                                                    <span className="text-sm font-medium">{tech}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Additional Tech Stack Details</label>
                                            <input
                                                type="text"
                                                name="tech_stack"
                                                value={formData.tech_stack}
                                                onChange={handleInputChange}
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
                                        disabled={isSubmitting || !formData.title}
                                        className="px-10 py-3 rounded-2xl bg-primary text-white font-bold flex items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
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
                                <div className="text-3xl font-bold mb-1">{result.ai_feedback?.high_risks || 0}</div>
                                <p className="text-slate-400 text-sm">Potential bottlenecks detected</p>
                            </div>
                            <div className="glass p-8 rounded-3xl border-l-4 border-blue-500">
                                <div className="flex items-center gap-3 mb-4">
                                    <Network className="text-blue-500 w-6 h-6" />
                                    <h3 className="font-bold text-xl">Scalability</h3>
                                </div>
                                <div className="text-3xl font-bold mb-1">{result.ai_feedback?.scalability || "In Beta"}</div>
                                <p className="text-slate-400 text-sm">Growth potential analysis</p>
                            </div>
                            <div className="glass p-8 rounded-3xl border-l-4 border-emerald-500">
                                <div className="flex items-center gap-3 mb-4">
                                    <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                                    <h3 className="font-bold text-xl">Review Status</h3>
                                </div>
                                <div className="text-3xl font-bold mb-1 capitalize">{result.status}</div>
                                <p className="text-slate-400 text-sm">Final decision outcome</p>
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
                                    {result.ai_feedback?.insights.map((insight, i) => (
                                        <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4">
                                            <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                                            <p className="text-slate-300 leading-relaxed">{insight}</p>
                                        </div>
                                    )) || (
                                            <p className="text-slate-500 italic">No specific insights generated for this design yet.</p>
                                        )}
                                </div>
                            </section>

                            {result.ai_feedback?.action_plan && (
                                <section className="pt-8 border-t border-white/5">
                                    <h4 className="font-bold mb-4 uppercase tracking-widest text-xs text-slate-500">Suggested Action Plan</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {result.ai_feedback.action_plan.map((item, i) => (
                                            <div key={i} className={cn(
                                                "p-6 rounded-2xl border",
                                                item.category === "Immediate Fix" ? "bg-rose-500/10 border-rose-500/20" : "bg-blue-500/10 border-blue-500/20"
                                            )}>
                                                <h5 className={cn(
                                                    "font-bold mb-2",
                                                    item.category === "Immediate Fix" ? "text-rose-500" : "text-blue-500"
                                                )}>{item.category}</h5>
                                                <p className="text-sm text-slate-400">{item.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-10">
                                <button
                                    onClick={() => setResult(null)}
                                    className="w-full md:w-auto px-8 py-3 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                >
                                    <RefreshCcw className="w-4 h-4" /> Perform Another Review
                                </button>
                                <Link href={`/dashboard/${result.id}`} className="w-full md:w-auto">
                                    <button className="w-full px-8 py-3 rounded-2xl bg-primary text-white font-bold hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all">
                                        View Full Report
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none -z-10" />
        </main>
    )
}
