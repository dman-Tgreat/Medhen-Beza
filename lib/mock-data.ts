/**
 * lib/mock-data.ts
 *
 * Central typed mock-data file for all CMS-driven pages and sections.
 * When the real CMS / database is connected, replace each getter/array
 * with the corresponding fetch call — page layouts remain untouched.
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
  Activity,
  Syringe,
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

const GREY_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='800' height='600' fill='%23E2E8F0'/%3E%3C/svg%3E";

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
  items: FAQItem[];
}

// ─── 1. Departments Data ─────────────────────────────────────────────────────

export const MOCK_DEPARTMENTS_DETAILED: DepartmentDetailData[] = [
  {
    id: "dept-1",
    slug: "cardiology",
    name: "Cardiology",
    image: "",
    imageAlt: "Cardiology department catheterization lab and care center",
    description:
      "Our cardiology unit is equipped with the latest echo, stress-testing, and cath-lab technology.",
    longDescription:
      "The Department of Cardiology at Medhen Beza Hospital provides comprehensive, state-of-the-art diagnostic and therapeutic care for patients with cardiovascular conditions. From non-invasive diagnostics like 3D echocardiography and continuous ECG monitoring to advanced coronary angiography and stent placement in our dedicated catheterization lab, our multidisciplinary team delivers round-the-clock cardiac care.",
    href: "/departments/cardiology",
    hours: "Mon – Sat: 8:00 AM – 6:00 PM · Emergency Interventions: 24/7",
    phone: "+251 116 000 120",
    email: "cardiology@medhenbeza.com",
    location: "Main Medical Wing, Building A, 2nd Floor",
    headDoctorName: "Dr. Selamawit Bekele",
    keyServices: ["cardiology", "general-medicine"],
  },
  {
    id: "dept-2",
    slug: "maternity",
    name: "Maternity & Neonatal",
    image: "",
    imageAlt: "Maternity ward, labor suites, and neonatal intensive care unit",
    description:
      "A dedicated ward with private labour suites, NICU, and round-the-clock midwifery support.",
    longDescription:
      "Our Maternity & Neonatal Department offers complete perinatal care designed around maternal comfort, safety, and newborn wellbeing. Equipped with private birthing suites, a Level III Neonatal Intensive Care Unit (NICU), advanced fetal ultrasound monitoring, and 24/7 obstetric surgical coverage, we support families through every stage of pregnancy, childbirth, and postnatal recovery.",
    href: "/departments/maternity",
    hours: "Outpatient Clinic: Mon – Fri: 8:30 AM – 5:30 PM · Labor & Delivery: 24/7",
    phone: "+251 116 000 130",
    email: "maternity@medhenbeza.com",
    location: "Women & Child Care Pavilion, Building B, 1st & 2nd Floors",
    headDoctorName: "Dr. Bethlehem Tesfaye",
    keyServices: ["maternity", "pediatrics"],
  },
  {
    id: "dept-3",
    slug: "pediatrics",
    name: "Pediatrics & Child Health",
    image: "",
    imageAlt: "Pediatrics ward, examination suites, and child-friendly play area",
    description:
      "Child-friendly spaces and specialist paediatric care for newborns through adolescents.",
    longDescription:
      "The Department of Pediatrics provides dedicated medical care tailored to infants, children, and adolescents. Our team of pediatrician specialists, pediatric nurses, and allied health professionals treat general pediatric conditions, childhood infectious diseases, nutritional disorders, respiratory illnesses, and developmental milestones in a warm, welcoming, and child-friendly atmosphere.",
    href: "/departments/pediatrics",
    hours: "Mon – Sat: 8:00 AM – 6:00 PM · Pediatric Emergency: 24/7",
    phone: "+251 116 000 140",
    email: "pediatrics@medhenbeza.com",
    location: "Women & Child Care Pavilion, Building B, Ground Floor",
    headDoctorName: "Dr. Amen Alemu",
    keyServices: ["pediatrics", "general-medicine"],
  },
  {
    id: "dept-4",
    slug: "surgery",
    name: "Surgery & Anesthesia",
    image: "",
    imageAlt: "Surgical department and modern operating theatres",
    description:
      "Elective and emergency surgical services supported by fully-equipped operating theatres.",
    longDescription:
      "The Department of Surgery delivers high-precision surgical interventions across general surgery, minimally invasive laparoscopic surgery, orthopedic procedures, and trauma surgery. Our surgical suites are integrated with HEPA filtration, modern anesthetic monitoring workstations, and dedicated post-anesthesia recovery units (PACU) to maximize patient safety.",
    href: "/departments/surgery",
    hours: "Surgical Consultations: Mon – Fri: 8:00 AM – 5:00 PM · Emergency Surgery: 24/7",
    phone: "+251 116 000 150",
    email: "surgery@medhenbeza.com",
    location: "Surgical Complex, Building A, 3rd Floor",
    headDoctorName: "Dr. Dawit Haile",
    keyServices: ["surgery", "orthopedics"],
  },
  {
    id: "dept-5",
    slug: "neurology",
    name: "Neurology & Spine",
    image: "",
    imageAlt: "Neurology diagnostic suite and EEG monitoring facility",
    description:
      "Comprehensive diagnostics and specialized therapy for brain, spine, and nervous system disorders.",
    longDescription:
      "The Neurology & Spine Department specializes in the evaluation, diagnosis, and management of conditions affecting the central and peripheral nervous systems. From acute stroke intervention and seizure management to chronic migraine, neuropathy, and neurodegenerative disorders, our clinical team works with digital neuro-diagnostics (EEG, EMG, and MRI).",
    href: "/departments/neurology",
    hours: "Mon – Fri: 8:30 AM – 5:00 PM · On-Call Neuro Emergency: 24/7",
    phone: "+251 116 000 160",
    email: "neurology@medhenbeza.com",
    location: "Diagnostic & Specialty Tower, Building C, 2nd Floor",
    headDoctorName: "Dr. Yohannes Assefa",
    keyServices: ["neurology", "diagnostics"],
  },
  {
    id: "dept-6",
    slug: "orthopedics",
    name: "Orthopedics & Joint Care",
    image: "",
    imageAlt: "Orthopedic clinic, casting room, and physical therapy center",
    description:
      "Surgical and non-surgical treatment for bones, joints, sports injuries, and rehabilitation.",
    longDescription:
      "Our Orthopedics Department provides comprehensive musculoskeletal care ranging from fracture management, joint arthroplasty, and arthroscopic procedures to sports medicine and post-operative physical rehabilitation. Our goal is restoring pain-free mobility and long-term joint function.",
    href: "/departments/orthopedics",
    hours: "Mon – Sat: 8:00 AM – 5:30 PM",
    phone: "+251 116 000 170",
    email: "orthopedics@medhenbeza.com",
    location: "Main Medical Wing, Building A, 1st Floor",
    headDoctorName: "Dr. Dawit Haile",
    keyServices: ["orthopedics", "surgery"],
  },
  {
    id: "dept-7",
    slug: "ophthalmology",
    name: "Ophthalmology & Vision Care",
    image: "",
    imageAlt: "Ophthalmology clinic, vision testing lane, and laser surgery suite",
    description:
      "Advanced eye care including cataract micro-surgery, retina evaluation, and vision rehabilitation.",
    longDescription:
      "The Ophthalmology Clinic offers comprehensive ocular assessments, cataract surgical care, glaucoma management, diabetic retinopathy screening, and refractive evaluations. Utilizing digital slit-lamp imaging, optical coherence tomography (OCT), and laser therapy, we safeguard and restore your vision.",
    href: "/departments/ophthalmology",
    hours: "Mon – Fri: 8:30 AM – 5:00 PM · Sat: 9:00 AM – 1:00 PM",
    phone: "+251 116 000 180",
    email: "eyes@medhenbeza.com",
    location: "Specialty Outpatient Wing, Building C, 1st Floor",
    headDoctorName: "Dr. Tigist Mengistu",
    keyServices: ["ophthalmology"],
  },
  {
    id: "dept-8",
    slug: "diagnostics",
    name: "Laboratory & Diagnostics",
    image: "",
    imageAlt: "Automated clinical laboratory and imaging suite",
    description:
      "State-of-the-art pathology, hematology, digital X-ray, ultrasound, CT, and MRI diagnostics.",
    longDescription:
      "Equipped with automated clinical chemistry analyzers, molecular diagnostics, and full digital imaging capabilities (digital radiography, high-resolution ultrasound, and helical CT scanning), our Diagnostic Center delivers accurate, rapid turnaround laboratory and imaging reports to support timely clinical decision-making.",
    href: "/departments/diagnostics",
    hours: "Routine Testing: Mon – Sat: 7:30 AM – 7:00 PM · Emergency Diagnostics: 24/7",
    phone: "+251 116 000 190",
    email: "lab@medhenbeza.com",
    location: "Diagnostic Tower, Building C, Ground Floor",
    headDoctorName: "Dr. Yohannes Assefa",
    keyServices: ["laboratory", "pharmacy"],
  },
];

export const MOCK_DEPARTMENTS: DepartmentCardData[] = MOCK_DEPARTMENTS_DETAILED;

// ─── 2. Doctors Data ─────────────────────────────────────────────────────────

export const MOCK_DOCTORS_DETAILED: DoctorDetailData[] = [
  {
    id: "doc-1",
    slug: "dr-selamawit-bekele",
    name: "Dr. Selamawit Bekele",
    title: "Chief of Cardiology & Senior Consultant",
    specialty: "Cardiologist",
    department: "Cardiology",
    departmentSlug: "cardiology",
    photo: "",
    href: "/doctors/dr-selamawit-bekele",
    biography:
      "Dr. Selamawit Bekele is a distinguished cardiologist with over 15 years of clinical experience in interventional and preventive cardiology. She earned her medical degree with honors from Addis Ababa University and completed specialized cardiology fellowships in South Africa and the UK. She has spearheaded modern cardiac intervention programs and remains passionate about community heart health awareness.",
    qualifications: [
      "MD, Addis Ababa University School of Medicine",
      "Fellowship in Interventional Cardiology, University of Cape Town",
      "Member of the Pan-African Society of Cardiology (PASCAR)",
      "Board Certified in Cardiovascular Medicine",
    ],
    experience: "15+ years of clinical practice in cardiology and interventional catheterization.",
    languages: ["Amharic", "English", "Oromo"],
    areasOfExpertise: [
      "Coronary Angiography & Stenting",
      "Echocardiography & Doppler Imaging",
      "Hypertension & Heart Failure Management",
      "Preventive Cardiovascular Screening",
    ],
    officeLocation: "Building A, 2nd Floor, Room 210",
    availability: "Mon, Tue, Thu: 9:00 AM – 3:30 PM",
    contactEmail: "dr.selamawit@medhenbeza.com",
  },
  {
    id: "doc-2",
    slug: "dr-yohannes-assefa",
    name: "Dr. Yohannes Assefa",
    title: "Senior Neurologist & Clinical Neurophysiologist",
    specialty: "Neurologist",
    department: "Neurology & Spine",
    departmentSlug: "neurology",
    photo: "",
    href: "/doctors/dr-yohannes-assefa",
    biography:
      "Dr. Yohannes Assefa brings over 13 years of expertise in neurology, stroke rehabilitation, and clinical neurophysiology. After completing his residency at Tikur Anbessa Hospital, he undertook specialized subspecialty training in neurological diagnostics in Germany. He is dedicated to compassionate, evidence-based care for complex neuromuscular and neurological disorders.",
    qualifications: [
      "MD, Addis Ababa University",
      "Specialty Certificate in Neurology, Tikur Anbessa Specialized Hospital",
      "Fellowship in Clinical Neurophysiology (EEG/EMG), Heidelberg University Hospital",
      "Member, World Federation of Neurology",
    ],
    experience: "13+ years diagnosing and treating neurological and neuromuscular conditions.",
    languages: ["Amharic", "English"],
    areasOfExpertise: [
      "Acute Stroke Management & Recovery",
      "Epilepsy & Digital EEG Interpretation",
      "Chronic Migraine & Headache Disorders",
      "Neuropathy & Peripheral Nerve Disorders",
    ],
    officeLocation: "Building C, 2nd Floor, Room 204",
    availability: "Tue, Wed, Fri: 8:30 AM – 2:00 PM",
    contactEmail: "dr.yohannes@medhenbeza.com",
  },
  {
    id: "doc-3",
    slug: "dr-bethlehem-tesfaye",
    name: "Dr. Bethlehem Tesfaye",
    title: "Lead Obstetrician & Gynecologist",
    specialty: "Obstetrician",
    department: "Maternity & Neonatal",
    departmentSlug: "maternity",
    photo: "",
    href: "/doctors/dr-bethlehem-tesfaye",
    biography:
      "Dr. Bethlehem Tesfaye is a dedicated obstetrician and gynecologist committed to advancing safe motherhood and women's health. With over 12 years of clinical practice, Dr. Bethlehem has overseen thousands of safe deliveries and specializes in high-risk pregnancies, fetal monitoring, and minimally invasive gynecological surgery.",
    qualifications: [
      "MD, Jimma University Institute of Health",
      "Residency in Obstetrics & Gynecology, St. Paul's Hospital Millennium Medical College",
      "Diploma in Advanced Fetal Ultrasound (ISUOG)",
      "Fellow, Ethiopian Society of Obstetricians & Gynecologists (ESOG)",
    ],
    experience: "12+ years in maternal-fetal medicine, safe childbirth, and gynecologic surgery.",
    languages: ["Amharic", "English"],
    areasOfExpertise: [
      "High-Risk Pregnancy Management",
      "Labor, Delivery & Cesarean Section Care",
      "Prenatal Fetal Ultrasound",
      "Gynecological Laparoscopy",
    ],
    officeLocation: "Building B, 2nd Floor, Room 225",
    availability: "Mon, Wed, Fri: 9:00 AM – 4:00 PM",
    contactEmail: "dr.bethlehem@medhenbeza.com",
  },
  {
    id: "doc-4",
    slug: "dr-dawit-haile",
    name: "Dr. Dawit Haile",
    title: "Consultant Orthopedic & Trauma Surgeon",
    specialty: "Orthopedic Surgeon",
    department: "Surgery & Anesthesia",
    departmentSlug: "surgery",
    photo: "",
    href: "/doctors/dr-dawit-haile",
    biography:
      "Dr. Dawit Haile is an orthopedic surgeon specializing in complex joint replacement, trauma reconstruction, and sports arthroscopy. With 16 years of surgical experience, Dr. Dawit has treated complex athletic injuries, degenerative joint conditions, and emergency bone trauma with modern surgical techniques.",
    qualifications: [
      "MD, Gondar University College of Medicine",
      "Master of Surgery in Orthopedics (FCS-ECSA)",
      "Fellowship in Joint Arthroplasty, New Delhi, India",
      "Member of the AO Trauma International Network",
    ],
    experience: "16+ years performing elective orthopedic and acute trauma surgical operations.",
    languages: ["Amharic", "English", "Tigrinya"],
    areasOfExpertise: [
      "Total Hip & Knee Replacement",
      "Arthroscopic Knee & Shoulder Surgery",
      "Fracture & Musculoskeletal Trauma Repair",
      "Sports Injury Rehabilitation",
    ],
    officeLocation: "Building A, 3rd Floor, Suite 312",
    availability: "Mon, Thu: 8:00 AM – 1:00 PM (Surgical days: Tue, Fri)",
    contactEmail: "dr.dawit@medhenbeza.com",
  },
  {
    id: "doc-5",
    slug: "dr-amen-alemu",
    name: "Dr. Amen Alemu",
    title: "Senior Consultant Pediatrician",
    specialty: "Pediatrician",
    department: "Pediatrics & Child Health",
    departmentSlug: "pediatrics",
    photo: "",
    href: "/doctors/dr-amen-alemu",
    biography:
      "Dr. Amen Alemu has dedicated her 11-year medical career to the health and wellbeing of children. She specializes in neonatology, pediatric infectious diseases, child nutrition, and developmental pediatrics. Her gentle bedside manner makes clinical visits reassuring for both children and parents.",
    qualifications: [
      "MD, Hawassa University College of Medicine",
      "Specialty in Pediatrics & Child Health, Tikur Anbessa Hospital",
      "Certificate in Neonatal Resuscitation & Emergency Care",
      "Member, Ethiopian Pediatric Society (EPS)",
    ],
    experience: "11+ years providing pediatric outpatient, inpatient, and neonatal critical care.",
    languages: ["Amharic", "English", "Sidama"],
    areasOfExpertise: [
      "Newborn & Neonatal Intensive Care",
      "Pediatric Asthma & Respiratory Allergies",
      "Child Nutrition & Growth Monitoring",
      "Routine Childhood Immunization",
    ],
    officeLocation: "Building B, Ground Floor, Room 108",
    availability: "Mon – Thu: 8:30 AM – 3:30 PM",
    contactEmail: "dr.amen@medhenbeza.com",
  },
  {
    id: "doc-6",
    slug: "dr-tigist-mengistu",
    name: "Dr. Tigist Mengistu",
    title: "Consultant Ophthalmologist & Cataract Specialist",
    specialty: "Ophthalmologist",
    department: "Ophthalmology & Vision Care",
    departmentSlug: "ophthalmology",
    photo: "",
    href: "/doctors/dr-tigist-mengistu",
    biography:
      "Dr. Tigist Mengistu is a consultant ophthalmologist with 10 years of expertise in anterior segment surgery, glaucoma management, and pediatric vision screening. She has performed hundreds of microsurgical cataract operations and is dedicated to eliminating preventable vision loss.",
    qualifications: [
      "MD, Addis Ababa University",
      "Residency in Ophthalmology, Menelik II Referral Hospital",
      "Fellowship in Small Incision Cataract Surgery (SICS)",
      "Member, Ophthalmological Society of Ethiopia (OSE)",
    ],
    experience: "10+ years specializing in ophthalmic diagnostics and ocular microsurgery.",
    languages: ["Amharic", "English"],
    areasOfExpertise: [
      "Micro-Incision Cataract Surgery",
      "Glaucoma Early Detection & Medical Management",
      "Diabetic Eye Disease Screening",
      "Refractive Error Assessment",
    ],
    officeLocation: "Building C, 1st Floor, Room 115",
    availability: "Mon, Wed, Fri: 9:00 AM – 4:00 PM",
    contactEmail: "dr.tigist@medhenbeza.com",
  },
  {
    id: "doc-7",
    slug: "dr-mulugeta-worku",
    name: "Dr. Mulugeta Worku",
    title: "Consultant Physician & Internist",
    specialty: "Internal Medicine",
    department: "Cardiology",
    departmentSlug: "cardiology",
    photo: "",
    href: "/doctors/dr-mulugeta-worku",
    biography:
      "Dr. Mulugeta Worku is an experienced internist specializing in chronic disease management, diabetes care, hypertension, and holistic internal medicine. With 14 years of practice, he focuses on preventive care and patient education to optimize long-term health outcomes.",
    qualifications: [
      "MD, Gondar University",
      "Internal Medicine Specialty, Addis Ababa University",
      "Member, Ethiopian Medical Association (EMA)",
    ],
    experience: "14+ years managing complex multi-system medical conditions.",
    languages: ["Amharic", "English"],
    areasOfExpertise: [
      "Diabetes Mellitus Management",
      "Cardiovascular Risk Reduction",
      "Geriatric Medicine",
      "Preventive Health Checkups",
    ],
    officeLocation: "Building A, 2nd Floor, Room 215",
    availability: "Tue, Thu, Sat: 8:30 AM – 2:00 PM",
    contactEmail: "dr.mulugeta@medhenbeza.com",
  },
  {
    id: "doc-8",
    slug: "dr-helen-girmu",
    name: "Dr. Helen Girmu",
    title: "Specialist Obstetrician & Gynecologist",
    specialty: "Obstetrician",
    department: "Maternity & Neonatal",
    departmentSlug: "maternity",
    photo: "",
    href: "/doctors/dr-helen-girmu",
    biography:
      "Dr. Helen Girmu is an obstetrician-gynecologist focused on reproductive health, prenatal wellness, and adolescent gynecology. She is passionate about empowering women through supportive, respectful clinical care.",
    qualifications: [
      "MD, Hawassa University",
      "Residency in Obstetrics & Gynecology, Tikur Anbessa Hospital",
      "Member, ESOG",
    ],
    experience: "8+ years in obstetrics, labor management, and fertility counseling.",
    languages: ["Amharic", "English"],
    areasOfExpertise: [
      "Antenatal & Postnatal Care",
      "Reproductive Health Counseling",
      "Cervical Cancer Screening",
      "Natural & Assisted Labor Support",
    ],
    officeLocation: "Building B, 2nd Floor, Room 228",
    availability: "Tue, Thu, Sat: 9:00 AM – 3:00 PM",
    contactEmail: "dr.helen@medhenbeza.com",
  },
];

export const MOCK_DOCTORS: DoctorCardData[] = MOCK_DOCTORS_DETAILED;

// ─── 3. Services Data ────────────────────────────────────────────────────────

export const MOCK_SERVICES_DETAILED: ServiceDetailData[] = [
  {
    id: "srv-1",
    slug: "cardiology",
    name: "Cardiology",
    icon: Heart,
    departmentSlug: "cardiology",
    departmentName: "Cardiology Department",
    description:
      "Comprehensive heart care from routine screenings to advanced interventional procedures.",
    longDescription:
      "Our Cardiology service provides comprehensive cardiovascular evaluations and state-of-the-art treatments. Led by seasoned cardiology specialists, we deliver accurate diagnostics including 2D/3D echocardiograms, exercise stress testing, 24-hour Holter monitoring, and emergency interventional cardiac catheterization procedures to treat acute coronary syndromes.",
    href: "/services/cardiology",
    availability: "Consultations: Mon – Sat: 8:00 AM – 6:00 PM · Emergency: 24/7",
    features: [
      "Digital Coronary Angiography & Percutaneous Intervention",
      "Comprehensive 3D Transthoracic & Transesophageal Echo",
      "Exercise & Pharmacological Stress Testing",
      "24/48-Hour Ambulatory ECG (Holter) & Blood Pressure Monitoring",
      "Specialized Cardiac Rehabilitation & Lifestyle Guidance",
    ],
    procedures: [
      "Cardiac catheterization and coronary stent placement",
      "Pacemaker evaluation and follow-up programming",
      "Non-invasive vascular Doppler ultrasound",
      "Hypertension and lipid optimization clinic",
    ],
    relatedDoctorSlugs: ["dr-selamawit-bekele", "dr-mulugeta-worku"],
  },
  {
    id: "srv-2",
    slug: "neurology",
    name: "Neurology",
    icon: Brain,
    departmentSlug: "neurology",
    departmentName: "Neurology & Spine Department",
    description:
      "Expert diagnosis and treatment for conditions of the brain, spine, and nervous system.",
    longDescription:
      "Our Neurology service offers specialized clinical evaluation and advanced diagnostics for stroke, epilepsy, chronic migraines, peripheral nerve disorders, and spinal conditions. We collaborate with neuro-radiologists and physical therapists to craft personalized recovery pathways.",
    href: "/services/neurology",
    availability: "Consultations: Mon – Fri: 8:30 AM – 5:00 PM",
    features: [
      "Digital 32-Channel Electroencephalography (EEG)",
      "Electromyography (EMG) & Nerve Conduction Studies (NCS)",
      "Comprehensive Stroke Assessment & Post-Stroke Rehabilitation",
      "Specialized Headache & Migraine Management Clinic",
    ],
    procedures: [
      "Sleep-deprived and video EEG recordings",
      "Nerve conduction velocity testing",
      "Diagnostic lumbar puncture",
      "Botulinum therapy for chronic migraine and spasticity",
    ],
    relatedDoctorSlugs: ["dr-yohannes-assefa"],
  },
  {
    id: "srv-3",
    slug: "maternity",
    name: "Maternity & Obstetrics",
    icon: Baby,
    departmentSlug: "maternity",
    departmentName: "Maternity & Neonatal Department",
    description:
      "Full-spectrum pregnancy support, labor & delivery, and postnatal care for mother and child.",
    longDescription:
      "From pre-conception counseling and routine prenatal checkups to high-risk pregnancy management, private birthing suites, and comprehensive postpartum support, our Maternity service places maternal comfort and infant safety at the heart of care.",
    href: "/services/maternity",
    availability: "Prenatal Clinic: Mon – Sat: 8:30 AM – 5:00 PM · Birthing Suites: 24/7",
    features: [
      "Private, en-suite Labor, Delivery & Recovery (LDR) Rooms",
      "High-Resolution Fetal 3D/4D Ultrasound & Anomaly Screening",
      "Immediate access to Level III Neonatal Intensive Care Unit (NICU)",
      "Dedicated Obstetric Surgical Theatre for Emergency Cesarean",
      "Lactation, Newborn Care & Maternal Wellness Guidance",
    ],
    procedures: [
      "Natural and pain-managed labor and delivery",
      "Elective and emergency Cesarean delivery",
      "Non-stress fetal monitoring (NST)",
      "Postnatal maternal and newborn checkups",
    ],
    relatedDoctorSlugs: ["dr-bethlehem-tesfaye", "dr-helen-girmu"],
  },
  {
    id: "srv-4",
    slug: "orthopedics",
    name: "Orthopedics & Joint Care",
    icon: Bone,
    departmentSlug: "orthopedics",
    departmentName: "Orthopedics & Joint Care Department",
    description:
      "Surgical and non-surgical treatment for bones, joints, ligaments, and sports injuries.",
    longDescription:
      "Our Orthopedics service delivers expert surgical and conservative management of musculoskeletal conditions, including osteoarthritis, bone fractures, ligament tears, and joint deterioration. We combine precise surgical interventions with targeted physical therapy.",
    href: "/services/orthopedics",
    availability: "Clinic: Mon – Sat: 8:00 AM – 5:30 PM · Trauma Unit: 24/7",
    features: [
      "Total Knee & Hip Arthroplasty (Joint Replacement)",
      "Minimally Invasive Arthroscopic Surgery",
      "Trauma Fracture Fixation & Casting",
      "Post-Operative Musculoskeletal Physical Rehabilitation",
    ],
    procedures: [
      "Joint aspiration and therapeutic corticosteroid injections",
      "Arthroscopic meniscus and ligament repairs",
      "Internal and external fixation of complex fractures",
      "Custom orthotic and casting immobilization",
    ],
    relatedDoctorSlugs: ["dr-dawit-haile"],
  },
  {
    id: "srv-5",
    slug: "ophthalmology",
    name: "Ophthalmology & Vision Care",
    icon: Eye,
    departmentSlug: "ophthalmology",
    departmentName: "Ophthalmology & Vision Care",
    description:
      "Advanced eye care including laser correction, cataract surgery, and vision rehabilitation.",
    longDescription:
      "The Ophthalmology service provides diagnostic vision screenings, treatment of refractive errors, microscopic cataract extractions with premium intraocular lens implantation, and medical management of glaucoma and retinal conditions.",
    href: "/services/ophthalmology",
    availability: "Mon – Fri: 8:30 AM – 5:00 PM · Sat: 9:00 AM – 1:00 PM",
    features: [
      "Digital Slit-Lamp & Ophthalmic Photography",
      "Micro-Incision Cataract Surgery with Foldable IOLs",
      "Visual Field Analysis & Tonometry Glaucoma Screening",
      "Diabetic Retinopathy & Macular Health Evaluation",
    ],
    procedures: [
      "Small-incision phacoemulsification cataract extraction",
      "Nd:YAG laser capsulotomy and iridotomy",
      "Foreign body removal and ocular trauma care",
      "Automated refraction and prescription eyewear fitting",
    ],
    relatedDoctorSlugs: ["dr-tigist-mengistu"],
  },
  {
    id: "srv-6",
    slug: "general-medicine",
    name: "General & Internal Medicine",
    icon: Stethoscope,
    departmentSlug: "cardiology",
    departmentName: "General Medicine & Cardiology",
    description:
      "Preventive care, health screenings, chronic disease management, and internal medicine.",
    longDescription:
      "General Medicine serves as the foundation of patient wellness at Medhen Beza Hospital. Our internists diagnose and manage acute infections, complex multi-organ illnesses, diabetes, metabolic disorders, and chronic hypertension while emphasizing preventative health checkups.",
    href: "/services/general-medicine",
    availability: "Daily: 8:00 AM – 7:00 PM",
    features: [
      "Executive Comprehensive Annual Health Checkup Packages",
      "Chronic Disease Management (Diabetes, Hypertension, Thyroid)",
      "Inpatient Medical Hospitalist Management",
      "Vaccinations & Adult Travel Health Immunizations",
    ],
    procedures: [
      "Routine biochemical & hematological screenings",
      "Electrocardiography and spirometry pulmonary testing",
      "Nutritional and lifestyle disease prevention counseling",
      "Multisystem complex disease consultations",
    ],
    relatedDoctorSlugs: ["dr-mulugeta-worku", "dr-selamawit-bekele"],
  },
  {
    id: "srv-7",
    slug: "laboratory",
    name: "Laboratory & Diagnostics",
    icon: Microscope,
    departmentSlug: "diagnostics",
    departmentName: "Laboratory & Diagnostics Department",
    description:
      "State-of-the-art lab testing, imaging, and pathology services with rapid turnaround.",
    longDescription:
      "Our Diagnostic Laboratory operates with automated, calibrated analyzers under strict quality control protocols. We provide comprehensive clinical chemistry, hematology, immunology, microbiology, and molecular diagnostic testing with fast turnaround times.",
    href: "/services/laboratory",
    availability: "Routine Testing: 7:30 AM – 7:00 PM · Emergency Lab: 24/7",
    features: [
      "Automated Clinical Chemistry & Electrolyte Profiling",
      "Complete Blood Counts with Automated Differential",
      "Microbiology Cultures & Antimicrobial Sensitivity Testing",
      "Hormonal, Thyroid & Tumor Biomarker Assays",
    ],
    procedures: [
      "Blood and bodily fluid collection and analysis",
      "Rapid cardiac biomarker assay (Troponin I, CK-MB)",
      "Urinalysis and stool microscopy",
      "Histopathology and cytology tissue processing",
    ],
    relatedDoctorSlugs: ["dr-yohannes-assefa"],
  },
  {
    id: "srv-8",
    slug: "pharmacy",
    name: "Pharmacy & Dispensary",
    icon: Pill,
    departmentSlug: "diagnostics",
    departmentName: "Pharmacy Services",
    description:
      "In-house pharmacy stocked with prescription and over-the-counter medications.",
    longDescription:
      "The Medhen Beza Hospital Pharmacy ensures safe, prompt, and accurate dispensing of prescription medications, specialized injectables, vaccines, and medical consumables. Our licensed pharmacists provide medication counseling, dosage reviews, and drug interaction screenings.",
    href: "/services/pharmacy",
    availability: "Outpatient Dispensary: 8:00 AM – 10:00 PM · Inpatient Pharmacy: 24/7",
    features: [
      "Fully Stocked with Verified National & International Pharmaceuticals",
      "Temperature-Controlled Cold-Chain Storage for Biologicals",
      "Patient Drug Counseling & Interaction Screening",
      "Electronic Prescription Verification System",
    ],
    procedures: [
      "Prescription medication dispensing and dosage titration review",
      "Hospital inpatient unit-dose drug distribution",
      "Emergency medication kits for critical hospital units",
      "Chronic medication refill programs",
    ],
    relatedDoctorSlugs: ["dr-mulugeta-worku"],
  },
  {
    id: "srv-9",
    slug: "pediatrics",
    name: "Pediatrics & Neonatal Care",
    icon: Activity,
    departmentSlug: "pediatrics",
    departmentName: "Pediatrics & Child Health",
    description:
      "Compassionate, specialized clinical care for infants, children, and adolescents.",
    longDescription:
      "Our Pediatrics service delivers routine wellness checks, developmental screenings, acute childhood illness treatments, and dedicated neonatal intensive care in a supportive, child-friendly environment.",
    href: "/services/pediatrics",
    availability: "Clinic: Mon – Sat: 8:00 AM – 6:00 PM · Pediatric Emergency: 24/7",
    features: [
      "Well-Child Developmental Checkups & Growth Tracking",
      "Childhood Immunization Programs",
      "Pediatric Emergency & Inpatient Hospitalization",
      "Nutritional Rehabilitation & Guidance",
    ],
    procedures: [
      "Pediatric clinical consultations",
      "Neonatal phototherapy and incubator care",
      "Nebulization and respiratory therapy",
      "Childhood vaccination administration",
    ],
    relatedDoctorSlugs: ["dr-amen-alemu"],
  },
  {
    id: "srv-10",
    slug: "surgery",
    name: "General & Laparoscopic Surgery",
    icon: Syringe,
    departmentSlug: "surgery",
    departmentName: "Surgery & Anesthesia Department",
    description:
      "Advanced elective and emergency surgical operations utilizing minimally invasive techniques.",
    longDescription:
      "Our Surgery service encompasses abdominal, gastrointestinal, endocrine, hernia, and emergency trauma surgical procedures using modern laparoscopic and open techniques for quicker recovery and minimal discomfort.",
    href: "/services/surgery",
    availability: "Surgical Consultations: Mon – Fri: 8:00 AM – 5:00 PM · OR: 24/7",
    features: [
      "Minimally Invasive Laparoscopic Abdominal Surgery",
      "Comprehensive Pre-Operative Assessment & Anesthesia Evaluation",
      "Dedicated Post-Anesthesia Recovery Unit (PACU)",
      "Strict Surgical Infection Control & HEPA-Filtered Theatres",
    ],
    procedures: [
      "Laparoscopic cholecystectomy and appendectomy",
      "Open and tension-free mesh hernia repair",
      "Thyroid and gastrointestinal surgical procedures",
      "Wound debridement and emergency trauma surgery",
    ],
    relatedDoctorSlugs: ["dr-dawit-haile"],
  },
];

export const MOCK_SERVICES: ServiceCardData[] = MOCK_SERVICES_DETAILED;

// ─── 4. Facilities Data ──────────────────────────────────────────────────────

export const MOCK_FACILITIES_DETAILED: FacilityDetailData[] = [
  {
    id: "fac-1",
    slug: "inpatient",
    name: "Modern Inpatient Building",
    image: "",
    imageAlt: "Main inpatient pavilion exterior and modern rooms",
    tagline: "Comfortable, quiet healing environment designed for recovery",
    description:
      "Spacious private and semi-private inpatient rooms equipped with adjustable electric medical beds, dedicated oxygen supply, nurse call systems, and calming natural lighting.",
    longDescription:
      "The Medhen Beza Inpatient Pavilion has been thoughtfully constructed to promote patient rest and clinical safety. With sound-dampened architecture, individual climate control, private en-suite bathrooms, comfortable family sleeper seating, and continuous bedside vital monitoring capabilities, every patient room offers dignity, comfort, and professional medical oversight.",
    location: "Main Medical Campus, Inpatient Pavilion (Floors 2 to 5)",
    capacity: "120 Inpatient Beds",
    features: [
      "Private and semi-private en-suite patient suites",
      "Centralized piped medical gases (O2, Vacuum, Air)",
      "Emergency bedside nurse call communication buttons",
      "Direct elevator access to surgical and diagnostic units",
      "Quiet family waiting lounges with refreshments",
    ],
    galleryImages: [
      { src: GREY_PLACEHOLDER, alt: "Private inpatient single room with electronic bed and large window", caption: "Standard Private Inpatient Suite" },
      { src: GREY_PLACEHOLDER, alt: "Nurses station on the 3rd floor inpatient wing", caption: "24/7 Floor Nursing Station" },
      { src: GREY_PLACEHOLDER, alt: "Inpatient family waiting lounge with comfortable seating", caption: "Quiet Family Lounge" },
    ],
    href: "/facilities/inpatient",
  },
  {
    id: "fac-2",
    slug: "surgery",
    name: "Surgical Theatres",
    image: "",
    imageAlt: "State-of-the-art sterile operating room and surgical lights",
    tagline: "Ultra-clean surgical suites with precision anesthesia and monitoring",
    description:
      "Four modern operating theatres equipped with positive-pressure laminar airflow, HEPA filtration, digital surgical lighting, and cutting-edge laparoscopic towers.",
    longDescription:
      "Our surgical suite is the operational center for complex elective and emergency procedures. Designed to international sterile theater specifications, each operating room features laminar air filtration to prevent surgical site infections, advanced anesthetic workstations, integrated high-definition surgical cameras, and immediate connectivity to our PACU and blood bank.",
    location: "Building A, 3rd Floor Surgical Complex",
    capacity: "4 Fully-Equipped Operating Theatres",
    features: [
      "Ultra-clean HEPA laminar airflow positive pressure ventilation",
      "High-definition 4K endoscopic and laparoscopic video towers",
      "Advanced multi-parameter anesthetic delivery workstations",
      "Dedicated 8-bed Post-Anesthesia Care Unit (PACU)",
      "Integrated emergency uninterruptible power supply (UPS)",
    ],
    galleryImages: [
      { src: GREY_PLACEHOLDER, alt: "Main operating theatre with LED overhead surgical lamps", caption: "Theatre 1 — Major General & Orthopedic Surgery" },
      { src: GREY_PLACEHOLDER, alt: "Laparoscopic minimally invasive surgery setup", caption: "Laparoscopy & Endoscopy Station" },
      { src: GREY_PLACEHOLDER, alt: "Post-anesthesia recovery bay with monitoring", caption: "PACU Recovery Unit" },
    ],
    href: "/facilities/surgery",
  },
  {
    id: "fac-3",
    slug: "imaging",
    name: "Imaging & Diagnostics",
    image: "",
    imageAlt: "Advanced CT scanner and digital X-ray suite",
    tagline: "High-resolution digital radiology and ultrasound imaging",
    description:
      "Comprehensive diagnostic radiology center featuring multi-slice CT scanning, digital X-ray, high-resolution ultrasound, and digital PACS archiving.",
    longDescription:
      "Our Imaging Department provides clear, rapid diagnostic imaging to support timely medical decisions. With low-dose digital radiography, multi-slice computed tomography, 3D Doppler ultrasound, and digital picture archiving systems (PACS), referring physicians can securely view radiological findings in real time.",
    location: "Diagnostic Tower, Building C, Ground Floor",
    capacity: "Continuous Outpatient & Inpatient Service",
    features: [
      "Multi-Slice Helical Computed Tomography (CT)",
      "Low-Dose High-Frequency Digital Radiography (X-Ray)",
      "High-Resolution Color Doppler Ultrasound Systems",
      "Digital PACS for immediate electronic radiologist reporting",
    ],
    galleryImages: [
      { src: GREY_PLACEHOLDER, alt: "Digital CT scan examination gantry and console", caption: "CT Scanner Suite" },
      { src: GREY_PLACEHOLDER, alt: "Ultrasound diagnostic room with dual monitors", caption: "Ultrasound & Echocardiography Room" },
      { src: GREY_PLACEHOLDER, alt: "Digital X-Ray examination table and stand", caption: "Digital Radiography Room" },
    ],
    href: "/facilities/imaging",
  },
  {
    id: "fac-4",
    slug: "pharmacy",
    name: "In-House Pharmacy",
    image: "",
    imageAlt: "Pharmacy dispensary counter and organized medication shelving",
    tagline: "Quality-assured medications and professional pharmacist counseling",
    description:
      "Fully-stocked hospital pharmacy staffed by licensed pharmacists, providing prescription fulfillment, cold-chain medication storage, and patient counseling.",
    longDescription:
      "Medhen Beza In-House Pharmacy guarantees access to genuine, high-quality pharmaceuticals. Operating around the clock for hospital patients and extended hours for outpatients, our pharmacy team ensures accurate dispensing and counseling on medication use.",
    location: "Main Hospital Entrance Lobby, Ground Floor",
    capacity: "24/7 Dispensary Service",
    features: [
      "Temperature-controlled and humidity-monitored pharmaceutical storage",
      "Dedicated patient medication counseling desk",
      "Direct integration with hospital electronic medical records",
      "Over-the-counter wellness and medical essentials section",
    ],
    galleryImages: [
      { src: GREY_PLACEHOLDER, alt: "Main outpatient pharmacy dispensing counters", caption: "Outpatient Dispensary Counter" },
      { src: GREY_PLACEHOLDER, alt: "Secure cold-chain biological refrigerator storage", caption: "Cold-Chain Storage Unit" },
    ],
    href: "/facilities/pharmacy",
  },
  {
    id: "fac-5",
    slug: "icu",
    name: "Intensive Care Unit (ICU)",
    image: "",
    imageAlt: "Intensive care unit patient bed and multi-parameter monitors",
    tagline: "Continuous critical care monitoring and dedicated medical support",
    description:
      "Dedicated adult and neonatal intensive care units equipped with advanced mechanical ventilators, invasive hemodynamic monitoring, and 1:1 nursing care.",
    longDescription:
      "Our Intensive Care Unit is staffed 24/7 by trained intensivists and critical care nurses. Designed for patients requiring continuous physiological monitoring and organ support, the unit features isolated negative-pressure rooms, modern invasive ventilators, and bedside dialysis capabilities.",
    location: "Building A, 2nd Floor (Adjacent to Surgical Complex)",
    capacity: "12 Critical Care Beds & 6 NICU Incubators",
    features: [
      "Dedicated mechanical ventilators and high-flow oxygen systems",
      "Continuous central hemodynamic monitoring station",
      "Negative-pressure airborne infection isolation suites",
      "1:1 and 1:2 specialist critical care nurse-to-patient ratio",
    ],
    galleryImages: [
      { src: GREY_PLACEHOLDER, alt: "ICU patient bay with digital ventilator and monitors", caption: "Adult Intensive Care Bay" },
      { src: GREY_PLACEHOLDER, alt: "Neonatal incubator with warming and monitoring unit", caption: "NICU Incubator Suite" },
    ],
    href: "/facilities/icu",
  },
  {
    id: "fac-6",
    slug: "emergency-center",
    name: "24/7 Emergency Care Center",
    image: "",
    imageAlt: "Emergency entrance bay and resuscitation trauma bays",
    tagline: "Rapid-response emergency trauma and acute resuscitation center",
    description:
      "Direct-access emergency department featuring triage bays, resuscitation rooms, minor procedure suites, and dedicated ambulance receiving docks.",
    longDescription:
      "The Emergency Center is engineered for rapid stabilization of critical conditions. With a dedicated driveway, barrier-free entrance, immediate triage assessment, and rapid point-of-care diagnostics, our emergency trauma team is ready 24/7.",
    location: "Gate 1, Bole Road (Dedicated Emergency Entrance)",
    capacity: "10 Triage & Resuscitation Bays",
    features: [
      "Dedicated ambulance receiving bay and wheelchair ramp",
      "Fully equipped resuscitation & cardiac arrest bay with defibrillators",
      "Minor procedure and suture treatment suite",
      "Dedicated 24/7 emergency triage nurse desk",
    ],
    galleryImages: [
      { src: GREY_PLACEHOLDER, alt: "Emergency ambulance entrance and reception bay", caption: "Ambulance Arrival Entrance" },
      { src: GREY_PLACEHOLDER, alt: "Resuscitation trauma room with cardiac monitoring", caption: "Acute Resuscitation Bay" },
    ],
    href: "/facilities/emergency-center",
  },
];

export const MOCK_FACILITIES: FacilityCardData[] = MOCK_FACILITIES_DETAILED;

// ─── 5. News Data ────────────────────────────────────────────────────────────

export const MOCK_NEWS_DETAILED: NewsDetailData[] = [
  {
    id: "news-1",
    slug: "cardiac-cath-lab",
    image: "",
    imageAlt: "New cardiac catheterization laboratory at Medhen Beza",
    category: "Cardiology",
    date: "September 5, 2026",
    readTime: "4 min read",
    title: "New Cardiac Catheterisation Lab Opens — Expanding Interventional Heart Services",
    summary:
      "Medhen Beza Hospital inaugurates its advanced catheterization lab, enabling minimally invasive coronary angiography, angioplasty, and pacemaker implantations in Addis Ababa.",
    author: {
      name: "Dr. Selamawit Bekele",
      role: "Chief of Cardiology",
      photo: "",
    },
    contentParagraphs: [
      "Medhen Beza Hospital is proud to announce the official opening of its state-of-the-art Cardiac Catheterisation Laboratory (Cath Lab), marking a significant milestone in expanding advanced cardiovascular care in Addis Ababa and the surrounding region.",
      "The new facility is equipped with high-resolution digital flat-panel angiography systems, fractional flow reserve (FFR) measurement, and intravascular imaging capabilities. These technologies allow our cardiology team to accurately diagnose and treat coronary artery disease, heart valve conditions, and rhythm disorders without open-heart surgery.",
      "Cardiovascular disease remains one of the fastest-growing health challenges in urban Ethiopia. By bringing this advanced interventional capability under our roof, we significantly reduce treatment delays for acute heart attack patients, where every minute saved preserves vital heart muscle.",
      "The Cath Lab will operate 24 hours a day for emergency coronary interventions, supported by a specialized team of interventional cardiologists, cath lab nurses, and cardiac technologists.",
    ],
    keyTakeaways: [
      "24/7 emergency coronary stenting and angioplasty capability",
      "Minimally invasive approach results in shorter hospital stays (1-2 days)",
      "High-precision digital angiography minimizes radiation exposure",
      "Integrated with our cardiac intensive care unit for seamless recovery",
    ],
    quote: {
      text: "Timely access to coronary catheterization saves lives. Our new lab brings international-standard cardiac interventions directly to our community.",
      author: "Dr. Selamawit Bekele, Chief of Cardiology",
    },
    tags: ["Cardiology", "Hospital Expansion", "Heart Health", "Technology"],
    isFeatured: true,
    href: "/news/cardiac-cath-lab",
  },
  {
    id: "news-2",
    slug: "accreditation",
    image: "",
    imageAlt: "Hospital leadership receiving national quality accreditation certificate",
    category: "Hospital News",
    date: "August 28, 2026",
    readTime: "3 min read",
    title: "Medhen Beza Achieves National Accreditation for Patient Safety & Clinical Standards",
    summary:
      "The hospital has been formally accredited by national regulatory authorities for exceptional infection control, clinical governance, and patient safety protocols.",
    author: {
      name: "Quality Assurance Directorate",
      role: "Clinical Governance Team",
      photo: "",
    },
    contentParagraphs: [
      "Following a rigorous multi-week audit by the National Health Regulatory Authority, Medhen Beza Hospital has been awarded top-tier national accreditation for patient safety, clinical quality, and healthcare facility management.",
      "The comprehensive evaluation examined hospital-wide infection control protocols, pharmacy storage standards, diagnostic accuracy rates, nursing documentation, emergency preparedness, and patient satisfaction metrics.",
      "This accreditation validates our sustained investment in modern infrastructure, clinical training, and transparent patient care practices.",
    ],
    keyTakeaways: [
      "Recognized for top infection control and clinical documentation",
      "Rigorous continuous quality audit system implemented across all wards",
      "Demonstrates adherence to national healthcare guidelines",
    ],
    tags: ["Accreditation", "Patient Safety", "Healthcare Quality", "Hospital News"],
    isFeatured: false,
    href: "/news/accreditation",
  },
  {
    id: "news-3",
    slug: "community-screening",
    image: "",
    imageAlt: "Community screening day tent with doctors checking patient blood pressure",
    category: "Community",
    date: "August 15, 2026",
    readTime: "3 min read",
    title: "Free Community Health Screening Day — Over 300 Residents Served",
    summary:
      "Our medical team conducted comprehensive screenings for blood pressure, blood glucose, eye health, and BMI at our annual community wellness outreach event.",
    author: {
      name: "Community Outreach Team",
      role: "Public Health Division",
      photo: "",
    },
    contentParagraphs: [
      "Over 300 community members visited Medhen Beza Hospital last Saturday for our annual Free Community Health Screening Day. The event provided free vital sign checks, blood glucose testing, visual acuity evaluations, and one-on-one medical consultations.",
      "Early detection of silent conditions such as hypertension and type-2 diabetes is crucial for preventing chronic complications. Participants identified with elevated readings received immediate medical advice and referrals to specialist clinics.",
      "We extend our gratitude to our volunteer medical staff, nursing team, and laboratory personnel whose dedication made this outreach event a resounding success.",
    ],
    tags: ["Community Outreach", "Preventive Care", "Diabetes", "Hypertension"],
    isFeatured: false,
    href: "/news/community-screening",
  },
  {
    id: "news-4",
    slug: "research-findings",
    image: "",
    imageAlt: "Clinical research team analyzing data on maternal outcomes",
    category: "Research",
    date: "August 2, 2026",
    readTime: "5 min read",
    title: "Clinical Research Team Publishes Findings on Maternal Health Outcomes",
    summary:
      "A peer-reviewed study co-authored by Medhen Beza obstetricians highlights improvements in perinatal outcomes through early antenatal risk stratification.",
    author: {
      name: "Dr. Bethlehem Tesfaye",
      role: "Lead Obstetrician",
      photo: "",
    },
    contentParagraphs: [
      "Physicians from the Department of Obstetrics & Gynecology at Medhen Beza Hospital have published their latest clinical research in the East African Medical Journal, evaluating the impact of structured first-trimester risk stratification on maternal and neonatal outcomes.",
      "The retrospective study analyzed over 1,200 pregnancies and demonstrated a 34% reduction in avoidable perinatal complications when specialized protocols were initiated before the 14th gestational week.",
      "Our hospital continues to support clinical research that directly informs local clinical guidelines and promotes evidence-based care across the region.",
    ],
    tags: ["Research", "Maternal Health", "Obstetrics", "Clinical Studies"],
    isFeatured: false,
    href: "/news/research-findings",
  },
  {
    id: "news-5",
    slug: "maternal-wellness-initiative",
    image: "",
    imageAlt: "New maternal wellness and breastfeeding support room",
    category: "Maternal Health",
    date: "July 20, 2026",
    readTime: "3 min read",
    title: "Launch of Comprehensive Postnatal Maternal Wellness Program",
    summary:
      "New program provides structured lactation support, postpartum mental wellness checks, and pediatric follow-up for new mothers.",
    author: {
      name: "Dr. Helen Girmu",
      role: "Obstetrics Specialist",
      photo: "",
    },
    contentParagraphs: [
      "Medhen Beza Hospital has launched a dedicated Postnatal Maternal Wellness Program designed to provide holistic support to mothers in the critical weeks following childbirth.",
      "The program integrates lactation consulting, postnatal pelvic health physiotherapy, postpartum depression screening, and infant vaccination schedules into a unified care journey.",
    ],
    tags: ["Maternal Health", "Postnatal Care", "Wellness"],
    isFeatured: false,
    href: "/news/maternal-wellness-initiative",
  },
  {
    id: "news-6",
    slug: "advanced-digital-imaging",
    image: "",
    imageAlt: "Modern diagnostic equipment installation",
    category: "Technology",
    date: "July 5, 2026",
    readTime: "4 min read",
    title: "Hospital Upgrades to High-Definition PACS and Digital Radiology Suites",
    summary:
      "New picture archiving and communication systems (PACS) enable instantaneous radiologist consultations across all hospital departments.",
    author: {
      name: "IT & Clinical Infrastructure Directorate",
      role: "Technology Division",
      photo: "",
    },
    contentParagraphs: [
      "To accelerate diagnostic turnarounds and enhance clinical collaboration, Medhen Beza Hospital has completed a full digital upgrade of its Picture Archiving and Communication System (PACS).",
      "Specialists in emergency, surgery, and outpatient clinics can now access high-resolution imaging scans within seconds of completion, enabling rapid clinical decision-making.",
    ],
    tags: ["Technology", "Diagnostics", "Hospital Expansion"],
    isFeatured: false,
    href: "/news/advanced-digital-imaging",
  },
];

export const MOCK_NEWS: NewsCardData[] = MOCK_NEWS_DETAILED;

// ─── 6. Gallery Data ─────────────────────────────────────────────────────────

export const MOCK_GALLERY_DETAILED: GalleryDetailItem[] = [
  {
    id: "gal-1",
    src: GREY_PLACEHOLDER,
    alt: "Medhen Beza Hospital main reception and welcoming atrium",
    type: "image",
    category: "Facilities",
    title: "Hospital Welcoming Lobby & Atrium",
    description: "Spacious, light-filled reception area designed for patient comfort, rapid check-in, and clear signage.",
    href: "/gallery",
  },
  {
    id: "gal-2",
    src: GREY_PLACEHOLDER,
    alt: "Tour of the cardiology catheterization lab and diagnostic wing",
    type: "video",
    category: "Clinical Care",
    duration: "2:14",
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "Cardiology Catheterization Lab Video Tour",
    description: "A walkthrough of our advanced cardiac cath lab and patient monitoring systems.",
    href: "/gallery",
  },
  {
    id: "gal-3",
    src: GREY_PLACEHOLDER,
    alt: "Modern operating theatre with sterile surgical equipment and lights",
    type: "image",
    category: "Facilities",
    title: "Surgical Theatre & Laparoscopy Suite",
    description: "Ultra-clean surgical suite with positive pressure HEPA ventilation and digital monitors.",
    href: "/gallery",
  },
  {
    id: "gal-4",
    src: GREY_PLACEHOLDER,
    alt: "Virtual tour of private maternity birthing suites and NICU",
    type: "video",
    category: "Clinical Care",
    duration: "3:45",
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    title: "Maternity & Newborn Care Tour",
    description: "Exploring private labor and delivery rooms and neonatal intensive care incubators.",
    href: "/gallery",
  },
  {
    id: "gal-5",
    src: GREY_PLACEHOLDER,
    alt: "Pediatric outpatient clinic and child play area",
    type: "image",
    category: "Facilities",
    title: "Pediatric Outpatient Clinic & Play Area",
    description: "Child-friendly consultation rooms designed to keep young patients at ease.",
    href: "/gallery",
  },
  {
    id: "gal-6",
    src: GREY_PLACEHOLDER,
    alt: "Specialized outpatient diagnostic consultation suite",
    type: "image",
    category: "Facilities",
    title: "Outpatient Consultation Suites",
    description: "Private consultation offices for specialist physician appointments.",
    href: "/gallery",
  },
  {
    id: "gal-7",
    src: GREY_PLACEHOLDER,
    alt: "Multidisciplinary medical and nursing team photo",
    type: "image",
    category: "Medical Team",
    title: "Our Dedicated Medical & Nursing Staff",
    description: "The clinical and administrative team committed to delivering compassionate care.",
    href: "/gallery",
  },
  {
    id: "gal-8",
    src: GREY_PLACEHOLDER,
    alt: "Highlights video from community health screening day",
    type: "video",
    category: "Community",
    duration: "1:30",
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    title: "Community Outreach & Wellness Highlights",
    description: "Video recap of our volunteer doctors providing free public health screenings.",
    href: "/gallery",
  },
  {
    id: "gal-9",
    src: GREY_PLACEHOLDER,
    alt: "Automated laboratory testing equipment in operation",
    type: "image",
    category: "Clinical Care",
    title: "Diagnostic Pathology & Hematology Analyzers",
    description: "High-throughput clinical chemistry and hematology workstations in our diagnostic laboratory.",
    href: "/gallery",
  },
];

export const MOCK_GALLERY: GalleryCardData[] = MOCK_GALLERY_DETAILED;

// ─── 7. Events Data ──────────────────────────────────────────────────────────

export const MOCK_EVENTS_DETAILED: EventDetailData[] = [
  {
    id: "evt-1",
    slug: "heart-talk-sep",
    image: "",
    imageAlt: "Public health lecture on heart disease risk factors",
    day: 18,
    month: "SEP",
    year: 2026,
    dateFormatted: "Friday, September 18, 2026",
    time: "2:00 PM – 4:30 PM",
    location: "Main Auditorium, Building A (Floor 1)",
    isPast: false,
    title: "Free Public Health Talk — Understanding Heart Disease Risk Factors",
    description:
      "Join our senior cardiologists for an informative, free public seminar on recognizing cardiovascular risk factors, managing blood pressure, and adopting heart-healthy habits.",
    fullDescription: [
      "Cardiovascular disease is increasingly prevalent, but up to 80% of premature heart attacks can be prevented through lifestyle modifications and early detection. In this interactive public seminar, our cardiology team will explain common risk factors, warning signs of heart trouble, and dietary guidelines for a healthy heart.",
      "The session will conclude with a live Q&A where attendees can ask questions directly to our consultant cardiologists. Free basic blood pressure and BMI checks will be available before the lecture.",
    ],
    agenda: [
      { time: "2:00 PM – 2:30 PM", topic: "Registration & Free Blood Pressure Checks" },
      { time: "2:30 PM – 3:30 PM", topic: "Keynote Lecture: Anatomy of Heart Disease & Prevention", presenter: "Dr. Selamawit Bekele" },
      { time: "3:30 PM – 4:15 PM", topic: "Open Q&A with Cardiology Panel", presenter: "Cardiology Clinical Team" },
      { time: "4:15 PM – 4:30 PM", topic: "Educational Resource Distribution & Closing" },
    ],
    speaker: {
      name: "Dr. Selamawit Bekele",
      title: "Chief of Cardiology, Medhen Beza Hospital",
    },
    registrationInfo: "Free admission. Open to the public. Pre-registration recommended at the hospital reception or by calling +251 116 000 111.",
    href: "/events/heart-talk-sep",
  },
  {
    id: "evt-2",
    slug: "blood-drive-sep",
    image: "",
    imageAlt: "Voluntary blood donation drive station at hospital",
    day: 25,
    month: "SEP",
    year: 2026,
    dateFormatted: "Friday, September 25, 2026",
    time: "9:00 AM – 4:00 PM",
    location: "Hospital Main Entrance Plaza & Blood Bank Suite",
    isPast: false,
    title: "Community Blood Donation Drive — Every Drop Counts",
    description:
      "Help save lives by donating blood in partnership with the National Blood Bank Service. Refreshments and donor health checks provided.",
    fullDescription: [
      "Blood supplies are continually needed for emergency surgeries, maternal labor complications, trauma care, and severe anemia patients. Medhen Beza Hospital is hosting its quarterly voluntary blood donation drive in coordination with the National Blood Bank.",
      "All donors receive a confidential health check (hemoglobin, blood pressure, blood type verification) and post-donation refreshments. Your single donation can save up to three lives.",
    ],
    agenda: [
      { time: "9:00 AM – 12:00 PM", topic: "Morning Donor Registration & Screening" },
      { time: "12:00 PM – 1:00 PM", topic: "Midday Donor Health Briefing" },
      { time: "1:00 PM – 4:00 PM", topic: "Afternoon Donation Sessions" },
    ],
    speaker: {
      name: "Blood Transfusion Services Team",
      title: "Medhen Beza & National Blood Bank",
    },
    registrationInfo: "Walk-ins welcome. Donors should be 18–65 years of age, weigh at least 50 kg, and be in good general health.",
    href: "/events/blood-drive-sep",
  },
  {
    id: "evt-3",
    slug: "conference-oct",
    image: "",
    imageAlt: "Medical conference hall with doctors and presentations",
    day: 10,
    month: "OCT",
    year: 2026,
    dateFormatted: "Saturday, October 10, 2026",
    time: "8:30 AM – 5:00 PM",
    location: "Grand Conference Hall & Online Live Stream",
    isPast: false,
    title: "Annual Medical Conference — Advances in East African Healthcare",
    description:
      "A clinical symposium bringing together regional specialists, surgeons, and nurses to discuss modern protocols in cardiology, obstetrics, and emergency medicine.",
    fullDescription: [
      "The Medhen Beza Annual Medical Conference convenes medical professionals from across the region to share clinical insights, evidence-based research, and innovative diagnostic strategies.",
      "Keynote sessions will explore topics including interventional cardiac care, reducing maternal morbidity, and optimizing emergency triage workflows.",
    ],
    agenda: [
      { time: "8:30 AM – 9:00 AM", topic: "Delegate Registration & Welcome Coffee" },
      { time: "9:00 AM – 11:00 AM", topic: "Plenary Session: Interventional Medicine in Resource-Conscious Settings" },
      { time: "11:30 AM – 1:00 PM", topic: "Parallel Sessions: Obstetrics & Emergency Medicine Tracks" },
      { time: "2:00 PM – 4:00 PM", topic: "Panel Discussion & Case Presentations" },
      { time: "4:00 PM – 5:00 PM", topic: "CPD Certificate Awarding & Reception" },
    ],
    speaker: {
      name: "Prof. Guest Lecturer & Hospital Faculty",
      title: "Regional Healthcare Leadership Board",
    },
    registrationInfo: "Registration required for healthcare professionals seeking Continuing Professional Development (CPD) credits.",
    href: "/events/conference-oct",
  },
  {
    id: "evt-4",
    slug: "maternal-wellness-workshop-past",
    image: "",
    imageAlt: "Past maternal health workshop with mothers and midwives",
    day: 12,
    month: "JUL",
    year: 2026,
    dateFormatted: "Sunday, July 12, 2026",
    time: "10:00 AM – 1:00 PM",
    location: "Women's Health Pavilion, Seminar Room 2",
    isPast: true,
    title: "Maternal Wellness & Newborn Care Workshop (Past Event)",
    description:
      "A completed interactive workshop for expectant parents covering labor preparation, newborn sleep safety, and early breastfeeding techniques.",
    fullDescription: [
      "This completed workshop brought together 45 expectant mothers and partners for hands-on demonstrations with our certified midwives and pediatric nurses.",
      "Participants practiced newborn swaddling, learned about labor breathing techniques, and received comprehensive maternal wellness guidebooks.",
    ],
    agenda: [
      { time: "10:00 AM – 11:00 AM", topic: "Preparing for Labor & Birth: What to Expect" },
      { time: "11:15 AM – 12:15 PM", topic: "Newborn Care & Lactation Basics" },
      { time: "12:15 PM – 1:00 PM", topic: "Hands-on Q&A with Midwives" },
    ],
    speaker: {
      name: "Dr. Bethlehem Tesfaye & Midwifery Team",
      title: "Maternity & Neonatal Department",
    },
    registrationInfo: "This event concluded on July 12, 2026. Look out for our next scheduled maternal workshop session.",
    href: "/events/maternal-wellness-workshop-past",
  },
  {
    id: "evt-5",
    slug: "diabetes-screening-day-past",
    image: "",
    imageAlt: "Past diabetes screening tent and counseling session",
    day: 20,
    month: "JUN",
    year: 2026,
    dateFormatted: "Saturday, June 20, 2026",
    time: "8:30 AM – 3:30 PM",
    location: "Outpatient Clinic Plaza",
    isPast: true,
    title: "World Diabetes Screening & Nutrition Fair (Past Event)",
    description:
      "A completed community outreach initiative providing free fasting blood sugar tests, HbA1c screenings, and clinical dietary counseling.",
    fullDescription: [
      "Our June community outreach event provided over 250 individuals with comprehensive diabetes risk assessments, glucose testing, and dietary guidance from our clinical nutritionists.",
    ],
    agenda: [
      { time: "8:30 AM – 12:00 PM", topic: "Fasting Blood Sugar & Vital Screenings" },
      { time: "1:00 PM – 3:30 PM", topic: "Nutritionist Consultations & Dietary Planning" },
    ],
    speaker: {
      name: "Dr. Mulugeta Worku",
      title: "Consultant Internist",
    },
    registrationInfo: "This event concluded on June 20, 2026.",
    href: "/events/diabetes-screening-day-past",
  },
];

export const MOCK_EVENTS: EventCardData[] = MOCK_EVENTS_DETAILED;

// ─── 8. Careers Data ─────────────────────────────────────────────────────────

export const MOCK_CAREERS_DETAILED: CareerDetailData[] = [
  {
    id: "car-1",
    slug: "senior-cardiologist",
    position: "Senior Consultant Cardiologist",
    department: "Cardiology Department",
    departmentSlug: "cardiology",
    type: "Full-time",
    location: "Addis Ababa, Ethiopia (On-site)",
    deadline: "October 31, 2026",
    postedDate: "September 1, 2026",
    overview:
      "Medhen Beza Hospital is seeking an experienced, board-certified Consultant Cardiologist to join our growing cardiovascular department. The successful candidate will provide comprehensive outpatient and inpatient clinical care, perform non-invasive echocardiography, and participate in cath-lab interventions.",
    responsibilities: [
      "Provide expert diagnosis, clinical consultation, and inpatient management for cardiovascular patients.",
      "Perform and interpret 2D/3D echocardiograms, exercise stress tests, and Holter monitoring.",
      "Participate in catheterization lab diagnostic procedures and post-intervention monitoring.",
      "Collaborate in multidisciplinary care conferences and guide resident medical officers.",
      "Participate in the department on-call rotation for emergency cardiac admissions.",
    ],
    requirements: [
      "Medical Degree (MD) with specialty certification in Cardiology or Internal Medicine + Cardiology.",
      "Minimum of 5 years post-fellowship clinical experience in a tertiary hospital setting.",
      "Valid, unrestricted medical license from the Ethiopian Health Regulatory Authority (EFDA/MOH).",
      "Demonstrated experience in non-invasive echocardiography and clinical cardiology management.",
      "Strong communication skills and collaborative team orientation.",
    ],
    qualifications: [
      "MD / Specialist Degree in Cardiology",
      "Board Certification / Fellowship in Cardiovascular Medicine",
      "Valid Professional Practice License",
      "Fluency in Amharic and English (Oromo is an asset)",
    ],
    benefits: [
      "Competitive salary package commensurate with clinical seniority",
      "Comprehensive medical insurance coverage for employee and family",
      "Annual Continuing Medical Education (CME) allowance",
      "Relocation and housing assistance where applicable",
    ],
    contactEmail: "careers@medhenbeza.com",
    href: "/careers/senior-cardiologist",
  },
  {
    id: "car-2",
    slug: "charge-nurse-icu",
    position: "ICU Charge Nurse / Critical Care Specialist",
    department: "Nursing & Intensive Care",
    departmentSlug: "surgery",
    type: "Full-time",
    location: "Addis Ababa, Ethiopia (On-site)",
    deadline: "November 15, 2026",
    postedDate: "September 5, 2026",
    overview:
      "We are looking for a dedicated ICU Charge Nurse to supervise bedside clinical nursing care, manage ventilator patients, ensure stringent infection control standards, and coordinate patient care plans with intensivists.",
    responsibilities: [
      "Deliver advanced nursing care to critically ill patients in the adult and neonatal ICU.",
      "Monitor and titrate vasoactive infusions, mechanical ventilators, and hemodynamic lines.",
      "Coordinate unit shift staffing, handoffs, and emergency code responses.",
      "Maintain rigorous sterility, medication safety, and patient documentation protocols.",
    ],
    requirements: [
      "Bachelor of Science in Nursing (BScN); Critical Care certification preferred.",
      "Minimum of 3 years dedicated ICU / critical care nursing experience.",
      "Current BLS (Basic Life Support) and ACLS (Advanced Cardiac Life Support) certifications.",
      "Strong decision-making skills under emergency pressure.",
    ],
    qualifications: [
      "BSc in Nursing from an accredited university",
      "Active Nursing Professional License",
      "ACLS / BLS Certified",
    ],
    benefits: [
      "Competitive salary with critical care shift differentials",
      "Continuous clinical skill training and certifications",
      "Hospital healthcare coverage and retirement savings contribution",
    ],
    contactEmail: "careers@medhenbeza.com",
    href: "/careers/charge-nurse-icu",
  },
  {
    id: "car-3",
    slug: "radiology-technologist",
    position: "Senior Radiologic Technologist (CT & X-Ray)",
    department: "Diagnostics & Imaging",
    departmentSlug: "diagnostics",
    type: "Full-time",
    location: "Addis Ababa, Ethiopia (On-site)",
    deadline: "November 20, 2026",
    postedDate: "September 8, 2026",
    overview:
      "Join our diagnostic imaging team operating multi-slice CT scanners and digital X-ray equipment. The technologist will execute high-quality radiological exams while maintaining patient radiation safety.",
    responsibilities: [
      "Operate multi-slice CT scanners and digital X-ray units according to standard imaging protocols.",
      "Ensure proper patient positioning, radiation shielding, and contrast administration safety.",
      "Archive images to the hospital PACS system and collaborate with consulting radiologists.",
      "Maintain equipment calibration logs and quality assurance records.",
    ],
    requirements: [
      "BSc or Diploma in Radiologic Technology / Medical Imaging.",
      "Minimum of 2 years experience performing CT scans and digital general radiography.",
      "Active regulatory registration as a Radiologic Technologist.",
      "Attention to patient care, safety, and imaging precision.",
    ],
    qualifications: [
      "Degree or Diploma in Medical Radiologic Technology",
      "Valid Health Professional License",
    ],
    benefits: [
      "Competitive monthly salary and radiation hazard allowance",
      "Health insurance and annual paid leave",
      "Professional development opportunities in advanced imaging",
    ],
    contactEmail: "careers@medhenbeza.com",
    href: "/careers/radiology-technologist",
  },
  {
    id: "car-4",
    slug: "medical-laboratory-scientist",
    position: "Medical Laboratory Scientist (Microbiology)",
    department: "Laboratory & Diagnostics",
    departmentSlug: "diagnostics",
    type: "Full-time",
    location: "Addis Ababa, Ethiopia (On-site)",
    deadline: "November 30, 2026",
    postedDate: "September 10, 2026",
    overview:
      "Responsible for processing clinical specimens, bacterial cultures, antimicrobial susceptibility testing, and clinical chemistry in our automated diagnostic laboratory.",
    responsibilities: [
      "Perform diagnostic microbiological cultures, stainings, and antibiotic sensitivity assays.",
      "Run routine and emergency clinical chemistry and hematology tests.",
      "Adhere to laboratory biosafety and ISO quality management systems.",
      "Verify and report urgent critical lab results promptly to clinical teams.",
    ],
    requirements: [
      "BSc in Medical Laboratory Science / Technology.",
      "2+ years experience in a clinical microbiology and general diagnostic hospital laboratory.",
      "Active professional practicing license.",
    ],
    qualifications: [
      "BSc in Medical Laboratory Science",
      "Valid Health Professional License",
    ],
    benefits: [
      "Competitive salary and laboratory differential",
      "Comprehensive medical coverage",
      "Regular technical training on modern automated analyzers",
    ],
    contactEmail: "careers@medhenbeza.com",
    href: "/careers/medical-laboratory-scientist",
  },
  {
    id: "car-5",
    slug: "patient-care-coordinator",
    position: "Patient Care Coordinator & Reception Lead",
    department: "Administration & Front Desk",
    departmentSlug: "cardiology",
    type: "Full-time",
    location: "Addis Ababa, Ethiopia (On-site)",
    deadline: "October 25, 2026",
    postedDate: "September 2, 2026",
    overview:
      "We are seeking an empathetic, organized front-desk professional to guide patients through registration, appointment scheduling, insurance verification, and hospital navigation.",
    responsibilities: [
      "Welcome outpatients, register visits in the electronic health record system, and schedule specialist consultations.",
      "Verify insurance coverage and coordinate with billing and pharmacy departments.",
      "Answer telephone inquiries with courtesy and resolve patient queries.",
      "Ensure a welcoming, orderly, and calm reception environment.",
    ],
    requirements: [
      "Diploma or Degree in Healthcare Administration, Communications, Business, or related field.",
      "Prior customer service, clinic reception, or hospitality experience preferred.",
      "Fluent verbal and written communication skills in Amharic and English (Oromo is an asset).",
      "Proficiency with computer systems and appointment software.",
    ],
    qualifications: [
      "Diploma or Degree in relevant discipline",
      "Excellent interpersonal and communication skills",
    ],
    benefits: [
      "Standard competitive compensation package",
      "Health benefits and paid time off",
      "Friendly, supportive multidisciplinary working environment",
    ],
    contactEmail: "careers@medhenbeza.com",
    href: "/careers/patient-care-coordinator",
  },
];

export const MOCK_CAREERS: CareerCardData[] = MOCK_CAREERS_DETAILED;

// ─── 9. FAQs Data ────────────────────────────────────────────────────────────

export const MOCK_FAQS_CATEGORIZED: FAQCategoryGroup[] = [
  {
    id: "general-visiting",
    category: "General & Visiting Information",
    description: "Hospital hours, visitor guidelines, parking, and campus directions.",
    items: [
      {
        question: "What are your general visiting hours for inpatient wards?",
        answer:
          "General inpatient visiting hours are daily from 11:00 AM – 1:00 PM and from 4:30 PM – 7:30 PM. To protect patient rest and healing, a maximum of two visitors are permitted at the bedside at any one time. Specialized units (ICU and NICU) have designated family visiting protocols.",
      },
      {
        question: "Where is Medhen Beza Hospital located, and is parking available?",
        answer:
          "Medhen Beza Hospital is centrally located on Bole Road in Addis Ababa, Ethiopia. We provide a secure, multi-level parking facility directly adjacent to the main building with over 300 spaces. The first two hours are complimentary for outpatients and visitors.",
      },
      {
        question: "Are interpreter services available for non-Amharic speaking patients?",
        answer:
          "Yes. Our medical and nursing staff are multilingual, with fluent Amharic, English, Oromo, and Tigrinya speakers on duty. We can also arrange language assistance for international patients upon advance request.",
      },
      {
        question: "Is there an on-site cafeteria and pharmacy for visitors?",
        answer:
          "Yes. Our ground-floor cafeteria serves fresh meals, hot beverages, and snacks from 7:00 AM to 9:00 PM daily. Our 24/7 outpatient pharmacy is located adjacent to the main welcoming lobby.",
      },
    ],
  },
  {
    id: "appointments-consultations",
    category: "Appointments & Specialist Consultations",
    description: "Booking appointments, walk-ins, what to bring, and doctor referrals.",
    items: [
      {
        question: "How do I book an appointment with a specialist doctor?",
        answer:
          "You can schedule an appointment through our online booking form on this website, by calling our central appointment line at +251 116 000 111, or by visiting our reception desk in person. Same-day walk-in consultations are also accommodated based on clinic schedule.",
      },
      {
        question: "Do I need a doctor's referral to see a specialist?",
        answer:
          "In most cases, you do not need a formal referral to consult with our specialists. However, if your insurance provider requires a referral letter for coverage, please bring that documentation along to your appointment.",
      },
      {
        question: "What should I bring for my first consultation visit?",
        answer:
          "Please bring a valid government-issued photo ID, your insurance card (if applicable), any previous medical records, recent lab results or imaging discs, and an up-to-date list of current prescription medications.",
      },
      {
        question: "How can I reschedule or cancel a booked appointment?",
        answer:
          "You can reschedule or cancel at least 24 hours in advance by calling our reception desk at +251 116 000 111 or sending an email to appointments@medhenbeza.com.",
      },
    ],
  },
  {
    id: "billing-insurance",
    category: "Billing, Insurance & Payments",
    description: "Accepted insurance providers, payment methods, and cost estimates.",
    items: [
      {
        question: "Does Medhen Beza Hospital accept health insurance?",
        answer:
          "Yes, we collaborate with most major Ethiopian domestic insurance providers (including Medin, Nyala, Africa Insurance, Nib, and United) as well as international travel and global health insurance plans (Cigna, Bupa, Allianz). Please present your valid insurance card at check-in.",
      },
      {
        question: "What payment methods are accepted at the hospital?",
        answer:
          "We accept all major local digital payment methods (Telebirr, CBE Birr, Awash Pay, Bank transfers), debit cards (EthSwitch), international Visa and MasterCard credit cards, and cash.",
      },
      {
        question: "Can I receive an estimated cost for a surgical procedure beforehand?",
        answer:
          "Yes. Following an initial specialist consultation, our billing and patient care coordination team can provide a transparent itemized cost estimate for elective surgeries, maternity packages, and diagnostic evaluations.",
      },
    ],
  },
  {
    id: "emergency-inpatient",
    category: "Emergency & Inpatient Care",
    description: "Emergency triage, 24/7 services, ambulance coordination, and admission.",
    items: [
      {
        question: "What are your emergency department operating hours?",
        answer:
          "Our emergency department operates 24 hours a day, 7 days a week, 365 days a year without interruption. We have on-duty trauma surgeons, cardiologists, emergency physicians, and nursing teams on site at all times.",
      },
      {
        question: "What is the emergency hotline number?",
        answer:
          "For immediate medical emergencies, call our dedicated 24/7 hotline directly at +251 911 000 999. Our emergency dispatch team will guide you on first response and prepare our trauma bay for your arrival.",
      },
      {
        question: "How does the emergency triage process work?",
        answer:
          "Upon arrival at the emergency gate, an emergency triage nurse immediately assesses vital signs, consciousness, and symptoms. Patients are prioritized based on clinical urgency (life-threatening cases receive immediate intervention before less critical cases).",
      },
      {
        question: "What amenities are provided in inpatient hospital rooms?",
        answer:
          "All inpatient rooms include an adjustable electric hospital bed, private en-suite bathroom, bedside oxygen and nurse call systems, patient wardrobe, companion recliner chair, high-speed Wi-Fi, and meal service tailored to physician dietary orders.",
      },
    ],
  },
];

export const FAQ_MOCK: FAQItem[] = MOCK_FAQS_CATEGORIZED.flatMap((c) => c.items);

// ─── 10. About Page Structured Data (Unchanged for compatibility) ────────────

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

// ─── Query Helper Functions ──────────────────────────────────────────────────

export function getDepartmentBySlug(slug: string): DepartmentDetailData | undefined {
  return MOCK_DEPARTMENTS_DETAILED.find((d) => d.slug.toLowerCase() === slug.toLowerCase());
}

export function getServiceBySlug(slug: string): ServiceDetailData | undefined {
  return MOCK_SERVICES_DETAILED.find((s) => s.slug.toLowerCase() === slug.toLowerCase());
}

export function getServicesByDepartment(departmentSlug: string): ServiceDetailData[] {
  return MOCK_SERVICES_DETAILED.filter(
    (s) => s.departmentSlug.toLowerCase() === departmentSlug.toLowerCase()
  );
}

export function getDoctorBySlug(slug: string): DoctorDetailData | undefined {
  return MOCK_DOCTORS_DETAILED.find((d) => d.slug.toLowerCase() === slug.toLowerCase());
}

export function getDoctorsByDepartment(departmentSlug: string): DoctorDetailData[] {
  return MOCK_DOCTORS_DETAILED.filter(
    (d) => d.departmentSlug.toLowerCase() === departmentSlug.toLowerCase()
  );
}

export function getRelatedDoctors(departmentSlug: string, currentDoctorSlug?: string, limit = 3): DoctorDetailData[] {
  return MOCK_DOCTORS_DETAILED.filter(
    (d) => d.departmentSlug.toLowerCase() === departmentSlug.toLowerCase() && d.slug !== currentDoctorSlug
  ).slice(0, limit);
}

export function getFacilityBySlug(slug: string): FacilityDetailData | undefined {
  return MOCK_FACILITIES_DETAILED.find((f) => f.slug.toLowerCase() === slug.toLowerCase());
}

export function getNewsBySlug(slug: string): NewsDetailData | undefined {
  return MOCK_NEWS_DETAILED.find((n) => n.slug.toLowerCase() === slug.toLowerCase());
}

export function getRelatedNews(currentSlug: string, category: string, limit = 3): NewsDetailData[] {
  const matchingCategory = MOCK_NEWS_DETAILED.filter(
    (n) => n.slug !== currentSlug && n.category === category
  );
  if (matchingCategory.length >= limit) return matchingCategory.slice(0, limit);
  const others = MOCK_NEWS_DETAILED.filter(
    (n) => n.slug !== currentSlug && n.category !== category
  );
  return [...matchingCategory, ...others].slice(0, limit);
}

export function getEventBySlug(slug: string): EventDetailData | undefined {
  return MOCK_EVENTS_DETAILED.find((e) => e.slug.toLowerCase() === slug.toLowerCase());
}

export function getCareerBySlug(slug: string): CareerDetailData | undefined {
  return MOCK_CAREERS_DETAILED.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}
