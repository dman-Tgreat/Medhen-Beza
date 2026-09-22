# Medhen Beza Hospital — Project Handoff Documentation

**Project Name:** Medhen Beza Hospital Web Platform & CMS  
**Version:** 0.2.0  
**Repository Directory:** `c:\Users\hp\Documents\Medhen Beza`  
**Date of Handoff:** September 2026  
**Primary Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS v4 · Prisma ORM · PostgreSQL · Jose / JWT · Cloudinary / Local Storage

---

## 1. Executive Summary & Purpose

The **Medhen Beza Hospital Web Platform** is an enterprise-grade hospital portal and content management system (CMS). It delivers a patient-centered, responsive, and accessible public healthcare website coupled with an administrative CMS featuring Role-Based Access Control (RBAC), multi-stage content approval pipelines, audit logging, dynamic hospital configuration, and visual content builders.

### Key Goals Delivered:
1. **Patient Care Public Portal:** Clinical services, medical departments, doctor directory, 24/7 emergency care hub, facility showcase, patient FAQs, career vacancies, media gallery, and appointment/contact inquiry capture.
2. **Enterprise Admin CMS:** Departmental content editing, doctor profiling, asset library (with resilient local and cloud storage), inquiry message triage, staff user administration, visual about/static page builders, and system audit trail.
3. **Dynamic Hospital Settings Integration:** Centralization of hospital name, emergency lines, ambulance dispatch, contact emails, addresses, hours, and SEO metadata from the admin settings tab to every page and metadata tag across the application.
4. **Resilient Media Pipeline:** Dual-mode upload (local file or direct URL), relaxed aspect-ratio constraints, and automatic local storage fallback preventing network timeouts.

---

## 2. Technology Stack & Architecture

| Layer | Technologies Used | Description |
|---|---|---|
| **Framework** | Next.js 16 (Turbopack, App Router) | Modern server-side rendering, streaming, React Server Components (RSC), and Server Actions. |
| **Frontend** | React 19, TypeScript 5 | Type-safe UI components, custom hooks, and transitions. |
| **Styling & UI** | Tailwind CSS v4, Lucide React, Radix UI | Modern utility-first styling with accessible primitives (`Dialog`, `DropdownMenu`, `Select`, `Tabs`, `Toast`). |
| **ORM & Database** | Prisma 5.22, PostgreSQL | Type-safe relational database queries, migrations, and relationship handling. |
| **Authentication** | Jose (JWT), HTTP-only cookies, BcryptJS | Stateless, tamper-proof session tokens stored in secure cookies, verified by Next.js Edge middleware. |
| **Media Storage** | Cloudinary + Local Storage Fallback | Dual storage architecture: attempts Cloudinary, with automatic fallback to `public/uploads/` on network timeouts or offline mode. |
| **SEO & Schema** | OpenGraph, Twitter Cards, Schema.org JSON-LD | Structured hospital, doctor, procedure, and event data for search engines. |

---

## 3. Directory Structure & Key Files

```
├── app/                                # Next.js App Router root
│   ├── (public)/                       # Public-facing hospital website route group
│   │   ├── layout.tsx                  # Public shell: Header, main, and Footer with live settings
│   │   ├── page.tsx                    # Home page: Hero, quick actions, intro, stats, showcase
│   │   ├── about/                      # About Us, mission, core values, leadership roster
│   │   ├── contact/                    # Contact directory, inquiry form, Google Maps
│   │   ├── emergency/                  # 24/7 trauma response, direct dialing, ambulance gate info
│   │   ├── departments/                # Clinical departments directory and [slug] detail pages
│   │   ├── services/                   # Clinical treatments, procedures and [slug] detail pages
│   │   ├── doctors/                    # Specialist physician directory and [slug] profiles
│   │   ├── facilities/                 # Hospital infrastructure, wings, and [slug] specs
│   │   ├── news/                       # Medical articles, publications, and [slug] pages
│   │   ├── events/                     # Community health seminars, drives, and [slug] pages
│   │   ├── gallery/                    # Visual media tour with category filtering and video lightbox
│   │   ├── careers/                    # Employment vacancies and [slug] job descriptions
│   │   ├── faqs/                       # Patient FAQs categorized by topic
│   │   └── [slug]/                     # Dynamic catch-all for CMS-managed static pages
│   ├── admin/                          # Administrative CMS portal route group
│   │   ├── layout.tsx                  # Admin layout: Topbar, collapsible sidebar, notifications
│   │   ├── page.tsx                    # Admin KPI dashboard and summary widgets
│   │   ├── login/                      # Staff login portal (Server Component + Client Form)
│   │   ├── forgot-password/            # Password reset request flow
│   │   ├── reset-password/             # Secure token password update
│   │   ├── settings/                   # Global hospital site settings editor
│   │   ├── approvals/                  # Content approval state machine dashboard
│   │   ├── audit-logs/                 # Immutable system activity and audit trail
│   │   ├── media/                      # Asset library and Cloudinary media manager
│   │   ├── messages/                   # Patient contact inquiries and triage inbox
│   │   ├── users/                      # Staff accounts, status, and credentials
│   │   ├── roles-permissions/          # RBAC matrix and role permission assignment
│   │   └── content/                    # Content management modules
│   │       ├── careers/                # Job openings, responsibilities, requirements
│   │       ├── departments/            # Departments, leads, specializations
│   │       ├── doctors/                # Physician profiles, schedules, portraits
│   │       ├── events/                 # Seminars, outreach drives
│   │       ├── facilities/             # Campus wings, capacity, specs, amenities
│   │       ├── faqs/                   # Frequently asked questions
│   │       ├── gallery/                # Photos, videos, albums
│   │       ├── news/                   # Articles, topics, reading times, hashtags
│   │       ├── pages/                  # Visual About page editor & custom static pages
│   │       └── services/               # Clinical treatments, overviews, availability
│   ├── api/                            # API routes (health check, webhooks, media signers)
│   ├── layout.tsx                      # Root layout: dynamic HTML metadata & SEO title templates
│   └── globals.css                     # Global design tokens, CSS variables, and utility classes
├── components/                         # Modular React components
│   ├── admin/                          # Admin dashboard components, sidebar, topbar, tables
│   │   ├── content-form-modal.tsx      # Core modal with ref-guarded state preservation & datalist
│   │   ├── media-upload-field.tsx      # Dual-mode media uploader (file / URL) with non-blocking ratio
│   │   └── content/                    # Module-specific admin clients (AboutPageVisualEditor, etc.)
│   ├── content/                        # Reusable cards (DoctorCard, ServiceCard, FacilityCard, etc.)
│   ├── layout/                         # Header, Footer, Breadcrumbs, Mobile Navigation
│   ├── public/                         # Client-interactive public directories and lightboxes
│   ├── sections/                       # Hero variants, SectionHeaders, CTA blocks
│   ├── seo/                            # Schema.org JsonLd component
│   └── ui/                             # Base UI kit (Button, Input, Dialog, Dropdown, etc.)
├── lib/                                # Core utilities and business logic
│   ├── actions/                        # Server Actions (auth, settings, content, facilities, media)
│   ├── auth/                           # JWT verification, cookie management, session utilities
│   ├── media/                          # Media constraints, video embed/thumbnail helpers
│   ├── queries/                        # Data access layer (public.ts and admin.ts)
│   ├── storage/                        # Storage providers: local.ts, cloudinary.ts, index.ts (fallback)
│   ├── constants.ts                    # Fallback hospital constants and navigation configs
│   ├── db.ts                           # Global PrismaClient singleton
│   ├── seo.ts                          # Metadata generators and Schema.org JSON-LD helpers
│   └── utils.ts                        # Styling utilities (cn, clsx, tailwind-merge)
├── prisma/                             # Database schema and seed scripts
│   ├── schema.prisma                   # Full PostgreSQL relational schema
│   └── seed.ts                         # Complete seed script with roles, users, and clinical content
├── public/                             # Public static assets and user uploads
│   └── uploads/                        # Local file storage target for uploaded images and videos
├── middleware.ts                       # Edge authentication middleware protecting /admin routes
├── package.json                        # Project dependencies and operational scripts
└── tailwind.config.ts                  # Tailwind theme customizations and brand color tokens
```

---

## 4. Database Schema & Data Models

The database is managed via **Prisma ORM** with **PostgreSQL**. The complete schema is defined in [`prisma/schema.prisma`](file:///c:/Users/hp/Documents/Medhen%20Beza/prisma/schema.prisma).

### Core Entities & Key Attributes

1. **RBAC & Authentication (`User`, `Role`, `Permission`, `UserRole`, `RolePermission`)**
   - Granular permission matrix combining `action` (`CREATE`, `READ`, `UPDATE`, `DELETE`, `APPROVE`, `PUBLISH`, `ARCHIVE`) and `resource` (`DOCTORS`, `SERVICES`, `DEPARTMENTS`, `NEWS`, `GALLERY`, `CAREERS`, `FACILITIES`, `PAGES`, `SETTINGS`, `USERS`, `AUDIT_LOGS`, etc.).
2. **Clinical Directory (`Department`, `Service`, `Doctor`)**
   - `Department`: Has many `Doctor` and `Service` records. Stores `headDoctor` (Department Lead) and `specializations: String[]` (Core Specializations tags).
   - `Service`: Belongs to a `Department`. Stores `description` (Short Summary / Tagline), `content` (Service Overview), `additionalInfo` (Key Care Highlights), and `availabilityInfo` (Operating Hours).
   - `Doctor`: Belongs to a `Department`. Stores specialties, biography, education, schedule, room numbers, and 1:1 portrait photo.
3. **Hospital Facilities (`Facility`)**
   - Dedicated table replacing the legacy gallery storage hack.
   - Fields: `name`, `slug`, `tagline`, `description`, `category` (Clinical Care Classification), `capacity` (Specifications), `location` (Wing & Floor), `hours` (Visiting Hours), `phone` (Direct Extension), `features: String[]` (Key Specifications & Amenities), and `image`.
4. **Hospital Communication & Outreach (`News`, `NewsCategory`, `HospitalEvent`, `Gallery`, `FAQ`)**
   - `News`: Linked to `NewsCategory`. Stores `readTime` (custom override or word-count calculated), `tags: String[]` (dynamic hashtags), and author attribution.
   - `Gallery`: Photo and video albums with `thumbnailUrl`, `videoUrl`, and embed support.
   - `HospitalEvent`: Seminars and health campaigns with date, location, and registration details.
   - `FAQ`: Categorized patient questions and answers.
5. **Careers (`Career`)**
   - Vacancies with deadline tracking, employment type (`FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`), `responsibilities: String[]`, and `requirements: String[]`.
6. **Dynamic Site Settings (`SiteSetting`)**
   - Key-value store for global settings (`hospital_name`, `hospital_phone`, `hospital_emergency`, `hospital_email`, `hospital_address`, `visiting_hours`, `seo_title`, etc.).
7. **Media Assets (`Media`)**
   - Tracks uploaded files, MIME types, dimensions, `storageProvider` (`"cloudinary"` or `"local"`), and relations to the uploading user.
8. **Governance & Operations (`AuditLog`, `ContactMessage`, `Notification`, `PasswordResetToken`)**
   - Immutable audit logs recording all administrative content actions (`action`, `contentType`, `contentId`, `changes` JSON diff, IP, user).
   - In-app notification queue for content submissions and approvals.

### Content Approval State Machine
All published entities support the `ContentStatus` lifecycle:
```
[DRAFT] ───> [PENDING_APPROVAL] ───> [APPROVED] ───> [PUBLISHED] ───> [ARCHIVED]
                    │
                    └───> [REJECTED] ───> [DRAFT]
```
> **Security Rule:** Public site queries strictly enforce `where: { status: ContentStatus.PUBLISHED }`. Drafts or unapproved changes are never exposed to the public.

---

## 5. Summary of Major CMS Modules & Feature Architecture

### 1. Hospital Facilities Architecture (`/admin/content/facilities`)
- **Dedicated Model:** Elevates facilities into a first-class `Facility` table.
- **Tagline vs. Description:** Punchy tagline is displayed in the hero and bold lead, while description forms the body narrative (eliminating duplication).
- **Location & Access Sidebar:** Displays campus wing/floor, clinical category classification, capacity/specifications, visiting hours, and direct telephone extension.
- **Dynamic Categories:** Admins can select standard wings or freely type any custom category. Category filter pills are generated dynamically on `/facilities`.
- **Key Specifications & Amenities:** Managed via an interactive tag input (`features`).
- **Video Sanitization:** Automated thumbnail extraction prevents YouTube/video URLs from breaking `next/image`.

### 2. Clinical Services Architecture (`/admin/content/services`)
- **Summary / Tagline:** Entered in `Service.description` and displayed on directory cards and the page hero.
- **Service Overview:** Entered in `Service.content` and rendered in the overview body.
- **Key Care Highlights:** Entered in `Service.additionalInfo` (line-separated or bullet list) and rendered as highlighted checkmark badges.
- **Availability & Schedule:** Entered in `Service.availabilityInfo` and rendered in the sidebar.

### 3. Medical Departments Architecture (`/admin/content/departments`)
- **Department Lead:** Configured via `headDoctor` and displayed in the sidebar under "Department Lead".
- **Core Specializations:** Configured via `specializations` tag input and rendered as badge chips under "Core Specializations".

### 4. News & Health Articles Architecture (`/admin/content/news`)
- **Dynamic Categories:** Autocomplete input with `<datalist>` and clickable topic chips. Case-insensitive auto-creation of new `NewsCategory` records in PostgreSQL.
- **Customizable & Calculated Read Time:** Admins can provide an override (e.g. "4 min read") or leave it blank to calculate automatically based on word count (`Math.max(1, Math.ceil(wordCount / 200)) min read`).
- **Editable Hashtags:** Managed via `tags` tag input and rendered as `#hashtag` pills at the footer of `/news/[slug]`.

### 5. Careers & Recruitment Architecture (`/admin/content/careers`)
- **Key Responsibilities:** Managed via `responsibilities` tag input and rendered under "Key Responsibilities".
- **Candidate Requirements:** Managed via `requirements` tag input and rendered under "Candidate Requirements".
- **Eliminated Redundancy:** Removed the duplicate "Required Qualifications" section on the detail page to present a clean, non-repetitive list.

### 6. Static Pages & Visual About Page Builder (`/admin/content/pages`)
- **Visual About Page Editor:** Visual roster builder for Executive Leadership (CEO, Medical Director, Chief Nurse, etc.) with portrait uploads, role ordering, multi-paragraph hospital story editor, mission/values illustrations, and campus highlights.
- **Dynamic Route Support:** Custom static pages rendered via `app/(public)/[slug]/page.tsx` avoiding 404 errors.

### 7. Media Upload & Storage Pipeline
- **Form Persistence:** `ContentFormModal.tsx` guards `useEffect` with `useRef` so that file selections and background server revalidations never wipe typed form data (title, category, text).
- **Non-blocking Aspect Ratio:** Displays gentle ratio recommendations without blocking uploads; any image format or ratio is accepted.
- **Dual Mode (File Upload OR Paste URL):** Admins can either upload local files or paste image/video URLs directly.
- **Automatic Local Storage Fallback:** If Cloudinary times out or fails (e.g. 5-second network timeout), files automatically save locally to `public/uploads/<folder>/<filename>`.
- **Expanded Limits:** Up to 15 MB for images and 150 MB for videos, with dual MIME type and file extension validation.

---

## 6. Seed Accounts & Access Credentials

To log in to the administrative portal locally (`http://localhost:3000/admin/login`), the following seed accounts are initialized with [`prisma/seed.ts`](file:///c:/Users/hp/Documents/Medhen%20Beza/prisma/seed.ts):

| Email | Default Role | Permitted Actions | Password |
|---|---|---|---|
| `director@medhenbeza.com` | `HOSPITAL_DIRECTOR` | Full content approval, publishing, and executive oversight. | `Admin@Medhen2026!` |
| `medical@medhenbeza.com` | `MEDICAL_DIRECTOR` | Approves and manages Doctors, Clinical Services, and Departments. | `Admin@Medhen2026!` |
| `hr@medhenbeza.com` | `HR_STAFF` | Manages Careers, vacancies, and job applications. | `Admin@Medhen2026!` |
| `content@medhenbeza.com` | `CONTENT_STAFF` | Edits News, Events, Media Gallery, FAQs, Facilities, and Static Pages. | `Admin@Medhen2026!` |
| `admin@medhenbeza.com` | `SYSTEM_ADMIN` | Configures Site Settings, manages Staff Users, Roles, and views Audit Logs. | `Admin@Medhen2026!` |

> [!NOTE]
> In production environments, immediately rotate all default passwords via the `/admin/users` interface.

---

## 7. Local Development & Setup Guide

### Prerequisites
- **Node.js:** v20.x, v22.x, or v24.x LTS (compatible with React 19)
- **Database:** PostgreSQL 14+ running locally or in Docker
- **Package Manager:** `npm` (v10+)

### Step-by-Step Installation

1. **Clone and Install Dependencies:**
   ```bash
   cd "c:\Users\hp\Documents\Medhen Beza"
   npm install
   ```

2. **Configure Environment Variables (`.env`):**
   ```env
   # PostgreSQL connection string
   DATABASE_URL="postgresql://username:password@localhost:5432/medhin_beza_db?schema=public&connection_limit=3"
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"

   # Storage Provider: "cloudinary" (with auto local fallback) or "local"
   STORAGE_PROVIDER="cloudinary"
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

3. **Database Migration & Seeding:**
   ```bash
   # Push Prisma schema to PostgreSQL
   npx prisma db push

   # Seed initial roles, permissions, hospital content, and admin accounts
   npx prisma db seed
   ```

4. **Launch Development Server:**
   ```bash
   npm run dev
   ```
   - Public Website: [http://localhost:3000](http://localhost:3000)
   - Admin CMS: [http://localhost:3000/admin](http://localhost:3000/admin)

5. **Code Verification & Building:**
   ```bash
   # Run TypeScript type check
   npx tsc --noEmit

   # Create production build
   npm run build
   ```

---

## 8. Important Coding Conventions & Lessons Learned

1. **Title Templates in Next.js 16:**
   - Because `app/layout.tsx` defines `template: "%s | ${settings.hospitalName}"`, child page `generateMetadata()` methods should return bare titles (e.g. `title: "Clinical Departments"`). Do not append `| Hospital Name` manually in child pages.
2. **Form State Preservation in Modals:**
   - In modals that invoke Server Actions (like media upload), never include inline object literals (`initialValues = {}`) in `useEffect` dependency arrays without `useRef` guards. In Next.js App Router, invoking a server action causes background route re-renders that generate new object references and reset form data.
3. **Storage Provider Resiliency:**
   - Never rely solely on external cloud storage APIs without a timeout and local disk fallback. External networks may experience connection timeouts (`ConnectTimeoutError`), which should gracefully degrade to saving in `public/uploads/`.
4. **Non-blocking Visual Validations:**
   - Aspect ratio checks should inform the user (e.g. "Notice: 4:3 image will be centered"), but never block the upload with `return;`. Modern CSS `object-cover` handles varied ratios cleanly.
5. **Layout Cache Invalidation:**
   - Whenever modifying global settings that appear in layouts (e.g. `Header`, `Footer`, `Sidebar`), always call `revalidatePath('/', 'layout')` and `revalidatePath('/admin', 'layout')`.
6. **Video vs. Image Source Safety:**
   - Never pass `.mp4` video files to `next/image`. Always verify that video entries use their thumbnail image for card displays and render videos inside HTML5 `<video>` or iframe embeds.

---

## 9. Contact & Handoff Sign-off

- **Application:** Medhen Beza Hospital Web Platform & CMS
- **Build Status:** Verified (0 TypeScript errors, 79/79 static & dynamic routes compiled)
- **Database Status:** Synchronized with PostgreSQL & Fully Seeded
- **Media Pipeline:** Resilient Dual-Mode (Cloudinary + Local Storage Fallback)
