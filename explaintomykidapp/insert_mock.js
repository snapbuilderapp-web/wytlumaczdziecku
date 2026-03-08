/* eslint-disable */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: info, error: infoErr } = await supabase
    .from('infographics')
    .select('id, slug')
    .eq('slug', 'dlaczego-niebo-jest-niebieskie')
    .single();

  if (infoErr) {
    console.error('Error fetching info:', infoErr);
    return;
  }

  const infographicId = info.id;
  console.log('Found infographic ID:', infographicId);

  const { error: insErr } = await supabase
    .from('quiz_questions')
    .insert([
      {
        infographic_id: infographicId,
        age_group: 'under13',
        display_order: 1,
        question_pl: 'Dlaczego niebo jest niebieskie?',
        explanation_pl: 'Niebieskie światło rozprasza się we wszystkich kierunkach przez gazy i cząsteczki w powietrzu.',
        options: [{"text": "Bo odbija kolor oceanu.", "correct": false}, {"text": "Bo niebieskie światło najlepiej się rozprasza.", "correct": true}, {"text": "Bo kosmos jest niebieski.", "correct": false}]
      },
      {
        infographic_id: infographicId,
        age_group: 'under13',
        display_order: 2,
        question_pl: 'Co to jest rozpraszanie Rayleigha?',
        explanation_pl: 'To zjawisko odpowiada za niebieski kolor nieba za dnia i czerwony podczas zachodu słońca.',
        options: [{"text": "Wysyłanie rakiet w kosmos.", "correct": false}, {"text": "Zjawisko optyczne załamujące światło przez atmosferę.", "correct": true}, {"text": "Rodzaj chmur burzowych.", "correct": false}]
      }
    ]);

  if (insErr) {
    console.error('Insert error:', insErr);
  } else {
    console.log('Successfully inserted quiz questions');
  }
}
run();
