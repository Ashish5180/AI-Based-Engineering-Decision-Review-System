"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    Search, Filter, History, ChevronRight,
    AlertCircle, CheckCircle, Clock,
    ExternalLink, Loader2, Plus, TrendingUp,
    BarChart3, ShieldCheck, Sparkles,
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
                .main-grid {
                    display: grid;
                    grid-template-columns: 1fr 300px;
                    gap: 32px;
                    align-items: start;
                }

                @media (max-width: 1024px) {
                    .main-grid {
                        grid-template-columns: 1fr;
                    }
                    .sidebar-container {
                        order: 2;
                    }
                    .list-container {
                        order: 1;
                    }
                }

                /* Responsive stat cards */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                }

                @media (max-width: 768px) {
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                }

                /* Mobile tweaks */
                @media (max-width: 640px) {
                    .dashboard-container {
                        padding: 100px 20px 60px !important;
                    }
                    .page-header {
                        margin-bottom: 24px !important;
                    }
                    .new-review-btn {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>

            {/* Ambient backgrounds */}
            <div className="dash-blob1" />
            <div className="dash-blob2" />
            <div className="dash-dots" />

            <Navbar />

            <div className="dashboard-container" style={{ position: "relative", zIndex: 10, paddingTop: 110, paddingBottom: 80, maxWidth: 1200, margin: "0 auto", padding: "110px 32px 80px" }}>

                {/* ── Page header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="page-header"
                    style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 48 }}
                >
                    {/* Top row: title + new review */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
                        <div style={{ flex: "1 1 300px" }}>
                            <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7C3AED", marginBottom: 8 }}>
                                Overview
                            </p>
                            <h1 className="dash-serif" style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700, color: "#1C1917", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 12 }}>
                                Engineering Decisions
                            </h1>
                            <p style={{ color: "#6B7280", fontSize: 16, lineHeight: 1.6, maxWidth: 600 }}>
                                Reference and manage your architectural reviews. Track risks and maintain consistency across your projects.
                            </p>
                        </div>
                        <Link href="/review/new" className="new-review-btn">
                            <Plus style={{ width: 18, height: 18 }} />
                            Start New Review
                        </Link>
                    </div>

                    {/* Stat cards row */}
                    <div className="stats-grid">
                        {[
                            { icon: BarChart3, label: "Total Reviews", value: totalReviews, color: "#7C3AED", bg: "#EDE9FE", desc: "Total analyzed" },
                            { icon: AlertCircle, label: "Critical Risks", value: criticalRisks, color: "#DC2626", bg: "#FEE2E2", desc: "Require attention" },
                            { icon: ShieldCheck, label: "Health Score", value: isLoading ? "—" : (totalReviews > 0 ? `${Math.round((approved / totalReviews) * 100)}%` : "N/A"), color: "#059669", bg: "#D1FAE5", desc: "Approval rate" },
                        ].map(({ icon: Icon, label, value, color, bg, desc }) => (
                            <div key={label} className="stat-card">
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Icon style={{ width: 18, height: 18, color }} />
                                    </div>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                                    <span className="dash-serif" style={{ fontSize: 36, fontWeight: 700, color: "#1C1917", letterSpacing: "-0.03em", lineHeight: 1 }}>
                                        {isLoading ? "—" : value}
                                    </span>
                                </div>
                                <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
                                    <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>{desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Search + filter */}
                    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                        <div style={{ position: "relative", flex: "1 1 300px" }}>
                            <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#9CA3AF" }} />
                            <input
                                type="text"
                                placeholder="Search by decision title or keyword..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="dash-search"
                                style={{ paddingLeft: 42, height: 46 }}
                            />
                        </div>
                        <button className="filter-btn" style={{ height: 46, width: 46 }}>
                            <Filter style={{ width: 18, height: 18 }} />
                        </button>
                    </div>
                </motion.div>

                {/* ── Main grid ── */}
                <div className="main-grid">

                    {/* ── Reviews list ── */}
                    <div className="list-container" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <p className="section-label" style={{ marginBottom: 4 }}>Recent Decisions</p>
                        {isLoading ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px", background: "white", borderRadius: 24, border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                                <div style={{ width: 56, height: 56, borderRadius: 16, background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                                    <Loader2 style={{ width: 26, height: 26, color: "#7C3AED" }} className="animate-spin" />
                                </div>
                                <p style={{ color: "#6B7280", fontSize: 15, fontWeight: 500 }}>Synchronizing history...</p>
                            </div>
                        ) : error ? (
                            <div className="error-state">
                                <div style={{ width: 56, height: 56, borderRadius: 16, background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                                    <AlertCircle style={{ width: 26, height: 26, color: "#DC2626" }} />
                                </div>
                                <p style={{ color: "#DC2626", fontWeight: 600, marginBottom: 8, fontSize: 16 }}>{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    style={{ fontSize: 14, color: "#6B7280", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontWeight: 500 }}
                                >
                                    Reconnect to system
                                </button>
                            </div>
                        ) : filteredDecisions.length === 0 ? (
                            <div className="empty-state">
                                <div style={{ width: 64, height: 64, borderRadius: 20, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                                    <History style={{ width: 28, height: 28, color: "#9CA3AF" }} />
                                </div>
                                <h3 className="dash-serif" style={{ fontSize: 24, fontWeight: 700, color: "#1C1917", marginBottom: 12 }}>No Records Found</h3>
                                <p style={{ color: "#9CA3AF", fontSize: 15, maxWidth: 360, lineHeight: 1.6, marginBottom: 32 }}>
                                    {searchQuery ? `No matches for "${searchQuery}". Try refining your search parameters.` : "Your architectural decision log is currently empty. Start by submitting a design for review."}
                                </p>
                    <Link href="/review/new">
                                    <button style={{ padding: "14px 32px", borderRadius: 16, background: "#1C1917", color: "white", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", transition: "all 0.2s" }}>
                                        Initialize First Review
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            filteredDecisions.map((decision, i) => {
                                const status = getStatusDetails(decision.status)
                                return (
                                    <Link href={`/dashboard/${decision.id}`} key={decision.id} style={{ textDecoration: "none" }}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                            className="review-row"
                                            style={{ cursor: "pointer" }}
                                        >
                                            {/* Left: icon + info */}
                                            <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0, flex: 1 }}>
                                                <div style={{
                                                    width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                                                    background: status.bg,
                                                    border: `1px solid ${status.border}`,
                                                    display: "flex", alignItems: "center", justifyContent: "center"
                                                }}>
                                                    <status.icon style={{ width: 20, height: 20, color: status.color }} />
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <p style={{ fontSize: 16, fontWeight: 600, color: "#1C1917", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                        {decision.title}
                                                    </p>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                                                        <span style={{ fontSize: 13, color: "#9CA3AF" }}>{formatDate(decision.created_at)}</span>
                                                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#D1D5DB" }} />
                                                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                                            <span style={{ fontSize: 12, fontWeight: 700, color: status.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>{status.label}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: actions */}
                                            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                                                <div className="detail-btn" style={{ padding: "10px 18px" }}>
                                                    View Analysis
                                                </div>
                                                <div style={{
                                                    width: 40, height: 40, borderRadius: 12,
                                                    background: "white", border: "1px solid rgba(0,0,0,0.08)",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    color: "#1C1917", transition: "all 0.2s",
                                                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                                                }}>
                                                    <ChevronRight style={{ width: 18, height: 18 }} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                )
                            })
                        )}

                        {!isLoading && !error && filteredDecisions.length > 0 && (
                            <div style={{ display: "flex", justifyContent: "center", paddingTop: 24 }}>
                                <button className="load-more">
                                    Show older records
                                    <ChevronRight style={{ width: 14, height: 14 }} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── Sidebar ── */}
                    <div className="sidebar-container" style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 100 }}>

                        {/* Summary card */}
                        <div className="dash-card" style={{ padding: "24px" }}>
                            <p className="section-label">System Metrics</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                {[
                                    { label: "Total Reviews", value: isLoading ? "—" : totalReviews, color: "#1C1917" },
                                    { label: "Critical Risks", value: isLoading ? "—" : criticalRisks, color: "#DC2626" },
                                    { label: "Healthy Designs", value: isLoading ? "—" : approved, color: "#059669" },
                                ].map(({ label, value, color }) => (
                                    <div key={label} className="summary-row" style={{ padding: "12px 0" }}>
                                        <span style={{ fontSize: 14, color: "#6B7280", fontWeight: 500 }}>{label}</span>
                                        <span className="dash-serif" style={{ fontSize: 20, fontWeight: 700, color }}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tip card */}
                        <div className="tip-card" style={{ padding: "24px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                                <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(124,58,237,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Sparkles style={{ width: 16, height: 16, color: "#7C3AED" }} />
                                </div>
                                <span style={{ fontSize: 14, fontWeight: 600, color: "#4C1D95" }}>Architecture Tip</span>
                            </div>
                            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>
                                High risk levels often correlate with tightly coupled services. Consider using message queues for cross-domain communication.
                            </p>
                        </div>

                        {/* Accent strip */}
                        <div style={{ borderRadius: 24, background: "linear-gradient(135deg,#1C1917,#44403C)", padding: "28px 24px", color: "white", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.3)" }}>
                            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.05em" }}>Global Compliance Score</p>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                                <p className="dash-serif" style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>
                                    {isLoading ? "—" : totalReviews > 0 ? Math.round((approved / totalReviews) * 100) : 0}
                                </p>
                                <span style={{ fontSize: 24, opacity: 0.5, fontWeight: 600 }}>%</span>
                            </div>
                            <div style={{ marginTop: 20, height: 6, borderRadius: 10, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: isLoading || totalReviews === 0 ? "0%" : `${Math.round((approved / totalReviews) * 100)}%` }}
                                    transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    style={{ height: "100%", borderRadius: 10, background: "linear-gradient(90deg, #A78BFA, #F472B6)" }}
                                />
                            </div>
                            <p style={{ fontSize: 12, opacity: 0.5, marginTop: 12, fontWeight: 500 }}>Calculated from {totalReviews} recent analyses</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}