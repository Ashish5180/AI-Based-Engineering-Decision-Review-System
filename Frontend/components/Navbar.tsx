"use client"

import Link from "next/link"
import { Shield, LayoutDashboard, FileText, Menu, X } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
            <Link href="/" className="flex items-center gap-2 group">
                <div className="p-2 rounded-xl bg-primary/20 border border-primary/30 group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                    Arch<span className="text-primary">Guard</span>
                </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
                <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <Link href="/patterns" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Patterns
                </Link>
                <Link href="/review/new" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
                    <FileText className="w-4 h-4" /> New Review
                </Link>
                <Link href="/review/new">
                    <button className="px-5 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]">
                        Get Started
                    </button>
                </Link>
            </div>

            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-16 left-0 right-0 p-6 glass border-b border-white/10 md:hidden flex flex-col gap-4"
                    >
                        <Link href="/dashboard" className="text-lg font-medium py-2 border-b border-white/5" onClick={() => setIsOpen(false)}>
                            Dashboard
                        </Link>
                        <Link href="/patterns" className="text-lg font-medium py-2 border-b border-white/5" onClick={() => setIsOpen(false)}>
                            Patterns
                        </Link>
                        <Link href="/review/new" className="text-lg font-medium py-2 border-b border-white/5" onClick={() => setIsOpen(false)}>
                            New Review
                        </Link>
                        <Link href="/review/new" className="w-full" onClick={() => setIsOpen(false)}>
                            <button className="w-full py-3 rounded-xl bg-primary text-white font-medium mt-2">
                                Get Started
                            </button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
