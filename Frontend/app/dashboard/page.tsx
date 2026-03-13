"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, Filter, History, ChevronRight, AlertCircle, CheckCircle, Clock, ExternalLink, Loader2 } from "lucide-react"
import Navbar from "@/components/Navbar"
import { cn } from "@/lib/utils"
import { listDecisions, Decision } from "@/lib/api"

export default function DashboardPage() {
    const [decisions, setDecisions] = useState<Decision[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchDecisions = async () => {
            try {
                const data = await listDecisions()
                setDecisions(data)
            } catch (err) {
                console.error("Error fetching decisions:", err)
                setError("Failed to load decisions. Please ensure the backend is running.")
            } finally {
                setIsLoading(false)
            }
        }
        fetchDecisions()
    }, [])

    const getStatusDetails = (status: string) => {
        switch (status) {
            case "reviewed":
                return { label: "Reviewed", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle }
            case "pending":
                return { label: "Analysis Pending", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Clock }
            case "failed":
                return { label: "Analysis Failed", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", icon: AlertCircle }
            default:
                return { label: status, color: "text-slate-500", bg: "bg-slate-500/10", border: "border-slate-500/20", icon: ExternalLink }
        }
    }

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr)
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        } catch {
            return dateStr
        }
    }

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
                                    <span className="font-bold">{decisions.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 text-sm">Critical Risks</span>
                                    <span className="font-bold text-rose-500">
                                        {decisions.filter(d => d.ai_feedback?.risk_level === "High" || (d.ai_feedback?.high_risks ?? 0) > 0).length}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 text-sm">Approved</span>
                                    <span className="font-bold text-emerald-500">
                                        {decisions.filter(d => d.status === "reviewed" && d.ai_feedback?.risk_level !== "High").length}
                                    </span>
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
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[40px] border border-white/5">
                                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                                <p className="text-slate-400 text-sm">Loading your decision history...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-rose-500/5 rounded-[40px] border border-rose-500/10">
                                <AlertCircle className="w-10 h-10 text-rose-500 mb-4" />
                                <p className="text-rose-500 font-medium mb-2">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="text-xs text-slate-400 underline hover:text-white"
                                >
                                    Try again
                                </button>
                            </div>
                        ) : decisions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[40px] border border-white/5 text-center px-6">
                                <div className="p-4 rounded-full bg-white/5 mb-4">
                                    <ExternalLink className="w-8 h-8 text-slate-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No reviews found</h3>
                                <p className="text-slate-400 text-sm max-w-sm mb-8">You haven't submitted any architectural designs for review yet.</p>
                                <Link href="/review/new">
                                    <button className="px-8 py-3 rounded-2xl bg-primary text-white font-bold hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all">
                                        Start Your First Review
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            decisions.map((decision, i) => {
                                const status = getStatusDetails(decision.status)
                                return (
                                    <motion.div
                                        key={decision.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="glass p-6 rounded-3xl glass-hover flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={cn("p-4 rounded-2xl flex items-center justify-center shrink-0", status.bg, status.border)}>
                                                <status.icon className={cn("w-6 h-6", status.color)} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{decision.title}</h3>
                                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                                    <span>{formatDate(decision.created_at)}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                                                    <span className={cn("font-medium", status.color)}>{status.label}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <Link href={`/dashboard/${decision.id}`} className="flex-1 md:flex-none">
                                                <button className="w-full px-4 py-2 rounded-xl text-xs font-bold border border-white/5 hover:bg-white/5 transition-all">
                                                    View Details
                                                </button>
                                            </Link>
                                            <Link href={`/dashboard/${decision.id}`}>
                                                <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        </div>
                                    </motion.div>
                                )
                            })
                        )}

                        {!isLoading && !error && decisions.length > 0 && (
                            <div className="flex justify-center pt-8">
                                <button className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">
                                    Load more results...
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}

