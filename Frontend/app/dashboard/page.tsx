"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Search, Filter, History, ChevronRight, AlertCircle, CheckCircle, Clock, ExternalLink } from "lucide-react"
import Navbar from "@/components/Navbar"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
    const reviews = [
        { id: 1, title: "E-Commerce Microservices", date: "2 hours ago", status: "Critical Risks", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", icon: AlertCircle },
        { id: 2, title: "Auth Service Refactor", date: "Yesterday", status: "Approved", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle },
        { id: 3, title: "Data Pipeline V2", date: "3 days ago", status: "Analysis Pending", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Clock },
        { id: 4, title: "Mobile API Design", date: "1 week ago", status: "Approved", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle },
        { id: 5, title: "Search Engine Integration", date: "2 weeks ago", status: "Optimizations Suggested", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: ExternalLink },
    ]

    return (
        <main className="min-h-screen bg-[#030014]">
            <Navbar />

            <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Decision History</h1>
                        <p className="text-slate-400">Manage and reference your past engineering architectural reviews.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search reviews..."
                                className="pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 transition-all text-sm w-full md:w-64"
                            />
                        </div>
                        <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                            <Filter className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Stats Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass p-6 rounded-3xl">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Summary</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 text-sm">Total Reviews</span>
                                    <span className="font-bold">42</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 text-sm">Critical Risks</span>
                                    <span className="font-bold text-rose-500">3</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 text-sm">Approved</span>
                                    <span className="font-bold text-emerald-500">35</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-6 rounded-3xl bg-primary/5 border-primary/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary/20">
                                    <History className="w-4 h-4 text-primary" />
                                </div>
                                <h3 className="font-bold text-sm">Quick Tip</h3>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Referencing past decisions helps maintain architectural consistency and avoids repeating historical mistakes.
                            </p>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="lg:col-span-3 space-y-4">
                        {reviews.map((review, i) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass p-6 rounded-3xl glass-hover flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={cn("p-4 rounded-2xl flex items-center justify-center shrink-0", review.bg, review.border)}>
                                        <review.icon className={cn("w-6 h-6", review.color)} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{review.title}</h3>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                            <span>{review.date}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                                            <span className={cn("font-medium", review.color)}>{review.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <Link href={`/dashboard/${review.id}`} className="flex-1 md:flex-none">
                                        <button className="w-full px-4 py-2 rounded-xl text-xs font-bold border border-white/5 hover:bg-white/5 transition-all">
                                            View Details
                                        </button>
                                    </Link>
                                    <Link href={`/dashboard/${review.id}`}>
                                        <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}

                        <div className="flex justify-center pt-8">
                            <button className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">
                                Load more results...
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
