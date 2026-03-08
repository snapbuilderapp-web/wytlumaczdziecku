INSERT INTO quiz_questions (infographic_id, age_group, display_order, question_pl, explanation_pl, options)
SELECT id, 'under13', 1, 'Dlaczego niebo jest niebieskie?', 'Niebieskie światło rozprasza się we wszystkich kierunkach przez gazy i cząsteczki w powietrzu.', '[{"text": "Bo odbija kolor oceanu.", "correct": false}, {"text": "Bo niebieskie światło najlepiej się rozprasza.", "correct": true}, {"text": "Bo kosmos jest niebieski.", "correct": false}]'::jsonb
FROM infographics WHERE slug = 'dlaczego-niebo-jest-niebieskie';

INSERT INTO quiz_questions (infographic_id, age_group, display_order, question_pl, explanation_pl, options)
SELECT id, 'under13', 2, 'Co to jest rozpraszanie Rayleigha?', 'To zjawisko odpowiada za niebieski kolor nieba za dnia i czerwony podczas zachodu słońca.', '[{"text": "Wysyłanie rakiet w kosmos.", "correct": false}, {"text": "Zjawisko optyczne załamujące światło przez atmosferę.", "correct": true}, {"text": "Rodzaj chmur burzowych.", "correct": false}]'::jsonb
FROM infographics WHERE slug = 'dlaczego-niebo-jest-niebieskie';
