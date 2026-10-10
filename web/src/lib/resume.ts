import resumeData from "@/data/resume.json";

export interface Profile {
  name: string;
  headline: string;
  location: string;
  email: string;
  linkedin_url: string;
  summary: string;
  focus_areas: string[];
  business_domains: string[];
}

export interface Stat {
  label: string;
  value: string;
  details?: string[];
}

export interface FocusAreaExample {
  client: string;
  accomplishment: string;
}

export interface Industry {
  name: string;
  examples: string[];
}

export interface SkillEntry {
  name: string;
  endorsements: number;
}

export interface Engagement {
  client: string;
  role: string | null;
  former: boolean;
  bullets: string[];
}

export interface FeaturedRole {
  company: string;
  location: string;
  date_range: string;
  role: string;
  summary: string | null;
  bullets: string[];
  engagements: Engagement[];
  rewards: string[];
}

export interface EarlierRole {
  company: string;
  location: string;
  date_range: string;
  role: string;
  highlight: string;
}

export interface Experience {
  featured: FeaturedRole[];
  earlier: EarlierRole[];
  earlier_rewards: string[];
}

export interface EducationEntry {
  school: string;
  degree: string;
  field_of_study: string;
  start_year: string;
  end_year: string;
  description: string;
}

export interface CertificationEntry {
  name: string;
  authority: string;
  issued_date: string;
}

export interface PortfolioLink {
  label: string;
  url: string;
}

export interface PortfolioItem {
  title: string;
  links: PortfolioLink[];
}

export interface Resume {
  profile: Profile;
  stats: Stat[];
  focus_area_examples: Record<string, FocusAreaExample[]>;
  industries: Industry[];
  skills: SkillEntry[];
  experience: Experience;
  education: EducationEntry[];
  certifications: CertificationEntry[];
  portfolio: PortfolioItem[];
  fun_facts: string[];
}

export const resume = resumeData as Resume;
