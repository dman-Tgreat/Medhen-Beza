import { db } from "@/lib/db";
import { ContentStatus } from "@prisma/client";
import type {
  DoctorDetailData,
  DepartmentDetailData,
  ServiceDetailData,
  NewsDetailData,
  EventDetailData,
  CareerDetailData,
  FAQCategoryGroup,
  FacilityDetailData,
} from "@/lib/mock-data";

import { HOSPITAL_INFO } from "@/lib/constants";
import { getVideoEmbedUrl, getVideoThumbnailUrl } from "@/lib/media/video";
import type { AboutPageData } from "@/lib/mock-data";
import { MOCK_ABOUT_PAGE } from "@/lib/mock-data";
import {
  Heart,
  Award,
  ShieldCheck,
  Users,
  HeartHandshake,
  UserCheck,
  Sparkles,
  Stethoscope,
  Activity,
  CheckCircle2,
} from "lucide-react";

export const ABOUT_VALUE_ICONS: Record<string, any> = {
  Heart,
  Award,
  ShieldCheck,
  Users,
  HeartHandshake,
  UserCheck,
  Sparkles,
  Stethoscope,
  Activity,
  CheckCircle2,
};

function resolveValueIcon(icon: any) {
  if (typeof icon === "function" || typeof icon === "object") return icon;
  if (typeof icon === "string" && ABOUT_VALUE_ICONS[icon]) return ABOUT_VALUE_ICONS[icon];
  return ShieldCheck;
}

/**
 * Public Data Access Layer with Type-Safe Adapters
 * Strict security rule: Only content with ContentStatus.PUBLISHED is ever returned.
 */

// ─── 0. Dynamic Site Settings ───────────────────────────────────────────────

export interface PublicSiteSettings {
  hospitalName: string;
  shortName: string;
  tagline: string;
  description: string;
  emergencyPhone: string;
  ambulancePhone: string;
  generalPhone: string;
  email: string;
  location: string;
  address: string;
  hours: string;
  visitingHours: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroHeadlineAccent: string;
  heroSupportingText: string;
  heroImage?: string;
  statSpecialists: string;
  statEmergency: string;
  statDepartments: string;
  hospitalIntroTitle: string;
  hospitalIntroParagraphs: string[];
  hospitalIntroImage?: string;
  emergencyGate: string;
  emergencyHours: string;
  city: string;
  country: string;
  seoTitle?: string;
  seoDescription?: string;
}

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  try {
    const rows = await db.siteSetting.findMany({
      where: { isPublic: true },
    });
    const map = new Map<string, string>();
    for (const r of rows) {
      map.set(r.key, r.value);
    }

    const hospitalName =
      map.get("hospital_name") || map.get("name") || HOSPITAL_INFO.name;
    const shortName =
      map.get("short_name") ||
      (hospitalName.toLowerCase().includes("hospital")
        ? hospitalName.replace(/hospital/i, "").trim()
        : hospitalName) ||
      HOSPITAL_INFO.shortName;
    const tagline =
      map.get("tagline") ||
      map.get("hero_headline_accent") ||
      HOSPITAL_INFO.tagline;
    const description =
      map.get("seo_description") ||
      map.get("description") ||
      map.get("hero_supporting_text") ||
      HOSPITAL_INFO.description;

    const emergencyPhone =
      map.get("hospital_emergency") ||
      map.get("emergency_phone") ||
      HOSPITAL_INFO.emergencyPhone;
    const ambulancePhone =
      map.get("ambulance_phone") ||
      map.get("hospital_emergency") ||
      map.get("emergency_phone") ||
      HOSPITAL_INFO.emergencyPhone;
    const generalPhone =
      map.get("hospital_phone") ||
      map.get("general_phone") ||
      map.get("phone") ||
      HOSPITAL_INFO.generalPhone;
    const email =
      map.get("hospital_email") ||
      map.get("email") ||
      HOSPITAL_INFO.email;
    const address =
      map.get("hospital_address") ||
      map.get("address") ||
      HOSPITAL_INFO.address;
    const location =
      map.get("location") ||
      address ||
      HOSPITAL_INFO.location;
    const hours =
      map.get("visiting_hours") ||
      map.get("working_hours") ||
      map.get("hours") ||
      HOSPITAL_INFO.hours;
    const visitingHours =
      map.get("visiting_hours") ||
      map.get("working_hours") ||
      map.get("hours") ||
      HOSPITAL_INFO.hours;

    const heroEyebrow = map.get("hero_eyebrow") || "Leading Healthcare Excellence";
    const heroHeadline = map.get("hero_headline") || "Compassionate care.";
    const heroHeadlineAccent = map.get("hero_headline_accent") || "Trusted healthcare.";
    const heroSupportingText = map.get("hero_supporting_text") || "Close to you, committed to you — exceptional clinical care delivered by specialists who put patients first.";
    const statSpecialists = map.get("stat_specialists") || "50+";
    const statEmergency = map.get("stat_emergency") || "24/7";
    const statDepartments = map.get("stat_departments") || "15+";

    const hospitalIntroTitle = map.get("hospital_intro_title") || "Trusted care for every stage of life";
    const rawIntro = map.get("hospital_intro_text") ||
      `${hospitalName} provides patient-centred, modern clinical care, delivering healthcare with empathy, clinical precision, and dignity.\n\nOur multidisciplinary teams of specialists work across cutting-edge diagnostic and surgical units to serve families across the region.\n\nCommitted to continuous clinical excellence and modern standards of practice.`;
    const hospitalIntroParagraphs = rawIntro.split("\n\n").map((p) => p.trim()).filter(Boolean);

    const emergencyGate = map.get("emergency_gate") || "Gate 1 (Dedicated Ambulance & Emergency Driveway), Bole Road";
    const emergencyHours = map.get("emergency_hours") || "Open 24 Hours · 7 Days a Week · All Holidays";
    const heroImage = map.get("hero_image") || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200";
    const hospitalIntroImage = map.get("hospital_intro_image") || "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=1200";
    const seoTitle = map.get("seo_title") || `${hospitalName} | ${tagline}`;
    const seoDescription = map.get("seo_description") || description;
    const city =
      map.get("city") ||
      (address.toLowerCase().includes("adama")
        ? "Adama"
        : address.toLowerCase().includes("addis")
        ? "Addis Ababa"
        : HOSPITAL_INFO.city);
    const country = map.get("country") || HOSPITAL_INFO.country;

    return {
      hospitalName,
      shortName,
      tagline,
      description,
      emergencyPhone,
      ambulancePhone,
      generalPhone,
      email,
      location,
      address,
      city,
      country,
      hours,
      visitingHours,
      heroEyebrow,
      heroHeadline,
      heroHeadlineAccent,
      heroSupportingText,
      heroImage,
      statSpecialists,
      statEmergency,
      statDepartments,
      hospitalIntroTitle,
      hospitalIntroParagraphs,
      hospitalIntroImage,
      emergencyGate,
      emergencyHours,
      seoTitle,
      seoDescription,
    };
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicSiteSettings]", error);
    return {
      hospitalName: HOSPITAL_INFO.name,
      shortName: HOSPITAL_INFO.shortName,
      tagline: HOSPITAL_INFO.tagline,
      description: HOSPITAL_INFO.description,
      emergencyPhone: HOSPITAL_INFO.emergencyPhone,
      ambulancePhone: HOSPITAL_INFO.emergencyPhone,
      generalPhone: HOSPITAL_INFO.generalPhone,
      email: HOSPITAL_INFO.email,
      location: HOSPITAL_INFO.location,
      address: HOSPITAL_INFO.address,
      city: HOSPITAL_INFO.city,
      country: HOSPITAL_INFO.country,
      hours: HOSPITAL_INFO.hours,
      visitingHours: HOSPITAL_INFO.hours,
      heroEyebrow: "Leading Healthcare Excellence",
      heroHeadline: "Compassionate care.",
      heroHeadlineAccent: "Trusted healthcare.",
      heroSupportingText: "Close to you, committed to you — exceptional clinical care delivered by specialists who put patients first.",
      heroImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200",
      statSpecialists: "50+",
      statEmergency: "24/7",
      statDepartments: "15+",
      hospitalIntroTitle: "Trusted care for every stage of life",
      hospitalIntroParagraphs: [
        `${HOSPITAL_INFO.name} provides patient-centred, modern clinical care, delivering healthcare with empathy, clinical precision, and dignity.`,
        "Our multidisciplinary teams of specialists work across cutting-edge diagnostic and surgical units to serve families across the region.",
      ],
      hospitalIntroImage: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=1200",
      emergencyGate: "Gate 1 (Dedicated Ambulance & Emergency Driveway), Bole Road",
      emergencyHours: "Open 24 Hours · 7 Days a Week · All Holidays",
      seoTitle: `${HOSPITAL_INFO.name} | ${HOSPITAL_INFO.tagline}`,
      seoDescription: HOSPITAL_INFO.description,
    };
  }
}

// ─── 1. Doctors ─────────────────────────────────────────────────────────────

function mapDoctor(doc: any): DoctorDetailData {
  return {
    id: doc.id,
    name: doc.fullName,
    slug: doc.slug,
    specialty: doc.specialty,
    department: doc.department?.name || "General Medicine",
    departmentSlug: doc.department?.slug || "general",
    title: doc.position || "Senior Specialist",
    photo: doc.profilePhoto || undefined,
    href: `/doctors/${doc.slug}`,
    biography: doc.biography || "",
    qualifications: doc.qualifications || [],
    experience: doc.experience || "10+ years of dedicated clinical experience",
    languages: doc.languages || ["Amharic", "English"],
    areasOfExpertise: doc.areasOfExpertise || [],
    officeLocation: doc.department?.location || "Main Hospital Building",
    availability: doc.availability || "Monday - Friday: 9:00 AM - 5:00 PM",
    contactEmail: doc.department?.email || "info@medhenbeza.com",
    metaTitle: doc.metaTitle,
    metaDescription: doc.metaDescription,
    canonicalUrl: doc.canonicalUrl,
    ogImage: doc.ogImage,
  };
}

export async function getPublicDoctors(): Promise<DoctorDetailData[]> {
  try {
    const docs = await db.doctor.findMany({
      where: { status: ContentStatus.PUBLISHED },
      include: { department: true },
      orderBy: [{ order: "asc" }, { fullName: "asc" }],
    });
    return docs.map(mapDoctor);
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicDoctors]", error);
    return [];
  }
}

export async function getPublicDoctorBySlug(slug: string): Promise<DoctorDetailData | null> {
  try {
    const doc = await db.doctor.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
      },
      include: {
        department: {
          include: {
            services: { where: { status: ContentStatus.PUBLISHED } },
            doctors: { where: { status: ContentStatus.PUBLISHED } },
          },
        },
      },
    });
    return doc ? mapDoctor(doc) : null;
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicDoctorBySlug]", error);
    return null;
  }
}

export async function getPublicRelatedDoctors(
  departmentSlug: string,
  excludeSlug: string,
  limit = 3
): Promise<DoctorDetailData[]> {
  try {
    const docs = await db.doctor.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        slug: { not: excludeSlug },
        department: { slug: departmentSlug },
      },
      include: { department: true },
      take: limit,
    });
    return docs.map(mapDoctor);
  } catch (error) {
    return [];
  }
}

// ─── 2. Departments ─────────────────────────────────────────────────────────

function mapDepartment(dept: any): DepartmentDetailData {
  const leadDoctor = dept.doctors?.find((d: any) =>
    /head|chief|director|lead/i.test(d.position || "")
  ) || dept.doctors?.[0];

  const specializations =
    Array.isArray(dept.specializations) && dept.specializations.length > 0
      ? dept.specializations
      : dept.services?.map((s: any) => s.title || s.name) || [];

  return {
    id: dept.id,
    name: dept.name,
    slug: dept.slug,
    description: dept.description || "Comprehensive clinical unit equipped for specialized patient care.",
    longDescription: dept.description || "",
    hours: dept.workingHours || "24/7 Emergency & Inpatient Care",
    phone: dept.phone || "+251 116 000 111",
    email: dept.email || "info@medhenbeza.com",
    location: dept.location || "Main Hospital Complex",
    headDoctorName: dept.headDoctor || leadDoctor?.fullName || "Consultant Specialist",
    keyServices: specializations,
    href: `/departments/${dept.slug}`,
    image: dept.image || "",
    imageAlt: `${dept.name} department at Medhen Beza Hospital`,
    metaTitle: dept.metaTitle,
    metaDescription: dept.metaDescription,
    canonicalUrl: dept.canonicalUrl,
    ogImage: dept.ogImage,
  };
}

export async function getPublicDepartments(): Promise<DepartmentDetailData[]> {
  try {
    const depts = await db.department.findMany({
      where: { status: ContentStatus.PUBLISHED },
      include: {
        services: { where: { status: ContentStatus.PUBLISHED } },
        doctors: { where: { status: ContentStatus.PUBLISHED } },
      },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });
    return depts.map(mapDepartment);
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicDepartments]", error);
    return [];
  }
}

export async function getPublicDepartmentBySlug(slug: string): Promise<DepartmentDetailData | null> {
  try {
    const dept = await db.department.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
      },
      include: {
        services: { where: { status: ContentStatus.PUBLISHED } },
        doctors: { where: { status: ContentStatus.PUBLISHED } },
        careers: { where: { status: ContentStatus.PUBLISHED } },
      },
    });
    return dept ? mapDepartment(dept) : null;
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicDepartmentBySlug]", error);
    return null;
  }
}

// ─── 3. Services ────────────────────────────────────────────────────────────

function mapService(srv: any): ServiceDetailData {
  let extractedFeatures: string[] = [];
  if (srv.additionalInfo) {
    extractedFeatures = srv.additionalInfo
      .split("\n")
      .map((l: string) => l.replace(/^[-*•]\s*/, "").trim())
      .filter((l: string) => l.length > 2 && l.length < 150)
      .slice(0, 8);
  }
  if (extractedFeatures.length === 0 && srv.content) {
    extractedFeatures = srv.content
      .split("\n")
      .map((l: string) => l.trim())
      .filter((l: string) => /^[-*•]/.test(l))
      .map((l: string) => l.replace(/^[-*•]\s*/, "").trim())
      .filter((l: string) => l.length > 2 && l.length < 150)
      .slice(0, 8);
  }

  return {
    id: srv.id,
    name: srv.title || srv.name,
    slug: srv.slug,
    description: srv.description || srv.summary || "Specialized clinical service.",
    longDescription: srv.content || srv.description || srv.summary || "",
    departmentSlug: srv.department?.slug || "general",
    departmentName: srv.department?.name || "General Medicine",
    availability: srv.availabilityInfo || "Standard Clinical Hours",
    features: extractedFeatures.length > 0 ? extractedFeatures : [
      "Specialist physician oversight",
      "Modern diagnostic technology",
      "Sterile clinical protocols",
    ],
    procedures: [],
    relatedDoctorSlugs: srv.department?.doctors?.map((d: any) => d.slug) || [],
    href: `/services/${srv.slug}`,
    image: srv.image || undefined,
    metaTitle: srv.metaTitle,
    metaDescription: srv.metaDescription,
    canonicalUrl: srv.canonicalUrl,
    ogImage: srv.ogImage,
  };
}

export async function getPublicServices(): Promise<ServiceDetailData[]> {
  try {
    const services = await db.service.findMany({
      where: { status: ContentStatus.PUBLISHED },
      include: {
        department: {
          include: {
            doctors: { where: { status: ContentStatus.PUBLISHED } },
          },
        },
      },
      orderBy: [{ order: "asc" }, { title: "asc" }],
    });
    return services.map(mapService);
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicServices]", error);
    return [];
  }
}

export async function getPublicServiceBySlug(slug: string): Promise<ServiceDetailData | null> {
  try {
    const srv = await db.service.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
      },
      include: {
        department: {
          include: {
            doctors: { where: { status: ContentStatus.PUBLISHED } },
            services: { where: { status: ContentStatus.PUBLISHED } },
          },
        },
      },
    });
    return srv ? mapService(srv) : null;
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicServiceBySlug]", error);
    return null;
  }
}

// ─── 4. News ────────────────────────────────────────────────────────────────

function mapNews(news: any): NewsDetailData {
  return {
    id: news.id,
    title: news.title,
    slug: news.slug,
    summary: news.summary || news.excerpt || news.content?.slice(0, 160) || "",
    category: news.category?.name || "Hospital News",
    date: (news.publishedAt || news.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    readTime: `${Math.max(2, Math.ceil((news.content || "").split(" ").length / 180))} min read`,
    author: {
      name: news.authorName || news.createdBy?.name || "Medhen Beza Medical Editorial",
      role: "Medical Communications",
    },
    contentParagraphs: (news.content || "").split("\n\n").filter(Boolean),
    tags: Array.isArray(news.tags) && news.tags.length > 0 ? news.tags : ["Healthcare", "Addis Ababa"],
    image: news.featuredImage || news.coverImage || undefined,
    href: `/news/${news.slug}`,
    metaTitle: news.metaTitle,
    metaDescription: news.metaDescription,
    canonicalUrl: news.canonicalUrl,
    ogImage: news.ogImage,
  };
}

export async function getPublicNews(): Promise<NewsDetailData[]> {
  try {
    const items = await db.news.findMany({
      where: { status: ContentStatus.PUBLISHED },
      include: { category: true, createdBy: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });
    return items.map(mapNews);
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicNews]", error);
    return [];
  }
}

export async function getPublicNewsBySlug(slug: string): Promise<NewsDetailData | null> {
  try {
    const item = await db.news.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
      },
      include: { category: true, createdBy: true },
    });
    return item ? mapNews(item) : null;
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicNewsBySlug]", error);
    return null;
  }
}

// ─── 5. Careers ─────────────────────────────────────────────────────────────

function mapCareer(car: any): CareerDetailData {
  const empTypeMap: Record<string, any> = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
  };

  const deadlineDate = car.deadline ? new Date(car.deadline) : new Date(Date.now() + 30 * 86400000);
  const createdDate = car.createdAt ? new Date(car.createdAt) : new Date();

  return {
    id: car.id,
    position: car.position,
    slug: car.slug,
    department: car.department?.name || "Clinical Operations",
    departmentSlug: car.department?.slug || "general",
    type: empTypeMap[car.employmentType] || "Full-time",
    location: car.location || "Addis Ababa, Ethiopia",
    deadline: deadlineDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    postedDate: createdDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    overview: car.description || "Clinical opportunity at Medhen Beza Hospital.",
    responsibilities: car.responsibilities && car.responsibilities.length > 0 ? car.responsibilities : [
      "Deliver compassionate, high-quality patient care in accordance with hospital clinical guidelines.",
      "Collaborate effectively with multidisciplinary medical teams and support staff.",
    ],
    requirements: car.requirements && car.requirements.length > 0 ? car.requirements : [],
    qualifications: car.qualifications && car.qualifications.length > 0 ? car.qualifications : [],
    benefits: [
      "Competitive hospital compensation package",
      "Comprehensive medical coverage at Medhen Beza Hospital",
      "Continuous professional training & development",
    ],
    contactEmail: car.department?.email || "careers@medhenbeza.com",
    href: `/careers/${car.slug}`,
  };
}

export async function getPublicCareers(): Promise<CareerDetailData[]> {
  try {
    const items = await db.career.findMany({
      where: { status: ContentStatus.PUBLISHED },
      include: { department: true },
      orderBy: [{ isFeatured: "desc" }, { deadline: "asc" }],
    });
    return items.map(mapCareer);
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicCareers]", error);
    return [];
  }
}

export async function getPublicCareerBySlug(slug: string): Promise<CareerDetailData | null> {
  try {
    const item = await db.career.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
      },
      include: { department: true },
    });
    return item ? mapCareer(item) : null;
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicCareerBySlug]", error);
    return null;
  }
}

// ─── 6. Events ──────────────────────────────────────────────────────────────

function mapEvent(ev: any): EventDetailData {
  const eventDate = new Date(ev.eventDate);
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  return {
    id: ev.id,
    title: ev.title,
    slug: ev.slug,
    day: eventDate.getDate(),
    month: monthNames[eventDate.getMonth()],
    year: eventDate.getFullYear(),
    dateFormatted: eventDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    time: "Event Date Scheduled",
    location: ev.location || "Medhen Beza Hospital Campus",
    isPast: eventDate < new Date(),
    description: ev.description || "Hospital public medical event.",
    fullDescription: [ev.description || "Special hospital event."],
    agenda: [],
    registrationInfo: "Free attendance for community members and healthcare professionals.",
    image: ev.image || undefined,
    href: `/events/${ev.slug}`,
    metaTitle: ev.metaTitle,
    metaDescription: ev.metaDescription,
    canonicalUrl: ev.canonicalUrl,
  };
}

export async function getPublicEvents(): Promise<EventDetailData[]> {
  try {
    const items = await db.hospitalEvent.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: [{ eventDate: "asc" }],
    });
    return items.map(mapEvent);
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicEvents]", error);
    return [];
  }
}

export async function getPublicEventBySlug(slug: string): Promise<EventDetailData | null> {
  try {
    const item = await db.hospitalEvent.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
      },
    });
    return item ? mapEvent(item) : null;
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicEventBySlug]", error);
    return null;
  }
}

// ─── 7. FAQs ────────────────────────────────────────────────────────────────

export async function getPublicFAQs(): Promise<FAQCategoryGroup[]> {
  try {
    const faqs = await db.fAQ.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: [{ order: "asc" }, { question: "asc" }],
    });

    const categoryMap = new Map<string, Array<{ id: string; question: string; answer: string }>>();
    for (const faq of faqs) {
      const cat = faq.category || "General Inquiries";
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, []);
      }
      categoryMap.get(cat)!.push({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
      });
    }

    return Array.from(categoryMap.entries()).map(([category, items], idx) => ({
      id: `faq-cat-${idx}`,
      category,
      description: `Common questions regarding ${category}`,
      items,
    }));
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicFAQs]", error);
    return [];
  }
}

// ─── 8. Gallery ─────────────────────────────────────────────────────────────

export async function getPublicGallery(): Promise<any[]> {
  try {
    const items = await db.gallery.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return items.map((g) => {
      const isVideo = g.type === "VIDEO";
      const fallbackThumb = isVideo ? getVideoThumbnailUrl(g.url) : null;
      const imageSrc = isVideo
        ? (g.thumbnailUrl || fallbackThumb || "")
        : (g.url || g.thumbnailUrl || "");

      return {
        id: g.id,
        title: g.title,
        description: g.description || "",
        category: g.album || "Facilities",
        type: isVideo ? "video" : "image",
        src: imageSrc,
        url: g.url,
        videoUrl: isVideo ? g.url : undefined,
        embedUrl: isVideo ? getVideoEmbedUrl(g.url) : undefined,
        href: isVideo ? g.url : undefined,
        alt: g.altText || g.title,
      };
    });
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicGallery]", error);
    return [];
  }
}

// ─── 9. CMS Pages & About Page ──────────────────────────────────────────────

export async function getPublicPageBySlug(slug: string) {
  try {
    const cleanSlug = slug.replace(/^\/+/, "");
    return await db.page.findFirst({
      where: {
        OR: [{ slug: cleanSlug }, { slug: `/${cleanSlug}` }],
        status: ContentStatus.PUBLISHED,
      },
    });
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicPageBySlug]", error);
    return null;
  }
}

export async function getPublicAboutPage(): Promise<AboutPageData> {
  const [dbPage, settings] = await Promise.all([
    getPublicPageBySlug("about"),
    getPublicSiteSettings(),
  ]);

  const base: AboutPageData = {
    ...MOCK_ABOUT_PAGE,
    hero: { ...MOCK_ABOUT_PAGE.hero },
    introduction: {
      ...MOCK_ABOUT_PAGE.introduction,
      paragraphs: [...MOCK_ABOUT_PAGE.introduction.paragraphs],
    },
    missionVision: {
      mission: { ...MOCK_ABOUT_PAGE.missionVision.mission },
      vision: { ...MOCK_ABOUT_PAGE.missionVision.vision },
    },
    values: MOCK_ABOUT_PAGE.values.map((v) => ({ ...v })),
    leadership: MOCK_ABOUT_PAGE.leadership.map((l) => ({ ...l })),
    environment: {
      ...MOCK_ABOUT_PAGE.environment,
      featured: { ...MOCK_ABOUT_PAGE.environment.featured },
      supporting: MOCK_ABOUT_PAGE.environment.supporting.map((p) => ({ ...p })),
    },
    accreditations: MOCK_ABOUT_PAGE.accreditations ? MOCK_ABOUT_PAGE.accreditations.map((a) => ({ ...a })) : [],
    finalCta: { ...MOCK_ABOUT_PAGE.finalCta },
  };

  // Dynamically replace default brand names with live hospitalName from settings
  base.hero.title = `About ${settings.hospitalName}`;
  base.hero.supportingText = base.hero.supportingText.replace(
    /Medhen Beza Hospital|Medhen Beza|Medhin Beza Hospital|Medhin Beza/gi,
    settings.hospitalName
  );
  base.hero.imageAlt = `${settings.hospitalName} main medical facility`;

  base.introduction.paragraphs = base.introduction.paragraphs.map((p) =>
    p.replace(
      /Medhen Beza Hospital|Medhen Beza|Medhin Beza Hospital|Medhin Beza/gi,
      settings.hospitalName
    )
  );
  base.introduction.photoAlt = `Medical team and care providers at ${settings.hospitalName}`;

  if (dbPage) {
    if (dbPage.title) base.hero.title = dbPage.title;
    if (dbPage.excerpt) base.hero.supportingText = dbPage.excerpt;

    if (dbPage.content && dbPage.content.trim().startsWith("{")) {
      try {
        const parsed = JSON.parse(dbPage.content);
        if (parsed.hero) {
          if (parsed.hero.title) base.hero.title = parsed.hero.title;
          if (parsed.hero.supportingText) base.hero.supportingText = parsed.hero.supportingText;
          if (parsed.hero.image) base.hero.image = parsed.hero.image;
          if (parsed.hero.imageAlt) base.hero.imageAlt = parsed.hero.imageAlt;
        }
        if (parsed.introduction) {
          base.introduction = {
            ...base.introduction,
            ...parsed.introduction,
            paragraphs: Array.isArray(parsed.introduction.paragraphs) && parsed.introduction.paragraphs.length > 0
              ? parsed.introduction.paragraphs
              : base.introduction.paragraphs,
          };
        }
        if (parsed.missionVision) {
          base.missionVision = {
            mission: { ...base.missionVision.mission, ...(parsed.missionVision?.mission || {}) },
            vision: { ...base.missionVision.vision, ...(parsed.missionVision?.vision || {}) },
          };
        }
        if (Array.isArray(parsed.values) && parsed.values.length > 0) {
          base.values = parsed.values.map((v: any) => ({
            label: v.label || "Value",
            description: v.description || "",
            icon: resolveValueIcon(v.icon),
          }));
        }
        if (Array.isArray(parsed.leadership) && parsed.leadership.length > 0) {
          base.leadership = parsed.leadership.map((l: any) => ({
            name: l.name || "Director",
            position: l.position || "Leadership",
            photo: l.photo || undefined,
            photoAlt: l.photoAlt || l.name || "Leadership photo",
          }));
        }
        if (parsed.environment) {
          base.environment = {
            eyebrow: parsed.environment.eyebrow || base.environment.eyebrow,
            title: parsed.environment.title || base.environment.title,
            description: parsed.environment.description || base.environment.description,
            featured: parsed.environment.featured ? { ...base.environment.featured, ...parsed.environment.featured } : base.environment.featured,
            supporting: Array.isArray(parsed.environment.supporting) && parsed.environment.supporting.length > 0
              ? parsed.environment.supporting
              : base.environment.supporting,
          };
        }
        if (Array.isArray(parsed.accreditations)) {
          base.accreditations = parsed.accreditations;
        }
        if (parsed.finalCta) {
          base.finalCta = { ...base.finalCta, ...parsed.finalCta };
        }
      } catch (e) {
        base.introduction.paragraphs = dbPage.content.split("\n\n").filter(Boolean);
      }
    } else if (dbPage.content) {
      base.introduction.paragraphs = dbPage.content.split("\n\n").filter(Boolean);
    }
  }

  return base;
}

// ─── 10. Facilities ─────────────────────────────────────────────────────────

export async function getPublicFacilities(): Promise<FacilityDetailData[]> {
  try {
    const galleryItems = await db.gallery.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        album: { equals: "Facilities", mode: "insensitive" },
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    const depts = await db.department.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: [{ order: "asc" }],
      take: 6,
    });

    if (galleryItems.length > 0) {
      return galleryItems.map((g) => ({
        id: g.id,
        slug: g.id,
        name: g.title,
        image: g.type === "VIDEO"
          ? g.thumbnailUrl || undefined
          : g.url || g.thumbnailUrl || undefined,
        imageAlt: g.altText || g.title,
        tagline: g.description || "State-of-the-art medical environment",
        description: g.description || "Modern clinical infrastructure designed for patient safety and comfort.",
        longDescription: g.description || "",
        location: "Main Medical Campus",
        features: [
          "Modern clinical and surgical suites",
          "Dedicated patient support and infection control",
          "Continuous medical team monitoring",
        ],
        galleryImages: [{ src: g.url || "", alt: g.altText || g.title }],
        href: `/facilities/${g.id}`,
      }));
    }

    return depts.map((d) => ({
      id: d.id,
      slug: d.slug,
      name: `${d.name} Facility`,
      image: d.image || undefined,
      imageAlt: `${d.name} wing`,
      tagline: d.description || "Advanced medical wing",
      description: d.description || "State-of-the-art clinical environment.",
      longDescription: d.description || "",
      location: d.location || "Main Campus",
      features: [
        "Advanced diagnostic and monitoring equipment",
        "24/7 specialist physician oversight",
        "Sterile clinical environment",
      ],
      galleryImages: d.image ? [{ src: d.image, alt: d.name }] : [],
      href: `/departments/${d.slug}`,
    }));
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicFacilities]", error);
    return [];
  }
}

export async function getPublicFacilityBySlug(slug: string): Promise<FacilityDetailData | null> {
  try {
    const item = await db.gallery.findFirst({
      where: {
        id: slug,
        status: ContentStatus.PUBLISHED,
      },
    });

    if (item) {
      return {
        id: item.id,
        slug: item.id,
        name: item.title,
        image: item.url || undefined,
        imageAlt: item.altText || item.title,
        tagline: item.description || "State-of-the-art hospital infrastructure",
        description: item.description || "High-standard clinical environment built for patient safety.",
        longDescription: item.description || "",
        location: "Main Medical Campus",
        features: [
          "24/7 patient vital monitoring",
          "Sterile, climate-controlled environmental systems",
          "Integrated emergency physician support",
        ],
        galleryImages: [{ src: item.url || "", alt: item.altText || item.title }],
        href: `/facilities/${item.id}`,
      };
    }

    const dept = await db.department.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
      },
    });

    if (dept) {
      return {
        id: dept.id,
        slug: dept.slug,
        name: `${dept.name} Pavilion`,
        image: dept.image || undefined,
        imageAlt: dept.name,
        tagline: dept.description,
        description: dept.description,
        longDescription: dept.description,
        location: dept.location || "Main Campus",
        features: [
          "Modern clinical suites and procedure rooms",
          "24/7 dedicated specialist care",
          "Integrated diagnostic radiology and laboratory access",
        ],
        galleryImages: dept.image ? [{ src: dept.image, alt: dept.name }] : [],
        href: `/facilities/${dept.slug}`,
      };
    }

    return null;
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicFacilityBySlug]", error);
    return null;
  }
}
