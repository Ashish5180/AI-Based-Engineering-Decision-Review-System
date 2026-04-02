"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    BookOpen, Code2, Layers, Network, Database,
    ShieldCheck, Zap, Sparkles, Loader2, X, CheckCircle2,
} from "lucide-react"
import Navbar from "@/components/Navbar"
import { listPatterns, tailorPattern, Pattern, PatternTailoredResponse } from "@/lib/api"
import MarkdownRenderer from "@/components/MarkdownRenderer"

// ─── Palette ──────────────────────────────────────────────────────────────────
const p = {
    purple50: "#EEEDFE",
    purple100: "#CECBF6",
    purple200: "#AFA9EC",
    purple600: "#534AB7",
    purple800: "#3C3489",
    green50: "#EAF3DE",
    green600: "#3B6D11",
    red50: "#FCEBEB",
    red600: "#A32D2D",
    amber50: "#FAEEDA",
    amber600: "#854F0B",
    blue50: "#E6F1FB",
    blue600: "#185FA5",
}

const iconMap: Record<string, React.ElementType> = {
    Network, Database, Zap, ShieldCheck,
}

// ─── Difficulty badge ─────────────────────────────────────────────────────────
function DifficultyBadge({ level }: { level: string }) {
    const styles: Record<string, { bg: string; color: string; border: string }> = {
        Beginner: { bg: p.green50, color: p.green600, border: "#C0DD97" },
        Intermediate: { bg: p.amber50, color: p.amber600, border: "#FAC775" },
        Advanced: { bg: p.red50, color: p.red600, border: "#F7C1C1" },
    }
    const s = styles[level] ?? styles.Intermediate
    return (
        <span
            className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest border"
            style={{ background: s.bg, color: s.color, borderColor: s.border }}
        >
            {level}
        </span>
    )
}

// ─── Pattern Card ─────────────────────────────────────────────────────────────
function PatternCard({
    pattern,
    index,
    onSelect,
}: {
    pattern: Pattern
    index: number
    onSelect: (p: Pattern) => void
}) {
    const Icon = iconMap[pattern.icon] ?? Network
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            className="flex flex-col h-full bg-white border border-black/[0.06] rounded-2xl p-6 hover:border-black/[0.12] hover:shadow-sm transition-all group"
        >
            {/* Icon + badge row */}
            <div className="flex items-start justify-between mb-6">
                <div
                    className="flex items-center justify-center rounded-xl transition-all group-hover:opacity-90"
                    style={{ width: 44, height: 44, background: p.purple50, border: `0.5px solid ${p.purple100}` }}
                >
                    <Icon size={20} color={p.purple600} strokeWidth={1.8} />
                </div>
                <DifficultyBadge level={pattern.difficulty} />
            </div>

            <h3 className="text-[18px] font-semibold text-gray-900 mb-1 leading-snug">{pattern.title}</h3>
            <p
                className="text-[11px] font-semibold uppercase tracking-widest mb-5"
                style={{ color: p.purple600 }}
            >
                {pattern.category}
            </p>

            <div className="space-y-4 flex-grow">
                {/* Problem */}
                <div>
                    <p className="flex items-center gap-1.5 text-[12px] font-semibold mb-2" style={{ color: p.red600 }}>
                        <Code2 size={13} strokeWidth={2} /> The problem
                    </p>
                    <p
                        className="text-[13px] text-gray-500 leading-relaxed italic border-l-2 pl-3"
                        style={{ borderColor: "#F7C1C1" }}
                    >
                        "{pattern.problem}"
                    </p>
                </div>

                {/* Solution */}
                <div>
                    <p className="flex items-center gap-1.5 text-[12px] font-semibold mb-2" style={{ color: p.green600 }}>
                        <Layers size={13} strokeWidth={2} /> Recommended solution
                    </p>
                    <p className="text-[13px] text-gray-600 leading-relaxed">{pattern.solution}</p>
                </div>
            </div>

            <button
                onClick={() => onSelect(pattern)}
                className="mt-8 w-full py-3 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 border transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                    background: p.purple50,
                    color: p.purple600,
                    borderColor: p.purple100,
                }}
            >
                <Sparkles size={14} strokeWidth={2} /> Tailor to my tech stack
            </button>
        </motion.div>
    )
}

// ─── Best-practice card ───────────────────────────────────────────────────────
function BestPracticeCard({ text, index }: { text: string; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            className="flex gap-3 p-4 rounded-xl border border-black/[0.06] bg-gray-50 hover:border-green-200 transition-colors"
        >
            <div
                className="flex items-center justify-center rounded-full shrink-0 mt-0.5"
                style={{ width: 20, height: 20, background: p.green50, border: `0.5px solid #C0DD97` }}
            >
                <CheckCircle2 size={11} color={p.green600} strokeWidth={2} />
            </div>
            <MarkdownRenderer content={text} className="text-[13px] text-gray-600 leading-relaxed" />
        </motion.div>
    )
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function TailorModal({
    pattern,
    onClose,
}: {
    pattern: Pattern
    onClose: () => void
}) {
    const [techStack, setTechStack] = useState("")
    const [tailoring, setTailoring] = useState(false)
    const [result, setResult] = useState<PatternTailoredResponse | null>(null)

    const handleTailor = async () => {
        if (!techStack) return
        setTailoring(true)
        setResult(null)
        try {
            const data = await tailorPattern(pattern.id, techStack)
            setResult(data)
        } catch (err) {
            console.error("Tailoring failed:", err)
            alert("Pattern tailoring failed. Please ensure the backend is running.")
        } finally {
            setTailoring(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />

            {/* Sheet */}
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="relative w-full max-w-3xl bg-white rounded-3xl border border-black/[0.07] shadow-xl max-h-[92vh] overflow-y-auto"
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 transition-colors z-20"
                >
                    <X size={18} color="#9CA3AF" strokeWidth={2} />
                </button>

                <div className="p-7 md:p-10">
                    {/* Modal header */}
                    <div className="mb-7 pb-7 border-b border-black/[0.06]">
                        <div
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-4 border"
                            style={{ background: p.purple50, color: p.purple600, borderColor: p.purple100 }}
                        >
                            <Sparkles size={11} strokeWidth={2} /> AI Implementation Assistant
                        </div>
                        <h2 className="text-[26px] font-semibold text-gray-900 leading-tight tracking-tight mb-2">
                            Tailor: {pattern.title}
                        </h2>
                        <p className="text-[14px] text-gray-500 leading-relaxed max-w-lg">
                            Adapt this pattern to your specific technology stack with bespoke AI architectural analysis.
                        </p>
                    </div>

                    {/* Input row */}
                    <div className="mb-8">
                        <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2.5">
                            Your tech stack
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                value={techStack}
                                onChange={(e) => setTechStack(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleTailor()}
                                placeholder="e.g. Next.js, FastAPI, PostgreSQL, Redis"
                                className="flex-grow border border-black/[0.1] rounded-xl px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-purple-300 transition-colors font-mono"
                            />
                            <button
                                disabled={!techStack || tailoring}
                                onClick={handleTailor}
                                className="px-6 py-3 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] shrink-0"
                                style={{ background: p.purple600 }}
                            >
                                {tailoring ? (
                                    <><Loader2 size={15} className="animate-spin" /> Analysing…</>
                                ) : (
                                    <><Sparkles size={14} strokeWidth={2} /> Tailor pattern</>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Result */}
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-10"
                            >
                                {/* Implementation */}
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div
                                            className="flex items-center justify-center rounded-xl"
                                            style={{ width: 36, height: 36, background: p.purple50, border: `0.5px solid ${p.purple100}` }}
                                        >
                                            <Code2 size={16} color={p.purple600} strokeWidth={1.8} />
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-semibold text-gray-900">Implementation strategy</p>
                                            <p className="text-[12px] text-gray-400">Tailored for your stack</p>
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-black/[0.06] bg-gray-50 p-4">
                                        <MarkdownRenderer content={result.implementation} />
                                    </div>
                                </div>

                                {/* Best practices */}
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div
                                            className="flex items-center justify-center rounded-xl"
                                            style={{ width: 36, height: 36, background: p.green50, border: `0.5px solid #C0DD97` }}
                                        >
                                            <CheckCircle2 size={16} color={p.green600} strokeWidth={1.8} />
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-semibold text-gray-900">Architecture guidelines</p>
                                            <p className="text-[12px] text-gray-400">Critical best practices for performance & scalability</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {result.best_practices.map((bp, i) => (
                                            <BestPracticeCard key={i} text={bp} index={i} />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PatternsPage() {
    const [patterns, setPatterns] = useState<Pattern[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null)

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

    return (
        <main style={{ minHeight: "100vh", background: "linear-gradient(160deg,#FAFAF7 0%,#F3F0FB 45%,#EEF5FF 100%)", fontFamily: "'DM Sans',sans-serif" }}>
            <Navbar />

            <div className="pt-28 pb-24 px-6 max-w-6xl mx-auto">

                {/* ── Hero ──────────────────────────────────────────────── */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold uppercase tracking-widest mb-6 border"
                        style={{ background: p.purple50, color: p.purple600, borderColor: p.purple100 }}
                    >
                        <BookOpen size={13} strokeWidth={2} /> Engineering Knowledge Base
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="text-[40px] md:text-[52px] font-semibold text-gray-900 tracking-tight leading-tight mb-5"
                    >
                        Architectural Patterns
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-[16px] text-gray-500 max-w-xl mx-auto leading-relaxed"
                    >
                        Explore common engineering pitfalls and get{" "}
                        <span className="font-semibold text-gray-800">AI-tailored implementation advice</span>{" "}
                        for your tech stack.
                    </motion.p>
                </div>

                {/* ── Grid / Loading ────────────────────────────────────── */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2
                            size={36}
                            className="animate-spin mb-4"
                            color={p.purple600}
                            strokeWidth={1.5}
                        />
                        <p className="text-[14px] text-gray-400">Consulting the knowledge base…</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {patterns.map((pattern, i) => (
                            <PatternCard
                                key={pattern.id}
                                pattern={pattern}
                                index={i}
                                onSelect={(p) => setSelectedPattern(p)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Modal ─────────────────────────────────────────────────── */}
            <AnimatePresence>
                {selectedPattern && (
                    <TailorModal
                        pattern={selectedPattern}
                        onClose={() => setSelectedPattern(null)}
                    />
                )}
            </AnimatePresence>
        </main>
    )
}