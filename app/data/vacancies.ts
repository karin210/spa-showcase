// Non-text data for the /work-with-us page. Every visible string lives in the
// message catalogue under careers.* (i18n/locales/<locale>/careers.json). Every
// vacancy is fictional.

export const WORK_BANNER_PHOTO_ID = "1519823551278-64ac92734fb1";

// Each id is the i18n key for the benefit's copy (careers.benefits.items.<id>.*).
export const WORK_BENEFIT_IDS = ["benefits", "training", "treatments", "schedules"] as const;

// Each id is the i18n key for the vacancy's copy (careers.vacancies.items.<id>.*) and
// doubles as an element-id prefix on the vacancy card.
export const VACANCY_IDS = ["massage-therapist", "cosmetologist", "front-desk"] as const;
