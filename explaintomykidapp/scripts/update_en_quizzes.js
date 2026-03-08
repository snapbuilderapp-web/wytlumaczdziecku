/* eslint-disable */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data: info, error: infoErr } = await supabase
        .from('infographics')
        .select('id')
        .eq('slug', 'dlaczego-niebo-jest-niebieskie')
        .single();

    if (infoErr) { console.error(infoErr); return; }

    // First delete any previous insertions just in case
    await supabase.from('quiz_questions').delete().eq('infographic_id', info.id);

    const { error: insErr } = await supabase
        .from('quiz_questions')
        .insert([
            {
                infographic_id: info.id,
                age_group: 'under13',
                display_order: 1,
                question_pl: 'Dlaczego niebo jest niebieskie?',
                question_en: 'Why is the sky blue?',
                explanation_pl: 'Niebieskie światło rozprasza się we wszystkich kierunkach przez gazy i cząsteczki w powietrzu.',
                explanation_en: 'Blue light is scattered in all directions by the tiny molecules of air in Earth\'s atmosphere.',
                options: [{ "text": "Bo odbija kolor oceanu.", "correct": false }, { "text": "Bo niebieskie światło najlepiej się rozprasza.", "correct": true }, { "text": "Bo kosmos jest niebieski.", "correct": false }],
                options_en: [{ "text": "Because it reflects the ocean.", "correct": false }, { "text": "Because blue light scatters the best.", "correct": true }, { "text": "Because space is blue.", "correct": false }]
            },
            {
                infographic_id: info.id,
                age_group: 'under13',
                display_order: 2,
                question_pl: 'Co to jest rozpraszanie Rayleigha?',
                question_en: 'What is Rayleigh scattering?',
                explanation_pl: 'To zjawisko odpowiada za niebieski kolor nieba za dnia i czerwony podczas zachodu słońca.',
                explanation_en: 'This phenomenon is responsible for the blue color of the sky during the day and red during sunset.',
                options: [{ "text": "Wysyłanie rakiet w kosmos.", "correct": false }, { "text": "Zjawisko optyczne załamujące światło przez atmosferę.", "correct": true }, { "text": "Rodzaj chmur burzowych.", "correct": false }],
                options_en: [{ "text": "Sending rockets to space.", "correct": false }, { "text": "An optical phenomenon scattering light through the atmosphere.", "correct": true }, { "text": "A type of storm cloud.", "correct": false }]
            }
        ]);

    if (insErr) {
        console.error('Insert error:', insErr);
    } else {
        console.log('Success inserting quiz questions!');
    }
}
run();
