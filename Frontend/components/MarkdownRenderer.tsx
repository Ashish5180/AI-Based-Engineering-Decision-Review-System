"use client"

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
    content: string
    className?: string
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    return (
        <div className={cn("max-w-none text-slate-300", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ inline, className, children, ...props }: { inline?: boolean, className?: string, children?: React.ReactNode }) {
                        const match = /language-(\w+)/.exec(className || '')
                        const language = match ? match[1] : 'text'

                        if (!inline) {
                            return (
                                <div className="relative group my-8">
                                    <div className="absolute -top-3.5 left-4 bg-[#0d1117] px-3 py-1 rounded-t-lg border-t border-x border-white/10 text-[9px] uppercase tracking-widest text-primary font-bold z-10">
                                        {language}
                                    </div>
                                    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0d1117]/80 backdrop-blur-md shadow-2xl">
                                        <div className="flex items-center gap-1.5 px-4 py-3 bg-white/[0.03] border-b border-white/5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/30" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/30" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30" />
                                        </div>
                                        <SyntaxHighlighter
                                            style={atomDark}
                                            language={language}
                                            PreTag="div"
                                            customStyle={{
                                                margin: 0,
                                                padding: '1.5rem',
                                                background: 'transparent',
                                                fontSize: '0.85rem',
                                                lineHeight: '1.7',
                                            }}
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    </div>
                                </div>
                            )
                        }

                        return (
                            <code className={cn("bg-white/10 text-primary-foreground px-1.5 py-0.5 rounded font-mono text-[13px] border border-white/5", className)} {...props}>
                                {children}
                            </code>
                        )
                    },
                    p: ({ children }: { children?: React.ReactNode }) => <p className="text-slate-400 leading-[1.8] mb-6 text-[15px]">{children}</p>,
                    h1: ({ children }: { children?: React.ReactNode }) => <h1 className="text-4xl font-black mb-8 gradient-text tracking-tight">{children}</h1>,
                    h2: ({ children }: { children?: React.ReactNode }) => <h2 className="text-2xl font-bold mb-6 text-white tracking-tight border-b border-white/5 pb-2">{children}</h2>,
                    h3: ({ children }: { children?: React.ReactNode }) => <h3 className="text-xl font-bold mb-4 text-white/90">{children}</h3>,
                    ul: ({ children }: { children?: React.ReactNode }) => <ul className="space-y-4 mb-8">{children}</ul>,
                    ol: ({ children }: { children?: React.ReactNode }) => <ol className="space-y-4 mb-8 list-decimal pl-6 text-slate-400">{children}</ol>,
                    li: ({ children }: { children?: React.ReactNode }) => (
                        <li className="text-slate-400 text-sm leading-relaxed flex gap-4">
                            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(124,58,237,0.5)] shrink-0" />
                            <div className="flex-grow">{children}</div>
                        </li>
                    ),
                    strong: ({ children }: { children?: React.ReactNode }) => <strong className="text-white font-bold">{children}</strong>,
                    em: ({ children }: { children?: React.ReactNode }) => <em className="text-primary italic font-medium">{children}</em>,
                    blockquote: ({ children }: { children?: React.ReactNode }) => (
                        <blockquote className="border-l-4 border-primary/50 bg-primary/5 px-8 py-6 rounded-r-[24px] mb-8 italic text-slate-300 shadow-inner">
                            {children}
                        </blockquote>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
