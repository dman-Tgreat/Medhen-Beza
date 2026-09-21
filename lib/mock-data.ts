/**
 * lib/mock-data.ts
 *
 * Central typed definition file for CMS-driven pages and sections.
 * All public pages read directly from Prisma Database queries.
 */

import {
  Heart,
  Award,
  ShieldCheck,
  Users,
  HeartHandshake,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

import type { ServiceCardData } from "@/components/content/ServiceCard";
import type { DepartmentCardData } from "@/components/content/DepartmentCard";
import type { DoctorCardData } from "@/components/content/DoctorCard";
import type { FacilityCardData } from "@/components/content/FacilityCard";
import type { NewsCardData } from "@/components/content/NewsCard";
import type { EventCardData } from "@/components/content/EventCard";
import type { GalleryCardData } from "@/components/content/GalleryCard";
import type { CareerCardData } from "@/components/content/CareerCard";
import type { FAQItem } from "@/components/content/FAQAccordion";

// ─── Extended Entity Interfaces ──────────────────────────────────────────────

export interface DepartmentDetailData extends DepartmentCardData {
  id: string;
  slug: string;
  longDescription: string;
  hours: string;
  phone: string;
  email: string;
  location: string;
  headDoctorName: string;
  keyServices: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
}

export interface ServiceDetailData extends ServiceCardData {
  id: string;
  slug: string;
  departmentSlug: string;
  departmentName: string;
  longDescription: string;
  availability: string;
  features: string[];
  procedures: string[];
  relatedDoctorSlugs: string[];
  image?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
}

export interface DoctorDetailData extends DoctorCardData {
  id: string;
  slug: string;
  title: string;
  departmentSlug: string;
  biography: string;
  qualifications: string[];
  experience: string;
  languages: string[];
  areasOfExpertise: string[];
  officeLocation: string;
  availability: string;
  contactEmail: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
}

export interface FacilityDetailData extends FacilityCardData {
  id: string;
  slug: string;
  tagline: string;
  description: string;
  longDescription: string;
  location: string;
  capacity?: string;
  features: string[];
  galleryImages: { src: string; alt: string; caption?: string }[];
}

export interface NewsDetailData extends NewsCardData {
  id: string;
  slug: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    photo?: string;
  };
  summary: string;
  contentParagraphs: string[];
  keyTakeaways?: string[];
  quote?: {
    text: string;
    author: string;
  };
  tags: string[];
  isFeatured?: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
}

export interface GalleryDetailItem extends GalleryCardData {
  id: string;
  title: string;
  category: "Facilities" | "Clinical Care" | "Community" | "Medical Team";
  description: string;
  videoSrc?: string;
}

export interface EventDetailData extends EventCardData {
  id: string;
  slug: string;
  year: number | string;
  dateFormatted: string;
  time: string;
  location: string;
  isPast: boolean;
  description: string;
  fullDescription: string[];
  agenda: { time: string; topic: string; presenter?: string }[];
  speaker?: { name: string; title: string };
  registrationInfo: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
}

export interface CareerDetailData extends CareerCardData {
  id: string;
  slug: string;
  departmentSlug: string;
  postedDate: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  qualifications: string[];
  benefits: string[];
  contactEmail: string;
}

export interface FAQCategoryGroup {
  id: string;
  category: string;
  description: string;
  items: FAQItem[];
}

export interface AboutHeroData {
  title: string;
  supportingText: string;
  image?: string;
  imageAlt: string;
}

export interface AboutIntroductionData {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  photo?: string;
  photoAlt: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface AboutMissionVisionData {
  mission: {
    eyebrow: string;
    title: string;
    text: string;
  };
  vision: {
    eyebrow: string;
    title: string;
    text: string;
  };
}

export interface AboutValueItem {
  icon: LucideIcon;
  label: string;
  description: string;
}

export interface AboutLeaderItem {
  name: string;
  position: string;
  photo?: string;
  photoAlt?: string;
}

export interface AboutEnvironmentImage {
  name: string;
  category: string;
  image?: string;
  imageAlt: string;
}

export interface AboutEnvironmentData {
  eyebrow: string;
  title: string;
  description: string;
  featured: AboutEnvironmentImage;
  supporting: AboutEnvironmentImage[];
}

export interface AboutAccreditationItem {
  name: string;
  issuer: string;
  logo?: string;
  logoAlt?: string;
}

export interface AboutFinalCtaData {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface AboutPageData {
  hero: AboutHeroData;
  introduction: AboutIntroductionData;
  missionVision: AboutMissionVisionData;
  values: AboutValueItem[];
  leadership: AboutLeaderItem[];
  environment: AboutEnvironmentData;
  accreditations: AboutAccreditationItem[];
  finalCta: AboutFinalCtaData;
}

export const MOCK_ABOUT_PAGE: AboutPageData = {
  hero: {
    title: "About Medhen Beza",
    supportingText:
      "Committed to clinical excellence, compassionate patient care, and modern medical standards for the Addis Ababa community and beyond.",
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Medhen Beza Hospital main medical facility",
  },
  introduction: {
    eyebrow: "Our Story & Purpose",
    title: "Dedicated to compassionate care & clinical innovation",
    paragraphs: [
      "Medhen Beza Hospital was established with a clear mandate: to provide accessible, patient-centered, and high-quality medical services to individuals and families throughout the region.",
      "Our modern clinical campus brings together specialized physicians, experienced nursing teams, and advanced diagnostic infrastructure to deliver comprehensive healthcare across multiple medical disciplines.",
      "Guided by strong ethical commitments and evidence-based clinical practices, we strive to make every patient visit safe, dignified, and supportive from admission through recovery.",
    ],
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=80",
    photoAlt: "Medical team and care providers at Medhen Beza Hospital",
    ctaLabel: "Contact Us",
    ctaHref: "/contact",
  },
  missionVision: {
    mission: {
      eyebrow: "Our Mission",
      title: "Compassionate, high-standard healthcare for every patient",
      text: "To deliver high-quality, patient-focused healthcare services that enhance wellness, prevent illness, and heal with empathy, dignity, and professional integrity.",
    },
    vision: {
      eyebrow: "Our Vision",
      title: "Setting the benchmark for healthcare excellence in the region",
      text: "To be recognized as a premier center of clinical excellence and medical innovation in East Africa, trusted by patients, families, and healthcare professionals alike.",
    },
  },
  values: [
    {
      icon: Heart,
      label: "Compassion",
      description: "Treating every patient and family member with empathy, warmth, and genuine human kindness.",
    },
    {
      icon: Award,
      label: "Excellence",
      description: "Pursuing the highest clinical and operational standards across all our services and departments.",
    },
    {
      icon: ShieldCheck,
      label: "Integrity",
      description: "Upholding complete medical honesty, confidentiality, and professional ethics in every interaction.",
    },
    {
      icon: Users,
      label: "Collaboration",
      description: "Working as multidisciplinary care teams to deliver integrated diagnosis and treatment plans.",
    },
    {
      icon: HeartHandshake,
      label: "Respect",
      description: "Honoring patient dignity, cultural diversity, and individual choices at every stage of care.",
    },
    {
      icon: UserCheck,
      label: "Safety",
      description: "Maintaining strict infection control, sterile protocols, and continuous patient safety monitoring.",
    },
  ],
  leadership: [
    {
      name: "Dr. Kebede Tadesse",
      position: "Chief Executive Officer & Medical Director",
      photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
      photoAlt: "Dr. Kebede Tadesse — CEO & Medical Director",
    },
    {
      name: "Dr. Selamawit Bekele",
      position: "Head of Clinical Services & Senior Cardiologist",
      photo: "https://images.unsplash.com/photo-1594824813520-a7d57f12e2c5?auto=format&fit=crop&w=800&q=80",
      photoAlt: "Dr. Selamawit Bekele — Head of Clinical Services",
    },
    {
      name: "Sister Bethlehem Worku",
      position: "Director of Nursing Operations",
      photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
      photoAlt: "Sister Bethlehem Worku — Director of Nursing Operations",
    },
    {
      name: "Ato Dawit Alemu",
      position: "Chief Financial & Administrative Officer",
      photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
      photoAlt: "Ato Dawit Alemu — Chief Administrative Officer",
    },
  ],
  environment: {
    eyebrow: "Healing Environment",
    title: "Infrastructure designed for comfort, recovery & safety",
    description:
      "Our hospital campus combines sterile clinical functionality with calming architectural elements to support rapid patient healing and family comfort.",
    featured: {
      name: "Inpatient Pavilion",
      category: "Inpatient Suites",
      image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Spacious private inpatient suite with electric bed and natural lighting",
    },
    supporting: [
      {
        name: "Surgical Suites",
        category: "Operating Theatres",
        image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80",
        imageAlt: "Sterile surgical theatre with modern operating lighting and laparoscopic columns",
      },
      {
        name: "Diagnostic Tower",
        category: "Radiology & Labs",
        image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
        imageAlt: "Advanced digital CT scanner and automated diagnostic laboratory",
      },
      {
        name: "Outpatient Clinic",
        category: "Consultation Rooms",
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
        imageAlt: "Modern outpatient consultation room with digital physician workstation",
      },
    ],
  },
  accreditations: [
    {
      name: "Ethiopian Ministry of Health",
      issuer: "Federal Ministry of Health (FMOH)",
    },
    {
      name: "ISO 9001:2015 Quality Management System",
      issuer: "International Organization for Standardization",
    },
  ],
  finalCta: {
    title: "Experience compassionate, high-standard healthcare",
    description:
      "Whether you need a routine health check-up, specialist consultation, or emergency care, our medical team is ready to serve you 24/7.",
    ctaLabel: "Contact Us Today",
    ctaHref: "/contact",
  },
};

// ─── Extended Entity Interfaces ──────────────────────────────────────────────

export interface DepartmentDetailData extends DepartmentCardData {
  id: string;
  slug: string;
  longDescription: string;
  hours: string;
  phone: string;
  email: string;
  location: string;
  headDoctorName: string;
  keyServices: string[];
}

export interface ServiceDetailData extends ServiceCardData {
  id: string;
  slug: string;
  departmentSlug: string;
  departmentName: string;
  longDescription: string;
  availability: string;
  features: string[];
  procedures: string[];
  relatedDoctorSlugs: string[];
}

export interface DoctorDetailData extends DoctorCardData {
  id: string;
  slug: string;
  title: string;
  departmentSlug: string;
  biography: string;
  qualifications: string[];
  experience: string;
  languages: string[];
  areasOfExpertise: string[];
  officeLocation: string;
  availability: string;
  contactEmail: string;
}

export interface FacilityDetailData extends FacilityCardData {
  id: string;
  slug: string;
  tagline: string;
  description: string;
  longDescription: string;
  location: string;
  capacity?: string;
  features: string[];
  galleryImages: { src: string; alt: string; caption?: string }[];
}

export interface NewsDetailData extends NewsCardData {
  id: string;
  slug: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    photo?: string;
  };
  summary: string;
  contentParagraphs: string[];
  keyTakeaways?: string[];
  quote?: {
    text: string;
    author: string;
  };
  tags: string[];
  isFeatured?: boolean;
}

export interface GalleryDetailItem extends GalleryCardData {
  id: string;
  title: string;
  category: "Facilities" | "Clinical Care" | "Community" | "Medical Team";
  description: string;
  videoSrc?: string;
}

export interface EventDetailData extends EventCardData {
  id: string;
  slug: string;
  year: number | string;
  dateFormatted: string;
  time: string;
  location: string;
  isPast: boolean;
  description: string;
  fullDescription: string[];
  agenda: { time: string; topic: string; presenter?: string }[];
  speaker?: { name: string; title: string };
  registrationInfo: string;
}

export interface CareerDetailData extends CareerCardData {
  id: string;
  slug: string;
  departmentSlug: string;
  postedDate: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  qualifications: string[];
  benefits: string[];
  contactEmail: string;
}

export interface FAQCategoryGroup {
  id: string;
  category: string;
  description: string;
}

export interface AboutPageData {
  hero: AboutHeroData;
  introduction: AboutIntroductionData;
  missionVision: AboutMissionVisionData;
  values: AboutValueItem[];
  leadership: AboutLeaderItem[];
  environment: AboutEnvironmentData;
  accreditations: AboutAccreditationItem[];
  finalCta: AboutFinalCtaData;
}

const MOCK_ABOUT_PAGE_LEGACY: AboutPageData = {
  hero: {
    title: "About Medhen Beza",
    supportingText:
      "Committed to clinical excellence, compassionate patient care, and modern medical standards for the Addis Ababa community and beyond.",
    image: "",
    imageAlt: "Medhen Beza Hospital main medical facility",
  },
  introduction: {
    eyebrow: "Our Story & Purpose",
    title: "Dedicated to compassionate care & clinical innovation",
    paragraphs: [
      "Medhen Beza Hospital was established with a clear mandate: to provide accessible, patient-centered, and high-quality medical services to individuals and families throughout the region.",
      "Our modern clinical campus brings together specialized physicians, experienced nursing teams, and advanced diagnostic infrastructure to deliver comprehensive healthcare across multiple medical disciplines.",
      "Guided by strong ethical commitments and evidence-based clinical practices, we strive to make every patient visit safe, dignified, and supportive from admission through recovery.",
    ],
    photo: "",
    photoAlt: "Medical team and care providers at Medhen Beza Hospital",
    ctaLabel: "Contact Us",
    ctaHref: "/contact",
  },
  missionVision: {
    mission: {
      eyebrow: "Our Mission",
      title: "Compassionate, high-standard healthcare for every patient",
      text: "To deliver high-quality, patient-focused healthcare services that enhance wellness, prevent illness, and heal with empathy, dignity, and professional integrity.",
    },
    vision: {
      eyebrow: "Our Vision",
      title: "Setting the benchmark for healthcare excellence in the region",
      text: "To be recognized as a premier center of clinical excellence and medical innovation in East Africa, trusted by patients, families, and healthcare professionals alike.",
    },
  },
  values: [
    {
      icon: Heart,
      label: "Compassion",
      description: "Treating every patient and family member with empathy, warmth, and genuine human kindness.",
    },
    {
      icon: Award,
      label: "Excellence",
      description: "Pursuing the highest clinical and operational standards across all our services and departments.",
    },
    {
      icon: ShieldCheck,
      label: "Integrity",
      description: "Upholding honesty, ethical transparency, patient confidentiality, and medical accountability.",
    },
    {
      icon: Users,
      label: "Teamwork",
      description: "Collaborating across multidisciplinary teams to ensure holistic and coordinated patient care.",
    },
    {
      icon: HeartHandshake,
      label: "Respect",
      description: "Valuing individual dignity, cultural diversity, and patient autonomy at every point of interaction.",
    },
    {
      icon: UserCheck,
      label: "Patient Focus",
      description: "Placing patient safety, comfort, and positive clinical outcomes at the center of every decision.",
    },
  ],
  leadership: [
    {
      name: "Dr. Selamawit Bekele",
      position: "Chief Medical Officer & Cardiology Lead",
      photo: "",
      photoAlt: "Chief Medical Officer portrait",
    },
    {
      name: "Ato Tadesse Haile",
      position: "Managing Director / CEO",
      photo: "",
      photoAlt: "Managing Director portrait",
    },
    {
      name: "Dr. Dawit Haile",
      position: "Head of Clinical Services & Surgery",
      photo: "",
      photoAlt: "Head of Clinical Services portrait",
    },
    {
      name: "Sister Almaz Gebre",
      position: "Director of Nursing & Patient Experience",
      photo: "",
      photoAlt: "Director of Nursing portrait",
    },
  ],
  environment: {
    eyebrow: "Our Environment",
    title: "A calm, modern care facility designed for healing",
    description:
      "Take a look at our clinical and welcoming hospital environment, designed for patient comfort, safety, and efficient care delivery.",
    featured: {
      name: "Main Campus & Inpatient Pavilion",
      category: "Main Campus",
      image: "",
      imageAlt: "Medhen Beza Hospital main campus and inpatient building exterior",
    },
    supporting: [
      {
        name: "Reception & Patient Welcoming Area",
        category: "Welcoming & Admitting",
        image: "",
        imageAlt: "Spacious and calm hospital reception and welcoming desk",
      },
      {
        name: "Diagnostic Pathology & Lab Suites",
        category: "Diagnostics & Imaging",
        image: "",
        imageAlt: "Modern diagnostic laboratory and testing stations",
      },
      {
        name: "Specialized Clinical Treatment Suites",
        category: "Clinical Care",
        image: "",
        imageAlt: "Comfortable and sterile patient treatment consultation suite",
      },
    ],
  },
  accreditations: [
    {
      name: "National Health Regulatory Authority (EFDA)",
      issuer: "Ministry of Health Ethiopia",
      logo: "",
      logoAlt: "National Health Authority Certification badge",
    },
    {
      name: "Quality & Patient Safety Standards Accreditation",
      issuer: "Healthcare Quality Board",
      logo: "",
      logoAlt: "Healthcare Quality Standards seal",
    },
    {
      name: "Clinical Diagnostic Excellence Certification",
      issuer: "Medical Laboratory Standards",
      logo: "",
      logoAlt: "Clinical Diagnostic Excellence badge",
    },
  ],
  finalCta: {
    title: "Have questions about our hospital?",
    description: "Our team is ready to help.",
    ctaLabel: "Contact Us",
    ctaHref: "/contact",
  },
};
