export interface AboutData {
  name: string;
  role: string;
  tagline: string;
  location: string;
  summary: string;
  avatar?: string;
}

export interface Skill {
  name: string;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  contributions: string[];
}

export interface ProjectFeature {
  name: string;
}

export interface Project {
  name: string;
  subtitle: string;
  description: string;
  features: ProjectFeature[];
  architecture: string[];
  techStack: string[];
  liveUrl: string;
}

export interface Achievement {
  description: string;
}

export interface Certification {
  name: string;
  status: "Active" | "Inactive" | "In Progress";
  period?: string;
}

export interface Education {
  degree: string;
  year: string;
  institution: string;
}

export interface Interests {
  learning: string;
  hobbies: string[];
}

export interface ContactInfo {
  type: "email" | "linkedin" | "github" | "phone";
  label: string;
  value: string;
  url: string;
}

export interface PortfolioData {
  about: AboutData;
  skills: SkillCategory[];
  experience: Experience[];
  projects: Project[];
  achievements: Achievement[];
  certifications: Certification[];
  contact: ContactInfo[];
  education: Education[];
  interests: Interests;
}
