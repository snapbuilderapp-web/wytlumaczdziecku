'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'

interface HeroImagePanelProps {
    src: string
    alt: string
    downloadName?: string
}

export function HeroImagePanel({ src, alt, downloadName = 'infographic' }: HeroImagePanelProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [downloading, setDownloading] = useState(false)

    const openLightbox = () => setLightboxOpen(true)
    const closeLightbox = useCallback(() => setLightboxOpen(false), [])

    // Close on Escape
    useEffect(() => {
        if (!lightboxOpen) return
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLightbox() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [lightboxOpen, closeLightbox])

    // Prevent body scroll when lightbox open
    useEffect(() => {
        document.body.style.overflow = lightboxOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [lightboxOpen])

    const handleDownload = async () => {
        setDownloading(true)
        try {
            const res = await fetch(src)
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${downloadName}.png`
            a.click()
            URL.revokeObjectURL(url)
        } finally {
            setDownloading(false)
        }
    }

    return (
        <>
            {/* ── Hero image card ── */}
            <div className="relative w-full max-w-sm mx-auto mb-6 group">
                {/* Thumbnail — clickable */}
                <button
                    onClick={openLightbox}
                    aria-label="Otwórz infografikę na pełnym ekranie"
                    className="w-full block rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5
                     focus-visible:ring-4 focus-visible:ring-blue-500/40
                     transition-transform duration-200 hover:scale-[1.015] hover:shadow-lg"
                >
                    <Image
                        src={src}
                        alt={alt}
                        width={576}
                        height={896}
                        className="w-full h-auto object-contain"
                        priority
                        unoptimized={!src.includes('.supabase.co')}
                    />
                </button>

                {/* Action bar */}
                <div className="flex gap-2 mt-3 justify-center">
                    <button
                        onClick={openLightbox}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full
                       bg-white border border-stone-200 shadow-sm
                       text-sm font-medium text-stone-700
                       hover:bg-stone-50 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" />
                        </svg>
                        Pełny ekran
                    </button>

                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full
                       bg-white border border-stone-200 shadow-sm
                       text-sm font-medium text-stone-700
                       hover:bg-stone-50 transition-colors
                       disabled:opacity-50 disabled:cursor-wait"
                    >
                        {downloading ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v11" />
                            </svg>
                        )}
                        Pobierz
                    </button>
                </div>
            </div>

            {/* ── Lightbox ── */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center p-4
                     bg-black/80 backdrop-blur-sm"
                    onClick={closeLightbox}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Infografika na pełnym ekranie"
                >
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20
                       text-white transition-colors"
                        aria-label="Zamknij"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Download in lightbox */}
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDownload() }}
                        disabled={downloading}
                        className="absolute top-4 right-16 p-2 rounded-full bg-white/10 hover:bg-white/20
                       text-white transition-colors disabled:opacity-50"
                        aria-label="Pobierz infografikę"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v11" />
                        </svg>
                    </button>

                    {/* Image — stop propagation so clicking image doesn't close */}
                    <div
                        className="relative max-h-[90vh] max-w-[90vw] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={src}
                            alt={alt}
                            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
                            draggable={false}
                        />
                    </div>
                </div>
            )}
        </>
    )
}
