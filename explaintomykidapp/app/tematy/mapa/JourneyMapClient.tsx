'use client'

import Link from 'next/link'
import { useGamification } from '@/hooks/useGamification'
import type { InfographicCard } from '@/types'

interface JourneyMapClientProps {
    items: InfographicCard[]
}

export function JourneyMapClient({ items }: JourneyMapClientProps) {
    const { completedInfographics } = useGamification()

    if (!items || items.length === 0) {
        return <div className="text-stone-500">Brak tematów na mapie.</div>
    }

    return (
        <div className="relative py-8 px-4 w-full flex flex-col items-center">

            {/* The Map Background/Path */}
            <div className="absolute top-0 bottom-0 left-1/2 w-3 bg-stone-200 -translate-x-1/2 rounded-full z-0"></div>

            {items.map((item, index) => {
                const isCompleted = completedInfographics.includes(item.id)

                // Determine if it's the "next" available topic (the first one not completed)
                // For a true progression map, you'd find the first index where isCompleted is false
                // But since users can jump around, we'll just style based on completion
                // Let's find the first uncompleted item globally to highlight it as "current"
                const firstUncompletedIndex = items.findIndex(i => !completedInfographics.includes(i.id))
                const isCurrent = index === firstUncompletedIndex
                const isLocked = index > firstUncompletedIndex && firstUncompletedIndex !== -1

                // Alternating Left/Right layout
                const isLeft = index % 2 === 0

                let nodeColor = "bg-stone-300 border-stone-400 text-stone-500" // Locked
                let lineColor = "bg-stone-300"

                if (isCompleted) {
                    nodeColor = "bg-green-500 border-green-600 text-white shadow-md shadow-green-500/30"
                    lineColor = "bg-green-500"
                } else if (isCurrent) {
                    nodeColor = "bg-amber-400 border-amber-500 text-amber-950 shadow-lg shadow-amber-400/50 scale-110 animate-pulse"
                    lineColor = "bg-amber-400"
                }

                return (
                    <div key={item.id} className="w-full max-w-lg mb-12 relative z-10 flex items-center justify-center">

                        {/* The structural container */}
                        <div className={`flex w-full ${isLeft ? 'flex-row-reverse' : 'flex-row'} items-center`}>

                            {/* The Space on the empty side */}
                            <div className="w-1/2"></div>

                            {/* The Connecting Line to Center */}
                            <div className={`w-8 h-1 ${lineColor} absolute left-1/2 -translate-x-1/2`}></div>

                            {/* The Node Content */}
                            <div className={`w-1/2 flex ${isLeft ? 'justify-end pr-8' : 'justify-start pl-8'}`}>

                                <Link
                                    href={`/${item.slug}`}
                                    onClick={(e) => {
                                        if (isLocked) {
                                            e.preventDefault()
                                            alert('Musisz przejść poprzednie tematy, aby odblokować ten!')
                                        }
                                    }}
                                    className={`
                    relative group flex flex-col items-center text-center transition-transform hover:-translate-y-1
                    ${isLocked ? 'cursor-not-allowed opacity-60 grayscale' : 'cursor-pointer'}
                  `}
                                >
                                    {/* Visual Node */}
                                    <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl font-bold z-10 transition-colors ${nodeColor}`}>
                                        {isCompleted ? '✓' : (index + 1)}
                                    </div>

                                    {/* Topic Card */}
                                    <div className="bg-white p-3 rounded-xl shadow-sm border border-stone-200 mt-3 w-40">
                                        <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">
                                            Poziom {index + 1}
                                        </div>
                                        <h3 className="font-bold text-sm text-[var(--text-primary)] leading-tight">
                                            {item.title_pl}
                                        </h3>

                                        {isLocked && (
                                            <div className="absolute -top-2 -right-2 bg-stone-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                                🔒
                                            </div>
                                        )}
                                    </div>
                                </Link>

                            </div>
                        </div>

                    </div>
                )
            })}

            {/* End of Path */}
            {items.length > 0 && (
                <div className="relative z-10 w-24 h-24 bg-gradient-to-tr from-amber-300 to-orange-500 rounded-full flex flex-col items-center justify-center text-white font-bold shadow-xl border-4 border-white mt-8">
                    <span className="text-3xl mb-1">🏆</span>
                    <span className="text-xs uppercase tracking-wider">Meta</span>
                </div>
            )}

        </div>
    )
}
