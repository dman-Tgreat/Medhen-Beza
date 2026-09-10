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
