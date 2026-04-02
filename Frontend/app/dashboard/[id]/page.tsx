"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Shield,
    Cpu,
    ExternalLink,
    Calendar,
    Layout,
    Loader2,
    Sparkles,
    Download,
} from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import { cn } from "@/lib/utils"
import { getDecision, Decision } from "@/lib/api"

// ─── Colour tokens ────────────────────────────────────────────────────────────
// All palette values are inlined so the file is self-contained.
// Swap any value here to re-skin the whole page.
const palette = {
    purple50: "#EEEDFE",
    purple200: "#AFA9EC",
    purple600: "#534AB7",
    purple800: "#3C3489",
    amber50: "#FAEEDA",
    amber400: "#BA7517",
    amber600: "#FAC775",
    blue50: "#E6F1FB",
    blue600: "#185FA5",
    red400: "#E24B4A",
    blue400: "#378ADD",
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function IconWrap({
    bg,
    children,
}: {
    bg: string
    children: React.ReactNode
}) {
    return (
        <div
            className="flex items-center justify-center rounded-[9px] shrink-0"
            style={{ width: 34, height: 34, background: bg }}
        >
            {children}
        </div>
    )
}

function InsightRow({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-[9px] border border-black/[0.06] bg-gray-50">
            <div
                className="flex items-center justify-center rounded-full shrink-0 mt-0.5"
                style={{ width: 20, height: 20, background: palette.purple50 }}
            >
                <CheckCircle2 size={11} color={palette.purple600} strokeWidth={2} />
            </div>
            <p className="text-[13px] text-gray-700 leading-relaxed">{text}</p>
        </div>
    )
}

function ActionItem({
    category,
    description,
}: {
    category: string
    description: string
}) {
    const isImmediate = category === "Immediate Fix"
    return (
        <div className="rounded-[9px] border border-black/[0.06] bg-gray-50 p-3">
            <div className="flex items-center gap-2 mb-1.5">
                <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: isImmediate ? palette.red400 : palette.blue400 }}
                />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    {category}
                </span>
            </div>
            <p className="text-[12px] text-gray-700 leading-snug">{description}</p>
        </div>
    )
}

function SpecBlock({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                {label}
            </p>
            <p className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-wrap bg-gray-50 border border-black/[0.06] rounded-[9px] p-3">
                {value}
            </p>
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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

    // ── Loading state ──────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <main className="min-h-screen bg-white">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[70vh]">
                    <Loader2
                        className="animate-spin mb-4"
                        size={40}
                        color={palette.purple600}
                        strokeWidth={1.5}
                    />
                    <p className="text-sm text-gray-400 tracking-wide">Fetching analysis report…</p>
                </div>
            </main>
        )
    }

    // ── Error state ────────────────────────────────────────────────────────────
    if (error || !decision) {
        return (
            <main className="min-h-screen bg-white">
                <Navbar />
                <div className="pt-32 px-6 max-w-xl mx-auto text-center">
                    <div className="border border-red-100 rounded-3xl p-12 bg-red-50/40">
                        <AlertCircle size={44} color={palette.red400} className="mx-auto mb-5" strokeWidth={1.5} />
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Decision not found</h2>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                            {error ?? "The decision report you're looking for doesn't exist or has been removed."}
                        </p>
                        <Link href="/dashboard">
                            <button className="px-7 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                Return to dashboard
                            </button>
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    const feedback = decision.ai_feedback
    const hasAIReview = decision.status === "reviewed" && feedback
    const healthScore = hasAIReview ? 100 - (feedback.high_risks * 15 || 0) : null

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-28 pb-24 px-6 max-w-[960px] mx-auto">

                {/* Back link */}
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-700 transition-colors mb-8 group"
                >
                    <ArrowLeft
                        size={14}
                        strokeWidth={1.8}
                        className="group-hover:-translate-x-0.5 transition-transform"
                    />
                    Back to dashboard
                </Link>

                {/* ── Header ──────────────────────────────────────────────── */}
                <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
                    <div className="flex-1 min-w-[260px] space-y-3">

                        {/* Pills row */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {hasAIReview && (
                                <span
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest border"
                                    style={{
                                        background: palette.amber50,
                                        color: palette.amber400,
                                        borderColor: palette.amber600,
                                    }}
                                >
                                    <span
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ background: palette.amber400 }}
                                    />
                                    {feedback.risk_level} Risk
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1.5 text-[12px] text-gray-400">
                                <Calendar size={13} strokeWidth={1.5} />
                                {new Date(decision.created_at).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                        </div>

                        <h1 className="text-[32px] md:text-[36px] font-semibold text-gray-900 leading-tight tracking-tight">
                            {decision.title}
                        </h1>
                        <p className="text-[14px] text-gray-500 leading-relaxed max-w-[540px] whitespace-pre-wrap">
                            {decision.architecture}
                        </p>
                    </div>

                    {/* Health-score badge */}
                    {healthScore !== null && (
                        <div
                            className="flex flex-col items-center justify-center rounded-[20px] text-white shrink-0"
                            style={{
                                background: `linear-gradient(135deg, ${palette.purple600}, ${palette.purple200})`,
                                width: 120,
                                height: 120,
                                gap: 4,
                            }}
                        >
                            <span className="text-[36px] font-semibold leading-none">{healthScore}</span>
                            <span className="text-[10px] font-semibold uppercase tracking-widest opacity-70">
                                Health score
                            </span>
                        </div>
                    )}
                </div>

                {/* ── Two-column grid ──────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">

                    {/* Left column */}
                    <div className="space-y-5">

                        {/* AI Insights card */}
                        {hasAIReview ? (
                            <section className="border border-black/[0.06] rounded-2xl p-6 bg-white">
                                <div className="flex items-center gap-3 mb-5">
                                    <IconWrap bg={palette.purple50}>
                                        <Shield size={15} color={palette.purple600} strokeWidth={1.8} />
                                    </IconWrap>
                                    <div>
                                        <p className="text-[14px] font-semibold text-gray-900">Strategic AI insights</p>
                                        <p className="text-[12px] text-gray-400">
                                            {feedback.insights.length} observations identified
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {feedback.insights.map((insight, i) => (
                                        <InsightRow key={i} text={insight} />
                                    ))}
                                </div>
                            </section>
                        ) : (
                            <section className="border border-black/[0.06] rounded-2xl p-6 bg-white flex flex-col items-center justify-center py-20 text-center">
                                <Sparkles size={36} color="#D1D5DB" strokeWidth={1.5} className="mb-4" />
                                <p className="text-[15px] font-semibold text-gray-900 mb-2">Analysis in progress</p>
                                <p className="text-[13px] text-gray-400 max-w-xs leading-relaxed">
                                    Our AI engine is reviewing your architectural design. This typically takes 30–60 seconds.
                                </p>
                            </section>
                        )}

                        {/* Design Specs card */}
                        <section className="border border-black/[0.06] rounded-2xl p-6 bg-white">
                            <div className="flex items-center gap-3 mb-5">
                                <IconWrap bg={palette.blue50}>
                                    <Layout size={15} color={palette.blue600} strokeWidth={1.8} />
                                </IconWrap>
                                <p className="text-[14px] font-semibold text-gray-900">Design specifications</p>
                            </div>
                            <div className="space-y-4">
                                <SpecBlock
                                    label="API design pattern"
                                    value={decision.api_design ?? "No specific API design patterns provided."}
                                />
                                <div className="border-t border-black/[0.05]" />
                                <SpecBlock
                                    label="Data models & schema"
                                    value={decision.data_model ?? "No specific data modeling details provided."}
                                />
                            </div>
                        </section>
                    </div>

                    {/* Right column */}
                    <div className="space-y-5">

                        {/* Action Plan card */}
                        {hasAIReview && feedback.action_plan && (
                            <section className="border border-black/[0.06] rounded-2xl p-5 bg-white">
                                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
                                    Action plan
                                </p>
                                <div className="space-y-2">
                                    {feedback.action_plan.map((item, i) => (
                                        <ActionItem
                                            key={i}
                                            category={item.category}
                                            description={item.description}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Tech Stack card */}
                        <section className="border border-black/[0.06] rounded-2xl p-5 bg-white">
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
                                Technology stack
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {decision.tech_choices.map((t) => (
                                    <span
                                        key={t}
                                        className="px-3 py-1 rounded-lg border border-black/[0.06] bg-gray-50 text-[12px] font-medium text-gray-600"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                            {decision.tech_stack && (
                                <p className="mt-3 pt-3 border-t border-black/[0.05] text-[11px] text-gray-400 italic leading-relaxed">
                                    {decision.tech_stack}
                                </p>
                            )}

                            {/* Export button */}
                            <button
                                className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                                style={{ background: palette.purple600 }}
                            >
                                <Download size={15} strokeWidth={2} />
                                Export PDF report
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    )
}