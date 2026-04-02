"use client"

import Link from "next/link"
import { Shield, LayoutDashboard, FileText, Bell, Search, Package, Plus, ChevronRight, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

export default function Navbar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [hasNotif, setHasNotif] = useState(true)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    const links = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", tip: "View overview" },
        { id: "patterns", label: "Patterns", icon: Shield, href: "/patterns", tip: "Security patterns" },
        { id: "reviews", label: "Reviews", icon: FileText, href: "/review/new", tip: "Architecture reviews" },
        { id: "docs", label: "Docs", icon: Package, href: "/docs", tip: "Documentation" },
    ]

    const isActive = (href: string) => {
        if (href === "/dashboard" && pathname.startsWith("/dashboard")) return true
        return pathname === href
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-5 pt-3">
            {/* Floating pill */}
            <div className={`
        relative max-w-[880px] mx-auto flex items-center justify-between
        px-2 py-2 pl-4 rounded-[20px] overflow-hidden
        border border-white/90
        transition-all duration-300
        ${scrolled
                    ? "bg-white/95 shadow-[0_4px_48px_rgba(0,0,0,0.11)]"
                    : "bg-white/82 shadow-[0_2px_32px_rgba(0,0,0,0.06)]"}
      `}
                style={{ backdropFilter: "blur(20px)" }}
            >
                {/* Shimmer sweep */}
                <motion.div
                    initial={{ left: "-60%" }}
                    animate={{ left: "200%" }}
                    transition={{ delay: 1.5, duration: 1.2, ease: "easeInOut" }}
                    className="absolute top-0 h-full w-[40%] -skew-x-12 pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)" }}
                />

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-[10px] flex items-center justify-center transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_4px_14px_rgba(124,58,237,0.4)]"
                        style={{ background: "linear-gradient(135deg,#7C3AED,#9F67F5)", boxShadow: "0 2px 8px rgba(124,58,237,0.28)" }}>
                        <Shield className="w-[18px] h-[18px] text-white" />
                    </div>
                    <span className="text-[16px] font-semibold tracking-tight text-[#1A1714]">
                        Arch<span className="text-violet-600">Guard</span>
                    </span>
                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-0.5">
                    {links.map(({ id, label, icon: Icon, href, tip }) => {
                        const active = isActive(href)
                        return (
                            <Link
                                key={id} href={href}
                                className={`
                    relative flex items-center gap-1.5 px-3 py-[7px] rounded-xl text-[13.5px] font-medium
                    border transition-all duration-150 group
                    ${active
                                        ? "text-violet-700 bg-violet-50 border-violet-200/70"
                                        : "text-[#4A4540] border-transparent hover:bg-black/[0.04] hover:border-black/[0.06] hover:text-[#1A1714]"}
                  `}
                            >
                                <Icon className={`w-[15px] h-[15px] transition-colors ${active ? "text-violet-600" : "opacity-60 group-hover:text-violet-500 group-hover:opacity-100"}`} />
                                {label}
                                {/* Tooltip */}
                                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 translate-y-1
                    opacity-0 group-hover:opacity-100 group-hover:translate-y-0
                    bg-[#1A1714] text-white text-[11px] px-2 py-1 rounded-md whitespace-nowrap
                    transition-all duration-150 pointer-events-none z-10">
                                    {tip}
                                </span>
                            </Link>
                        )
                    })}
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-1.5">
                    <Link href="/notifications">
                        <button
                            onClick={() => setHasNotif(false)}
                            className={`relative w-[34px] h-[34px] rounded-[10px] border border-black/[0.07] bg-white/70
                  flex items-center justify-center text-[#5A5450] hover:bg-white hover:border-black/[0.12]
                  hover:text-[#1A1714] hover:-translate-y-px hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]
                  transition-all duration-150 ${pathname === '/notifications' ? 'bg-violet-50 border-violet-200 text-violet-600' : ''}`}
                        >
                            <Bell className="w-[15px] h-[15px]" />
                            {hasNotif && pathname !== '/notifications' && (
                                <span className="absolute top-[5px] right-[5px] w-[7px] h-[7px] rounded-full bg-red-500
                    border-[1.5px] border-white animate-pulse" />
                            )}
                        </button>
                    </Link>

                    <button className="w-[34px] h-[34px] rounded-[10px] border border-black/[0.07] bg-white/70
            flex items-center justify-center text-[#5A5450] hover:bg-white hover:border-black/[0.12]
            hover:text-[#1A1714] hover:-translate-y-px hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]
            transition-all duration-150">
                        <Search className="w-[15px] h-[15px]" />
                    </button>

                    <Link href="/review/new">
                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold text-white
              border-none group transition-all duration-200
              hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(124,58,237,0.4)]"
                            style={{ background: "linear-gradient(135deg,#7C3AED,#9333EA)", boxShadow: "0 2px 8px rgba(124,58,237,0.28)" }}>
                            <Plus className="w-[14px] h-[14px]" />
                            New Review
                            <ChevronRight className="w-[14px] h-[14px] transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </Link>
                </div>

                {/* Mobile toggle */}
                <button onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden w-[34px] h-[34px] rounded-[10px] border border-black/[0.08]
            flex items-center justify-center text-[#4A4540] hover:bg-black/[0.04] transition-all">
                    {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        className="md:hidden mt-2 mx-0 p-2 rounded-[20px] flex flex-col gap-0.5
              bg-white/96 border border-white/90 shadow-[0_8px_40px_rgba(0,0,0,0.1)]"
                        style={{ backdropFilter: "blur(20px)" }}
                    >
                        {links.map(({ id, label, icon: Icon, href }) => (
                            <Link key={id} href={href}
                                onClick={() => { setIsOpen(false) }}
                                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[14px] font-medium
                    ${isActive(href) ? 'text-violet-700 bg-violet-50' : 'text-[#3A3530] hover:bg-violet-50 hover:text-violet-700'} transition-all`}
                            >
                                <Icon className="w-4 h-4 opacity-70" />
                                {label}
                            </Link>
                        ))}
                        <div className="h-px bg-black/[0.05] my-1" />
                        <Link href="/review/new" onClick={() => setIsOpen(false)}>
                            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                text-[14px] font-semibold text-white transition-all"
                                style={{ background: "linear-gradient(135deg,#7C3AED,#9333EA)" }}>
                                <Plus className="w-4 h-4" />
                                New Review
                            </button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}