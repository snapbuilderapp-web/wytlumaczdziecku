'use client'

import { useState } from 'react'
import { useGamification } from '@/hooks/useGamification'
import { Rys } from '@/components/mascot/Rys'

interface RewardsModalProps {
    isOpen: boolean
    onClose: () => void
}

export function RewardsModal({ isOpen, onClose }: RewardsModalProps) {
    const { points } = useGamification()

    // Define unlockable items
    const rewards = [
        { title: 'Ryś Odkrywca', description: 'Odblokuj po rozwiązaniu 1 quizu', pointsReq: 10, icon: '🎒' },
        { title: 'Złota Lupa', description: 'Odblokuj po zdobyciu 50 punktów', pointsReq: 50, icon: '🔍' },
        { title: 'Czapka Detektywa', description: 'Znajdź rozwiązanie na 100 punktów', pointsReq: 100, icon: '🕵️' },
        { title: 'Peleryna Super-Mózgu', description: 'Najwyższy poziom od 200 punktów', pointsReq: 200, icon: '🦸' },
    ]

    if (!isOpen) return null

    // Highest unlocked state gives the Rys a different "state" visually
    const highestUnlocked = rewards.slice().reverse().find(r => points >= r.pointsReq)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
            <div
                className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
                aria-labelledby="rewards-title"
            >
                <div className="p-6 pb-0 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-700 transition-colors"
                        aria-label="Zamknij"
                    >
                        ✕
                    </button>

                    <h2 id="rewards-title" className="text-2xl font-bold font-[family-name:var(--age-font-display)] mb-2">
                        Twój Ryś
                    </h2>
                    <p className="text-[var(--text-secondary)] mb-6">
                        Rozwiązuj quizy, zdobywaj punkty i odblokowuj nagrody!
                    </p>

                    <div className="flex justify-center mb-6 relative">
                        {/* Display the mascot with a special background if high score */}
                        <div className={`
              rounded-full p-8 transition-colors duration-500
              ${points >= 200 ? 'bg-gradient-to-tr from-amber-200 to-orange-400' : 'bg-stone-100'}
            `}>
                            <Rys
                                size={120}
                                state={highestUnlocked ? 'celebrating' : 'encouraging'}
                                className="drop-shadow-xl"
                            />
                        </div>

                        <div className="absolute -bottom-4 bg-stone-900 text-white font-bold py-1 px-4 rounded-full border-4 border-white shadow-sm">
                            {points} PKT
                        </div>
                    </div>
                </div>

                <div className="bg-stone-50 p-6 pt-8 border-t border-stone-100 max-h-[50vh] overflow-y-auto">
                    <h3 className="font-bold mb-4 uppercase text-xs tracking-wider text-stone-500">
                        Kolekcja
                    </h3>

                    <div className="space-y-3">
                        {rewards.map((reward, i) => {
                            const isUnlocked = points >= reward.pointsReq
                            return (
                                <div
                                    key={i}
                                    className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all
                    ${isUnlocked
                                            ? 'bg-white border-amber-300 shadow-sm'
                                            : 'bg-stone-100 border-stone-200 opacity-60 grayscale'
                                        }`
                                    }
                                >
                                    <div className="text-3xl mt-1">{reward.icon}</div>
                                    <div>
                                        <h4 className={`font-bold ${isUnlocked ? 'text-[var(--text-primary)]' : 'text-stone-500'}`}>
                                            {reward.title}
                                        </h4>
                                        <p className="text-sm text-stone-500">{reward.description}</p>
                                        {!isUnlocked && (
                                            <div className="mt-2 text-xs font-semibold text-stone-400">
                                                Brakuje {reward.pointsReq - points} p.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
