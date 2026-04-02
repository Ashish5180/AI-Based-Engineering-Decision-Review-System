"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Send, Layout, Database, Network, Cpu,
    CheckCircle2, ChevronRight, AlertTriangle,
    Sparkles, Loader2, RefreshCcw, Bell,
} from "lucide-react"
import Navbar from "@/components/Navbar"
import { cn } from "@/lib/utils"
import { createDecision, Decision, CreateDecisionRequest } from "@/lib/api"
import Link from "next/link"

const NOTIF_SOUND = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"

// ─── Palette ──────────────────────────────────────────────────────────────────
const p = {
    purple50: "#EEEDFE",
    purple100: "#CECBF6",
    purple200: "#AFA9EC",
    purple600: "#534AB7",
    purple800: "#3C3489",
    green50: "#EAF3DE",
    green100: "#C0DD97",
    green600: "#3B6D11",
    amber50: "#FAEEDA",
    amber100: "#FAC775",
    amber600: "#854F0B",
    red50: "#FCEBEB",
    red100: "#F7C1C1",
    red600: "#A32D2D",
    blue50: "#E6F1FB",
    blue100: "#B5D4F4",
    blue600: "#185FA5",
}

// ─── Step config ──────────────────────────────────────────────────────────────
const STEPS = [
    { id: 1, name: "Architecture", icon: Layout },
    { id: 2, name: "API Design", icon: Network },
    { id: 3, name: "Data Model", icon: Database },
    { id: 4, name: "Tech Stack", icon: Cpu },
]

const TECH_CHOICES = [
    "Microservices", "Serverless", "Event-Driven",
    "Monolithic", "Cloud Native", "On-Premise",
]

// ─── Field components ─────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
            {children}
        </p>
    )
}

const inputCls =
    "w-full border border-black/[0.1] rounded-xl px-4 py-3 text-[13px] text-gray-800 " +
    "placeholder:text-gray-300 focus:outline-none focus:border-purple-300 transition-colors bg-white"

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepDots({ current }: { current: number }) {
    return (
        <div className="flex items-center gap-2">
            {STEPS.map((s) => (
                <div
                    key={s.id}
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                        width: current === s.id ? 28 : 8,
                        background: current >= s.id ? p.purple600 : "#E5E7EB",
                    }}
                />
            ))}
        </div>
    )
}

// ─── Result metric card ───────────────────────────────────────────────────────
function MetricCard({
    icon: Icon,
    label,
    value,
    sub,
    accent,
}: {
    icon: React.ElementType
    label: string
    value: string | number
    sub: string
    accent: { bg: string; border: string; icon: string; text: string }
}) {
    return (
        <div
            className="bg-white rounded-2xl border p-5 flex flex-col gap-3"
            style={{ borderColor: accent.border, borderLeftWidth: 3 }}
        >
            <div className="flex items-center gap-2">
                <div
                    className="flex items-center justify-center rounded-lg"
                    style={{ width: 32, height: 32, background: accent.bg }}
                >
                    <Icon size={15} color={accent.icon} strokeWidth={1.8} />
                </div>
                <p className="text-[12px] font-semibold text-gray-500">{label}</p>
            </div>
            <p className="text-[28px] font-semibold leading-none" style={{ color: accent.text }}>
                {value}
            </p>
            <p className="text-[12px] text-gray-400">{sub}</p>
        </div>
    )
}

// ─── Action plan card ─────────────────────────────────────────────────────────
function ActionCard({ category, description }: { category: string; description: string }) {
    const isImmediate = category === "Immediate Fix"
    const style = isImmediate
        ? { bg: p.red50, border: p.red100, color: p.red600 }
        : { bg: p.blue50, border: p.blue100, color: p.blue600 }
    return (
        <div
            className="p-4 rounded-xl border"
            style={{ background: style.bg, borderColor: style.border }}
        >
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: style.color }}>
                {category}
            </p>
            <p className="text-[13px] text-gray-600 leading-relaxed">{description}</p>
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NewReviewPage() {
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisPhase, setAnalysisPhase] = useState(0)
    const [result, setResult] = useState<Decision | null>(null)
    const [showToast, setShowToast] = useState(false)
    const [formData, setFormData] = useState<CreateDecisionRequest>({
        title: "",
        architecture: "",
        api_design: "",
        data_model: "",
        tech_stack: "",
        tech_choices: [],
    })

    const playSound = () => {
        try {
            const audio = new Audio(NOTIF_SOUND)
            audio.volume = 0.4
            audio.play().catch(e => console.warn("Sound blocked by browser:", e))
        } catch(e) { console.warn("Failed to play sound:", e) }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const toggleTechChoice = (tech: string) => {
        setFormData(prev => ({
            ...prev,
            tech_choices: prev.tech_choices.includes(tech)
                ? prev.tech_choices.filter(t => t !== tech)
                : [...prev.tech_choices, tech],
        }))
    }

    const ANALYSIS_PHASES = [
        { title: "Analyzing Architecture", sub: "Exploring components and patterns...", icon: Layout },
        { title: "Reviewing API Design", sub: "Checking protocols and authentication...", icon: Network },
        { title: "Scaling Assessment", sub: "Testing traffic volume scenarios...", icon: Database },
        { title: "Optimizing Tech Stack", sub: "Refining resource allocation...", icon: Cpu },
        { title: "Finalizing Report", sub: "Polishing architectural insights...", icon: Sparkles },
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title) { alert("Please provide a project title."); setStep(1); return }
        
        setIsSubmitting(true)
        setIsAnalyzing(true)
        setAnalysisPhase(0)

        // Mock several phases for premium feel even if API is super fast
        const phaseInterval = setInterval(() => {
            setAnalysisPhase(prev => (prev < ANALYSIS_PHASES.length - 1 ? prev + 1 : prev))
        }, 800)

        try {
            const [data] = await Promise.all([
                createDecision(formData),
                new Promise(resolve => setTimeout(resolve, 4000)) // Min 4s for premium feel
            ])
            
            clearInterval(phaseInterval)
            setAnalysisPhase(ANALYSIS_PHASES.length - 1)
            
            // Short delay after final phase before showing result
            setTimeout(() => {
                setResult(data)
                setIsAnalyzing(false)
                setIsSubmitting(false)
                playSound()
                setShowToast(true)
                setTimeout(() => setShowToast(false), 5000)
            }, 600)

        } catch (err) {
            clearInterval(phaseInterval)
            console.error("Submission failed:", err)
            alert("Failed to submit review. Please ensure the backend is running.")
            setIsAnalyzing(false)
            setIsSubmitting(false)
        }
    }

    // ── Results view ───────────────────────────────────────────────────────────
    if (result) {
        return (
        <main style={{ minHeight: "100vh", background: "linear-gradient(160deg,#FAFAF7 0%,#F3F0FB 45%,#EEF5FF 100%)", fontFamily: "'DM Sans',sans-serif" }}>
                <Navbar />
                <div className="pt-28 pb-24 px-6 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Results header */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <h2 className="text-[32px] font-semibold text-gray-900 tracking-tight">
                                Analysis results
                            </h2>
                            <span
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold border"
                                style={{ background: p.green50, color: p.green600, borderColor: p.green100 }}
                            >
                                <CheckCircle2 size={13} strokeWidth={2} /> Review complete
                            </span>
                        </div>

                        {/* Metric cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <MetricCard
                                icon={AlertTriangle}
                                label="High risks"
                                value={result.ai_feedback?.high_risks ?? 0}
                                sub="Potential bottlenecks detected"
                                accent={{ bg: p.amber50, border: p.amber100, icon: p.amber600, text: p.amber600 }}
                            />
                            <MetricCard
                                icon={Network}
                                label="Scalability"
                                value={result.ai_feedback?.scalability ?? "In Beta"}
                                sub="Growth potential analysis"
                                accent={{ bg: p.blue50, border: p.blue100, icon: p.blue600, text: p.blue600 }}
                            />
                            <MetricCard
                                icon={CheckCircle2}
                                label="Review status"
                                value={result.status}
                                sub="Final decision outcome"
                                accent={{ bg: p.green50, border: p.green100, icon: p.green600, text: p.green600 }}
                            />
                        </div>

                        {/* Insights + action plan */}
                        <div className="bg-white border border-black/[0.06] rounded-2xl p-6 space-y-7">

                            {/* Key insights */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div
                                        className="flex items-center justify-center rounded-xl"
                                        style={{ width: 34, height: 34, background: p.purple50 }}
                                    >
                                        <Sparkles size={15} color={p.purple600} strokeWidth={1.8} />
                                    </div>
                                    <p className="text-[15px] font-semibold text-gray-900">Key insights</p>
                                </div>
                                <div className="space-y-2">
                                    {result.ai_feedback?.insights.length ? (
                                        result.ai_feedback.insights.map((insight, i) => (
                                            <div
                                                key={i}
                                                className="flex items-start gap-3 p-3 rounded-xl border border-black/[0.05] bg-gray-50"
                                            >
                                                <span
                                                    className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                                                    style={{ background: p.purple600 }}
                                                />
                                                <p className="text-[13px] text-gray-600 leading-relaxed">{insight}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[13px] text-gray-400 italic">No specific insights generated yet.</p>
                                    )}
                                </div>
                            </div>

                            {/* Action plan */}
                            {result.ai_feedback?.action_plan && (
                                <div className="pt-6 border-t border-black/[0.05]">
                                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
                                        Suggested action plan
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {result.ai_feedback.action_plan.map((item, i) => (
                                            <ActionCard key={i} category={item.category} description={item.description} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CTA row */}
                            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-black/[0.05]">
                                <button
                                    onClick={() => { setResult(null); setStep(1) }}
                                    className="w-full sm:w-auto px-6 py-3 rounded-xl border border-black/[0.1] text-[13px] font-semibold text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                                >
                                    <RefreshCcw size={14} strokeWidth={2} /> New review
                                </button>
                                <Link href={`/dashboard/${result.id}`} className="w-full sm:w-auto">
                                    <button
                                        className="w-full px-6 py-3 rounded-xl text-[13px] font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                                        style={{ background: p.purple600 }}
                                    >
                                        View full report <ChevronRight size={14} strokeWidth={2} />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        )
    }

    // ── Form view ──────────────────────────────────────────────────────────────
    const currentStep = STEPS[step - 1]
    const StepIcon = currentStep.icon

    return (
        <main style={{ minHeight: "100vh", background: "linear-gradient(160deg,#FAFAF7 0%,#F3F0FB 45%,#EEF5FF 100%)", fontFamily: "'DM Sans',sans-serif" }}>
            <Navbar />

            <div className="pt-28 pb-24 px-6 max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-black/[0.07] rounded-3xl shadow-sm overflow-hidden"
                >
                    {/* Form header */}
                    <div
                        className="px-8 pt-8 pb-7 border-b border-black/[0.06]"
                        style={{ background: p.purple50 }}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-3 border"
                                    style={{ background: "white", color: p.purple600, borderColor: p.purple100 }}
                                >
                                    <StepIcon size={11} strokeWidth={2} />
                                    Step {step} of 4 — {currentStep.name}
                                </div>
                                <h1 className="text-[26px] font-semibold text-gray-900 tracking-tight">
                                    New engineering review
                                </h1>
                                <p className="text-[13px] text-gray-500 mt-1">
                                    Submit your design details for AI architectural analysis.
                                </p>
                            </div>
                            <StepDots current={step} />
                        </div>
                    </div>

                    {/* Step tabs */}
                    <div className="flex border-b border-black/[0.06]">
                        {STEPS.map((s) => {
                            const Icon = s.icon
                            const active = step === s.id
                            const done = step > s.id
                            return (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => step > s.id && setStep(s.id)}
                                    className="flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-semibold uppercase tracking-wider transition-colors"
                                    style={{
                                        color: active ? p.purple600 : done ? p.purple200 : "#9CA3AF",
                                        borderBottom: active ? `2px solid ${p.purple600}` : "2px solid transparent",
                                        cursor: done ? "pointer" : "default",
                                    }}
                                >
                                    <Icon size={14} strokeWidth={active ? 2.2 : 1.8} />
                                    <span className="hidden sm:block">{s.name}</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Form body */}
                    <form 
                        onSubmit={handleSubmit}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && step < 4) {
                                e.preventDefault()
                                setStep(s => s + 1)
                            }
                        }}
                    >
                        <div className="px-8 py-8 min-h-[340px] relative">
                            <AnimatePresence mode="wait">
                                {isAnalyzing ? (
                                    <motion.div
                                        key="analyzing"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        className="flex flex-col items-center justify-center py-12 text-center"
                                    >
                                        <div className="relative mb-12">
                                            {/* Pulsing base */}
                                            <motion.div 
                                                className="absolute inset-0 bg-purple-100 rounded-full blur-2xl"
                                                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                                                transition={{ duration: 3, repeat: Infinity }}
                                            />
                                            
                                            {/* Spinning outer ring */}
                                            <svg className="w-40 h-40 transform -rotate-90">
                                                <circle
                                                    cx="80"
                                                    cy="80"
                                                    r="70"
                                                    stroke={p.purple100}
                                                    strokeWidth="4"
                                                    fill="none"
                                                />
                                                <motion.circle
                                                    cx="80"
                                                    cy="80"
                                                    r="70"
                                                    stroke={p.purple600}
                                                    strokeWidth="4"
                                                    fill="none"
                                                    strokeDasharray="440"
                                                    initial={{ strokeDashoffset: 440 }}
                                                    animate={{ strokeDashoffset: 440 - (440 * (analysisPhase + 1)) / ANALYSIS_PHASES.length }}
                                                    transition={{ duration: 0.8 }}
                                                />
                                            </svg>
                                            
                                            {/* Central icon */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={analysisPhase}
                                                        initial={{ opacity: 0, y: 10, rotate: -20 }}
                                                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                                                        exit={{ opacity: 0, y: -10, rotate: 20 }}
                                                    >
                                                        {(() => {
                                                            const Icon = ANALYSIS_PHASES[analysisPhase].icon
                                                            return <Icon className="w-12 h-12" style={{ color: p.purple600 }} strokeWidth={1.5} />
                                                        })()}
                                                    </motion.div>
                                                </AnimatePresence>
                                            </div>

                                            {/* Floating mini icons */}
                                            {[Network, Cpu, Sparkles, Database].map((Icon, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    className="absolute p-2 rounded-xl bg-white border border-black/[0.05] shadow-sm"
                                                    animate={{ 
                                                        y: [0, -10, 0],
                                                        x: [0, idx % 2 === 0 ? 5 : -5, 0],
                                                        rotate: [0, 10, -10, 0]
                                                    }}
                                                    transition={{ 
                                                        duration: 3 + idx, 
                                                        repeat: Infinity,
                                                        delay: idx * 0.5
                                                    }}
                                                    style={{
                                                        top: idx === 0 ? '-10%' : idx === 1 ? '70%' : 'auto',
                                                        bottom: idx === 2 ? '-10%' : idx === 3 ? '20%' : 'auto',
                                                        left: idx === 0 ? '0%' : idx === 2 ? '80%' : 'auto',
                                                        right: idx === 1 ? '0%' : idx === 3 ? '85%' : 'auto',
                                                    }}
                                                >
                                                    <Icon size={14} style={{ color: idx % 2 === 0 ? p.purple600 : p.blue600 }} />
                                                </motion.div>
                                            ))}
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-[20px] font-semibold text-gray-900">
                                                {ANALYSIS_PHASES[analysisPhase].title}
                                            </h3>
                                            <p className="text-[14px] text-gray-500">
                                                {ANALYSIS_PHASES[analysisPhase].sub}
                                            </p>
                                        </div>

                                        <div className="mt-8 flex items-center gap-1">
                                            {[0, 1, 2, 3, 4].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    className="w-1.5 h-1.5 rounded-full"
                                                    style={{ background: i <= analysisPhase ? p.purple600 : p.purple100 }}
                                                    animate={i === analysisPhase ? { scale: [1, 1.5, 1] } : {}}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <>
                                        {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -16 }}
                                        transition={{ duration: 0.18 }}
                                        className="space-y-5"
                                    >
                                        <div>
                                            <Label>Project title</Label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Next-Gen Real-time Analytics System"
                                                className={inputCls}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label>Architecture description</Label>
                                            <textarea
                                                rows={7}
                                                name="architecture"
                                                value={formData.architecture}
                                                onChange={handleInputChange}
                                                placeholder="Describe the overall system architecture, service communication patterns, and high-level components…"
                                                className={cn(inputCls, "resize-none")}
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -16 }}
                                        transition={{ duration: 0.18 }}
                                    >
                                        <Label>API design & patterns</Label>
                                        <textarea
                                            rows={10}
                                            name="api_design"
                                            value={formData.api_design}
                                            onChange={handleInputChange}
                                            placeholder="Define major endpoints, authentication strategies, and communication protocols (REST, GraphQL, gRPC)…"
                                            className={cn(inputCls, "resize-none")}
                                        />
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -16 }}
                                        transition={{ duration: 0.18 }}
                                    >
                                        <Label>Data models & schema</Label>
                                        <textarea
                                            rows={10}
                                            name="data_model"
                                            value={formData.data_model}
                                            onChange={handleInputChange}
                                            placeholder="Describe key entities, relationships, and indexing strategies…"
                                            className={cn(inputCls, "resize-none")}
                                        />
                                    </motion.div>
                                )}

                                {step === 4 && (
                                    <motion.div
                                        key="step4"
                                        initial={{ opacity: 0, x: 16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -16 }}
                                        transition={{ duration: 0.18 }}
                                        className="space-y-5"
                                    >
                                        <div>
                                            <Label>Architecture style</Label>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                                {TECH_CHOICES.map((tech) => {
                                                    const selected = formData.tech_choices.includes(tech)
                                                    return (
                                                        <button
                                                            key={tech}
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                toggleTechChoice(tech);
                                                            }}
                                                            className="flex items-center gap-2.5 p-3 rounded-xl border text-[13px] font-medium transition-all text-left"
                                                            style={{
                                                                background: selected ? p.purple50 : "white",
                                                                borderColor: selected ? p.purple200 : "#E5E7EB",
                                                                color: selected ? p.purple600 : "#6B7280",
                                                            }}
                                                        >
                                                            <span
                                                                className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                                                                style={{
                                                                    borderColor: selected ? p.purple600 : "#D1D5DB",
                                                                    background: selected ? p.purple600 : "white",
                                                                }}
                                                            >
                                                                {selected && (
                                                                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                                                        <polyline points="1,4 3,6.5 7,1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                )}
                                                            </span>
                                                            {tech}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Additional tech stack details</Label>
                                            <input
                                                type="text"
                                                name="tech_stack"
                                                value={formData.tech_stack}
                                                onChange={handleInputChange}
                                                placeholder="Language, database, cloud provider…"
                                                className={inputCls}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                                </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer nav */}
                        {!isAnalyzing && (
                            <div className="flex items-center justify-between px-8 pb-8 pt-2 border-t border-black/[0.05]">
                            <button
                                type="button"
                                onClick={() => setStep(Math.max(1, step - 1))}
                                className={cn(
                                    "px-5 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors border border-transparent hover:border-black/[0.07]",
                                    step === 1 && "invisible"
                                )}
                            >
                                Back
                            </button>

                            {step < 4 ? (
                                <button
                                    type="button"
                                    onClick={() => setStep(step + 1)}
                                    className="px-6 py-2.5 rounded-xl border text-[13px] font-semibold flex items-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                                    style={{ background: p.purple50, color: p.purple600, borderColor: p.purple100 }}
                                >
                                    Next step <ChevronRight size={15} strokeWidth={2} />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !formData.title}
                                    className="px-7 py-2.5 rounded-xl text-[13px] font-semibold text-white flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
                                    style={{ background: p.purple600 }}
                                >
                                    {isSubmitting ? (
                                        <><Loader2 size={14} className="animate-spin" /> Analysing…</>
                                    ) : (
                                        <><Send size={14} strokeWidth={2} /> Analyse design</>
                                    )}
                                </button>
                            )}
                        </div>
                        )}
                    </form>
                </motion.div>
            </div>
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-[24px] bg-white border border-violet-100 shadow-[0_20px_50px_rgba(124,58,237,0.15)] flex items-center gap-4 min-w-[320px]"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center border border-violet-100">
                            <Bell className="w-6 h-6 text-violet-600 animate-pulse" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">Analysis Complete</p>
                            <p className="text-[11px] text-slate-500 font-medium">Your architectural review is ready.</p>
                        </div>
                        <button 
                            onClick={() => setShowToast(false)}
                            className="ml-auto p-1 text-slate-300 hover:text-slate-600 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}