// Non-text data for the /about-us page. Every visible string lives in the message
// catalogue under about.* (i18n/locales/<locale>/about.json). The story, values and
// dates are fictional.

export const ABOUT_BANNER_PHOTO_ID = "1583416750470-965b2707b355";
export const PHILOSOPHY_PHOTO_ID = "1596178060671-7a80dc8059ea";

// Each id is the i18n key for the value's copy (about.values.items.<id>.*).
export const COMPANY_VALUE_IDS = [
  "mindful-care",
  "local-roots",
  "sustainability",
  "transparency",
  "growing-team",
  "safe-spaces",
] as const;

// Each year is the i18n key for its milestone (about.milestones.items.<year>).
export const MILESTONE_YEARS = ["2016", "2019", "2022", "2025"] as const;
