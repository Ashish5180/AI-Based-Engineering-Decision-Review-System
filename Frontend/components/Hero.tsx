"use client"

import { motion } from "framer-motion"
import { ArrowRight, BrainCircuit, Sparkles, Zap, Shield } from "lucide-react"
import Link from "next/link"

export default function Hero() {
    return (
        <div className="relative pt-32 pb-20 px-6 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10 pointer-events-none" />
            <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-secondary/10 blur-[100px] rounded-full -z-10 pointer-events-none" />

            <div className="max-w-6xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8"
                >
                    <Sparkles className="w-3 h-3" />
                    <span>AI-Powered Architectural Intelligence</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1]"
                >
                    Prevent <span className="gradient-text">Costly Mistakes</span> <br />
                    Before You Write Code
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-slate-400"
                >
                    The intelligent review system that validates your engineering decisions, identifying scalability risks and anti-patterns in real-time.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="/review/new"
                        className="group px-8 py-4 rounded-full bg-primary text-white font-semibold flex items-center gap-2 hover:bg-primary/90 transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
                    >
                        Start New Review <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/dashboard"
                        className="px-8 py-4 rounded-full bg-white/5 border border-white/10 font-semibold hover:bg-white/10 transition-all"
                    >
                        View History
                    </Link>
                </motion.div>

                {/* Feature Highlights */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {[
                        { icon: BrainCircuit, title: "Deep Analysis", desc: "AI-driven reasoning engine detects complex architectural risks." },
                        { icon: Zap, title: "Instant Feedback", desc: "Get real-time insights on scalability, performance, and security." },
                        { icon: Shield, title: "Best Practices", desc: "Ensures your designs follow industry standards and patterns." }
                    ].map((feature, i) => (
                        <div key={i} className="glass p-8 rounded-3xl text-left glass-hover">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-6">
                                <feature.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
