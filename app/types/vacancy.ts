export interface Vacancy {
  // Stable id; doubles as an element-id prefix on the vacancy card.
  id: string;
  title: string;
  employmentType: string;
  schedule: string;
  salary: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
}

export interface WorkBenefit {
  title: string;
  description: string;
}
