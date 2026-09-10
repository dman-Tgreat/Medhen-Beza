/**
 * lib/mock-data.ts
 *
 * Central typed mock-data file for all CMS-driven homepage sections.
 * When the real CMS / database is connected, replace each exported array
 * with the corresponding fetch call — page.tsx stays untouched.
 *
 * All types are imported from the component files that consume them.
 */

import {
  Stethoscope,
  Heart,
  Baby,
  Brain,
  Bone,
  Eye,
  Microscope,
  Pill,
  Award,
  ShieldCheck,
  Users,
  HeartHandshake,
  UserCheck,
  Building2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import type { ServiceCardData } from "@/components/content/ServiceCard";
import type { DepartmentCardData } from "@/components/content/DepartmentCard";
import type { DoctorCardData } from "@/components/content/DoctorCard";
import type { FacilityCardData } from "@/components/content/FacilityCard";
import type { NewsCardData } from "@/components/content/NewsCard";
import type { EventCardData } from "@/components/content/EventCard";
import type { GalleryCardData } from "@/components/content/GalleryCard";

// ─── Services (max 6 shown on homepage) ──────────────────────────────────────

export const MOCK_SERVICES: ServiceCardData[] = [
  {
    icon: Heart,
    name: "Cardiology",
    description:
      "Comprehensive heart care from routine screenings to advanced interventional procedures.",
    href: "/services/cardiology",
  },
  {
    icon: Brain,
    name: "Neurology",
    description:
      "Expert diagnosis and treatment for conditions of the brain, spine, and nervous system.",
    href: "/services/neurology",
  },
  {
    icon: Baby,
    name: "Maternity & Obstetrics",
    description:
      "Full-spectrum pregnancy support, labor & delivery, and postnatal care for mother and child.",
    href: "/services/maternity",
  },
  {
    icon: Bone,
    name: "Orthopedics",
    description:
      "Surgical and non-surgical treatment for bones, joints, ligaments, and sports injuries.",
    href: "/services/orthopedics",
  },
  {
    icon: Eye,
    name: "Ophthalmology",
    description:
      "Advanced eye care including laser correction, cataract surgery, and vision rehabilitation.",
    href: "/services/ophthalmology",
  },
  {
    icon: Stethoscope,
    name: "General Medicine",
    description:
      "Preventive care, health screenings, chronic disease management, and internal medicine.",
    href: "/services/general-medicine",
  },
  // Additional services exist — only the first 6 are shown on the homepage.
  {
    icon: Microscope,
    name: "Laboratory & Diagnostics",
    description:
      "State-of-the-art lab testing, imaging, and pathology services with rapid turnaround.",
    href: "/services/laboratory",
  },
  {
    icon: Pill,
    name: "Pharmacy",
    description:
      "In-house pharmacy stocked with prescription and over-the-counter medications.",
    href: "/services/pharmacy",
  },
];

// ─── Departments ──────────────────────────────────────────────────────────────

export const MOCK_DEPARTMENTS: DepartmentCardData[] = [
  {
    image: "",
    imageAlt: "Cardiology department",
    name: "Cardiology",
    description:
      "Our cardiology unit is equipped with the latest echo, stress-testing, and cath-lab technology.",
    href: "/departments/cardiology",
  },
  {
    image: "",
    imageAlt: "Maternity ward",
    name: "Maternity & Neonatal",
    description:
      "A dedicated ward with private labour suites, NICU, and round-the-clock midwifery support.",
    href: "/departments/maternity",
  },
  {
    image: "",
    imageAlt: "Pediatrics ward",
    name: "Pediatrics",
    description:
      "Child-friendly spaces and specialist paediatric care for newborns through adolescents.",
    href: "/departments/pediatrics",
  },
  {
    image: "",
    imageAlt: "Surgical department",
    name: "Surgery",
    description:
      "Elective and emergency surgical services supported by a fully-equipped operating theatre.",
    href: "/departments/surgery",
  },
];

// ─── Doctors ──────────────────────────────────────────────────────────────────

export const MOCK_DOCTORS: DoctorCardData[] = [
  {
    photo: "",
    name: "[Doctor Name]",
    specialty: "Cardiologist",
    department: "Cardiology Department",
    href: "/doctors/1",
  },
  {
    photo: "",
    name: "[Doctor Name]",
    specialty: "Neurologist",
    department: "Neurology Department",
    href: "/doctors/2",
  },
  {
    photo: "",
    name: "[Doctor Name]",
    specialty: "Obstetrician",
    department: "Maternity & Neonatal",
    href: "/doctors/3",
  },
  {
    photo: "",
    name: "[Doctor Name]",
    specialty: "Orthopedic Surgeon",
    department: "Orthopedics Department",
    href: "/doctors/4",
  },
];

// ─── Facilities ───────────────────────────────────────────────────────────────

export const MOCK_FACILITIES: FacilityCardData[] = [
  {
    image: "",
    imageAlt: "Main hospital building exterior",
    name: "Modern Inpatient Building",
    href: "/facilities/inpatient",
  },
  {
    image: "",
    imageAlt: "Operating theatre",
    name: "Surgical Theatres",
    href: "/facilities/surgery",
  },
  {
    image: "",
    imageAlt: "Diagnostic imaging suite",
    name: "Imaging & Diagnostics",
    href: "/facilities/imaging",
  },
  {
    image: "",
    imageAlt: "Pharmacy interior",
    name: "In-House Pharmacy",
    href: "/facilities/pharmacy",
  },
];

// ─── News ─────────────────────────────────────────────────────────────────────

export const MOCK_NEWS: NewsCardData[] = [
  {
    image: "",
    imageAlt: "Cardiology news",
    category: "Cardiology",
    date: "September 5, 2026",
    title: "[Placeholder] New cardiac catheterisation lab opens — expanding interventional heart services",
    href: "/news/cardiac-cath-lab",
  },
  {
    image: "",
    imageAlt: "Hospital news",
    category: "Hospital News",
    date: "August 28, 2026",
    title: "[Placeholder] Medhen Beza achieves national accreditation for patient safety standards",
    href: "/news/accreditation",
  },
  {
    image: "",
    imageAlt: "Community health",
    category: "Community",
    date: "August 15, 2026",
    title: "[Placeholder] Free community health screening day — over 300 residents served",
    href: "/news/community-screening",
  },
  {
    image: "",
    imageAlt: "Medical research",
    category: "Research",
    date: "August 2, 2026",
    title: "[Placeholder] Clinical research team publishes findings on maternal health outcomes",
    href: "/news/research-findings",
  },
];

// ─── Events ───────────────────────────────────────────────────────────────────

export const MOCK_EVENTS: EventCardData[] = [
  {
    image: "",
    imageAlt: "Health talk event",
    day: 18,
    month: "SEP",
    title: "[Placeholder] Free Public Health Talk — Understanding Heart Disease Risk Factors",
    href: "/events/heart-talk-sep",
  },
  {
    image: "",
    imageAlt: "Blood donation drive",
    day: 25,
    month: "SEP",
    title: "[Placeholder] Blood Donation Drive — Every Drop Counts",
    href: "/events/blood-drive-sep",
  },
  {
    image: "",
    imageAlt: "Medical conference",
    day: 10,
    month: "OCT",
    title: "[Placeholder] Annual Medical Conference — Advances in East African Healthcare",
    href: "/events/conference-oct",
  },
];

// ─── Gallery ──────────────────────────────────────────────────────────────────
// Requires real image/video URLs from the client.
// Placeholder srcs use a neutral grey swatch (data URI) so layout renders.

const GREY_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='800' height='600' fill='%23E2E8F0'/%3E%3C/svg%3E";

export const MOCK_GALLERY: GalleryCardData[] = [
  {
    src: GREY_PLACEHOLDER,
    alt: "[Placeholder] Hospital reception area",
    type: "image",
    href: "/gallery",
  },
  {
    src: GREY_PLACEHOLDER,
    alt: "[Placeholder] Tour of the cardiology wing",
    type: "video",
    duration: "2:14",
    href: "/gallery",
  },
  {
    src: GREY_PLACEHOLDER,
    alt: "[Placeholder] Surgical theatre equipment",
    type: "image",
    href: "/gallery",
  },
  {
    src: GREY_PLACEHOLDER,
    alt: "[Placeholder] Maternity ward tour",
    type: "video",
    duration: "3:45",
    href: "/gallery",
  },
  {
    src: GREY_PLACEHOLDER,
    alt: "[Placeholder] Paediatric ward playroom",
    type: "image",
    href: "/gallery",
  },
  {
    src: GREY_PLACEHOLDER,
    alt: "[Placeholder] Outpatient clinic",
    type: "image",
    href: "/gallery",
  },
  {
    src: GREY_PLACEHOLDER,
    alt: "[Placeholder] Medical staff team photo",
    type: "image",
    href: "/gallery",
  },
  {
    src: GREY_PLACEHOLDER,
    alt: "[Placeholder] Community health event highlights",
    type: "video",
    duration: "1:30",
    href: "/gallery",
  },
];

// ─── About Page Structured Types & Data ──────────────────────────────────────

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
      "[Placeholder] Committed to clinical excellence, compassionate patient care, and modern medical standards for the Addis Ababa community and beyond.",
    image: "",
    imageAlt: "Medhen Beza Hospital main medical facility",
  },
  introduction: {
    eyebrow: "Our Story & Purpose",
    title: "[Placeholder] Dedicated to compassionate care & clinical innovation",
    paragraphs: [
      "[Placeholder] Medhen Beza Hospital was established with a clear mandate: to provide accessible, patient-centered, and high-quality medical services to individuals and families throughout the region.",
      "[Placeholder] Our modern clinical campus brings together specialized physicians, experienced nursing teams, and advanced diagnostic infrastructure to deliver comprehensive healthcare across multiple medical disciplines.",
      "[Placeholder] Guided by strong ethical commitments and evidence-based clinical practices, we strive to make every patient visit safe, dignified, and supportive from admission through recovery.",
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
      text: "[Placeholder] To deliver high-quality, patient-focused healthcare services that enhance wellness, prevent illness, and heal with empathy, dignity, and professional integrity.",
    },
    vision: {
      eyebrow: "Our Vision",
      title: "Setting the benchmark for healthcare excellence in the region",
      text: "[Placeholder] To be recognized as a premier center of clinical excellence and medical innovation in East Africa, trusted by patients, families, and healthcare professionals alike.",
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
      name: "[Placeholder] Dr. Medical Director",
      position: "Chief Medical Officer",
      photo: "",
      photoAlt: "Chief Medical Officer portrait",
    },
    {
      name: "[Placeholder] Hospital Managing Director",
      position: "Managing Director / CEO",
      photo: "",
      photoAlt: "Managing Director portrait",
    },
    {
      name: "[Placeholder] Dr. Clinical Lead",
      position: "Head of Clinical Services & Surgery",
      photo: "",
      photoAlt: "Head of Clinical Services portrait",
    },
    {
      name: "[Placeholder] Director of Nursing",
      position: "Director of Nursing & Patient Experience",
      photo: "",
      photoAlt: "Director of Nursing portrait",
    },
  ],
  environment: {
    eyebrow: "Our Environment",
    title: "A calm, modern care facility designed for healing",
    description:
      "[Placeholder] Take a look at our clinical and welcoming hospital environment, designed for patient comfort, safety, and efficient care delivery.",
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

