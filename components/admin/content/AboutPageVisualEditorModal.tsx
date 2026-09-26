"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Save,
  Send,
  Globe,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  UserCircle2,
  Building2,
  Sparkles,
  Code2,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Heart,
  Award,
  Users,
  HeartHandshake,
  UserCheck,
  Stethoscope,
  Activity,
  Layers,
  FileText,
  Briefcase,
  HelpCircle,
  ExternalLink,
  Languages,
} from "lucide-react";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { useAdminRole } from "@/components/admin/role-context";
import { cn } from "@/lib/utils";
import { ADMIN_LANGUAGES } from "@/components/admin/content-form-modal";
import { MOCK_ABOUT_PAGE_AM, MOCK_ABOUT_PAGE_OM } from "@/lib/mock-data";

interface AboutLeaderItem {
  name: string;
  position: string;
  photo?: string;
  photoAlt?: string;
}

interface AboutValueItem {
  label: string;
  description: string;
  icon?: string;
}

interface AboutFacilityItem {
  name: string;
  category: string;
  image: string;
  imageAlt?: string;
}

interface AboutAccreditationItem {
  name: string;
  issuer: string;
}

interface AboutPageFormState {
  hero: {
    title: string;
    supportingText: string;
    image: string;
    imageAlt: string;
  };
  introduction: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    photo: string;
    photoAlt: string;
    ctaLabel: string;
    ctaHref: string;
  };
  missionVision: {
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
  };
  values: AboutValueItem[];
  leadership: AboutLeaderItem[];
  environment: {
    eyebrow: string;
    title: string;
    description: string;
    featured: AboutFacilityItem;
    supporting: AboutFacilityItem[];
  };
  accreditations: AboutAccreditationItem[];
  finalCta: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  seoTitle: string;
  seoDescription: string;
}

const DEFAULT_ABOUT_FORM: AboutPageFormState = {
  hero: {
    title: "About Medhen Beza Hospital",
    supportingText:
      "Dedicated to clinical excellence, compassionate patient recovery, and advanced medical practice in Adama and beyond.",
    image:
      "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Medhen Beza Hospital campus in Adama",
  },
  introduction: {
    eyebrow: "Our Story & Purpose",
    title: "A modern healthcare institution built on trust, clinical expertise, and compassion",
    paragraphs: [
      "Medhen Beza Hospital was founded with a singular purpose: to bring accessible, world-class specialized healthcare to patients and families across Adama and throughout Ethiopia.",
      "From routine outpatient consultations to complex multi-stage surgical procedures, our hospital operates around the clock to ensure every patient receives dignity, clinical precision, and compassionate support.",
      "We invest continuously in our medical workforce, international standards of clinical safety, and the latest diagnostic technologies.",
    ],
    photo:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=80",
    photoAlt: "Clinical leadership and medical team at Medhen Beza Hospital",
    ctaLabel: "Contact Us",
    ctaHref: "/contact",
  },
  missionVision: {
    mission: {
      eyebrow: "Our Mission",
      title: "Compassionate, high-standard healthcare for every patient",
      text: "To deliver accessible, patient-centered clinical care of the highest standard, treating every individual with compassion, clinical integrity, and dignity.",
    },
    vision: {
      eyebrow: "Our Vision",
      title: "Setting the benchmark for healthcare excellence across Ethiopia",
      text: "To be Ethiopia's most trusted hospital for specialized and emergency medicine, recognized across East Africa for clinical innovation, safety, and patient outcomes.",
    },
  },
  values: [
    {
      icon: "Heart",
      label: "Compassion",
      description: "Treating every patient and family member with empathy, warmth, and genuine human kindness.",
    },
    {
      icon: "Award",
      label: "Excellence",
      description: "Pursuing the highest clinical and operational standards across all our services and departments.",
    },
    {
      icon: "ShieldCheck",
      label: "Integrity",
      description: "Upholding complete medical honesty, confidentiality, and professional ethics in every interaction.",
    },
    {
      icon: "Users",
      label: "Collaboration",
      description: "Working as multidisciplinary care teams to deliver integrated diagnosis and treatment plans.",
    },
    {
      icon: "HeartHandshake",
      label: "Respect",
      description: "Honoring patient dignity, cultural diversity, and individual choices at every stage of care.",
    },
    {
      icon: "UserCheck",
      label: "Safety",
      description: "Maintaining strict infection control, sterile protocols, and continuous patient safety monitoring.",
    },
  ],
  leadership: [
    {
      name: "Dr. Dawit Haile",
      position: "Hospital Director & Senior Cardiologist",
      photo:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
      photoAlt: "Dr. Dawit Haile — Hospital Director",
    },
    {
      name: "Dr. Helen Tadesse",
      position: "Medical Director & Chief Neurologist",
      photo:
        "https://images.unsplash.com/photo-1594824813520-a7d57f12e2c5?auto=format&fit=crop&w=800&q=80",
      photoAlt: "Dr. Helen Tadesse — Medical Director",
    },
    {
      name: "Dr. Senait Bekele",
      position: "Head of Maternal-Fetal Medicine",
      photo:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
      photoAlt: "Dr. Senait Bekele — Head of Maternal-Fetal Medicine",
    },
    {
      name: "Dr. Yonas Mulugeta",
      position: "Chief of Surgery & Trauma Care",
      photo:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
      photoAlt: "Dr. Yonas Mulugeta — Chief of Surgery",
    },
  ],
  environment: {
    eyebrow: "Healing Environment",
    title: "Infrastructure designed for comfort, recovery & patient safety",
    description:
      "Our hospital campus combines sterile clinical functionality with calming architectural elements to support rapid patient healing and family comfort.",
    featured: {
      name: "Inpatient Pavilion",
      category: "Inpatient Suites",
      image:
        "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Spacious private inpatient suite with electric bed and natural lighting",
    },
    supporting: [
      {
        name: "Surgical Suites",
        category: "Operating Theatres",
        image:
          "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80",
        imageAlt: "Sterile surgical theatre with modern operating lighting and laparoscopic columns",
      },
      {
        name: "Diagnostic Tower",
        category: "Radiology & Labs",
        image:
          "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
        imageAlt: "Advanced digital CT scanner and automated diagnostic laboratory",
      },
      {
        name: "Outpatient Clinic",
        category: "Consultation Rooms",
        image:
          "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
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
  seoTitle: "About Us | Medhen Beza Hospital",
  seoDescription:
    "Learn about Medhen Beza Hospital — our history, clinical leadership team, mission, values, and world-class healthcare facilities in Adama.",
};

const DEFAULT_ABOUT_FORM_AM: AboutPageFormState = {
  hero: {
    title: MOCK_ABOUT_PAGE_AM.hero.title,
    supportingText: MOCK_ABOUT_PAGE_AM.hero.supportingText,
    image: MOCK_ABOUT_PAGE_AM.hero.image || DEFAULT_ABOUT_FORM.hero.image,
    imageAlt: MOCK_ABOUT_PAGE_AM.hero.imageAlt || "የመድህን ቤዛ ሆስፒታል ግቢ",
  },
  introduction: {
    eyebrow: MOCK_ABOUT_PAGE_AM.introduction.eyebrow,
    title: MOCK_ABOUT_PAGE_AM.introduction.title,
    paragraphs: [...MOCK_ABOUT_PAGE_AM.introduction.paragraphs],
    photo: MOCK_ABOUT_PAGE_AM.introduction.photo || DEFAULT_ABOUT_FORM.introduction.photo,
    photoAlt: MOCK_ABOUT_PAGE_AM.introduction.photoAlt || "የመድህን ቤዛ ሆስፒታል የህክምና ቡድን",
    ctaLabel: MOCK_ABOUT_PAGE_AM.introduction.ctaLabel,
    ctaHref: MOCK_ABOUT_PAGE_AM.introduction.ctaHref,
  },
  missionVision: {
    mission: {
      eyebrow: MOCK_ABOUT_PAGE_AM.missionVision.mission.eyebrow,
      title: MOCK_ABOUT_PAGE_AM.missionVision.mission.title,
      text: MOCK_ABOUT_PAGE_AM.missionVision.mission.text,
    },
    vision: {
      eyebrow: MOCK_ABOUT_PAGE_AM.missionVision.vision.eyebrow,
      title: MOCK_ABOUT_PAGE_AM.missionVision.vision.title,
      text: MOCK_ABOUT_PAGE_AM.missionVision.vision.text,
    },
  },
  values: MOCK_ABOUT_PAGE_AM.values.map((v, i) => ({
    label: v.label,
    description: v.description,
    icon: DEFAULT_ABOUT_FORM.values[i]?.icon || "Heart",
  })),
  leadership: MOCK_ABOUT_PAGE_AM.leadership.map((l) => ({
    name: l.name,
    position: l.position,
    photo: l.photo || "",
    photoAlt: l.photoAlt || l.name,
  })),
  environment: {
    eyebrow: MOCK_ABOUT_PAGE_AM.environment.eyebrow,
    title: MOCK_ABOUT_PAGE_AM.environment.title,
    description: MOCK_ABOUT_PAGE_AM.environment.description,
    featured: {
      name: MOCK_ABOUT_PAGE_AM.environment.featured.name,
      category: MOCK_ABOUT_PAGE_AM.environment.featured.category,
      image: MOCK_ABOUT_PAGE_AM.environment.featured.image || DEFAULT_ABOUT_FORM.environment.featured.image,
      imageAlt: MOCK_ABOUT_PAGE_AM.environment.featured.imageAlt || "",
    },
    supporting: MOCK_ABOUT_PAGE_AM.environment.supporting.map((s, idx) => ({
      name: s.name,
      category: s.category,
      image: s.image || DEFAULT_ABOUT_FORM.environment.supporting[idx]?.image || "",
      imageAlt: s.imageAlt || "",
    })),
  },
  accreditations: (MOCK_ABOUT_PAGE_AM.accreditations || []).map((a) => ({
    name: a.name,
    issuer: a.issuer,
  })),
  finalCta: {
    title: MOCK_ABOUT_PAGE_AM.finalCta.title,
    description: MOCK_ABOUT_PAGE_AM.finalCta.description,
    ctaLabel: MOCK_ABOUT_PAGE_AM.finalCta.ctaLabel,
    ctaHref: MOCK_ABOUT_PAGE_AM.finalCta.ctaHref,
  },
  seoTitle: "ስለ መድህን ቤዛ ሆስፒታል | አዳማ",
  seoDescription: MOCK_ABOUT_PAGE_AM.hero.supportingText,
};

const DEFAULT_ABOUT_FORM_OM: AboutPageFormState = {
  hero: {
    title: MOCK_ABOUT_PAGE_OM.hero.title,
    supportingText: MOCK_ABOUT_PAGE_OM.hero.supportingText,
    image: MOCK_ABOUT_PAGE_OM.hero.image || DEFAULT_ABOUT_FORM.hero.image,
    imageAlt: MOCK_ABOUT_PAGE_OM.hero.imageAlt || "Gamoo guddaa Hospitaala Medhen Beza",
  },
  introduction: {
    eyebrow: MOCK_ABOUT_PAGE_OM.introduction.eyebrow,
    title: MOCK_ABOUT_PAGE_OM.introduction.title,
    paragraphs: [...MOCK_ABOUT_PAGE_OM.introduction.paragraphs],
    photo: MOCK_ABOUT_PAGE_OM.introduction.photo || DEFAULT_ABOUT_FORM.introduction.photo,
    photoAlt: MOCK_ABOUT_PAGE_OM.introduction.photoAlt || "Garee yaala Hospitaala Medhen Beza",
    ctaLabel: MOCK_ABOUT_PAGE_OM.introduction.ctaLabel,
    ctaHref: MOCK_ABOUT_PAGE_OM.introduction.ctaHref,
  },
  missionVision: {
    mission: {
      eyebrow: MOCK_ABOUT_PAGE_OM.missionVision.mission.eyebrow,
      title: MOCK_ABOUT_PAGE_OM.missionVision.mission.title,
      text: MOCK_ABOUT_PAGE_OM.missionVision.mission.text,
    },
    vision: {
      eyebrow: MOCK_ABOUT_PAGE_OM.missionVision.vision.eyebrow,
      title: MOCK_ABOUT_PAGE_OM.missionVision.vision.title,
      text: MOCK_ABOUT_PAGE_OM.missionVision.vision.text,
    },
  },
  values: MOCK_ABOUT_PAGE_OM.values.map((v, i) => ({
    label: v.label,
    description: v.description,
    icon: DEFAULT_ABOUT_FORM.values[i]?.icon || "Heart",
  })),
  leadership: MOCK_ABOUT_PAGE_OM.leadership.map((l) => ({
    name: l.name,
    position: l.position,
    photo: l.photo || "",
    photoAlt: l.photoAlt || l.name,
  })),
  environment: {
    eyebrow: MOCK_ABOUT_PAGE_OM.environment.eyebrow,
    title: MOCK_ABOUT_PAGE_OM.environment.title,
    description: MOCK_ABOUT_PAGE_OM.environment.description,
    featured: {
      name: MOCK_ABOUT_PAGE_OM.environment.featured.name,
      category: MOCK_ABOUT_PAGE_OM.environment.featured.category,
      image: MOCK_ABOUT_PAGE_OM.environment.featured.image || DEFAULT_ABOUT_FORM.environment.featured.image,
      imageAlt: MOCK_ABOUT_PAGE_OM.environment.featured.imageAlt || "",
    },
    supporting: MOCK_ABOUT_PAGE_OM.environment.supporting.map((s, idx) => ({
      name: s.name,
      category: s.category,
      image: s.image || DEFAULT_ABOUT_FORM.environment.supporting[idx]?.image || "",
      imageAlt: s.imageAlt || "",
    })),
  },
  accreditations: (MOCK_ABOUT_PAGE_OM.accreditations || []).map((a) => ({
    name: a.name,
    issuer: a.issuer,
  })),
  finalCta: {
    title: MOCK_ABOUT_PAGE_OM.finalCta.title,
    description: MOCK_ABOUT_PAGE_OM.finalCta.description,
    ctaLabel: MOCK_ABOUT_PAGE_OM.finalCta.ctaLabel,
    ctaHref: MOCK_ABOUT_PAGE_OM.finalCta.ctaHref,
  },
  seoTitle: "Waa'ee Hospitaala Medhen Beza | Adaamaa",
  seoDescription: MOCK_ABOUT_PAGE_OM.hero.supportingText,
};

function parseAboutPageContent(
  rawContent: any,
  fallbackForm: AboutPageFormState,
  meta?: { title?: string; excerpt?: string; seoTitle?: string; seoDescription?: string }
): AboutPageFormState {
  if (!rawContent) return fallbackForm;
  let parsed: any = null;
  if (typeof rawContent === "string") {
    const trimmed = rawContent.trim();
    if (trimmed.startsWith("{")) {
      try {
        parsed = JSON.parse(trimmed);
      } catch {}
    } else if (trimmed.length > 0) {
      return {
        ...fallbackForm,
        hero: {
          ...fallbackForm.hero,
          title: meta?.title || fallbackForm.hero.title,
          supportingText: meta?.excerpt || fallbackForm.hero.supportingText,
        },
        introduction: {
          ...fallbackForm.introduction,
          paragraphs: trimmed.split("\n\n").filter(Boolean),
        },
      };
    }
  } else if (typeof rawContent === "object") {
    parsed = rawContent;
  }

  if (!parsed || typeof parsed !== "object") return fallbackForm;

  return {
    hero: {
      title: parsed.hero?.title || meta?.title || fallbackForm.hero.title,
      supportingText: parsed.hero?.supportingText || meta?.excerpt || fallbackForm.hero.supportingText,
      image: parsed.hero?.image || fallbackForm.hero.image,
      imageAlt: parsed.hero?.imageAlt || fallbackForm.hero.imageAlt,
    },
    introduction: {
      eyebrow: parsed.introduction?.eyebrow || fallbackForm.introduction.eyebrow,
      title: parsed.introduction?.title || fallbackForm.introduction.title,
      paragraphs:
        Array.isArray(parsed.introduction?.paragraphs) && parsed.introduction.paragraphs.length > 0
          ? parsed.introduction.paragraphs
          : fallbackForm.introduction.paragraphs,
      photo: parsed.introduction?.photo || fallbackForm.introduction.photo,
      photoAlt: parsed.introduction?.photoAlt || fallbackForm.introduction.photoAlt,
      ctaLabel: parsed.introduction?.ctaLabel || fallbackForm.introduction.ctaLabel,
      ctaHref: parsed.introduction?.ctaHref || fallbackForm.introduction.ctaHref,
    },
    missionVision: {
      mission: {
        eyebrow: parsed.missionVision?.mission?.eyebrow || fallbackForm.missionVision.mission.eyebrow,
        title: parsed.missionVision?.mission?.title || fallbackForm.missionVision.mission.title,
        text: parsed.missionVision?.mission?.text || fallbackForm.missionVision.mission.text,
      },
      vision: {
        eyebrow: parsed.missionVision?.vision?.eyebrow || fallbackForm.missionVision.vision.eyebrow,
        title: parsed.missionVision?.vision?.title || fallbackForm.missionVision.vision.title,
        text: parsed.missionVision?.vision?.text || fallbackForm.missionVision.vision.text,
      },
    },
    values:
      Array.isArray(parsed.values) && parsed.values.length > 0
        ? parsed.values.map((v: any, i: number) => ({
            label: v.label || fallbackForm.values[i]?.label || "",
            description: v.description || fallbackForm.values[i]?.description || "",
            icon: typeof v.icon === "string" ? v.icon : fallbackForm.values[i]?.icon || "Heart",
          }))
        : fallbackForm.values,
    leadership:
      Array.isArray(parsed.leadership) && parsed.leadership.length > 0
        ? parsed.leadership.map((l: any, i: number) => ({
            name: l.name || fallbackForm.leadership[i]?.name || "",
            position: l.position || fallbackForm.leadership[i]?.position || "",
            photo: l.photo || fallbackForm.leadership[i]?.photo || "",
            photoAlt: l.photoAlt || l.name || fallbackForm.leadership[i]?.photoAlt || "",
          }))
        : fallbackForm.leadership,
    environment: {
      eyebrow: parsed.environment?.eyebrow || fallbackForm.environment.eyebrow,
      title: parsed.environment?.title || fallbackForm.environment.title,
      description: parsed.environment?.description || fallbackForm.environment.description,
      featured: {
        name: parsed.environment?.featured?.name || fallbackForm.environment.featured.name,
        category: parsed.environment?.featured?.category || fallbackForm.environment.featured.category,
        image: parsed.environment?.featured?.image || fallbackForm.environment.featured.image,
        imageAlt: parsed.environment?.featured?.imageAlt || fallbackForm.environment.featured.imageAlt,
      },
      supporting:
        Array.isArray(parsed.environment?.supporting) && parsed.environment.supporting.length > 0
          ? parsed.environment.supporting
          : fallbackForm.environment.supporting,
    },
    accreditations:
      Array.isArray(parsed.accreditations) && parsed.accreditations.length > 0
        ? parsed.accreditations
        : fallbackForm.accreditations,
    finalCta: {
      title: parsed.finalCta?.title || fallbackForm.finalCta.title,
      description: parsed.finalCta?.description || fallbackForm.finalCta.description,
      ctaLabel: parsed.finalCta?.ctaLabel || fallbackForm.finalCta.ctaLabel,
      ctaHref: parsed.finalCta?.ctaHref || fallbackForm.finalCta.ctaHref,
    },
    seoTitle: meta?.seoTitle || parsed.seoTitle || fallbackForm.seoTitle,
    seoDescription: meta?.seoDescription || parsed.seoDescription || fallbackForm.seoDescription,
  };
}

const AVAILABLE_ICONS = [
  { label: "Heart (Compassion)", value: "Heart" },
  { label: "Award (Excellence)", value: "Award" },
  { label: "Shield Check (Integrity / Trust)", value: "ShieldCheck" },
  { label: "Users (Collaboration / Community)", value: "Users" },
  { label: "Handshake (Respect)", value: "HeartHandshake" },
  { label: "User Check (Safety)", value: "UserCheck" },
  { label: "Sparkles (Innovation)", value: "Sparkles" },
  { label: "Stethoscope (Clinical Care)", value: "Stethoscope" },
  { label: "Activity (Emergency / Health)", value: "Activity" },
  { label: "Check Circle (Quality Standards)", value: "CheckCircle2" },
];

interface AboutPageVisualEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPage?: any;
  onSubmit: (
    data: {
      id?: string;
      title: string;
      slug: string;
      content: string;
      excerpt?: string;
      seoTitle?: string;
      seoDescription?: string;
      translations?: any;
    },
    actionType: "draft" | "submit" | "publish"
  ) => void;
  isLoading?: boolean;
}

export function AboutPageVisualEditorModal({
  isOpen,
  onClose,
  initialPage,
  onSubmit,
  isLoading = false,
}: AboutPageVisualEditorModalProps) {
  const { canPublish } = useAdminRole();
  const [currentLang, setCurrentLang] = useState<"en" | "am" | "om">("en");
  const [forms, setForms] = useState<Record<"en" | "am" | "om", AboutPageFormState>>({
    en: DEFAULT_ABOUT_FORM,
    am: DEFAULT_ABOUT_FORM_AM,
    om: DEFAULT_ABOUT_FORM_OM,
  });
  const [translations, setTranslations] = useState<any>(initialPage?.translations || null);
  const [rawMode, setRawMode] = useState(false);
  const [rawJsonText, setRawJsonText] = useState("");
  const [rawJsonError, setRawJsonError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("hero");

  const form = forms[currentLang];
  const setForm = (action: React.SetStateAction<AboutPageFormState>) => {
    setForms((prev) => {
      const current = prev[currentLang];
      const next = typeof action === "function" ? action(current) : action;
      return {
        ...prev,
        [currentLang]: next,
      };
    });
  };

  const renderEnglishRef = (text: string | string[] | undefined) => {
    if (currentLang === "en" || !text) return null;
    const content = Array.isArray(text) ? text.filter(Boolean).join("\n\n") : text;
    if (!content.trim()) return null;
    return (
      <div className="rounded-md bg-muted/50 border border-border/60 p-2 text-xs text-text-muted my-1">
        <span className="font-semibold text-text text-[10px] uppercase tracking-wider block mb-0.5">
          English Reference:
        </span>
        <p className="whitespace-pre-wrap leading-relaxed text-[11px] text-text-muted">{content}</p>
      </div>
    );
  };

  useEffect(() => {
    if (!isOpen) return;

    setCurrentLang("en");

    let parsedTranslations: any = null;
    if (initialPage?.translations) {
      try {
        parsedTranslations =
          typeof initialPage.translations === "string"
            ? JSON.parse(initialPage.translations)
            : initialPage.translations;
        setTranslations(parsedTranslations);
      } catch {
        parsedTranslations = initialPage.translations;
        setTranslations(initialPage.translations);
      }
    } else {
      setTranslations(null);
    }

    const enForm = parseAboutPageContent(
      initialPage?.content,
      DEFAULT_ABOUT_FORM,
      {
        title: initialPage?.title,
        excerpt: initialPage?.excerpt,
        seoTitle: initialPage?.seoTitle,
        seoDescription: initialPage?.seoDescription,
      }
    );

    const amRawContent = parsedTranslations?.am?.content;
    const amForm = parseAboutPageContent(
      amRawContent,
      DEFAULT_ABOUT_FORM_AM,
      {
        title: parsedTranslations?.am?.title,
        excerpt: parsedTranslations?.am?.excerpt,
        seoTitle: parsedTranslations?.am?.metaTitle || parsedTranslations?.am?.seoTitle,
        seoDescription: parsedTranslations?.am?.metaDescription || parsedTranslations?.am?.seoDescription,
      }
    );

    const omRawContent = parsedTranslations?.om?.content;
    const omForm = parseAboutPageContent(
      omRawContent,
      DEFAULT_ABOUT_FORM_OM,
      {
        title: parsedTranslations?.om?.title,
        excerpt: parsedTranslations?.om?.excerpt,
        seoTitle: parsedTranslations?.om?.metaTitle || parsedTranslations?.om?.seoTitle,
        seoDescription: parsedTranslations?.om?.metaDescription || parsedTranslations?.om?.seoDescription,
      }
    );

    setForms({
      en: enForm,
      am: amForm,
      om: omForm,
    });
    setRawMode(false);
    setRawJsonText("");
    setRawJsonError(null);
    setActiveTab("hero");
  }, [isOpen, initialPage]);

  // Sync to raw JSON string when toggling raw mode
  const handleToggleRawMode = () => {
    if (!rawMode) {
      setRawJsonText(JSON.stringify(forms[currentLang], null, 2));
      setRawJsonError(null);
      setRawMode(true);
    } else {
      try {
        const parsed = JSON.parse(rawJsonText);
        setForm(parsed);
        setRawJsonError(null);
        setRawMode(false);
      } catch (err: any) {
        setRawJsonError("Invalid JSON syntax: " + err.message);
      }
    }
  };

  const handleLanguageChange = (nextLang: "en" | "am" | "om") => {
    if (nextLang === currentLang) return;

    if (rawMode) {
      try {
        const parsed = JSON.parse(rawJsonText);
        setForms((prev) => ({ ...prev, [currentLang]: parsed }));
        setRawJsonText(JSON.stringify(forms[nextLang], null, 2));
        setRawJsonError(null);
      } catch (err: any) {
        setRawJsonError("Invalid JSON syntax. Please fix before switching languages.");
        return;
      }
    }

    setForms((prev) => {
      const en = prev.en;
      const target = prev[nextLang];

      // Ensure leadership items match English count and share photos
      const syncedLeadership = en.leadership.map((enLead, idx) => {
        const existing = target.leadership[idx];
        return {
          name: existing?.name || "",
          position: existing?.position || "",
          photo: existing?.photo || enLead.photo || "",
          photoAlt: existing?.photoAlt || existing?.name || enLead.photoAlt || "",
        };
      });

      // Ensure values match English count and icons
      const syncedValues = en.values.map((enVal, idx) => {
        const existing = target.values[idx];
        return {
          label: existing?.label || "",
          description: existing?.description || "",
          icon: existing?.icon || enVal.icon || "Heart",
        };
      });

      return {
        ...prev,
        [nextLang]: {
          ...target,
          hero: {
            ...target.hero,
            image: target.hero.image || en.hero.image,
            imageAlt: target.hero.imageAlt || en.hero.imageAlt,
          },
          introduction: {
            ...target.introduction,
            paragraphs: en.introduction.paragraphs.map(
              (_, i) => target.introduction.paragraphs[i] || ""
            ),
            photo: target.introduction.photo || en.introduction.photo,
            photoAlt: target.introduction.photoAlt || en.introduction.photoAlt,
            ctaHref: target.introduction.ctaHref || en.introduction.ctaHref,
          },
          leadership: syncedLeadership,
          values: syncedValues,
          environment: {
            ...target.environment,
            featured: {
              ...target.environment.featured,
              image: target.environment.featured.image || en.environment.featured.image,
              category: target.environment.featured.category || en.environment.featured.category,
            },
            supporting: en.environment.supporting.map((enSup, idx) => {
              const existing = target.environment.supporting[idx];
              return {
                name: existing?.name || "",
                category: existing?.category || enSup.category || "",
                image: existing?.image || enSup.image || "",
                imageAlt: existing?.imageAlt || enSup.imageAlt || "",
              };
            }),
          },
          accreditations: en.accreditations.map((enAcc, idx) => {
            const existing = target.accreditations[idx];
            return {
              name: existing?.name || "",
              issuer: existing?.issuer || enAcc.issuer || "",
            };
          }),
          finalCta: {
            ...target.finalCta,
            ctaHref: target.finalCta.ctaHref || en.finalCta.ctaHref,
          },
        },
      };
    });

    setCurrentLang(nextLang);
  };

  // ─── Paragraphs Handlers ──────────────────────────────────────────────────
  const handleAddParagraph = () => {
    setForm((prev) => ({
      ...prev,
      introduction: {
        ...prev.introduction,
        paragraphs: [...prev.introduction.paragraphs, ""],
      },
    }));
  };

  const handleUpdateParagraph = (index: number, text: string) => {
    setForm((prev) => {
      const updated = [...prev.introduction.paragraphs];
      updated[index] = text;
      return {
        ...prev,
        introduction: {
          ...prev.introduction,
          paragraphs: updated,
        },
      };
    });
  };

  const handleDeleteParagraph = (index: number) => {
    setForm((prev) => ({
      ...prev,
      introduction: {
        ...prev.introduction,
        paragraphs: prev.introduction.paragraphs.filter((_, i) => i !== index),
      },
    }));
  };

  const handleMoveParagraph = (index: number, direction: "up" | "down") => {
    setForm((prev) => {
      const list = [...prev.introduction.paragraphs];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= list.length) return prev;
      const temp = list[index];
      list[index] = list[target];
      list[target] = temp;
      return {
        ...prev,
        introduction: { ...prev.introduction, paragraphs: list },
      };
    });
  };

  // ─── Leadership Team Handlers ─────────────────────────────────────────────
  const handleAddLeader = () => {
    setForm((prev) => ({
      ...prev,
      leadership: [
        ...prev.leadership,
        {
          name: "",
          position: "",
          photo: "",
          photoAlt: "",
        },
      ],
    }));
  };

  const handleUpdateLeader = (index: number, field: keyof AboutLeaderItem, value: string) => {
    setForm((prev) => {
      const updated = [...prev.leadership];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, leadership: updated };
    });
  };

  const handleDeleteLeader = (index: number) => {
    if (confirm("Are you sure you want to remove this leadership member?")) {
      setForm((prev) => ({
        ...prev,
        leadership: prev.leadership.filter((_, i) => i !== index),
      }));
    }
  };

  const handleMoveLeader = (index: number, direction: "up" | "down") => {
    setForm((prev) => {
      const list = [...prev.leadership];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= list.length) return prev;
      const temp = list[index];
      list[index] = list[target];
      list[target] = temp;
      return { ...prev, leadership: list };
    });
  };

  // ─── Values Handlers ──────────────────────────────────────────────────────
  const handleAddValue = () => {
    setForm((prev) => ({
      ...prev,
      values: [
        ...prev.values,
        { label: "New Principle", description: "", icon: "ShieldCheck" },
      ],
    }));
  };

  const handleUpdateValue = (index: number, field: keyof AboutValueItem, value: string) => {
    setForm((prev) => {
      const updated = [...prev.values];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, values: updated };
    });
  };

  const handleDeleteValue = (index: number) => {
    setForm((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
  };

  // ─── Supporting Facilities Handlers ───────────────────────────────────────
  const handleAddSupportingFacility = () => {
    setForm((prev) => ({
      ...prev,
      environment: {
        ...prev.environment,
        supporting: [
          ...prev.environment.supporting,
          { name: "New Facility", category: "Wing / Suite", image: "", imageAlt: "" },
        ],
      },
    }));
  };

  const handleUpdateSupportingFacility = (
    index: number,
    field: keyof AboutFacilityItem,
    value: string
  ) => {
    setForm((prev) => {
      const updated = [...prev.environment.supporting];
      updated[index] = { ...updated[index], [field]: value };
      return {
        ...prev,
        environment: { ...prev.environment, supporting: updated },
      };
    });
  };

  const handleDeleteSupportingFacility = (index: number) => {
    setForm((prev) => ({
      ...prev,
      environment: {
        ...prev.environment,
        supporting: prev.environment.supporting.filter((_, i) => i !== index),
      },
    }));
  };

  // ─── Accreditations Handlers ──────────────────────────────────────────────
  const handleAddAccreditation = () => {
    setForm((prev) => ({
      ...prev,
      accreditations: [
        ...prev.accreditations,
        { name: "Accreditation Name", issuer: "Authority" },
      ],
    }));
  };

  const handleUpdateAccreditation = (
    index: number,
    field: keyof AboutAccreditationItem,
    value: string
  ) => {
    setForm((prev) => {
      const updated = [...prev.accreditations];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, accreditations: updated };
    });
  };

  const handleDeleteAccreditation = (index: number) => {
    setForm((prev) => ({
      ...prev,
      accreditations: prev.accreditations.filter((_, i) => i !== index),
    }));
  };

  // ─── Submission ───────────────────────────────────────────────────────────
  const handleSubmit = (actionType: "draft" | "submit" | "publish") => {
    let currentData = form;
    if (rawMode) {
      try {
        currentData = JSON.parse(rawJsonText);
      } catch (err: any) {
        setRawJsonError("Cannot save: Invalid JSON syntax.");
        return;
      }
    }

    const currentForms = {
      ...forms,
      [currentLang]: currentData,
    };

    const serializeContent = (data: AboutPageFormState) =>
      JSON.stringify({
        hero: data.hero,
        introduction: data.introduction,
        missionVision: data.missionVision,
        values: data.values,
        leadership: data.leadership,
        environment: data.environment,
        accreditations: data.accreditations,
        finalCta: data.finalCta,
      });

    const enContent = serializeContent(currentForms.en);
    const amContent = serializeContent(currentForms.am);
    const omContent = serializeContent(currentForms.om);

    const translationsPayload = {
      ...(translations || {}),
      am: {
        ...(translations?.am || {}),
        title: currentForms.am.hero.title || currentForms.en.hero.title || "About Medhen Beza Hospital",
        excerpt: currentForms.am.hero.supportingText || currentForms.en.hero.supportingText,
        metaTitle: currentForms.am.seoTitle || currentForms.en.seoTitle,
        metaDescription: currentForms.am.seoDescription || currentForms.en.seoDescription,
        content: amContent,
      },
      om: {
        ...(translations?.om || {}),
        title: currentForms.om.hero.title || currentForms.en.hero.title || "About Medhen Beza Hospital",
        excerpt: currentForms.om.hero.supportingText || currentForms.en.hero.supportingText,
        metaTitle: currentForms.om.seoTitle || currentForms.en.seoTitle,
        metaDescription: currentForms.om.seoDescription || currentForms.en.seoDescription,
        content: omContent,
      },
    };

    onSubmit(
      {
        id: initialPage?.id,
        title: currentForms.en.hero.title || "About Medhen Beza Hospital",
        slug: "about",
        content: enContent,
        excerpt: currentForms.en.hero.supportingText,
        seoTitle: currentForms.en.seoTitle,
        seoDescription: currentForms.en.seoDescription,
        translations: translationsPayload,
      },
      actionType
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl sm:max-w-5xl w-[95vw] h-[92vh] max-h-[900px] flex flex-col p-0 gap-0 overflow-hidden bg-background">
        {/* Header */}
        <DialogHeader className="p-5 sm:p-6 border-b border-border bg-surface shrink-0 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary border border-primary/20 shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-text">
                  Visual Page Editor: About Us Page
                </DialogTitle>
                <DialogDescription className="text-xs text-text-muted mt-0.5">
                  Easily edit leadership members, photos, story paragraphs, and core values without touching code.
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleToggleRawMode}
                className="text-xs gap-1.5 h-8 font-medium border-border hover:bg-surface-hover"
              >
                {rawMode ? (
                  <>
                    <Eye className="h-3.5 w-3.5 text-primary" />
                    Switch to Visual Form
                  </>
                ) : (
                  <>
                    <Code2 className="h-3.5 w-3.5 text-text-muted" />
                    Developer JSON Mode
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Multilingual Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border/50">
            <div className="flex items-center gap-1.5 bg-background p-1 rounded-lg border border-border">
              {ADMIN_LANGUAGES.map((lang) => {
                const isActive = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code as "en" | "am" | "om")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer",
                      isActive
                        ? "bg-primary text-white shadow-xs font-semibold"
                        : "text-text-muted hover:text-text hover:bg-muted/40"
                    )}
                  >
                    <span className="text-sm leading-none">{lang.code === "en" ? "🇺🇸" : "🇪🇹"}</span>
                    <span>{lang.label}</span>
                    <span className="text-[10px] opacity-75 hidden sm:inline">({lang.nativeName})</span>
                  </button>
                );
              })}
            </div>

            {currentLang !== "en" && (
              <div className="text-[11px] text-text-muted flex items-center gap-1.5 bg-primary/5 px-2.5 py-1 rounded-md border border-primary/20">
                <Languages className="h-3.5 w-3.5 text-primary" />
                <span>
                  Translating into <strong className="text-text">{currentLang === "am" ? "Amharic (አማርኛ)" : "Afan Oromo (Afaan Oromoo)"}</strong>
                </span>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {rawMode ? (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-center gap-2">
                <Code2 className="h-4 w-4 shrink-0 text-amber-700" />
                <span>
                  <strong>Developer Mode:</strong> Directly editing raw JSON structure. Validated before saving.
                </span>
              </div>
              {rawJsonError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-mono">
                  {rawJsonError}
                </div>
              )}
              <textarea
                value={rawJsonText}
                onChange={(e) => {
                  setRawJsonText(e.target.value);
                  setRawJsonError(null);
                }}
                className="w-full h-[520px] font-mono text-xs p-4 rounded-lg bg-slate-900 text-emerald-400 border border-slate-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary"
                spellCheck={false}
              />
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
              <div className="border-b border-border pb-1 overflow-x-auto">
                <TabsList className="bg-surface p-1 h-auto flex flex-wrap gap-1 border border-border/60">
                  <TabsTrigger value="hero" className="text-xs py-1.5 px-3">
                    Hero & Campus
                  </TabsTrigger>
                  <TabsTrigger value="story" className="text-xs py-1.5 px-3">
                    Story & Intro
                  </TabsTrigger>
                  <TabsTrigger value="leadership" className="text-xs py-1.5 px-3 font-semibold text-primary">
                    Leadership Team ({form.leadership.length})
                  </TabsTrigger>
                  <TabsTrigger value="mission" className="text-xs py-1.5 px-3">
                    Mission & Vision
                  </TabsTrigger>
                  <TabsTrigger value="values" className="text-xs py-1.5 px-3">
                    Core Values ({form.values.length})
                  </TabsTrigger>
                  <TabsTrigger value="environment" className="text-xs py-1.5 px-3">
                    Facilities Showcase
                  </TabsTrigger>
                  <TabsTrigger value="accreditations" className="text-xs py-1.5 px-3">
                    Accreditations
                  </TabsTrigger>
                  <TabsTrigger value="cta" className="text-xs py-1.5 px-3">
                    Closing CTA
                  </TabsTrigger>
                  <TabsTrigger value="seo" className="text-xs py-1.5 px-3">
                    SEO & Meta
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* ─── TAB 1: HERO & CAMPUS ─────────────────────────────────── */}
              <TabsContent value="hero" className="space-y-6 m-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text">
                        Hero Main Headline <span className="text-emergency">*</span>
                      </label>
                      {renderEnglishRef(forms.en.hero.title)}
                      <Input
                        value={form.hero.title}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, title: e.target.value },
                          }))
                        }
                        placeholder="e.g. About Medhen Beza Hospital"
                        className="bg-surface text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text">
                        Hero Subtitle & Supporting Statement <span className="text-emergency">*</span>
                      </label>
                      {renderEnglishRef(forms.en.hero.supportingText)}
                      <textarea
                        value={form.hero.supportingText}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, supportingText: e.target.value },
                          }))
                        }
                        rows={4}
                        placeholder="Brief executive summary describing the hospital's clinical mission..."
                        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text">
                        Campus Photo Accessibility Alt Text
                      </label>
                      {renderEnglishRef(forms.en.hero.imageAlt)}
                      <Input
                        value={form.hero.imageAlt}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, imageAlt: e.target.value },
                          }))
                        }
                        placeholder="e.g. Exterior view of Medhen Beza Hospital campus in Adama"
                        className="bg-surface text-sm"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-2">
                    <label className="text-xs font-semibold text-text block">
                      Hero Campus Photography
                    </label>
                    <MediaUploadField
                      value={form.hero.image}
                      onChange={(url) =>
                        setForm((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, image: url },
                        }))
                      }
                      folder="about"
                      aspectRatio={4 / 3}
                      aspectLabel="4:3 landscape"
                      helperText="High-resolution campus exterior image displayed at the top of the About page."
                    />
                  </div>
                </div>
              </TabsContent>

              {/* ─── TAB 2: STORY & INTRO ─────────────────────────────────── */}
              <TabsContent value="story" className="space-y-6 m-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-text">Section Eyebrow</label>
                        {renderEnglishRef(forms.en.introduction.eyebrow)}
                        <Input
                          value={form.introduction.eyebrow}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              introduction: { ...prev.introduction, eyebrow: e.target.value },
                            }))
                          }
                          placeholder="e.g. Our Story & Purpose"
                          className="bg-surface text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-text">Section Title</label>
                        {renderEnglishRef(forms.en.introduction.title)}
                        <Input
                          value={form.introduction.title}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              introduction: { ...prev.introduction, title: e.target.value },
                            }))
                          }
                          placeholder="e.g. Dedicated to compassionate care..."
                          className="bg-surface text-sm"
                        />
                      </div>
                    </div>

                    {/* Paragraphs list */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-text">
                          Hospital Story Paragraphs ({form.introduction.paragraphs.length})
                        </label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddParagraph}
                          className="text-xs h-7 gap-1 border-primary/30 text-primary hover:bg-primary-light"
                        >
                          <Plus className="h-3 w-3" />
                          Add Paragraph
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {form.introduction.paragraphs.map((p, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg border border-border bg-surface space-y-2 relative group"
                          >
                            <div className="flex items-center justify-between text-xs text-text-muted">
                              <span className="font-semibold text-text">
                                Paragraph #{idx + 1} {idx === 0 && "(Featured Lead Paragraph)"}
                              </span>
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveParagraph(idx, "up")}
                                  className="h-6 w-6 p-0 text-text-muted hover:text-text"
                                  title="Move up"
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  disabled={idx === form.introduction.paragraphs.length - 1}
                                  onClick={() => handleMoveParagraph(idx, "down")}
                                  className="h-6 w-6 p-0 text-text-muted hover:text-text"
                                  title="Move down"
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteParagraph(idx)}
                                  className="h-6 w-6 p-0 text-emergency hover:bg-emergency/10"
                                  title="Delete paragraph"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            {renderEnglishRef(forms.en.introduction.paragraphs[idx])}
                            <textarea
                              value={p}
                              onChange={(e) => handleUpdateParagraph(idx, e.target.value)}
                              rows={3}
                              placeholder="Write paragraph content..."
                              className="w-full rounded-md border border-border/80 bg-background px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-text">CTA Button Label</label>
                        {renderEnglishRef(forms.en.introduction.ctaLabel)}
                        <Input
                          value={form.introduction.ctaLabel}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              introduction: { ...prev.introduction, ctaLabel: e.target.value },
                            }))
                          }
                          placeholder="Contact Us"
                          className="bg-surface text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-text">CTA Button Link</label>
                        <Input
                          value={form.introduction.ctaHref}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              introduction: { ...prev.introduction, ctaHref: e.target.value },
                            }))
                          }
                          placeholder="/contact"
                          className="bg-surface text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-3">
                    <label className="text-xs font-semibold text-text block">
                      Story Section Photo
                    </label>
                    <MediaUploadField
                      value={form.introduction.photo}
                      onChange={(url) =>
                        setForm((prev) => ({
                          ...prev,
                          introduction: { ...prev.introduction, photo: url },
                        }))
                      }
                      folder="about"
                      aspectRatio={4 / 3}
                      aspectLabel="4:3 clinical photo"
                      helperText="Photo of doctors, nurses, or caregivers in action."
                    />
                    <div className="space-y-1.5 pt-2">
                      <label className="text-xs font-semibold text-text">Photo Alt Text</label>
                      {renderEnglishRef(forms.en.introduction.photoAlt)}
                      <Input
                        value={form.introduction.photoAlt}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            introduction: { ...prev.introduction, photoAlt: e.target.value },
                          }))
                        }
                        placeholder="e.g. Clinical care team during morning rounds"
                        className="bg-surface text-sm"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ─── TAB 3: LEADERSHIP TEAM ──────────────────────────────── */}
              <TabsContent value="leadership" className="space-y-6 m-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-primary-light/40 border border-primary/20 rounded-xl">
                  <div>
                    <h3 className="text-sm font-bold text-text flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Executive Governance & Leadership Roster
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      Add, update names and medical titles, change portrait photos, or reorder members shown on the About page.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddLeader}
                    size="sm"
                    className="gap-1.5 text-xs bg-primary hover:bg-primary-dark text-white shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    Add Leadership Member
                  </Button>
                </div>

                {form.leadership.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                    <UserCircle2 className="h-12 w-12 mx-auto text-text-muted/40 mb-3" />
                    <p className="text-sm font-medium text-text">No leadership members listed.</p>
                    <p className="text-xs text-text-muted mt-1 mb-4">
                      Click the button above to add hospital directors and clinical leaders.
                    </p>
                    <Button type="button" size="sm" onClick={handleAddLeader} className="text-xs">
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add First Leader
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {form.leadership.map((leader, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-border bg-surface shadow-xs space-y-4 relative flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                          <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                            <span className="flex h-5 w-5 rounded-full bg-primary text-white text-[11px] items-center justify-center font-mono">
                              {idx + 1}
                            </span>
                            {leader.name || "Unnamed Leader"}
                          </span>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={idx === 0}
                              onClick={() => handleMoveLeader(idx, "up")}
                              className="h-7 w-7 p-0 text-text-muted hover:text-text"
                              title="Move up"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={idx === form.leadership.length - 1}
                              onClick={() => handleMoveLeader(idx, "down")}
                              className="h-7 w-7 p-0 text-text-muted hover:text-text"
                              title="Move down"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteLeader(idx)}
                              className="h-7 w-7 p-0 text-emergency hover:bg-emergency/10"
                              title="Remove member"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                          {/* Portrait photo uploader preview */}
                          <div className="sm:col-span-4 space-y-1.5">
                            <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                              Portrait Photo
                            </label>
                            <MediaUploadField
                              value={leader.photo || ""}
                              onChange={(url) => handleUpdateLeader(idx, "photo", url)}
                              folder="leadership"
                              aspectRatio={4 / 5}
                              aspectLabel="4:5 portrait"
                              helperText="Portrait orientation."
                            />
                          </div>

                          {/* Member details */}
                          <div className="sm:col-span-8 space-y-3">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-text">
                                Full Name & Honorific <span className="text-emergency">*</span>
                              </label>
                              {renderEnglishRef(forms.en.leadership[idx]?.name)}
                              <Input
                                value={leader.name}
                                onChange={(e) => handleUpdateLeader(idx, "name", e.target.value)}
                                placeholder="e.g. Dr. Dawit Haile"
                                className="bg-background text-sm"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-text">
                                Position & Medical Title <span className="text-emergency">*</span>
                              </label>
                              {renderEnglishRef(forms.en.leadership[idx]?.position)}
                              <Input
                                value={leader.position}
                                onChange={(e) =>
                                  handleUpdateLeader(idx, "position", e.target.value)
                                }
                                placeholder="e.g. Hospital Director & Senior Cardiologist"
                                className="bg-background text-sm"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-text">
                                Image Alt Description
                              </label>
                              {renderEnglishRef(forms.en.leadership[idx]?.photoAlt)}
                              <Input
                                value={leader.photoAlt || ""}
                                onChange={(e) =>
                                  handleUpdateLeader(idx, "photoAlt", e.target.value)
                                }
                                placeholder={`e.g. ${leader.name || "Leader"} — ${leader.position || "Director"}`}
                                className="bg-background text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* ─── TAB 4: MISSION & VISION ──────────────────────────────── */}
              <TabsContent value="mission" className="space-y-6 m-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mission block */}
                  <div className="p-5 rounded-xl border border-border bg-surface space-y-4">
                    <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-light text-primary font-bold text-xs">
                        M
                      </div>
                      <h4 className="text-sm font-bold text-text">Our Mission</h4>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text">Mission Eyebrow</label>
                      {renderEnglishRef(forms.en.missionVision.mission.eyebrow)}
                      <Input
                        value={form.missionVision.mission.eyebrow}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            missionVision: {
                              ...prev.missionVision,
                              mission: { ...prev.missionVision.mission, eyebrow: e.target.value },
                            },
                          }))
                        }
                        placeholder="Our Mission"
                        className="bg-background text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text">Mission Headline</label>
                      {renderEnglishRef(forms.en.missionVision.mission.title)}
                      <Input
                        value={form.missionVision.mission.title}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            missionVision: {
                              ...prev.missionVision,
                              mission: { ...prev.missionVision.mission, title: e.target.value },
                            },
                          }))
                        }
                        placeholder="Compassionate, high-standard healthcare for every patient"
                        className="bg-background text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text">Mission Statement</label>
                      {renderEnglishRef(forms.en.missionVision.mission.text)}
                      <textarea
                        value={form.missionVision.mission.text}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            missionVision: {
                              ...prev.missionVision,
                              mission: { ...prev.missionVision.mission, text: e.target.value },
                            },
                          }))
                        }
                        rows={4}
                        placeholder="Full mission statement text..."
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Vision block */}
                  <div className="p-5 rounded-xl border border-border bg-surface space-y-4">
                    <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary-light text-secondary font-bold text-xs">
                        V
                      </div>
                      <h4 className="text-sm font-bold text-text">Our Vision</h4>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text">Vision Eyebrow</label>
                      {renderEnglishRef(forms.en.missionVision.vision.eyebrow)}
                      <Input
                        value={form.missionVision.vision.eyebrow}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            missionVision: {
                              ...prev.missionVision,
                              vision: { ...prev.missionVision.vision, eyebrow: e.target.value },
                            },
                          }))
                        }
                        placeholder="Our Vision"
                        className="bg-background text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text">Vision Headline</label>
                      {renderEnglishRef(forms.en.missionVision.vision.title)}
                      <Input
                        value={form.missionVision.vision.title}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            missionVision: {
                              ...prev.missionVision,
                              vision: { ...prev.missionVision.vision, title: e.target.value },
                            },
                          }))
                        }
                        placeholder="Setting the benchmark for healthcare excellence..."
                        className="bg-background text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text">Vision Statement</label>
                      {renderEnglishRef(forms.en.missionVision.vision.text)}
                      <textarea
                        value={form.missionVision.vision.text}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            missionVision: {
                              ...prev.missionVision,
                              vision: { ...prev.missionVision.vision, text: e.target.value },
                            },
                          }))
                        }
                        rows={4}
                        placeholder="Full vision statement text..."
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ─── TAB 5: CORE VALUES ──────────────────────────────────── */}
              <TabsContent value="values" className="space-y-4 m-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-text">Hospital Core Values</h3>
                    <p className="text-xs text-text-muted">
                      Principles that guide clinical diagnosis, patient safety, and ethics.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddValue}
                    className="text-xs gap-1 border-primary/30 text-primary hover:bg-primary-light"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Core Value
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {form.values.map((val, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-border bg-surface space-y-3 relative"
                    >
                      <div className="flex items-center justify-between border-b border-border/50 pb-2">
                        <span className="text-xs font-bold text-text">Value #{idx + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteValue(idx)}
                          className="h-6 w-6 p-0 text-emergency hover:bg-emergency/10"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-text-muted">Value Label</label>
                        {renderEnglishRef(forms.en.values[idx]?.label)}
                        <Input
                          value={val.label}
                          onChange={(e) => handleUpdateValue(idx, "label", e.target.value)}
                          placeholder="e.g. Compassion"
                          className="bg-background text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-text-muted">Icon</label>
                        <Select
                          value={val.icon || "Heart"}
                          onValueChange={(iconVal) => handleUpdateValue(idx, "icon", iconVal)}
                        >
                          <SelectTrigger className="bg-background text-xs h-9">
                            <SelectValue placeholder="Select icon" />
                          </SelectTrigger>
                          <SelectContent>
                            {AVAILABLE_ICONS.map((ic) => (
                              <SelectItem key={ic.value} value={ic.value} className="text-xs">
                                {ic.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-text-muted">
                          Description
                        </label>
                        {renderEnglishRef(forms.en.values[idx]?.description)}
                        <textarea
                          value={val.description}
                          onChange={(e) => handleUpdateValue(idx, "description", e.target.value)}
                          rows={2}
                          placeholder="Description of this principle..."
                          className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-text focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* ─── TAB 6: FACILITIES & ENVIRONMENT ─────────────────────── */}
              <TabsContent value="environment" className="space-y-6 m-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text">Section Eyebrow</label>
                    {renderEnglishRef(forms.en.environment.eyebrow)}
                    <Input
                      value={form.environment.eyebrow}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          environment: { ...prev.environment, eyebrow: e.target.value },
                        }))
                      }
                      placeholder="Healing Environment"
                      className="bg-surface text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text">Section Title</label>
                    {renderEnglishRef(forms.en.environment.title)}
                    <Input
                      value={form.environment.title}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          environment: { ...prev.environment, title: e.target.value },
                        }))
                      }
                      placeholder="Infrastructure designed for comfort, recovery & patient safety"
                      className="bg-surface text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">Section Description</label>
                  {renderEnglishRef(forms.en.environment.description)}
                  <textarea
                    value={form.environment.description || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        environment: { ...prev.environment, description: e.target.value },
                      }))
                    }
                    rows={2}
                    placeholder="Short description of the facilities and environment..."
                    className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
                  />
                </div>

                {/* Featured Large Facility */}
                <div className="p-4 rounded-xl border border-primary/20 bg-primary-light/20 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary block">
                    ★ Featured Facility (Large Showcase Card)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-5 space-y-1.5">
                      <MediaUploadField
                        value={form.environment.featured.image}
                        onChange={(url) =>
                          setForm((prev) => ({
                            ...prev,
                            environment: {
                              ...prev.environment,
                              featured: { ...prev.environment.featured, image: url },
                            },
                          }))
                        }
                        folder="facilities"
                        aspectRatio={16 / 9}
                        aspectLabel="16:9 widescreen"
                      />
                    </div>
                    <div className="sm:col-span-7 space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-text">Facility Name</label>
                        {renderEnglishRef(forms.en.environment.featured.name)}
                        <Input
                          value={form.environment.featured.name}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              environment: {
                                ...prev.environment,
                                featured: { ...prev.environment.featured, name: e.target.value },
                              },
                            }))
                          }
                          placeholder="e.g. Inpatient Pavilion"
                          className="bg-surface text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-text">Category Tag</label>
                        {renderEnglishRef(forms.en.environment.featured.category)}
                        <Input
                          value={form.environment.featured.category}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              environment: {
                                ...prev.environment,
                                featured: {
                                  ...prev.environment.featured,
                                  category: e.target.value,
                                },
                              },
                            }))
                          }
                          placeholder="e.g. Inpatient Suites"
                          className="bg-surface text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Supporting Facilities */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-text">
                      Supporting Facilities Showcase ({form.environment.supporting.length})
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddSupportingFacility}
                      className="text-xs h-7 gap-1 border-primary/30 text-primary hover:bg-primary-light"
                    >
                      <Plus className="h-3 w-3" />
                      Add Facility
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {form.environment.supporting.map((sup, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-border bg-surface space-y-3 relative"
                      >
                        <div className="flex items-center justify-between border-b border-border/50 pb-1.5">
                          <span className="text-xs font-semibold text-text">Slot #{idx + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSupportingFacility(idx)}
                            className="h-6 w-6 p-0 text-emergency hover:bg-emergency/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <MediaUploadField
                          value={sup.image}
                          onChange={(url) => handleUpdateSupportingFacility(idx, "image", url)}
                          folder="facilities"
                          aspectRatio={4 / 3}
                          aspectLabel="4:3 photo"
                        />
                        <div className="space-y-2">
                          <div>
                            {renderEnglishRef(forms.en.environment.supporting[idx]?.name)}
                            <Input
                              value={sup.name}
                              onChange={(e) =>
                                handleUpdateSupportingFacility(idx, "name", e.target.value)
                              }
                              placeholder="Facility name"
                              className="bg-background text-xs h-8"
                            />
                          </div>
                          <div>
                            {renderEnglishRef(forms.en.environment.supporting[idx]?.category)}
                            <Input
                              value={sup.category}
                              onChange={(e) =>
                                handleUpdateSupportingFacility(idx, "category", e.target.value)
                              }
                              placeholder="Category"
                              className="bg-background text-xs h-8"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* ─── TAB 7: ACCREDITATIONS ───────────────────────────────── */}
              <TabsContent value="accreditations" className="space-y-4 m-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-text">Accreditations & Certifications</h3>
                    <p className="text-xs text-text-muted">
                      Healthcare quality, hygiene, and clinical certifications.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddAccreditation}
                    className="text-xs gap-1 border-primary/30 text-primary hover:bg-primary-light"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Accreditation
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {form.accreditations.map((acc, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-border bg-surface space-y-3 relative"
                    >
                      <div className="flex items-center justify-between border-b border-border/50 pb-2">
                        <span className="text-xs font-bold text-text">Badge #{idx + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAccreditation(idx)}
                          className="h-6 w-6 p-0 text-emergency hover:bg-emergency/10"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-text-muted">
                          Accreditation Name
                        </label>
                        {renderEnglishRef(forms.en.accreditations[idx]?.name)}
                        <Input
                          value={acc.name}
                          onChange={(e) => handleUpdateAccreditation(idx, "name", e.target.value)}
                          placeholder="e.g. ISO 9001:2015 Quality Management System"
                          className="bg-background text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-text-muted">
                          Issuing Organization
                        </label>
                        {renderEnglishRef(forms.en.accreditations[idx]?.issuer)}
                        <Input
                          value={acc.issuer}
                          onChange={(e) => handleUpdateAccreditation(idx, "issuer", e.target.value)}
                          placeholder="e.g. Ethiopian Ministry of Health"
                          className="bg-background text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* ─── TAB 8: CLOSING CTA ──────────────────────────────────── */}
              <TabsContent value="cta" className="space-y-4 m-0">
                <div className="p-5 rounded-xl border border-border bg-surface space-y-4 max-w-2xl">
                  <h3 className="text-sm font-bold text-text">Bottom Call-to-Action Banner</h3>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text">Banner Title</label>
                    {renderEnglishRef(forms.en.finalCta.title)}
                    <Input
                      value={form.finalCta.title}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          finalCta: { ...prev.finalCta, title: e.target.value },
                        }))
                      }
                      placeholder="Experience compassionate, high-standard healthcare"
                      className="bg-background text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text">Description</label>
                    {renderEnglishRef(forms.en.finalCta.description)}
                    <textarea
                      value={form.finalCta.description}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          finalCta: { ...prev.finalCta, description: e.target.value },
                        }))
                      }
                      rows={3}
                      placeholder="Closing call to action message..."
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text">Button Label</label>
                      {renderEnglishRef(forms.en.finalCta.ctaLabel)}
                      <Input
                        value={form.finalCta.ctaLabel}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            finalCta: { ...prev.finalCta, ctaLabel: e.target.value },
                          }))
                        }
                        placeholder="Contact Us Today"
                        className="bg-background text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text">Button Link</label>
                      <Input
                        value={form.finalCta.ctaHref}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            finalCta: { ...prev.finalCta, ctaHref: e.target.value },
                          }))
                        }
                        placeholder="/contact"
                        className="bg-background text-sm"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ─── TAB 9: SEO & META ───────────────────────────────────── */}
              <TabsContent value="seo" className="space-y-4 m-0">
                <div className="p-5 rounded-xl border border-border bg-surface space-y-4 max-w-2xl">
                  <h3 className="text-sm font-bold text-text">Search Engine Optimization (SEO)</h3>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text">SEO Meta Title</label>
                    {renderEnglishRef(forms.en.seoTitle)}
                    <Input
                      value={form.seoTitle}
                      onChange={(e) => setForm((prev) => ({ ...prev, seoTitle: e.target.value }))}
                      placeholder="About Us | Medhen Beza Hospital"
                      className="bg-background text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text">SEO Meta Description</label>
                    {renderEnglishRef(forms.en.seoDescription)}
                    <textarea
                      value={form.seoDescription}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, seoDescription: e.target.value }))
                      }
                      rows={4}
                      placeholder="Search engine snippet description..."
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>

        {/* Modal Footer */}
        <DialogFooter className="p-4 sm:p-5 border-t border-border bg-surface shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>All sections are validated. Changes revalidate the live /about page immediately.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSubmit("draft")}
              disabled={isLoading}
              className="text-xs gap-1.5 border-border"
            >
              <Save className="h-3.5 w-3.5 text-text-muted" />
              Save Draft
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSubmit("submit")}
              disabled={isLoading}
              className="text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary-light"
            >
              <Send className="h-3.5 w-3.5" />
              Submit for Approval
            </Button>
            {canPublish && (
              <Button
                type="button"
                size="sm"
                onClick={() => handleSubmit("publish")}
                disabled={isLoading}
                className="text-xs gap-1.5 bg-primary hover:bg-primary-dark text-white shadow-xs"
              >
                <Globe className="h-3.5 w-3.5" />
                Publish Live
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
