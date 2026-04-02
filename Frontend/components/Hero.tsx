"use client"

import { motion, useMotionValue, useTransform, animate, useSpring } from "framer-motion"
import { ArrowRight, BrainCircuit, Sparkles, Zap, Shield, CheckCircle2, TrendingUp, AlertTriangle, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
    const count = useMotionValue(0)
    const rounded = useTransform(count, (v) => Math.round(v).toLocaleString() + suffix)
    useEffect(() => {
        const ctrl = animate(count, to, { duration: 2.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] as any })
        return ctrl.stop
    }, [])
    return <motion.span>{rounded}</motion.span>
}

const reviewItems = [
    { icon: CheckCircle2, color: "#059669", bg: "#D1FAE5", label: "Auth gateway", note: "Scales to 500k req/s ✓" },
    { icon: AlertTriangle, color: "#D97706", bg: "#FEF3C7", label: "Database layer", note: "N+1 query detected" },
    { icon: TrendingUp, color: "#7C3AED", bg: "#EDE9FE", label: "Cache strategy", note: "97% hit rate projected" },
]

const tags = ["Microservices", "Event Sourcing", "CQRS", "Domain-Driven", "API Gateway", "Zero Trust"]

export default function Hero() {
    const cardRef = useRef<HTMLDivElement>(null)
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const springX = useSpring(mouseX, { stiffness: 120, damping: 20 })
    const springY = useSpring(mouseY, { stiffness: 120, damping: 20 })
    const rotateX = useTransform(springY, [-150, 150], [8, -8])
    const rotateY = useTransform(springX, [-150, 150], [-8, 8])
    const [tagIdx, setTagIdx] = useState(0)

    useEffect(() => {
        const t = setInterval(() => setTagIdx(i => (i + 1) % tags.length), 1800)
        return () => clearInterval(t)
    }, [])

    function onMouseMove(e: React.MouseEvent) {
        if (!cardRef.current) return
        const r = cardRef.current.getBoundingClientRect()
        mouseX.set(e.clientX - r.left - r.width / 2)
        mouseY.set(e.clientY - r.top - r.height / 2)
    }

    function onMouseLeave() { mouseX.set(0); mouseY.set(0) }

    return (
        <section className="hero-section">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');

                .hero-section {
                    position: relative;
                    overflow: hidden;
                    background: linear-gradient(160deg, #FAFAF7 0%, #F3F0FB 40%, #EEF5FF 100%);
                    min-height: 100vh;
                    font-family: 'DM Sans', sans-serif;
                }

                .hero-serif { font-family: 'Playfair Display', serif; }

                .blob1 {
                    position: absolute; border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
                    background: radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, rgba(139,92,246,0.04) 60%, transparent 100%);
                    width: 700px; height: 700px;
                    top: -180px; right: -120px;
                    animation: morphBlob 12s ease-in-out infinite alternate;
                    pointer-events: none; z-index: 0;
                }
                .blob2 {
                    position: absolute; border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%;
                    background: radial-gradient(ellipse, rgba(59,130,246,0.09) 0%, transparent 70%);
                    width: 500px; height: 500px;
                    bottom: -100px; left: -80px;
                    animation: morphBlob 15s ease-in-out 2s infinite alternate-reverse;
                    pointer-events: none; z-index: 0;
                }
                .blob3 {
                    position: absolute; border-radius: 50%;
                    background: radial-gradient(ellipse, rgba(251,191,36,0.07) 0%, transparent 70%);
                    width: 300px; height: 300px;
                    top: 40%; left: 40%;
                    pointer-events: none; z-index: 0;
                }

                @keyframes morphBlob {
                    0%   { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
                    33%  { border-radius: 40% 60% 30% 70% / 70% 30% 60% 40%; }
                    66%  { border-radius: 70% 30% 50% 50% / 40% 60% 50% 60%; }
                    100% { border-radius: 50% 50% 40% 60% / 60% 40% 70% 30%; }
                }

                .dot-grid {
                    position: absolute; inset: 0; pointer-events: none; z-index: 0;
                    background-image: radial-gradient(circle, rgba(120,80,220,0.10) 1px, transparent 1px);
                    background-size: 32px 32px;
                    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
                }

                .stripe-band {
                    position: absolute;
                    width: 200%; height: 60px;
                    background: repeating-linear-gradient(
                        -55deg,
                        transparent, transparent 12px,
                        rgba(124,58,237,0.04) 12px, rgba(124,58,237,0.04) 14px
                    );
                    top: 38%; left: -50%; z-index: 0; pointer-events: none;
                    transform: rotate(-2deg);
                }

                .tag-pill {
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 5px 12px; border-radius: 100px;
                    background: white; border: 1px solid rgba(124,58,237,0.18);
                    font-size: 12px; font-weight: 500; color: #6D28D9;
                    box-shadow: 0 1px 6px rgba(124,58,237,0.12);
                    white-space: nowrap; font-family: 'DM Sans', sans-serif;
                }

                .badge-new {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 7px 16px 7px 8px; border-radius: 100px;
                    background: white;
                    border: 1px solid rgba(0,0,0,0.08);
                    box-shadow: 0 2px 12px rgba(0,0,0,0.06), 0 0 0 4px rgba(124,58,237,0.06);
                    font-size: 12.5px; color: #374151; font-weight: 500;
                    font-family: 'DM Sans', sans-serif;
                }

                .badge-new-inner {
                    display: flex; align-items: center; gap: 4px;
                    padding: 3px 8px; border-radius: 100px;
                    background: linear-gradient(135deg, #7C3AED, #9333EA);
                    color: white; font-size: 11px; font-weight: 600;
                    letter-spacing: 0.04em;
                }

                .btn-main {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 14px 28px; border-radius: 14px;
                    background: #1C1917; color: white;
                    font-size: 15px; font-weight: 600; font-family: 'DM Sans', sans-serif;
                    border: none; cursor: pointer; text-decoration: none;
                    box-shadow: 0 1px 0 rgba(255,255,255,0.12) inset, 0 4px 20px rgba(0,0,0,0.2);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    position: relative; overflow: hidden;
                }
                .btn-main::after {
                    content: '';
                    position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
                    transform: skewX(-20deg);
                    transition: left 0.5s ease;
                }
                .btn-main:hover { transform: translateY(-2px); box-shadow: 0 1px 0 rgba(255,255,255,0.12) inset, 0 8px 28px rgba(0,0,0,0.28); }
                .btn-main:hover::after { left: 160%; }

                .btn-ghost {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 14px 24px; border-radius: 14px;
                    background: white; color: #374151;
                    font-size: 15px; font-weight: 500; font-family: 'DM Sans', sans-serif;
                    border: 1px solid rgba(0,0,0,0.09); cursor: pointer; text-decoration: none;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
                    transition: all 0.2s ease;
                }
                .btn-ghost:hover { background: #F9FAFB; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.09); }

                .review-card-outer {
                    background: white;
                    border: 1px solid rgba(0,0,0,0.08);
                    border-radius: 24px;
                    box-shadow: 0 0 0 1px rgba(255,255,255,0.8) inset,
                                0 20px 60px rgba(0,0,0,0.1),
                                0 4px 16px rgba(124,58,237,0.08);
                    overflow: hidden;
                }

                .card-topbar {
                    padding: 13px 18px;
                    display: flex; align-items: center; justify-content: space-between;
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                    background: #FAFAFA;
                }

                .tl-dots { display: flex; gap: 6px; }
                .tld { width: 11px; height: 11px; border-radius: 50%; }

                .review-row-card {
                    padding: 12px 18px;
                    display: flex; align-items: center; gap: 12px;
                    border-bottom: 1px solid rgba(0,0,0,0.04);
                    transition: background 0.15s;
                    cursor: default;
                }
                .review-row-card:hover { background: #FAFAF8; }
                .review-row-card:last-child { border-bottom: none; }

                .score-bar-bg {
                    height: 6px; border-radius: 6px;
                    background: #F1F0EE;
                    overflow: hidden; flex: 1;
                }

                .stat-pill {
                    display: flex; flex-direction: column; align-items: center;
                    padding: 16px 20px; border-radius: 16px;
                    background: white; border: 1px solid rgba(0,0,0,0.07);
                    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
                    min-width: 90px;
                }

                .tag-strip {
                    display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
                }

                .scan-anim {
                    height: 2px; width: 100%;
                    background: linear-gradient(90deg, transparent, #7C3AED, transparent);
                    animation: scanline 2.2s linear infinite;
                }
                @keyframes scanline {
                    0%   { transform: translateX(-100%); opacity: 0; }
                    15%  { opacity: 1; }
                    85%  { opacity: 1; }
                    100% { transform: translateX(300%); opacity: 0; }
                }

                @keyframes floatCard {
                    0%, 100% { transform: translateY(0px); }
                    50%       { transform: translateY(-10px); }
                }
                .float-idle { animation: floatCard 7s ease-in-out infinite; }

                .deco-ring {
                    position: absolute; border-radius: 50%;
                    border: 1px dashed rgba(124,58,237,0.15);
                    pointer-events: none;
                }

                .accent-bar {
                    display: inline-block; width: 40px; height: 3px; border-radius: 4px;
                    background: linear-gradient(90deg, #7C3AED, #C084FC);
                    margin-bottom: 20px;
                }

                .chip-row { display: flex; gap: 8px; flex-wrap: wrap; }
                .chip {
                    display: flex; align-items: center; gap: 6px;
                    padding: 8px 14px; border-radius: 10px;
                    background: white; border: 1px solid rgba(0,0,0,0.07);
                    font-size: 13px; color: #4B5563; font-weight: 500;
                    font-family: 'DM Sans', sans-serif;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
                    transition: all 0.18s;
                }
                .chip:hover {
                    border-color: rgba(124,58,237,0.25);
                    color: #7C3AED; background: #FAF8FF;
                    box-shadow: 0 2px 10px rgba(124,58,237,0.1);
                }

                .hero-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 64px;
                    align-items: center;
                    min-height: calc(100vh - 110px);
                }

                @media (max-width: 900px) {
                    .hero-grid { grid-template-columns: 1fr; gap: 40px; }
                }
            `}</style>

            <div className="blob1" />
            <div className="blob2" />
            <div className="blob3" />
            <div className="dot-grid" />
            <div className="stripe-band" />
            <div className="deco-ring" style={{ width: 500, height: 500, top: -160, right: -160, opacity: 0.5 }} />
            <div className="deco-ring" style={{ width: 300, height: 300, top: -60, right: -60, opacity: 0.7 }} />

            <div style={{ position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
                <div className="hero-grid" style={{ paddingTop: 110 }}>

                    {/* ── LEFT ── */}
                    <div style={{ paddingBottom: 60 }}>

                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <div className="badge-new" style={{ marginBottom: 28 }}>
                                <div className="badge-new-inner">
                                    <Sparkles style={{ width: 10, height: 10 }} />
                                    NEW
                                </div>
                                AI-Powered Architectural Reviews
                            </div>
                        </motion.div>

                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.1 }} style={{ transformOrigin: "left" }}>
                            <div className="accent-bar" />
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, delay: 0.15 }}
                            className="hero-serif"
                            style={{ fontSize: "clamp(38px, 4.5vw, 62px)", lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: 22, color: "#1C1917" }}
                        >
                            Prevent{" "}
                            <span style={{ color: "#7C3AED", fontStyle: "italic", position: "relative", display: "inline-block" }}>
                                costly
                                <svg viewBox="0 0 140 12" style={{ position: "absolute", bottom: -6, left: 0, width: "100%", overflow: "visible" }}>
                                    <path d="M2 8 Q35 2 70 8 Q105 14 138 6" stroke="#C084FC" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
                                </svg>
                            </span>{" "}
                            mistakes
                            <br />
                            <span style={{ color: "#9CA3AF", fontStyle: "italic", fontWeight: 400, fontSize: "0.8em" }}>
                                before you write code
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.25 }}
                            style={{ color: "#6B7280", fontSize: 16, lineHeight: 1.75, maxWidth: 440, marginBottom: 36 }}
                        >
                            The intelligent review system that validates your engineering decisions, identifying scalability risks and anti-patterns in real-time — so your architecture is bulletproof from day one.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.32 }}
                            style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 44 }}
                        >
                            <Link href="/review/new" className="btn-main">
                                Start New Review
                                <ArrowRight style={{ width: 16, height: 16 }} />
                            </Link>
                            <Link href="/dashboard" className="btn-ghost">
                                View History
                                <ArrowUpRight style={{ width: 14, height: 14, opacity: 0.5 }} />
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.42 }}
                            style={{ display: "flex", gap: 12, marginBottom: 40 }}
                        >
                            {[
                                { value: 2847, suffix: "+", label: "Reviews" },
                                { value: 94, suffix: "%", label: "Catch rate" },
                                { value: 12, suffix: "x", label: "Faster" },
                            ].map((s) => (
                                <div key={s.label} className="stat-pill">
                                    <span className="hero-serif" style={{ fontSize: 26, fontWeight: 700, color: "#1C1917", letterSpacing: "-0.02em", lineHeight: 1 }}>
                                        <Counter to={s.value} suffix={s.suffix} />
                                    </span>
                                    <span style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500 }}>
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.55 }}
                            className="chip-row"
                        >
                            {[
                                { icon: BrainCircuit, label: "Deep Analysis" },
                                { icon: Zap, label: "Real-time" },
                                { icon: Shield, label: "Best Practices" },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="chip">
                                    <Icon style={{ width: 14, height: 14, color: "#7C3AED" }} />
                                    {label}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* ── RIGHT ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 32, y: 16 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center", paddingBottom: 60 }}
                    >
                        {/* Top tags */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="tag-strip"
                            style={{ justifyContent: "center", marginBottom: 4 }}
                        >
                            {tags.slice(0, 3).map((t, i) => (
                                <motion.div
                                    key={t}
                                    animate={{ opacity: tagIdx === i ? 1 : 0.45, scale: tagIdx === i ? 1.04 : 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="tag-pill"
                                >
                                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: tagIdx === i ? "#7C3AED" : "#C4B5FD" }} />
                                    {t}
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Card */}
                        <div
                            ref={cardRef}
                            onMouseMove={onMouseMove}
                            onMouseLeave={onMouseLeave}
                            style={{ perspective: "1000px", width: "100%", maxWidth: 420 }}
                        >
                            <motion.div
                                className="float-idle"
                                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                            >
                                <div className="review-card-outer">
                                    <div className="card-topbar">
                                        <div className="tl-dots">
                                            <div className="tld" style={{ background: "#FF5F57" }} />
                                            <div className="tld" style={{ background: "#FFBD2E" }} />
                                            <div className="tld" style={{ background: "#27C93F" }} />
                                        </div>
                                        <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500, letterSpacing: "0.04em", fontFamily: "'DM Sans', sans-serif" }}>
                                            ArchGuard · Review #2847
                                        </span>
                                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 6px #22C55E" }} />
                                            <span style={{ fontSize: 11, color: "#16A34A", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Live</span>
                                        </div>
                                    </div>

                                    <div style={{ height: 2, background: "#F3F4F6", overflow: "hidden" }}>
                                        <div className="scan-anim" />
                                    </div>

                                    <div style={{ padding: "16px 18px 8px" }}>
                                        <div style={{
                                            padding: "11px 14px", borderRadius: 10,
                                            background: "#F9F9F9", border: "1px solid #E9E7E3",
                                            fontSize: 12, fontFamily: "monospace", lineHeight: 1.7, color: "#6B7280"
                                        }}>
                                            <span style={{ color: "#7C3AED", fontWeight: 600 }}>$</span>{" "}
                                            arch review <span style={{ color: "#0F766E" }}>--service</span>{" "}
                                            <span style={{ color: "#7C3AED" }}>auth-gateway</span>
                                            <br />
                                            <span style={{ color: "#9CA3AF" }}>Analyzing patterns</span>
                                            <motion.span
                                                animate={{ opacity: [1, 0, 1] }}
                                                transition={{ duration: 0.9, repeat: Infinity }}
                                                style={{ color: "#7C3AED", marginLeft: 2 }}
                                            >▊</motion.span>
                                        </div>
                                    </div>

                                    <div style={{ padding: "8px 0 4px" }}>
                                        {reviewItems.map(({ icon: Icon, color, bg, label, note }, i) => (
                                            <motion.div
                                                key={label}
                                                className="review-row-card"
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.4, delay: 1 + i * 0.18 }}
                                            >
                                                <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <Icon style={{ width: 15, height: 15, color }} />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
                                                    <div style={{ fontSize: 11.5, color: "#9CA3AF", marginTop: 1, fontFamily: "'DM Sans', sans-serif" }}>{note}</div>
                                                </div>
                                                <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div style={{ padding: "14px 18px", background: "#FAFAFA", borderTop: "1px solid rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
                                        <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>Architecture score</span>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                                            <div className="score-bar-bg">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "82%" }}
                                                    transition={{ duration: 1.4, delay: 1.5, ease: [0.16, 1, 0.3, 1] as any }}
                                                    style={{ height: "100%", borderRadius: 6, background: "linear-gradient(90deg, #7C3AED, #C084FC)" }}
                                                />
                                            </div>
                                            <span className="hero-serif" style={{ fontSize: 15, fontWeight: 700, color: "#7C3AED", flexShrink: 0 }}>82</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Bottom tags */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className="tag-strip"
                            style={{ justifyContent: "center", marginTop: 4 }}
                        >
                            {tags.slice(3).map((t, i) => (
                                <motion.div
                                    key={t}
                                    animate={{ opacity: tagIdx === i + 3 ? 1 : 0.45, scale: tagIdx === i + 3 ? 1.04 : 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="tag-pill"
                                >
                                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: tagIdx === i + 3 ? "#7C3AED" : "#C4B5FD" }} />
                                    {t}
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}