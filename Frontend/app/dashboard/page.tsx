"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    Search, Filter, History, ChevronRight,
    AlertCircle, CheckCircle, Clock,
    ExternalLink, Loader2, Plus, TrendingUp,
    BarChart3, ShieldCheck,
} from "lucide-react"
import Navbar from "@/components/Navbar"
import { listDecisions, Decision } from "@/lib/api"

export default function DashboardPage() {
    const [decisions, setDecisions] = useState<Decision[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

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
                return {
                    label: "Reviewed", color: "#059669",
                    bg: "#D1FAE5", border: "rgba(5,150,105,0.2)",
                    icon: CheckCircle,
                }
            case "pending":
                return {
                    label: "Analysis Pending", color: "#D97706",
                    bg: "#FEF3C7", border: "rgba(217,119,6,0.2)",
                    icon: Clock,
                }
            case "failed":
                return {
                    label: "Analysis Failed", color: "#DC2626",
                    bg: "#FEE2E2", border: "rgba(220,38,38,0.2)",
                    icon: AlertCircle,
                }
            default:
                return {
                    label: status, color: "#6B7280",
                    bg: "#F3F4F6", border: "rgba(107,114,128,0.2)",
                    icon: ExternalLink,
                }
        }
    }

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr)
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        } catch {
            return dateStr
        }
    }

    const filteredDecisions = decisions.filter(d =>
        !searchQuery || d.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalReviews = decisions.length
    const criticalRisks = decisions.filter(
        d => d.ai_feedback?.risk_level === "High" || (d.ai_feedback?.high_risks ?? 0) > 0
    ).length
    const approved = decisions.filter(
        d => d.status === "reviewed" && d.ai_feedback?.risk_level !== "High"
    ).length

    return (
        <main style={{ minHeight: "100vh", background: "linear-gradient(160deg,#FAFAF7 0%,#F3F0FB 45%,#EEF5FF 100%)", fontFamily: "'DM Sans',sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

                .dash-serif { font-family: 'Playfair Display', serif; }

                /* Page blobs */
                .dash-blob1 {
                    position: fixed; pointer-events: none; z-index: 0;
                    width: 600px; height: 600px; border-radius: 50%;
                    background: radial-gradient(ellipse, rgba(139,92,246,0.10) 0%, transparent 70%);
                    top: -200px; right: -150px;
                    animation: blobDrift 14s ease-in-out infinite alternate;
                }
                .dash-blob2 {
                    position: fixed; pointer-events: none; z-index: 0;
                    width: 400px; height: 400px; border-radius: 50%;
                    background: radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%);
                    bottom: -100px; left: -80px;
                    animation: blobDrift 18s ease-in-out 3s infinite alternate-reverse;
                }
                @keyframes blobDrift {
                    0%   { transform: translate(0,0) scale(1); }
                    100% { transform: translate(30px,20px) scale(1.08); }
                }

                /* Dot grid */
                .dash-dots {
                    position: fixed; inset: 0; pointer-events: none; z-index: 0;
                    background-image: radial-gradient(circle, rgba(120,80,220,0.08) 1px, transparent 1px);
                    background-size: 28px 28px;
                    mask-image: radial-gradient(ellipse 90% 90% at 50% 30%, black 20%, transparent 100%);
                }

                /* Card base */
                .dash-card {
                    background: white;
                    border: 1px solid rgba(0,0,0,0.07);
                    border-radius: 20px;
                    box-shadow: 0 2px 16px rgba(0,0,0,0.05), 0 0 0 1px rgba(255,255,255,0.9) inset;
                }

                /* Stat card */
                .stat-card {
                    background: white;
                    border: 1px solid rgba(0,0,0,0.07);
                    border-radius: 16px;
                    padding: 20px 22px;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    cursor: default;
                }
                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 24px rgba(0,0,0,0.08);
                }

                /* Search input */
                .dash-search {
                    width: 100%; padding: 10px 14px 10px 38px;
                    border: 1px solid rgba(0,0,0,0.09);
                    border-radius: 12px;
                    background: white;
                    font-size: 14px; color: #374151;
                    font-family: 'DM Sans', sans-serif;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .dash-search:focus {
                    border-color: rgba(124,58,237,0.4);
                    box-shadow: 0 0 0 3px rgba(124,58,237,0.08), 0 1px 4px rgba(0,0,0,0.05);
                }
                .dash-search::placeholder { color: #9CA3AF; }

                /* Filter button */
                .filter-btn {
                    display: flex; align-items: center; justify-content: center;
                    width: 42px; height: 42px; border-radius: 12px;
                    background: white; border: 1px solid rgba(0,0,0,0.09);
                    cursor: pointer; color: #6B7280;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
                    transition: all 0.18s;
                    flex-shrink: 0;
                }
                .filter-btn:hover { background: #F9F8FF; border-color: rgba(124,58,237,0.25); color: #7C3AED; }

                /* Review row */
                .review-row {
                    background: white;
                    border: 1px solid rgba(0,0,0,0.07);
                    border-radius: 18px;
                    padding: 18px 20px;
                    display: flex; flex-direction: column; gap: 14px;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
                    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s;
                    cursor: default;
                    position: relative; overflow: hidden;
                }
                .review-row::before {
                    content: '';
                    position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
                    background: linear-gradient(180deg, #7C3AED, #C084FC);
                    opacity: 0;
                    transition: opacity 0.2s;
                    border-radius: 3px 0 0 3px;
                }
                .review-row:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 24px rgba(0,0,0,0.08);
                    border-color: rgba(124,58,237,0.15);
                }
                .review-row:hover::before { opacity: 1; }

                @media (min-width: 640px) {
                    .review-row { flex-direction: row; align-items: center; justify-content: space-between; gap: 16px; }
                }

                /* Detail btn */
                .detail-btn {
                    padding: 8px 16px; border-radius: 10px;
                    background: #F9F8FF; border: 1px solid rgba(124,58,237,0.15);
                    font-size: 13px; font-weight: 600; color: #7C3AED;
                    font-family: 'DM Sans', sans-serif;
                    cursor: pointer; text-decoration: none; white-space: nowrap;
                    transition: all 0.18s;
                    display: inline-flex; align-items: center; gap: 4px;
                }
                .detail-btn:hover { background: #EDE9FE; border-color: rgba(124,58,237,0.3); }

                /* New review btn */
                .new-review-btn {
                    display: inline-flex; align-items: center; gap: 7px;
                    padding: 11px 20px; border-radius: 12px;
                    background: #1C1917; color: white;
                    font-size: 14px; font-weight: 600; font-family: 'DM Sans', sans-serif;
                    border: none; cursor: pointer; text-decoration: none;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.18);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    flex-shrink: 0;
                }
                .new-review-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.25); }

                /* Sidebar section label */
                .section-label {
                    font-size: 11px; font-weight: 600; letter-spacing: 0.09em;
                    text-transform: uppercase; color: #9CA3AF;
                    margin-bottom: 14px;
                }

                /* Summary row */
                .summary-row {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 10px 0;
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                }
                .summary-row:last-child { border-bottom: none; }

                /* Load more */
                .load-more {
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 10px 24px; border-radius: 12px;
                    background: white; border: 1px solid rgba(0,0,0,0.08);
                    font-size: 13px; font-weight: 500; color: #6B7280;
                    font-family: 'DM Sans', sans-serif;
                    cursor: pointer;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
                    transition: all 0.18s;
                }
                .load-more:hover { background: #F9F8FF; border-color: rgba(124,58,237,0.2); color: #7C3AED; }

                /* Tip card accent */
                .tip-card {
                    background: linear-gradient(135deg, #F9F8FF 0%, #F3F0FF 100%);
                    border: 1px solid rgba(124,58,237,0.15);
                    border-radius: 16px; padding: 18px;
                    box-shadow: 0 2px 12px rgba(124,58,237,0.06);
                }

                /* Empty state */
                .empty-state {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    padding: 64px 24px; text-align: center;
                    background: white; border: 1px dashed rgba(0,0,0,0.12);
                    border-radius: 24px;
                }

                /* Error state */
                .error-state {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    padding: 64px 24px; text-align: center;
                    background: #FFF5F5; border: 1px solid rgba(220,38,38,0.15);
                    border-radius: 24px;
                }
            `}</style>

            {/* Ambient backgrounds */}
            <div className="dash-blob1" />
            <div className="dash-blob2" />
            <div className="dash-dots" />

            <Navbar />

            <div style={{ position: "relative", zIndex: 10, paddingTop: 110, paddingBottom: 80, maxWidth: 1200, margin: "0 auto", padding: "110px 32px 80px" }}>

                {/* ── Page header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 40 }}
                >
                    {/* Top row: title + new review */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                        <div>
                            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 6 }}>
                                Dashboard
                            </p>
                            <h1 className="dash-serif" style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "#1C1917", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 6 }}>
                                Decision History
                            </h1>
                            <p style={{ color: "#6B7280", fontSize: 15, lineHeight: 1.5 }}>
                                Manage and reference your past engineering architectural reviews.
                            </p>
                        </div>
                        <Link href="/review/new" className="new-review-btn">
                            <Plus style={{ width: 15, height: 15 }} />
                            New Review
                        </Link>
                    </div>

                    {/* Stat cards row */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                        {[
                            { icon: BarChart3, label: "Total Reviews", value: totalReviews, color: "#7C3AED", bg: "#EDE9FE" },
                            { icon: AlertCircle, label: "Critical Risks", value: criticalRisks, color: "#DC2626", bg: "#FEE2E2" },
                            { icon: ShieldCheck, label: "Approved", value: approved, color: "#059669", bg: "#D1FAE5" },
                        ].map(({ icon: Icon, label, value, color, bg }) => (
                            <div key={label} className="stat-card">
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                    <span style={{ fontSize: 12, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</span>
                                    <div style={{ width: 30, height: 30, borderRadius: 8, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Icon style={{ width: 14, height: 14, color }} />
                                    </div>
                                </div>
                                <span className="dash-serif" style={{ fontSize: 34, fontWeight: 700, color: "#1C1917", letterSpacing: "-0.03em", lineHeight: 1 }}>
                                    {isLoading ? "—" : value}
                                </span>
                                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                                    <TrendingUp style={{ width: 11, height: 11, color: color }} />
                                    <span style={{ fontSize: 11, color: color, fontWeight: 500 }}>Updated now</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Search + filter */}
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
                            <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "#9CA3AF" }} />
                            <input
                                type="text"
                                placeholder="Search reviews…"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="dash-search"
                            />
                        </div>
                        <button className="filter-btn">
                            <Filter style={{ width: 16, height: 16 }} />
                        </button>
                    </div>
                </motion.div>

                {/* ── Main grid ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24, alignItems: "start" }}>

                    {/* ── Reviews list ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {isLoading ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", background: "white", borderRadius: 24, border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                                <div style={{ width: 48, height: 48, borderRadius: 14, background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                                    <Loader2 style={{ width: 22, height: 22, color: "#7C3AED" }} className="animate-spin" />
                                </div>
                                <p style={{ color: "#6B7280", fontSize: 14, fontWeight: 500 }}>Loading your decision history…</p>
                            </div>
                        ) : error ? (
                            <div className="error-state">
                                <div style={{ width: 48, height: 48, borderRadius: 14, background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                                    <AlertCircle style={{ width: 22, height: 22, color: "#DC2626" }} />
                                </div>
                                <p style={{ color: "#DC2626", fontWeight: 600, marginBottom: 6, fontSize: 15 }}>{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    style={{ fontSize: 13, color: "#6B7280", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "'DM Sans',sans-serif" }}
                                >
                                    Try again
                                </button>
                            </div>
                        ) : filteredDecisions.length === 0 ? (
                            <div className="empty-state">
                                <div style={{ width: 52, height: 52, borderRadius: 16, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                                    <ExternalLink style={{ width: 22, height: 22, color: "#9CA3AF" }} />
                                </div>
                                <h3 className="dash-serif" style={{ fontSize: 22, fontWeight: 700, color: "#1C1917", marginBottom: 8 }}>No reviews found</h3>
                                <p style={{ color: "#9CA3AF", fontSize: 14, maxWidth: 320, lineHeight: 1.6, marginBottom: 28 }}>
                                    {searchQuery ? `No results for "${searchQuery}". Try a different search.` : "You haven't submitted any architectural designs for review yet."}
                                </p>
                                <Link href="/review/new">
                                    <button style={{ padding: "12px 28px", borderRadius: 14, background: "#1C1917", color: "white", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                                        Start Your First Review
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            filteredDecisions.map((decision, i) => {
                                const status = getStatusDetails(decision.status)
                                return (
                                    <motion.div
                                        key={decision.id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        className="review-row"
                                    >
                                        {/* Left: icon + info */}
                                        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                                            <div style={{
                                                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                                                background: status.bg,
                                                border: `1px solid ${status.border}`,
                                                display: "flex", alignItems: "center", justifyContent: "center"
                                            }}>
                                                <status.icon style={{ width: 18, height: 18, color: status.color }} />
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <p style={{ fontSize: 15, fontWeight: 600, color: "#1C1917", marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                    {decision.title}
                                                </p>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#9CA3AF" }}>
                                                    <span>{formatDate(decision.created_at)}</span>
                                                    <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#D1D5DB", display: "inline-block" }} />
                                                    <span style={{ color: status.color, fontWeight: 600 }}>{status.label}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: actions */}
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                                            <Link href={`/dashboard/${decision.id}`} className="detail-btn">
                                                View Details
                                            </Link>
                                            <Link href={`/dashboard/${decision.id}`}>
                                                <button style={{
                                                    width: 34, height: 34, borderRadius: 9,
                                                    background: "#F9F8FF", border: "1px solid rgba(124,58,237,0.15)",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    cursor: "pointer", color: "#7C3AED", transition: "all 0.15s"
                                                }}>
                                                    <ChevronRight style={{ width: 15, height: 15 }} />
                                                </button>
                                            </Link>
                                        </div>
                                    </motion.div>
                                )
                            })
                        )}

                        {!isLoading && !error && filteredDecisions.length > 0 && (
                            <div style={{ display: "flex", justifyContent: "center", paddingTop: 16 }}>
                                <button className="load-more">
                                    Load more results
                                    <ChevronRight style={{ width: 14, height: 14 }} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── Sidebar ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 100 }}>

                        {/* Summary card */}
                        <div className="dash-card" style={{ padding: "20px 22px" }}>
                            <p className="section-label">Summary</p>
                            <div>
                                {[
                                    { label: "Total Reviews", value: isLoading ? "—" : totalReviews, color: "#1C1917" },
                                    { label: "Critical Risks", value: isLoading ? "—" : criticalRisks, color: "#DC2626" },
                                    { label: "Approved", value: isLoading ? "—" : approved, color: "#059669" },
                                ].map(({ label, value, color }) => (
                                    <div key={label} className="summary-row">
                                        <span style={{ fontSize: 13, color: "#6B7280" }}>{label}</span>
                                        <span className="dash-serif" style={{ fontSize: 18, fontWeight: 700, color }}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tip card */}
                        <div className="tip-card">
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                                <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(124,58,237,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <History style={{ width: 14, height: 14, color: "#7C3AED" }} />
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 600, color: "#4C1D95" }}>Quick Tip</span>
                            </div>
                            <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65 }}>
                                Referencing past decisions helps maintain architectural consistency and avoids repeating historical mistakes.
                            </p>
                        </div>

                        {/* Accent strip */}
                        <div style={{ borderRadius: 16, background: "linear-gradient(135deg,#7C3AED,#9333EA)", padding: "20px 22px", color: "white" }}>
                            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, opacity: 0.9 }}>Architecture score</p>
                            <p className="dash-serif" style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>
                                {isLoading ? "—" : approved > 0 ? Math.round((approved / totalReviews) * 100) : 0}
                                <span style={{ fontSize: 18, opacity: 0.6 }}>%</span>
                            </p>
                            <div style={{ marginTop: 12, height: 5, borderRadius: 4, background: "rgba(255,255,255,0.2)", overflow: "hidden" }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: isLoading || totalReviews === 0 ? "0%" : `${Math.round((approved / totalReviews) * 100)}%` }}
                                    transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    style={{ height: "100%", borderRadius: 4, background: "rgba(255,255,255,0.7)" }}
                                />
                            </div>
                            <p style={{ fontSize: 11, opacity: 0.6, marginTop: 6 }}>Approved vs total reviews</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}