"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Code2, Layers, Cpu, Database, Network, ShieldCheck, Zap, Sparkles, Loader2, X, CheckCircle2 } from "lucide-react"
import Navbar from "@/components/Navbar"
import { listPatterns, tailorPattern, Pattern, PatternTailoredResponse } from "@/lib/api"
import MarkdownRenderer from "@/components/MarkdownRenderer"
import { cn } from "@/lib/utils"

const iconMap: Record<string, any> = {
    Network,
    Database,
    Zap,
    ShieldCheck,
}

export default function PatternsPage() {
    const [patterns, setPatterns] = useState<Pattern[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null)
    const [techStack, setTechStack] = useState("")
    const [tailoring, setTailoring] = useState(false)
    const [tailoredResult, setTailoredResult] = useState<PatternTailoredResponse | null>(null)

    useEffect(() => {
        const fetchPatterns = async () => {
            try {
                const data = await listPatterns()
                setPatterns(data)
            } catch (err) {
                console.error("Failed to fetch patterns:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchPatterns()
    }, [])

    const handleTailor = async () => {
        if (!selectedPattern || !techStack) return
        setTailoring(true)
        setTailoredResult(null)
        try {
            const result = await tailorPattern(selectedPattern.id, techStack)
            setTailoredResult(result)
        } catch (err) {
            console.error("Tailoring failed:", err)
            alert("Pattern tailoring failed. Please ensure the backend is running.")
        } finally {
            setTailoring(false)
        }
    }

    return (
        <main className="min-h-screen bg-[#030014]">
            <Navbar />

            <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6"
                    >
                        <BookOpen className="w-4 h-4" />
                        Engineering Knowledge Base
                    </motion.div>
                    <h1 className="text-5xl font-bold mb-6">Architectural Patterns</h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Deep dive into common engineering pitfalls and get <span className="text-white font-bold">AI-tailored implementation</span> advice for your tech stack.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                        <p className="text-slate-400">Consulting the Knowledge Base...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {patterns.map((pattern, i) => {
                            const Icon = iconMap[pattern.icon] || Network
                            return (
                                <motion.div
                                    key={pattern.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass p-8 rounded-[32px] gradient-border flex flex-col h-full group"
                                >
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="p-4 rounded-2xl bg-primary/20 border border-primary/10 group-hover:bg-primary/30 transition-all">
                                            <Icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                            {pattern.difficulty}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-bold mb-2">{pattern.title}</h3>
                                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-6">{pattern.category}</p>

                                    <div className="space-y-6 flex-grow">
                                        <div>
                                            <h4 className="text-sm font-bold text-rose-500 mb-2 flex items-center gap-2">
                                                <Code2 className="w-4 h-4" /> The Problem
                                            </h4>
                                            <p className="text-sm text-slate-400 leading-relaxed italic border-l-2 border-rose-500/30 pl-4">
                                                "{pattern.problem}"
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-emerald-500 mb-2 flex items-center gap-2">
                                                <Layers className="w-4 h-4" /> Recommended Solution
                                            </h4>
                                            <p className="text-sm text-slate-300 leading-relaxed">
                                                {pattern.solution}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setSelectedPattern(pattern)
                                            setTailoredResult(null)
                                            setTechStack("")
                                        }}
                                        className="mt-10 w-full py-4 rounded-2xl bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-all text-sm font-bold flex items-center justify-center gap-2 text-primary"
                                    >
                                        <Sparkles className="w-4 h-4" /> Tailor to my Tech Stack
                                    </button>
                                </motion.div>
                            )
                        })}
                    </div>
                )}

                <AnimatePresence>
                    {selectedPattern && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedPattern(null)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="relative w-full max-w-4xl bg-[#030014] p-8 md:p-14 rounded-[48px] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] max-h-[95vh] overflow-y-auto"
                            >
                                <button
                                    onClick={() => setSelectedPattern(null)}
                                    className="absolute top-8 right-8 p-3 rounded-full hover:bg-white/5 transition-colors z-20"
                                >
                                    <X className="w-6 h-6 text-slate-500 hover:text-white" />
                                </button>

                                <div className="mb-12 relative border-b border-white/5 pb-12">
                                    <div className="flex items-center gap-3 text-primary mb-6">
                                        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold tracking-[0.2em] uppercase text-[9px]">AI Implementation Assistant</span>
                                    </div>
                                    <h2 className="text-4xl font-extrabold mb-6 tracking-tight">Tailor: {selectedPattern.title}</h2>
                                    <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">Adapt this pattern to your specific technology stack with our <span className="text-white font-semibold">bespoke AI architectural analysis</span>.</p>
                                </div>

                                <div className="space-y-6 mb-20">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Current Tech Stack</label>
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <input
                                                type="text"
                                                value={techStack}
                                                onChange={(e) => setTechStack(e.target.value)}
                                                placeholder="e.g. Next.js, FastAPI, PostgreSQL, Redis"
                                                className="flex-grow bg-[#0a0a0a] border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm placeholder:text-slate-700"
                                            />
                                            <button
                                                disabled={!techStack || tailoring}
                                                onClick={handleTailor}
                                                className="px-10 py-5 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(124,58,237,0.2)]"
                                            >
                                                {tailoring ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        <span>Processing...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="w-4 h-4" />
                                                        <span>Tailor Pattern</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {tailoredResult && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-20 animate-fade-in pb-10"
                                    >
                                        <div className="space-y-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                                    <Code2 className="text-primary w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-2xl tracking-tight">Implementation Strategy</h4>
                                                    <p className="text-xs text-slate-500 font-medium">Bespoke technical instructions generated for your stack</p>
                                                </div>
                                            </div>
                                            <div className="pl-2">
                                                <MarkdownRenderer content={tailoredResult.implementation} />
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                                    <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-2xl tracking-tight">Architecture Guidelines</h4>
                                                    <p className="text-xs text-slate-500 font-medium">Critical best practices for performance & scalability</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {tailoredResult.best_practices.map((bp, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, scale: 0.98 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="p-8 rounded-[32px] bg-[#0a0a0a] border border-white/5 hover:border-emerald-500/20 transition-all group"
                                                    >
                                                        <div className="flex gap-5">
                                                            <div className="mt-1 w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                            </div>
                                                            <MarkdownRenderer content={bp} className="text-sm" />
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    )
}
