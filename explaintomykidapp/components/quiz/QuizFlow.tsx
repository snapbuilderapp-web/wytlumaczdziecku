'use client'

import { useState, useEffect } from 'react'
import type { QuizQuestion, AgeGroup } from '@/types'
import { useGamification } from '@/hooks/useGamification'

interface QuizFlowProps {
    infographicId: string
    ageGroup: AgeGroup
    lang?: 'pl' | 'en'
}

export function QuizFlow({ infographicId, ageGroup, lang = 'pl' }: QuizFlowProps) {
    const [questions, setQuestions] = useState<QuizQuestion[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [showExplanation, setShowExplanation] = useState(false)
    const [quizFinished, setQuizFinished] = useState(false)
    const [score, setScore] = useState(0)

    const { addPoints, isCompleted } = useGamification()
    const alreadyDone = isCompleted(infographicId)
    const isEn = lang === 'en'

    const uiText = {
        loading: isEn ? "Loading quiz..." : "Ładowanie quizu...",
        alreadyDone: isEn ? "Quiz completed!" : "Quiz rozwiązany!",
        alreadyDoneDesc: isEn ? "You already earned points for this topic." : "Zdobyłeś już punkty za ten temat.",
        playAgain: isEn ? "Play again (no points)" : "Rozwiąż ponownie (bez punktów)",
        greatJob: isEn ? "Great job!" : "Super robota!",
        scoreText: isEn ? "Your score:" : "Twój wynik:",
        nextQuestion: isEn ? "Next question" : "Następne pytanie",
        finishQuiz: isEn ? "Finish quiz" : "Zakończ quiz",
        testYourself: isEn ? "Test Yourself" : "Sprawdź się",
        points: isEn ? "PTS!" : "PKT!"
    }

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const res = await fetch(`/api/quiz?infographicId=${infographicId}&ageGroup=${ageGroup}`)
                if (!res.ok) throw new Error('Fetch failed')
                const data = await res.json()
                setQuestions(data.questions || [])
            } catch (err) {
                console.error(err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        fetchQuestions()
    }, [infographicId, ageGroup])

    if (loading) {
        return (
            <div className="w-full bg-[var(--bg-card)] rounded-xl p-6 border border-stone-200 text-center text-[var(--text-secondary)]">
                <p>{uiText.loading}</p>
            </div>
        )
    }

    if (error || questions.length === 0) {
        // Fail gracefully by hiding the quiz entirely if there are no questions
        return null
    }

    // Already completed UI
    if (alreadyDone && !quizFinished && currentIndex === 0) {
        return (
            <div className="w-full bg-[var(--brand-science)]/10 rounded-xl p-6 border border-[var(--brand-science)]/30 text-center mt-8">
                <div className="text-4xl mb-3">⭐</div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 font-[family-name:var(--age-font-display)]">
                    {uiText.alreadyDone}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm mb-4">
                    {uiText.alreadyDoneDesc}
                </p>
                <button
                    onClick={() => setCurrentIndex(0)}
                    className="text-sm font-semibold text-[var(--brand-science)] hover:underline"
                >
                    {uiText.playAgain}
                </button>
            </div>
        )
    }

    // Finished UI
    if (quizFinished) {
        return (
            <div className="w-full bg-[#FFFBF5] rounded-xl p-8 border-2 border-amber-300 text-center shadow-sm mt-8 relative overflow-hidden">
                {/* Confetti decoration */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0iIzNGN0U0NCI+PHBhdGggZD0iTTExIDEwaDJ2NGgtMnpNMTUgMTB2NGgydi00ek03IDEwdjRoMnYtNHoiLz48L3N2Zz4=')]"></div>

                <div className="text-5xl mb-4 relative z-10">🎉</div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2 font-[family-name:var(--age-font-display)] relative z-10">
                    {uiText.greatJob}
                </h3>
                <p className="text-[var(--text-secondary)] mb-4 relative z-10">
                    {uiText.scoreText} {score} / {questions.length}
                </p>
                {!alreadyDone && (
                    <div className="inline-block bg-amber-400 text-amber-950 font-bold px-4 py-2 rounded-full relative z-10 animate-bounce">
                        + {score * 10} {uiText.points}
                    </div>
                )}
            </div>
        )
    }

    const currentQ = questions[currentIndex]
    const displayQuestion = isEn && currentQ.question_en ? currentQ.question_en : currentQ.question_pl
    const displayExplanation = isEn && currentQ.explanation_en ? currentQ.explanation_en : currentQ.explanation_pl
    // Fall back to Polish options if English options are missing or invalid
    const displayOptions = isEn && currentQ.options_en && Array.isArray(currentQ.options_en) ? currentQ.options_en : currentQ.options

    const handleOptionClick = (index: number) => {
        if (showExplanation) return // Don't allow changing answer

        setSelectedAnswer(index)
        setShowExplanation(true)

        if (displayOptions[index]?.correct) {
            setScore(s => s + 1)
        }
    }

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(c => c + 1)
            setSelectedAnswer(null)
            setShowExplanation(false)
        } else {
            setQuizFinished(true)
            if (!alreadyDone) {
                // Award 10 points per correct answer + 10 points for the current one if correct
                addPoints(score * 10 + (displayOptions[selectedAnswer!]?.correct ? 10 : 0), infographicId)
            }
        }
    }

    return (
        <div className="w-full bg-white rounded-xl p-6 border-2 border-stone-200 mt-8 shadow-sm">
            {/* Quiz Header & Progress */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-[var(--text-primary)] font-[family-name:var(--age-font-display)] flex items-center gap-2">
                    <span>🧠</span> {uiText.testYourself}
                </h3>
                <div className="text-xs font-semibold text-[var(--text-tertiary)] bg-stone-100 px-2 py-1 rounded">
                    {currentIndex + 1} / {questions.length}
                </div>
            </div>

            <div className="w-full bg-stone-100 h-1.5 rounded-full mb-6 overflow-hidden">
                <div
                    className="bg-amber-400 h-full transition-all duration-300 ease-out"
                    style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
                ></div>
            </div>

            {/* Question */}
            <h4 className="text-lg font-medium text-[var(--text-primary)] mb-5">
                {displayQuestion}
            </h4>

            {/* Options */}
            <div className="space-y-3 mb-6">
                {displayOptions.map((opt, idx) => {
                    let btnColor = "border-stone-200 hover:border-stone-300 bg-white"

                    if (showExplanation) {
                        if (opt.correct) {
                            btnColor = "border-green-500 bg-green-50 text-green-900"
                        } else if (idx === selectedAnswer) {
                            btnColor = "border-red-500 bg-red-50 text-red-900"
                        } else {
                            btnColor = "border-stone-200 bg-white opacity-50"
                        }
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleOptionClick(idx)}
                            disabled={showExplanation}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${btnColor} focus-visible:outline-blue-500`}
                        >
                            <span className="font-medium">{opt.text}</span>
                        </button>
                    )
                })}
            </div>

            {/* Explanation & Next */}
            {showExplanation && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="p-4 bg-stone-50 rounded-lg border border-stone-100 mb-4">
                        <p className="text-sm text-[var(--text-secondary)]">
                            {displayExplanation}
                        </p>
                    </div>
                    <button
                        onClick={handleNext}
                        className="w-full py-3 px-4 bg-[var(--text-primary)] text-white font-bold rounded-xl hover:bg-stone-800 transition-colors focus-visible:ring-4 focus-visible:ring-stone-300"
                    >
                        {currentIndex < questions.length - 1 ? uiText.nextQuestion : uiText.finishQuiz}
                    </button>
                </div>
            )}
        </div>
    )
}
