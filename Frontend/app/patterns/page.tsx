"use client"

import { motion } from "framer-motion"
import { BookOpen, Code2, Layers, Cpu, Database, Network, ShieldCheck, Zap } from "lucide-react"
import Navbar from "@/components/Navbar"

export default function PatternsPage() {
    const patterns = [
        {
            title: "Asynchronous Communication",
            category: "Architecture",
            icon: Network,
            problem: "Tight coupling between microservices through synchronous REST calls leads to failure cascades.",
            solution: "Implement message queues (RabbitMQ, Kafka) to decouple services and ensure eventual consistency.",
            difficulty: "Intermediate"
        },
        {
            title: "Database Partitioning",
            category: "Data",
            icon: Database,
            problem: "Large monolithic tables causing query performance degradation as data grows linearly.",
            solution: "Horizontal sharding or partitioning by tenant/date to distribute load and improve index efficiency.",
            difficulty: "Advanced"
        },
        {
            title: "Idempotent API Designs",
            category: "API",
            icon: Zap,
            problem: "Network retries leading to duplicate resource creation or invalid state transitions.",
            solution: "Utilize Idempotency Keys in headers to ensure requests are processed only once regardless of retries.",
            difficulty: "Beginner"
        },
        {
            title: "Circuit Breaker Pattern",
            category: "Resiliency",
            icon: ShieldCheck,
            problem: "Repetitive calls to a failing downstream service consuming system resources and causing latency.",
            solution: "Wrap service calls in a circuit breaker that fails fast when error thresholds are met.",
            difficulty: "Intermediate"
        }
    ]

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
                    <h1 className="text-5xl font-bold mb-6">Learning Architectural Patterns</h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Deep dive into common engineering pitfalls and the best practices our AI engine uses to evaluate your designs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {patterns.map((pattern, i) => (
                        <motion.div
                            key={pattern.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass p-8 rounded-[32px] gradient-border flex flex-col h-full"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="p-4 rounded-2xl bg-primary/20 border border-primary/10">
                                    <pattern.icon className="w-6 h-6 text-primary" />
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
                                        <Layers className="w-4 h-4" /> Recommended Pattern
                                    </h4>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        {pattern.solution}
                                    </p>
                                </div>
                            </div>

                            <button className="mt-10 w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm font-bold">
                                Read Full Case Study
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="mt-20 glass p-12 rounded-[40px] text-center border-dashed border-white/10">
                    <h2 className="text-3xl font-bold mb-4">Want more insights?</h2>
                    <p className="text-slate-400 mb-8">Our AI engine constantly learns from thousands of engineering papers and open source patterns.</p>
                    <button className="px-10 py-4 rounded-full bg-primary text-white font-bold hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all">
                        Submit a Pattern to Request Review
                    </button>
                </div>
            </div>
        </main>
    )
}
