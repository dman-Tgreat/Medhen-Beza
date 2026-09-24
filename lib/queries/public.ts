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
import { type SupportedLocale, DEFAULT_LOCALE } from "@/lib/i18n/config";
import { localizeEntity, formatLocalizedDate } from "@/lib/i18n/localize";
import { getVideoEmbedUrl, getVideoThumbnailUrl, isDirectVideoFile } from "@/lib/media/video";
import type { AboutPageData } from "@/lib/mock-data";
import { MOCK_ABOUT_PAGE, getMockAboutPage } from "@/lib/mock-data";
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

export async function getPublicSiteSettings(
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<PublicSiteSettings> {
  try {
    const rows = await db.siteSetting.findMany({
      where: { isPublic: true },
    });
    const map = new Map<string, string>();
    for (const r of rows) {
      map.set(r.key, r.value);
    }

    const getVal = (key: string): string | undefined => {
      if (locale !== "en") {
        const localized = map.get(`${key}_${locale}`);
        if (localized && localized.trim().length > 0) return localized;
      }
      return map.get(key);
    };

    const hospitalName =
      getVal("hospital_name") || getVal("name") || HOSPITAL_INFO.name;
    const shortName =
      getVal("short_name") ||
      (hospitalName.toLowerCase().includes("hospital")
        ? hospitalName.replace(/hospital/i, "").trim()
        : hospitalName) ||
      HOSPITAL_INFO.shortName;
    const tagline =
      getVal("tagline") ||
      getVal("hero_headline_accent") ||
      HOSPITAL_INFO.tagline;
    const description =
      getVal("seo_description") ||
      getVal("description") ||
      getVal("hero_supporting_text") ||
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
      getVal("location") ||
      address ||
      HOSPITAL_INFO.location;
    const hours =
      getVal("visiting_hours") ||
      getVal("working_hours") ||
      getVal("hours") ||
      HOSPITAL_INFO.hours;
    const visitingHours =
      getVal("visiting_hours") ||
      getVal("working_hours") ||
      getVal("hours") ||
      HOSPITAL_INFO.hours;

    const heroEyebrow = getVal("hero_eyebrow") || "Leading Healthcare Excellence";
    const heroHeadline = getVal("hero_headline") || "Compassionate care.";
    const heroHeadlineAccent = getVal("hero_headline_accent") || "Trusted healthcare.";
    const heroSupportingText = getVal("hero_supporting_text") || "Close to you, committed to you — exceptional clinical care delivered by specialists who put patients first.";
    const statSpecialists = getVal("stat_specialists") || "50+";
    const statEmergency = getVal("stat_emergency") || "24/7";
    const statDepartments = getVal("stat_departments") || "15+";

    const hospitalIntroTitle = getVal("hospital_intro_title") || "Trusted care for every stage of life";
    const rawIntro = getVal("hospital_intro_text") ||
      `${hospitalName} provides patient-centred, modern clinical care, delivering healthcare with empathy, clinical precision, and dignity.\n\nOur multidisciplinary teams of specialists work across cutting-edge diagnostic and surgical units to serve families across the region.\n\nCommitted to continuous clinical excellence and modern standards of practice.`;
    const hospitalIntroParagraphs = rawIntro.split("\n\n").map((p) => p.trim()).filter(Boolean);

    const emergencyGate = getVal("emergency_gate") || "Gate 1 (Dedicated Ambulance & Emergency Driveway), Bole Road";
    const emergencyHours = getVal("emergency_hours") || "Open 24 Hours · 7 Days a Week · All Holidays";
    const heroImage = map.get("hero_image") || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200";
    const hospitalIntroImage = map.get("hospital_intro_image") || "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=1200";
    const seoTitle = getVal("seo_title") || `${hospitalName} | ${tagline}`;
    const seoDescription = getVal("seo_description") || description;
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

function mapDoctor(doc: any, locale: SupportedLocale = DEFAULT_LOCALE): DoctorDetailData {
  const locDoc = localizeEntity(doc, locale, [
    "fullName",
    "specialty",
    "position",
    "biography",
    "experience",
    "areasOfExpertise",
    "availability",
    "metaTitle",
    "metaDescription",
  ]);
  const locDept = locDoc.department
    ? localizeEntity(locDoc.department, locale, ["name", "description", "location"])
    : null;

  return {
    id: locDoc.id,
    name: locDoc.fullName,
    slug: locDoc.slug,
    specialty: locDoc.specialty,
    department: locDept?.name || locDoc.department?.name || "General Medicine",
    departmentSlug: locDoc.department?.slug || "general",
    title: locDoc.position || "Senior Specialist",
    photo: locDoc.profilePhoto || undefined,
    href: `/${locale}/doctors/${locDoc.slug}`,
    biography: locDoc.biography || "",
    qualifications: locDoc.qualifications || [],
    experience: locDoc.experience || "10+ years of dedicated clinical experience",
    languages: locDoc.languages || ["Amharic", "English"],
    areasOfExpertise: locDoc.areasOfExpertise || [],
    officeLocation: locDept?.location || locDoc.department?.location || "Main Hospital Building",
    availability: locDoc.availability || "Monday - Friday: 9:00 AM - 5:00 PM",
    contactEmail: locDoc.department?.email || "info@medhenbeza.com",
    metaTitle: locDoc.metaTitle,
    metaDescription: locDoc.metaDescription,
    canonicalUrl: locDoc.canonicalUrl,
    ogImage: locDoc.ogImage,
  };
}

export async function getPublicDoctors(
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<DoctorDetailData[]> {
  try {
    const docs = await db.doctor.findMany({
      where: { status: ContentStatus.PUBLISHED },
      include: { department: true },
      orderBy: [{ order: "asc" }, { fullName: "asc" }],
    });
    return docs.map((d) => mapDoctor(d, locale));
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicDoctors]", error);
    return [];
  }
}

export async function getPublicDoctorBySlug(
  slug: string,
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<DoctorDetailData | null> {
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
    return doc ? mapDoctor(doc, locale) : null;
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicDoctorBySlug]", error);
    return null;
  }
}

export async function getPublicRelatedDoctors(
  departmentSlug: string,
  excludeSlug: string,
  limit = 3,
  locale: SupportedLocale = DEFAULT_LOCALE
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
    return docs.map((d) => mapDoctor(d, locale));
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicRelatedDoctors]", error);
    return [];
  }
}

// ─── 2. Departments ─────────────────────────────────────────────────────────

function mapDepartment(dept: any, locale: SupportedLocale = DEFAULT_LOCALE): DepartmentDetailData {
  const locDept = localizeEntity(dept, locale, [
    "name",
    "description",
    "location",
    "workingHours",
    "headDoctor",
    "specializations",
    "metaTitle",
    "metaDescription",
  ]);

  const leadDoctor = locDept.doctors?.find((d: any) =>
    /head|chief|director|lead/i.test(d.position || "")
  ) || locDept.doctors?.[0];

  const localizedLeadDoctor = leadDoctor
    ? localizeEntity(leadDoctor, locale, ["fullName", "position"])
    : null;

  const specializations =
    Array.isArray(locDept.specializations) && locDept.specializations.length > 0
      ? locDept.specializations
      : locDept.services?.map((s: any) => {
          const locS = localizeEntity(s, locale, ["title", "name"]);
          return locS.title || locS.name;
        }) || [];

  return {
    id: locDept.id,
    name: locDept.name,
    slug: locDept.slug,
    description: locDept.description || "Comprehensive clinical unit equipped for specialized patient care.",
    longDescription: locDept.description || "",
    hours: locDept.workingHours || "24/7 Emergency & Inpatient Care",
    phone: locDept.phone || "+251 116 000 111",
    email: locDept.email || "info@medhenbeza.com",
    location: locDept.location || "Main Hospital Complex",
    headDoctorName: locDept.headDoctor || localizedLeadDoctor?.fullName || "Consultant Specialist",
    keyServices: specializations,
    href: `/${locale}/departments/${locDept.slug}`,
    image: locDept.image || "",
    imageAlt: `${locDept.name} department at Medhin Beza Hospital`,
    metaTitle: locDept.metaTitle,
    metaDescription: locDept.metaDescription,
    canonicalUrl: locDept.canonicalUrl,
    ogImage: locDept.ogImage,
  };
}

export async function getPublicDepartments(
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<DepartmentDetailData[]> {
  try {
    const depts = await db.department.findMany({
      where: { status: ContentStatus.PUBLISHED },
      include: {
        services: { where: { status: ContentStatus.PUBLISHED } },
        doctors: { where: { status: ContentStatus.PUBLISHED } },
      },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });
    return depts.map((d) => mapDepartment(d, locale));
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicDepartments]", error);
    return [];
  }
}

export async function getPublicDepartmentBySlug(
  slug: string,
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<DepartmentDetailData | null> {
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
    return dept ? mapDepartment(dept, locale) : null;
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicDepartmentBySlug]", error);
    return null;
  }
}

// ─── 3. Services ────────────────────────────────────────────────────────────

function mapService(srv: any, locale: SupportedLocale = DEFAULT_LOCALE): ServiceDetailData {
  const locSrv = localizeEntity(srv, locale, [
    "title",
    "description",
    "content",
    "additionalInfo",
    "availabilityInfo",
    "metaTitle",
    "metaDescription",
  ]);

  const locDept = locSrv.department
    ? localizeEntity(locSrv.department, locale, ["name", "description", "location"])
    : null;

  let extractedFeatures: string[] = [];
  if (locSrv.additionalInfo) {
    extractedFeatures = locSrv.additionalInfo
      .split("\n")
      .map((l: string) => l.replace(/^[-*•]\s*/, "").trim())
      .filter((l: string) => l.length > 2 && l.length < 150)
      .slice(0, 8);
  }
  if (extractedFeatures.length === 0 && locSrv.content) {
    extractedFeatures = locSrv.content
      .split("\n")
      .map((l: string) => l.trim())
      .filter((l: string) => /^[-*•]/.test(l))
      .map((l: string) => l.replace(/^[-*•]\s*/, "").trim())
      .filter((l: string) => l.length > 2 && l.length < 150)
      .slice(0, 8);
  }

  return {
    id: locSrv.id,
    name: locSrv.title || locSrv.name,
    slug: locSrv.slug,
    description: locSrv.description || locSrv.summary || "Specialized clinical service.",
    longDescription: locSrv.content || locSrv.description || locSrv.summary || "",
    departmentSlug: locDept?.slug || locSrv.department?.slug || "general",
    departmentName: locDept?.name || locSrv.department?.name || "General Medicine",
    availability: locSrv.availabilityInfo || "Standard Clinical Hours",
    features: extractedFeatures.length > 0 ? extractedFeatures : [
      "Specialist physician oversight",
      "Modern diagnostic technology",
      "Sterile clinical protocols",
    ],
    procedures: [],
    relatedDoctorSlugs: locSrv.department?.doctors?.map((d: any) => d.slug) || [],
    href: `/${locale}/services/${locSrv.slug}`,
    image: locSrv.image || undefined,
    metaTitle: locSrv.metaTitle,
    metaDescription: locSrv.metaDescription,
    canonicalUrl: locSrv.canonicalUrl,
    ogImage: locSrv.ogImage,
  };
}

export async function getPublicServices(
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<ServiceDetailData[]> {
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
    return services.map((s) => mapService(s, locale));
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicServices]", error);
    return [];
  }
}

export async function getPublicServiceBySlug(
  slug: string,
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<ServiceDetailData | null> {
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
    return srv ? mapService(srv, locale) : null;
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicServiceBySlug]", error);
    return null;
  }
}

// ─── 4. News ────────────────────────────────────────────────────────────────

function mapNews(news: any, locale: SupportedLocale = DEFAULT_LOCALE): NewsDetailData {
  const locNews = localizeEntity(news, locale, [
    "title",
    "summary",
    "content",
    "authorName",
    "readTime",
    "tags",
    "metaTitle",
    "metaDescription",
  ]);

  const locCat = locNews.category
    ? localizeEntity(locNews.category, locale, ["name", "description"])
    : null;

  const wordCount = (locNews.content || "").trim().split(/\s+/).filter(Boolean).length;
  const calculatedReadTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
  const readTime = locNews.readTime && locNews.readTime.trim() ? locNews.readTime.trim() : calculatedReadTime;

  const rawTags = Array.isArray(locNews.tags) ? locNews.tags : [];
  const tags = rawTags
    .map((t: string) => (typeof t === "string" ? t.replace(/^#/, "").trim() : ""))
    .filter(Boolean);

  return {
    id: locNews.id,
    title: locNews.title,
    slug: locNews.slug,
    summary: locNews.summary || locNews.excerpt || locNews.content?.slice(0, 160) || "",
    category: locCat?.name || locNews.category?.name || "Hospital News",
    date: formatLocalizedDate(locNews.publishedAt || locNews.createdAt, locale),
    readTime,
    author: {
      name: locNews.authorName || locNews.createdBy?.name || "Medhen Beza Medical Editorial",
      role: "Medical Communications",
    },
    contentParagraphs: (locNews.content || "").split("\n\n").filter(Boolean),
    tags,
    image: locNews.featuredImage || locNews.coverImage || undefined,
    href: `/${locale}/news/${locNews.slug}`,
    metaTitle: locNews.metaTitle,
    metaDescription: locNews.metaDescription,
    canonicalUrl: locNews.canonicalUrl,
    ogImage: locNews.ogImage,
  };
}

export async function getPublicNews(
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<NewsDetailData[]> {
  try {
    const items = await db.news.findMany({
      where: { status: ContentStatus.PUBLISHED },
      include: { category: true, createdBy: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });
    return items.map((n) => mapNews(n, locale));
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicNews]", error);
    return [];
  }
}

export async function getPublicNewsBySlug(
  slug: string,
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<NewsDetailData | null> {
  try {
    const item = await db.news.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
      },
      include: { category: true, createdBy: true },
    });
    return item ? mapNews(item, locale) : null;
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicNewsBySlug]", error);
    return null;
  }
}

// ─── 5. Careers ─────────────────────────────────────────────────────────────

function mapCareer(car: any, locale: SupportedLocale = DEFAULT_LOCALE): CareerDetailData {
  const locCar = localizeEntity(car, locale, [
    "position",
    "location",
    "description",
    "responsibilities",
    "requirements",
    "qualifications",
    "applicationInstructions",
    "metaTitle",
    "metaDescription",
  ]);

  const locDept = locCar.department
    ? localizeEntity(locCar.department, locale, ["name", "description"])
    : null;

  const empTypeMap: Record<string, any> = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
  };

  const deadlineDate = locCar.deadline ? new Date(locCar.deadline) : new Date(Date.now() + 30 * 86400000);
  const createdDate = locCar.createdAt ? new Date(locCar.createdAt) : new Date();

  return {
    id: locCar.id,
    position: locCar.position,
    slug: locCar.slug,
    department: locDept?.name || locCar.department?.name || "Clinical Operations",
    departmentSlug: locDept?.slug || locCar.department?.slug || "general",
    type: empTypeMap[locCar.employmentType] || "Full-time",
    location: locCar.location || "Addis Ababa, Ethiopia",
    deadline: formatLocalizedDate(deadlineDate, locale),
    postedDate: formatLocalizedDate(createdDate, locale),
    overview: locCar.description || "Clinical opportunity at Medhen Beza Hospital.",
    responsibilities: Array.isArray(locCar.responsibilities) ? locCar.responsibilities : [],
    requirements: Array.isArray(locCar.requirements) ? locCar.requirements : [],
    qualifications: Array.isArray(locCar.qualifications) ? locCar.qualifications : [],
    benefits: [
      "Competitive hospital compensation package",
      "Comprehensive medical coverage at Medhen Beza Hospital",
      "Continuous professional training & development",
    ],
    contactEmail: locCar.department?.email || "careers@medhenbeza.com",
    href: `/${locale}/careers/${locCar.slug}`,
  };
}

export async function getPublicCareers(
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<CareerDetailData[]> {
  try {
    const items = await db.career.findMany({
      where: { status: ContentStatus.PUBLISHED },
      include: { department: true },
      orderBy: [{ isFeatured: "desc" }, { deadline: "asc" }],
    });
    return items.map((c) => mapCareer(c, locale));
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicCareers]", error);
    return [];
  }
}

export async function getPublicCareerBySlug(
  slug: string,
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<CareerDetailData | null> {
  try {
    const item = await db.career.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
      },
      include: { department: true },
    });
    return item ? mapCareer(item, locale) : null;
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicCareerBySlug]", error);
    return null;
  }
}

// ─── 6. Events ──────────────────────────────────────────────────────────────

function mapEvent(ev: any, locale: SupportedLocale = DEFAULT_LOCALE): EventDetailData {
  const locEv = localizeEntity(ev, locale, [
    "title",
    "description",
    "location",
    "metaTitle",
    "metaDescription",
  ]);

  const eventDate = new Date(locEv.eventDate);
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  return {
    id: locEv.id,
    title: locEv.title,
    slug: locEv.slug,
    day: eventDate.getDate(),
    month: monthNames[eventDate.getMonth()],
    year: eventDate.getFullYear(),
    dateFormatted: formatLocalizedDate(eventDate, locale),
    time: "Event Date Scheduled",
    location: locEv.location || "Medhen Beza Hospital Campus",
    isPast: eventDate < new Date(),
    description: locEv.description || "Hospital public medical event.",
    fullDescription: [locEv.description || "Special hospital event."],
    agenda: [],
    registrationInfo: "Free attendance for community members and healthcare professionals.",
    image: locEv.image || undefined,
    href: `/${locale}/events/${locEv.slug}`,
    metaTitle: locEv.metaTitle,
    metaDescription: locEv.metaDescription,
    canonicalUrl: locEv.canonicalUrl,
  };
}

export async function getPublicEvents(
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<EventDetailData[]> {
  try {
    const items = await db.hospitalEvent.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: [{ eventDate: "asc" }],
    });
    return items.map((e) => mapEvent(e, locale));
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicEvents]", error);
    return [];
  }
}

export async function getPublicEventBySlug(
  slug: string,
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<EventDetailData | null> {
  try {
    const item = await db.hospitalEvent.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
      },
    });
    return item ? mapEvent(item, locale) : null;
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicEventBySlug]", error);
    return null;
  }
}

// ─── 7. FAQs ────────────────────────────────────────────────────────────────

export async function getPublicFAQs(
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<FAQCategoryGroup[]> {
  try {
    const rawFaqs = await db.fAQ.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: [{ order: "asc" }, { question: "asc" }],
    });

    const faqs = rawFaqs.map((f) =>
      localizeEntity(f, locale, ["question", "answer", "category"])
    );

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

export async function getPublicGallery(
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<any[]> {
  try {
    const rawItems = await db.gallery.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    const items = rawItems.map((g) =>
      localizeEntity(g, locale, ["title", "description", "album", "altText"])
    );

    return items.map((g) => {
      const isVideo = g.type === "VIDEO";
      const fallbackThumb = isVideo ? getVideoThumbnailUrl(g.url) : null;
      let imageSrc = isVideo
        ? (g.thumbnailUrl || fallbackThumb || "")
        : (g.url || g.thumbnailUrl || "");
      if (imageSrc && isDirectVideoFile(imageSrc)) {
        imageSrc = "";
      }

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

export async function getPublicPageBySlug(
  slug: string,
  locale: SupportedLocale = DEFAULT_LOCALE
) {
  try {
    const cleanSlug = slug.replace(/^\/+/, "");
    const page = await db.page.findFirst({
      where: {
        OR: [{ slug: cleanSlug }, { slug: `/${cleanSlug}` }],
        status: ContentStatus.PUBLISHED,
      },
    });
    return page ? localizeEntity(page, locale, ["title", "excerpt", "content", "metaTitle", "metaDescription"]) : null;
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicPageBySlug]", error);
    return null;
  }
}

export async function getPublicAboutPage(
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<AboutPageData> {
  const [dbPage, settings] = await Promise.all([
    getPublicPageBySlug("about", locale),
    getPublicSiteSettings(locale),
  ]);

  const fallback = getMockAboutPage(locale);
  const base: AboutPageData = {
    ...fallback,
    hero: { ...fallback.hero },
    introduction: {
      ...fallback.introduction,
      paragraphs: [...fallback.introduction.paragraphs],
    },
    missionVision: {
      mission: { ...fallback.missionVision.mission },
      vision: { ...fallback.missionVision.vision },
    },
    values: fallback.values.map((v) => ({ ...v })),
    leadership: fallback.leadership.map((l) => ({ ...l })),
    environment: {
      ...fallback.environment,
      featured: { ...fallback.environment.featured },
      supporting: fallback.environment.supporting.map((p) => ({ ...p })),
    },
    accreditations: fallback.accreditations ? fallback.accreditations.map((a) => ({ ...a })) : [],
    finalCta: { ...fallback.finalCta },
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

    let contentToParse = dbPage.content;
    if (locale !== "en" && dbPage.translations) {
      const translations = typeof dbPage.translations === "string" ? JSON.parse(dbPage.translations) : dbPage.translations;
      if (translations?.[locale]?.content) {
        contentToParse = translations[locale].content;
      }
    }

    if (contentToParse && contentToParse.trim().startsWith("{")) {
      try {
        const parsed = JSON.parse(contentToParse);
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
        base.introduction.paragraphs = contentToParse.split("\n\n").filter(Boolean);
      }
    } else if (contentToParse) {
      base.introduction.paragraphs = contentToParse.split("\n\n").filter(Boolean);
    }
  }

  return base;
}

// ─── 10. Facilities ─────────────────────────────────────────────────────────

function resolveValidImageUrl(url?: string | null): string | undefined {
  if (!url || typeof url !== "string") return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;

  // Convert YouTube watch/embed/short link to img.youtube.com thumbnail
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  }

  // If someone passed a raw youtube URL that wasn't matched
  if (trimmed.includes("youtube.com") || trimmed.includes("youtu.be")) {
    return "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80";
  }

  if (trimmed.startsWith("/") || trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return undefined;
}

function mapFacility(f: any, locale: SupportedLocale = DEFAULT_LOCALE): FacilityDetailData {
  const locF = localizeEntity(f, locale, [
    "name",
    "tagline",
    "description",
    "category",
    "capacity",
    "location",
    "hours",
    "features",
  ]);

  const defaultFeatures = [
    "Specialist physician and nursing coverage",
    "Sterile climate-controlled environmental systems",
    "Continuous patient vital monitoring",
    "Integrated emergency resuscitation protocol",
  ];

  const features =
    Array.isArray(locF.features) && locF.features.length > 0
      ? locF.features
      : defaultFeatures;

  const validImage = resolveValidImageUrl(locF.image);

  return {
    id: locF.id,
    slug: locF.slug || locF.id,
    name: locF.name,
    image: validImage,
    imageAlt: `${locF.name} at Medhen Beza Hospital`,
    tagline: locF.tagline || locF.name,
    description: locF.description || "State-of-the-art clinical environment engineered for patient safety.",
    longDescription: locF.description || "",
    category: locF.category || "Clinical Unit",
    capacity: locF.capacity || undefined,
    location: locF.location || "Main Hospital Complex",
    hours: locF.hours || "24/7 Clinical & Emergency Access",
    phone: locF.phone || "+251 11 654 3000",
    features,
    galleryImages: validImage ? [{ src: validImage, alt: locF.name }] : [],
    href: `/${locale}/facilities/${locF.slug || locF.id}`,
  };
}

export async function getPublicFacilities(
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<FacilityDetailData[]> {
  try {
    const facilities = await db.facility.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    if (facilities.length > 0) {
      return facilities.map((f) => mapFacility(f, locale));
    }

    const depts = await db.department.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: [{ order: "asc" }],
      take: 6,
    });

    return depts.map((d) => {
      const locD = localizeEntity(d, locale, ["name", "description", "location", "workingHours"]);
      return {
        id: locD.id,
        slug: locD.slug,
        name: `${locD.name} Facility`,
        image: locD.image || undefined,
        imageAlt: `${locD.name} wing`,
        tagline: locD.description || "Advanced medical wing",
        description: locD.description || "State-of-the-art clinical environment.",
        longDescription: locD.description || "",
        category: "Clinical Wing",
        capacity: "Comprehensive Care Unit",
        location: locD.location || "Main Campus",
        hours: locD.workingHours || "24/7 Care",
        phone: locD.phone || "+251 11 654 3000",
        features: [
          "Advanced diagnostic and monitoring equipment",
          "24/7 specialist physician oversight",
          "Sterile clinical environment",
        ],
        galleryImages: locD.image ? [{ src: locD.image, alt: locD.name }] : [],
        href: `/${locale}/departments/${locD.slug}`,
      };
    });
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicFacilities]", error);
    return [];
  }
}

export async function getPublicFacilityBySlug(
  slug: string,
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<FacilityDetailData | null> {
  try {
    const item = await db.facility.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        status: ContentStatus.PUBLISHED,
      },
    });

    if (item) {
      return mapFacility(item, locale);
    }

    const dept = await db.department.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
      },
    });

    if (dept) {
      const locD = localizeEntity(dept, locale, ["name", "description", "location", "workingHours"]);
      return {
        id: locD.id,
        slug: locD.slug,
        name: `${locD.name} Facility`,
        image: locD.image || undefined,
        imageAlt: `${locD.name} wing`,
        tagline: locD.description || "Advanced medical wing",
        description: locD.description || "State-of-the-art clinical environment.",
        longDescription: locD.description || "",
        category: "Clinical Wing",
        capacity: "Comprehensive Care Unit",
        location: locD.location || "Main Campus",
        hours: locD.workingHours || "24/7 Care",
        phone: locD.phone || "+251 11 654 3000",
        features: [
          "Advanced diagnostic and monitoring equipment",
          "24/7 specialist physician oversight",
          "Sterile clinical environment",
        ],
        galleryImages: locD.image ? [{ src: locD.image, alt: locD.name }] : [],
        href: `/${locale}/departments/${locD.slug}`,
      };
    }

    return null;
  } catch (error) {
    console.error("[PUBLIC_QUERY_ERROR: getPublicFacilityBySlug]", error);
    return null;
  }
}

