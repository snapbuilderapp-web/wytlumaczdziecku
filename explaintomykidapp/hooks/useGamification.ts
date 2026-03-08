/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useState, useEffect } from 'react'

interface GamificationState {
    points: number
    completedInfographics: string[]
}

export function useGamification() {
    const [state, setState] = useState<GamificationState>({
        points: 0,
        completedInfographics: [],
    })

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const storedPoints = localStorage.getItem('wtk_points')
            const storedCompleted = localStorage.getItem('wtk_completed')

            setState({
                points: storedPoints ? parseInt(storedPoints, 10) : 0,
                completedInfographics: storedCompleted ? JSON.parse(storedCompleted) : [],
            })
        } catch (e) {
            console.error('Failed to load gamification state from localStorage', e)
        }
    }, [])

    const addPoints = (amount: number, infographicId?: string) => {
        setState((prev) => {
            // If an infographicId is provided, check if we already completed it to avoid double-rewarding
            if (infographicId && prev.completedInfographics.includes(infographicId)) {
                return prev
            }

            const newPoints = prev.points + amount
            const newCompleted = infographicId
                ? [...prev.completedInfographics, infographicId]
                : prev.completedInfographics

            // Save to localStorage
            try {
                localStorage.setItem('wtk_points', newPoints.toString())
                localStorage.setItem('wtk_completed', JSON.stringify(newCompleted))
            } catch (e) {
                console.error('Failed to save gamification state to localStorage', e)
            }

            return {
                points: newPoints,
                completedInfographics: newCompleted,
            }
        })
    }

    return {
        points: state.points,
        completedInfographics: state.completedInfographics,
        addPoints,
        isCompleted: (id: string) => state.completedInfographics.includes(id)
    }
}
