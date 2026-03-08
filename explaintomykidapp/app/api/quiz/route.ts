import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { QuizQuestion } from '@/types'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const infographicId = searchParams.get('infographicId')
    const ageGroup = searchParams.get('ageGroup') || 'under13'

    if (!infographicId) {
        return NextResponse.json({ error: 'Missing infographicId' }, { status: 400 })
    }

    try {
        const supabase = await createClient()

        // Fetch questions for this infographic
        let query = supabase
            .from('quiz_questions')
            .select('*')
            .eq('infographic_id', infographicId)
            .order('display_order', { ascending: true })

        // If a specific age group is requested, try to filter by it
        if (ageGroup === 'under13' || ageGroup === '13plus') {
            query = query.eq('age_group', ageGroup)
        }

        const { data, error } = await query

        if (error) {
            console.error('Quiz fetch error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Safety fallback: if we asked for 13plus and got nothing, maybe only under13 exist (or vice versa/both exist as 'both')
        // A more robust app might fallback here, but for now we expect exact matches as per schema.

        return NextResponse.json({ questions: data as QuizQuestion[] })
    } catch (error) {
        console.error('Quiz fetch exception:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
