import { z } from "zod";
import { isValidEthiopianPhone, normalizeEthiopianPhone } from "./phone";

// Helper for validating Ethiopian phone with custom error message
export const ethiopianPhoneValidator = (allowShortCode = false, required = false) => {
  return z
    .string()
    .transform((val) => val.trim())
    .refine(
      (val) => {
        if (!val) return !required;
        return isValidEthiopianPhone(val, allowShortCode);
      },
      {
        message: allowShortCode
          ? "Please enter a valid Ethiopian phone number (+251 9... / +251 11... or 09...) or emergency shortcode (e.g. 911)."
          : "Please enter a valid Ethiopian phone number (e.g. +251 91 123 4567, 0911 234 567, or +251 11 654 3210).",
      }
    );
};

// ─── 1. Public Contact / Inquiry Schema ──────────────────────────────────────
export const contactMessageSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters long.")
    .max(120, "Full name must not exceed 120 characters.")
    .refine((val) => !/^[\d\W]+$/.test(val), "Full name must contain letters."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address (e.g. name@example.com).")
    .max(160, "Email address is too long."),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // optional
        return isValidEthiopianPhone(val, false);
      },
      {
        message:
          "Please enter a valid Ethiopian phone number (e.g. +251 91 123 4567, 0911 234 567, or 011 654 3210).",
      }
    ),
  department: z.string().trim().max(100).default("General Inquiries"),
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters long.")
    .max(180, "Subject must not exceed 180 characters."),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters long.")
    .max(5000, "Message is too long (maximum 5,000 characters)."),
  website: z.string().optional(), // Honeypot field
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

// ─── 2. Admin Site Settings Schema ──────────────────────────────────────────
export const siteSettingsSchema = z.object({
  hospital_name: z
    .string()
    .trim()
    .min(2, "Hospital name is required.")
    .max(150, "Hospital name must not exceed 150 characters."),
  hospital_phone: ethiopianPhoneValidator(false, true),
  hospital_emergency: ethiopianPhoneValidator(true, true),
  ambulance_phone: ethiopianPhoneValidator(true, true),
  hospital_email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid hospital email address.")
    .max(160),
  hospital_address: z
    .string()
    .trim()
    .min(5, "Hospital physical address is required.")
    .max(255),
  emergency_gate: z.string().trim().max(255).optional(),
  emergency_hours: z.string().trim().max(150).optional(),
  visiting_hours: z.string().trim().max(255).optional(),

  // Content settings
  hero_headline: z.string().trim().max(200).optional(),
  hero_headline_accent: z.string().trim().max(200).optional(),
  hero_supporting_text: z.string().trim().max(500).optional(),
  stat_specialists: z.string().trim().max(50).optional(),
  stat_emergency: z.string().trim().max(50).optional(),
  stat_departments: z.string().trim().max(50).optional(),
  hospital_intro_title: z.string().trim().max(200).optional(),

  // Workflow settings
  auto_archive_days: z
    .string()
    .trim()
    .refine(
      (val) => {
        if (!val) return true;
        const num = Number(val);
        return !isNaN(num) && num >= 1 && num <= 365;
      },
      { message: "Auto-archive days must be a number between 1 and 365." }
    )
    .optional(),
  require_director_approval: z.string().optional(),
  enable_email_notifications: z.string().optional(),

  // SEO settings
  seo_title: z.string().trim().max(200).optional(),
  seo_description: z.string().trim().max(400).optional(),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

// ─── 3. Admin User Schema ───────────────────────────────────────────────────
export const adminUserSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .trim()
    .min(2, "Staff member name must be at least 2 characters.")
    .max(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid staff email address.")
    .max(160),
  roleCode: z.enum(
    [
      "HOSPITAL_DIRECTOR",
      "MEDICAL_DIRECTOR",
      "HR_STAFF",
      "CONTENT_STAFF",
      "SYSTEM_ADMIN",
    ],
    { message: "Please select a valid administrative role." }
  ),
  department: z.string().trim().max(120).optional(),
  password: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return val.length >= 8;
      },
      { message: "Password must be at least 8 characters long." }
    ),
});

export type AdminUserInput = z.infer<typeof adminUserSchema>;

// ─── 4. Hospital Facilities Schema ──────────────────────────────────────────
export const facilitySchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .trim()
    .min(2, "Facility name is required (min 2 characters).")
    .max(150),
  category: z.string().trim().min(2, "Clinical category is required.").max(100),
  tagline: z.string().trim().max(255).optional(),
  description: z.string().trim().max(5000).optional(),
  capacity: z.string().trim().max(150).optional(),
  location: z.string().trim().max(150).optional(),
  hours: z.string().trim().max(150).optional(),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return isValidEthiopianPhone(val, true); // Allow unit direct extensions / short extensions
      },
      {
        message:
          "Please enter a valid Ethiopian telephone number (e.g. +251 11 654 3030) or extension.",
      }
    ),
  features: z.array(z.string().trim()).default([]),
  image: z.string().trim().optional(),
  order: z.number().int().min(0).default(0),
  slug: z.string().trim().optional(),
});

export type FacilityInput = z.infer<typeof facilitySchema>;

// ─── 5. Department Schema ───────────────────────────────────────────────────
export const departmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "Department name is required.").max(150),
  description: z.string().trim().max(5000).optional(),
  headDoctor: z.string().trim().max(150).optional(),
  specializations: z.array(z.string().trim()).default([]),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return isValidEthiopianPhone(val, false);
      },
      { message: "Please enter a valid Ethiopian phone number for the department." }
    ),
  email: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return z.string().email().safeParse(val).success;
      },
      { message: "Please enter a valid email address." }
    ),
  location: z.string().trim().max(150).optional(),
  workingHours: z.string().trim().max(150).optional(),
  image: z.string().trim().optional(),
  icon: z.string().trim().max(50).optional(),
  order: z.number().int().min(0).default(0),
});

export type DepartmentInput = z.infer<typeof departmentSchema>;

// ─── 6. Doctor Schema ───────────────────────────────────────────────────────
export const doctorSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().trim().min(2, "Doctor name is required.").max(150),
  specialty: z.string().trim().min(2, "Medical specialty is required.").max(150),
  departmentId: z.string().trim().min(1, "Please select an assigned department."),
  position: z.string().trim().max(150).optional(),
  experience: z.string().trim().max(150).optional(),
  biography: z.string().trim().max(5000).optional(),
  profilePhoto: z.string().trim().optional(),
  languages: z.array(z.string().trim()).default([]),
  qualifications: z.array(z.string().trim()).default([]),
  areasOfExpertise: z.array(z.string().trim()).default([]),
  availability: z.string().trim().max(200).optional(),
  isFeatured: z.boolean().default(false),
});

// ─── 7. Service Schema ──────────────────────────────────────────────────────
export const serviceSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "Service name is required.").max(150),
  departmentId: z.string().trim().min(1, "Please select an associated department."),
  summary: z
    .string()
    .trim()
    .min(5, "Please provide a short summary/tagline for the service.")
    .max(500),
  description: z.string().trim().max(5000).optional(),
  availabilityInfo: z.string().trim().max(200).optional(),
  additionalInfo: z.string().trim().max(2000).optional(),
  image: z.string().trim().optional(),
  isEmergency: z.boolean().default(false),
});

// ─── 8. Career Schema ───────────────────────────────────────────────────────
export const careerSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2, "Position title is required.").max(150),
  departmentId: z.string().trim().min(1, "Please select a department."),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]),
  location: z.string().trim().min(2, "Work location is required.").max(150),
  deadline: z.string().trim().optional(),
  description: z.string().trim().min(10, "Job description is required.").max(5000),
  responsibilities: z.array(z.string().trim()).default([]),
  requirements: z.array(z.string().trim()).default([]),
});

// ─── 9. News / Article Schema ───────────────────────────────────────────────
export const newsSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3, "Article title is required.").max(255),
  category: z.string().trim().min(2, "Category is required.").max(100),
  excerpt: z.string().trim().min(10, "Excerpt must be at least 10 characters.").max(500),
  content: z.string().trim().min(20, "Article content must be at least 20 characters."),
  readTime: z.string().trim().max(50).optional(),
  tags: z.array(z.string().trim()).default([]),
  image: z.string().trim().optional(),
  author: z.string().trim().max(120).optional(),
});

// ─── 10. Event Schema ───────────────────────────────────────────────────────
export const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3, "Event title is required.").max(255),
  date: z.string().trim().min(1, "Event date and time is required."),
  location: z.string().trim().min(2, "Event location is required.").max(200),
  description: z.string().trim().min(10, "Event description is required.").max(5000),
  registrationUrl: z.string().trim().max(500).optional(),
  image: z.string().trim().optional(),
});

// ─── 11. FAQ Schema ─────────────────────────────────────────────────────────
export const faqSchema = z.object({
  id: z.string().optional(),
  question: z.string().trim().min(5, "Question must be at least 5 characters.").max(300),
  answer: z.string().trim().min(5, "Answer must be at least 5 characters.").max(3000),
  category: z.string().trim().min(2, "Category is required.").max(100),
});

// ─── 12. Gallery Schema ─────────────────────────────────────────────────────
export const gallerySchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2, "Title is required.").max(200),
  category: z.string().trim().min(2, "Category is required.").max(100),
  type: z.enum(["IMAGE", "VIDEO"]),
  url: z.string().trim().min(1, "Media file or URL is required."),
  thumbnailUrl: z.string().trim().optional(),
});
