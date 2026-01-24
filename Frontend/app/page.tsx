import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Decorative gradient section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="gradient-border p-12 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-50" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl">
                <h2 className="text-3xl font-bold mb-4">Empower Your Engineering Team</h2>
                <p className="text-slate-400 mb-8">
                  Bridge the gap between design and implementation. ArchGuard helps junior and mid-level engineers learn better decision-making practices through structured, AI-driven explanations.
                </p>
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-primary">40%</span>
                    <span className="text-sm text-slate-500 uppercase tracking-widest">Less Tech Debt</span>
                  </div>
                  <div className="w-[1px] h-12 bg-white/10" />
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-secondary">2x</span>
                    <span className="text-sm text-slate-500 uppercase tracking-widest">Faster Reviews</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3 aspect-square glass rounded-3xl flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
                <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                <div className="relative z-10 p-8 text-center">
                  <div className="text-primary font-mono text-sm mb-4">Analyzing architecture...</div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                    <div className="w-2/3 h-full bg-primary animate-[shimmer_2s_infinite]" />
                  </div>
                  <div className="text-xs text-slate-500">Scanning for tight coupling</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>© 2026 ArchGuard AI. Excellence in Engineering Decisions.</p>
      </footer>
    </main>
  )
}
