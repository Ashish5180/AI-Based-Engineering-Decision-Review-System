"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle2,
  AlertCircle,
  Info,
  Trash2,
  Search,
  RefreshCw,
  ArrowUpRight,
  BellOff,
  Settings
} from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/Navbar"

// ─── Types ───────────────────────────────────────────────────────────────────

type NotifType = "success" | "alert" | "info" | "update"

interface Notification {
  id: number
  type: NotifType
  category: string
  title: string
  desc: string
  time: string
  read: boolean
  link: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const INITIAL_DATA: Notification[] = [
  {
    id: 1,
    type: "success",
    category: "Reviews",
    title: "Review Completed",
    desc: "Architecture review for 'Payment Gateway V2' is ready. AI scored it 88/100.",
    time: "10 min ago",
    read: false,
    link: "/dashboard/1",
  },
  {
    id: 2,
    type: "alert",
    category: "Security",
    title: "Critical Security Risk",
    desc: "A potential data exposure vulnerability was detected in the 'Auth Service' design pattern.",
    time: "2 hr ago",
    read: false,
    link: "/dashboard/2",
  },
  {
    id: 3,
    type: "info",
    category: "System",
    title: "New Pattern Added",
    desc: "The 'Event-Driven Saga' pattern has been added to the library. Check it out now.",
    time: "5 hr ago",
    read: true,
    link: "/patterns",
  },
  {
    id: 4,
    type: "update",
    category: "Updates",
    title: "System Update v2.4.0",
    desc: "ArchGuard is now running version 2.4.0 with improved reasoning and faster analysis.",
    time: "1 day ago",
    read: true,
    link: "/docs",
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function DotPulse() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
    </span>
  )
}

const ICON_MAP: Record<NotifType, React.ReactNode> = {
  success: <CheckCircle2 size={16} strokeWidth={2} />,
  alert: <AlertCircle size={16} strokeWidth={2} />,
  info: <Info size={16} strokeWidth={2} />,
  update: <RefreshCw size={16} strokeWidth={2} />,
}

function NotifIcon({ type, read }: { type: NotifType; read: boolean }) {
  const styles: Record<NotifType, string> = {
    success: "bg-emerald-50 border-emerald-100 text-emerald-600",
    alert: "bg-rose-50 border-rose-100 text-rose-600",
    info: "bg-sky-50 border-sky-100 text-sky-600",
    update: "bg-amber-50 border-amber-100 text-amber-600",
  }

  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${read ? 'grayscale opacity-60' : styles[type]}`}>
      {ICON_MAP[type]}
    </div>
  )
}

function CategoryBadge({ category }: { category: string }) {
  const styles: Record<string, string> = {
    Reviews: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Security: "bg-rose-50 text-rose-700 border-rose-100",
    System: "bg-sky-50 text-sky-700 border-sky-100",
    Updates: "bg-amber-50 text-amber-700 border-amber-100",
  }
  const styleClass = styles[category] ?? "bg-slate-50 text-slate-600 border-slate-100"
  
  return (
    <span className={`text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-md border ${styleClass}`}>
      {category}
    </span>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>(INITIAL_DATA)
  const [filter, setFilter] = useState<"all" | "unread">("all")
  const [query, setQuery] = useState("")

  const unreadCount = notifs.filter((n) => !n.read).length

  const visible = notifs.filter((n) => {
    const matchF = filter === "all" || !n.read
    const matchS =
      !query ||
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.desc.toLowerCase().includes(query.toLowerCase())
    return matchF && matchS
  })

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))
  const deleteNotif = (id: number) => setNotifs((prev) => prev.filter((n) => n.id !== id))
  const toggleRead = (id: number) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)))

  return (
    <main className="min-h-screen bg-[#FAFAF8] text-[#0D0D0D] font-sans relative overflow-hidden">
      <Navbar />

      {/* Subtle grain overlay */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E")`,
        }}
      />

      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-violet-100/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-100/20 blur-[100px] rounded-full" />
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        
        .serif { font-family: 'Playfair Display', serif; }
        .sans { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="relative z-10 pt-32 pb-24 px-6 max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 mb-6"
          >
            <DotPulse />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Activity Center
            </span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="serif text-5xl md:text-7xl font-bold leading-[0.9] tracking-tight mb-6">
                Updates & <br />
                <span className="text-slate-400">Notifications</span>
              </h1>
              
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {unreadCount}
                </div>
                <span className="text-sm font-medium text-slate-500">
                  unread notifications
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <button
                onClick={markAllRead}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                <CheckCircle2 size={14} className="text-emerald-500" />
                Mark all read
              </button>
              <button className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                <Settings size={18} />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row items-center gap-4 mb-12"
        >
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
            <input
              type="text"
              placeholder="Search notifications…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white/50 backdrop-blur-md border border-slate-200 rounded-2xl py-3.5 pl-12 pr-6 text-[13px] font-medium focus:outline-none focus:border-slate-400 focus:bg-white/80 transition-all"
            />
          </div>
          
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 w-full md:w-auto">
            {["all", "unread"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as "all" | "unread")}
                className={`px-6 py-2 rounded-lg text-xs font-bold capitalize transition-all flex-1 md:flex-none ${
                  filter === f
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-0 relative">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.length > 0 ? (
              visible.map((n, idx) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => toggleRead(n.id)}
                  className={`group relative flex items-start gap-6 py-8 border-b border-slate-200 cursor-pointer transition-all duration-300 ${
                    n.read ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <div className="relative shrink-0 mt-1">
                    <NotifIcon type={n.type} read={n.read} />
                    {!n.read && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-slate-900 border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <CategoryBadge category={n.category} />
                      <h3 className={`font-bold text-[15px] tracking-tight group-hover:text-slate-600 transition-colors ${n.read ? 'text-slate-500' : 'text-slate-900'}`}>
                        {n.title}
                      </h3>
                    </div>
                    
                    <p className="text-sm text-slate-500 leading-relaxed mb-4 max-w-2xl">
                      {n.desc}
                    </p>

                    <div className="flex items-center gap-6">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {n.time}
                      </span>
                      <Link href={n.link} onClick={(e) => e.stopPropagation()}>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-900 border-b border-slate-900/10 hover:border-slate-900 transition-all pb-0.5">
                          VIEW <ArrowUpRight size={10} strokeWidth={2.5} />
                        </span>
                      </Link>
                      <button className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider">
                        Mute
                      </button>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className="opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotif(n.id)
                      }}
                      className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-24 text-center"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BellOff size={24} className="text-slate-300" />
                </div>
                <h3 className="serif text-2xl font-bold text-slate-900 mb-2">All Quiet Here</h3>
                <p className="text-slate-400 max-w-xs mx-auto text-sm leading-relaxed">
                  No notifications match your current filter. Try broadening your search or starting a new review.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Promo / Footer Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 relative p-10 md:p-14 rounded-[32px] overflow-hidden bg-slate-900 text-white"
        >
          {/* Decorative SVG pattern */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10 grid md:grid-cols-[1fr,auto] items-center gap-10">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-slate-700"></span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Coming Soon
                </span>
              </div>
              <h4 className="serif text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Weekly Architecture <br /> Audit Digest
              </h4>
              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-md">
                A weekly intelligence report that maps all your recent engineering reviews into one strategic risk overview.
              </p>
            </div>
            
            <button className="px-8 py-4 rounded-2xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-all shadow-xl active:scale-95">
              Notify Me
            </button>
          </div>

          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        </motion.div>

      </div>
    </main>
  )
}

