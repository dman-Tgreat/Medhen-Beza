import { PrismaClient, ContentStatus, MediaType, EmploymentType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding for Medhen Beza Hospital...");

  // ─── 1. Clean existing records (in reverse dependency order) ───────────────
  await prisma.auditLog.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.page.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.hospitalEvent.deleteMany();
  await prisma.career.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.media.deleteMany();
  await prisma.news.deleteMany();
  await prisma.newsCategory.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.service.deleteMany();
  await prisma.department.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleaned existing database records.");

  // ─── 2. Create Roles (§3, §4, §26) ──────────────────────────────────────────
  const rolesData = [
    {
      name: "Hospital Director",
      code: "HOSPITAL_DIRECTOR",
      description: "Highest-level content authority with final approval and publishing rights.",
    },
    {
      name: "Medical Director",
      code: "MEDICAL_DIRECTOR",
      description: "Responsible for medical specialties, doctors, medical departments, and services.",
    },
    {
      name: "HR Staff",
      code: "HR_STAFF",
      description: "Responsible for careers, job descriptions, requirements, and vacancies.",
    },
    {
      name: "Content Staff / Editor",
      code: "CONTENT_STAFF",
      description: "Responsible for non-medical content: news, blog, gallery, FAQs, and events.",
    },
    {
      name: "System Administrator",
      code: "SYSTEM_ADMIN",
      description: "Technical administrator for CMS users, roles, permissions, settings, and logs.",
    },
  ];

  const roles: Record<string, { id: string; code: string; name: string }> = {};
  for (const r of rolesData) {
    const created = await prisma.role.create({
      data: r,
    });
    roles[r.code] = created;
  }
  console.log(`✅ Seeded ${Object.keys(roles).length} system roles.`);

  // ─── 3. Create Permissions ──────────────────────────────────────────────────
  const resources = [
    "DOCTORS",
    "DEPARTMENTS",
    "SERVICES",
    "NEWS",
    "GALLERY",
    "CAREERS",
    "PAGES",
    "EVENTS",
    "FAQS",
    "SETTINGS",
    "USERS",
    "ROLES",
    "AUDIT_LOGS",
    "MESSAGES",
    "MEDIA",
  ];

  const actions = ["CREATE", "READ", "UPDATE", "DELETE", "APPROVE", "PUBLISH", "ARCHIVE"];

  const permissions: Array<{ id: string; action: string; resource: string }> = [];
  for (const resource of resources) {
    for (const action of actions) {
      const perm = await prisma.permission.create({
        data: {
          action,
          resource,
          description: `Permission to ${action} on ${resource}`,
        },
      });
      permissions.push(perm);
    }
  }
  console.log(`✅ Seeded ${permissions.length} granular permissions.`);

  // ─── 4. Map Permissions to Roles (Content Ownership Matrix §26) ────────────
  // Hospital Director: ALL permissions
  for (const perm of permissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: roles["HOSPITAL_DIRECTOR"].id,
        permissionId: perm.id,
      },
    });
  }

  // Medical Director: DOCTORS, DEPARTMENTS, SERVICES (Create, Read, Update, Delete) + READ for rest
  const medicalDirectorResources = ["DOCTORS", "DEPARTMENTS", "SERVICES"];
  for (const perm of permissions) {
    if (medicalDirectorResources.includes(perm.resource)) {
      if (["CREATE", "READ", "UPDATE", "DELETE"].includes(perm.action)) {
        await prisma.rolePermission.create({
          data: { roleId: roles["MEDICAL_DIRECTOR"].id, permissionId: perm.id },
        });
      }
    } else if (perm.action === "READ") {
      await prisma.rolePermission.create({
        data: { roleId: roles["MEDICAL_DIRECTOR"].id, permissionId: perm.id },
      });
    }
  }

  // HR Staff: CAREERS (Create, Read, Update, Delete, Archive) + READ for others
  for (const perm of permissions) {
    if (perm.resource === "CAREERS") {
      if (["CREATE", "READ", "UPDATE", "DELETE", "ARCHIVE"].includes(perm.action)) {
        await prisma.rolePermission.create({
          data: { roleId: roles["HR_STAFF"].id, permissionId: perm.id },
        });
      }
    } else if (perm.action === "READ") {
      await prisma.rolePermission.create({
        data: { roleId: roles["HR_STAFF"].id, permissionId: perm.id },
      });
    }
  }

  // Content Staff: NEWS, GALLERY, PAGES, EVENTS, FAQS (Create, Read, Update, Delete)
  const contentStaffResources = ["NEWS", "GALLERY", "PAGES", "EVENTS", "FAQS", "MEDIA"];
  for (const perm of permissions) {
    if (contentStaffResources.includes(perm.resource)) {
      if (["CREATE", "READ", "UPDATE", "DELETE"].includes(perm.action)) {
        await prisma.rolePermission.create({
          data: { roleId: roles["CONTENT_STAFF"].id, permissionId: perm.id },
        });
      }
    } else if (perm.action === "READ") {
      await prisma.rolePermission.create({
        data: { roleId: roles["CONTENT_STAFF"].id, permissionId: perm.id },
      });
    }
  }

  // System Admin: USERS, ROLES, SETTINGS, AUDIT_LOGS, MESSAGES, MEDIA + READ all
  const sysAdminResources = ["USERS", "ROLES", "SETTINGS", "AUDIT_LOGS", "MESSAGES", "MEDIA"];
  for (const perm of permissions) {
    if (sysAdminResources.includes(perm.resource)) {
      await prisma.rolePermission.create({
        data: { roleId: roles["SYSTEM_ADMIN"].id, permissionId: perm.id },
      });
    } else if (perm.action === "READ") {
      await prisma.rolePermission.create({
        data: { roleId: roles["SYSTEM_ADMIN"].id, permissionId: perm.id },
      });
    }
  }

  console.log("✅ Configured role permission matrices.");

  // ─── 5. Seed Initial Administrative Users ──────────────────────────────────
  const passwordHash = await bcrypt.hash("Admin@Medhen2026!", 10);

  const usersData = [
    {
      email: "director@medhenbeza.com",
      name: "Dr. Hospital Director",
      roleCode: "HOSPITAL_DIRECTOR",
    },
    {
      email: "medical@medhenbeza.com",
      name: "Dr. Medical Director",
      roleCode: "MEDICAL_DIRECTOR",
    },
    {
      email: "hr@medhenbeza.com",
      name: "Abebech HR Manager",
      roleCode: "HR_STAFF",
    },
    {
      email: "content@medhenbeza.com",
      name: "Yared Content Editor",
      roleCode: "CONTENT_STAFF",
    },
    {
      email: "admin@medhenbeza.com",
      name: "Dagmawi System Administrator",
      roleCode: "SYSTEM_ADMIN",
    },
  ];

  for (const u of usersData) {
    const user = await prisma.user.create({
      data: {
        email: u.email,
        name: u.name,
        password: passwordHash,
        isActive: true,
      },
    });

    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: roles[u.roleCode].id,
      },
    });
  }

  console.log(`✅ Seeded ${usersData.length} staff users with respective roles.`);

  // ─── 6. Seed Departments (§9) ───────────────────────────────────────────────
  const departmentsData = [
    {
      name: "Cardiology",
      slug: "cardiology",
      description: "Our cardiology unit is equipped with the latest echo, stress-testing, and cath-lab technology.",
      phone: "+251 116 000 112",
      email: "cardiology@medhenbeza.com",
      location: "Building A, 2nd Floor",
      workingHours: "Mon – Sat: 8:00 AM – 6:00 PM (Emergency 24/7)",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 1,
    },
    {
      name: "Maternity & Neonatal",
      slug: "maternity",
      description: "A dedicated ward with private labour suites, NICU, and round-the-clock midwifery support.",
      phone: "+251 116 000 113",
      email: "maternity@medhenbeza.com",
      location: "Building B, 3rd Floor",
      workingHours: "24/7 Inpatient & Delivery Services",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 2,
    },
    {
      name: "Pediatrics",
      slug: "pediatrics",
      description: "Child-friendly spaces and specialist paediatric care for newborns through adolescents.",
      phone: "+251 116 000 114",
      email: "pediatrics@medhenbeza.com",
      location: "Building A, 1st Floor",
      workingHours: "Mon – Sat: 8:00 AM – 5:00 PM",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 3,
    },
    {
      name: "Surgery",
      slug: "surgery",
      description: "Elective and emergency surgical services supported by modern operating theatres.",
      phone: "+251 116 000 115",
      email: "surgery@medhenbeza.com",
      location: "Building C, 4th Floor",
      workingHours: "24/7 Emergency Surgery & Mon-Fri Elective",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 4,
    },
    {
      name: "Neurology",
      slug: "neurology",
      description: "Expert diagnosis and treatment for conditions of the brain, spine, and nervous system.",
      phone: "+251 116 000 116",
      email: "neurology@medhenbeza.com",
      location: "Building A, 3rd Floor",
      workingHours: "Mon – Fri: 8:30 AM – 5:00 PM",
      status: ContentStatus.PUBLISHED,
      isFeatured: false,
      order: 5,
    },
  ];

  const departments: Record<string, { id: string; name: string }> = {};
  for (const d of departmentsData) {
    const created = await prisma.department.create({ data: d });
    departments[d.slug] = created;
  }
  console.log(`✅ Seeded ${departmentsData.length} clinical departments.`);

  // ─── 7. Seed Services (§10) ─────────────────────────────────────────────────
  const servicesData = [
    {
      title: "Cardiology Consultations & Diagnostics",
      slug: "cardiology-consultation",
      description: "Comprehensive heart care from routine screenings to advanced interventional procedures.",
      content: "Complete cardiac evaluation including ECG, Echocardiography, Stress Testing, and 24-hour Holter monitoring.",
      departmentId: departments["cardiology"].id,
      availabilityInfo: "Daily, 8:00 AM – 6:00 PM",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 1,
    },
    {
      title: "Neurology & Stroke Care",
      slug: "neurology-care",
      description: "Expert diagnosis and treatment for conditions of the brain, spine, and nervous system.",
      content: "Advanced neurological diagnostics, EEG, nerve conduction studies, and comprehensive post-stroke rehabilitation.",
      departmentId: departments["neurology"].id,
      availabilityInfo: "Mon – Fri, 8:30 AM – 5:00 PM",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 2,
    },
    {
      title: "Maternity & Obstetrics",
      slug: "maternity-obstetrics",
      description: "Full-spectrum pregnancy support, labor & delivery, and postnatal care for mother and child.",
      content: "Antenatal clinic, high-risk pregnancy monitoring, modern delivery rooms, and 24/7 neonatal intensive care (NICU).",
      departmentId: departments["maternity"].id,
      availabilityInfo: "24/7 Delivery & Inpatient",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 3,
    },
    {
      title: "General & Laparoscopic Surgery",
      slug: "general-surgery",
      description: "Surgical treatment for abdominal, trauma, and soft tissue conditions with minimally invasive techniques.",
      content: "State-of-the-art operating theaters equipped with HD laparoscopy towers, advanced anesthesia, and dedicated recovery rooms.",
      departmentId: departments["surgery"].id,
      availabilityInfo: "24/7 Emergency / Scheduled elective surgeries",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 4,
    },
    {
      title: "Pediatric & Neonatal Care",
      slug: "pediatric-care",
      description: "Dedicated healthcare for infants, children, and adolescents delivered by experienced pediatric specialists.",
      content: "Well-child checkups, immunization programs, pediatric emergency care, and specialized inpatient facilities.",
      departmentId: departments["pediatrics"].id,
      availabilityInfo: "Mon – Sat, 8:00 AM – 6:00 PM",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 5,
    },
  ];

  for (const s of servicesData) {
    await prisma.service.create({ data: s });
  }
  console.log(`✅ Seeded ${servicesData.length} hospital services.`);

  // ─── 8. Seed Doctors (§11) ──────────────────────────────────────────────────
  const doctorsData = [
    {
      fullName: "Dr. Dawit Haile",
      slug: "dr-dawit-haile",
      specialty: "Cardiologist",
      position: "Senior Consultant Interventional Cardiologist",
      biography: "Dr. Dawit has over 15 years of experience in cardiology and interventional cardiovascular medicine.",
      qualifications: ["MD", "FCPS (Cardiology)", "Fellowship in Interventional Cardiology (UK)"],
      experience: "15+ years clinical practice in major teaching and tertiary hospitals.",
      languages: ["English", "Amharic"],
      areasOfExpertise: ["Echocardiography", "Coronary Angiography", "Heart Failure Management", "Hypertension"],
      availability: "Mon, Wed, Fri: 9:00 AM – 2:00 PM",
      departmentId: departments["cardiology"].id,
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 1,
      publishedAt: new Date(),
    },
    {
      fullName: "Dr. Helen Tadesse",
      slug: "dr-helen-tadesse",
      specialty: "Neurologist",
      position: "Chief Neurologist & Stroke Specialist",
      biography: "Dr. Helen specializes in cerebrovascular diseases, epilepsy, and peripheral neuropathy disorders.",
      qualifications: ["MD", "Specialty in Neurology", "MSc Neurophysiology"],
      experience: "12+ years specialist clinical neurology experience.",
      languages: ["English", "Amharic", "Oromo"],
      areasOfExpertise: ["Stroke Management", "Epilepsy", "Headache Disorders", "Neuropathy"],
      availability: "Tue, Thu: 8:30 AM – 4:00 PM",
      departmentId: departments["neurology"].id,
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 2,
      publishedAt: new Date(),
    },
    {
      fullName: "Dr. Senait Bekele",
      slug: "dr-senait-bekele",
      specialty: "Obstetrician & Gynecologist",
      position: "Head of Maternal-Fetal Medicine",
      biography: "Dr. Senait is dedicated to safe motherhood, high-risk pregnancy care, and gynecological laparoscopic surgery.",
      qualifications: ["MD", "Specialty in OB/GYN", "Diploma in Advanced Laparoscopy"],
      experience: "14+ years in maternal and child healthcare.",
      languages: ["English", "Amharic"],
      areasOfExpertise: ["High-Risk Pregnancy", "Minimally Invasive Surgery", "Infertility Assessment"],
      availability: "Mon – Thu: 8:00 AM – 3:00 PM",
      departmentId: departments["maternity"].id,
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 3,
      publishedAt: new Date(),
    },
    {
      fullName: "Dr. Yonas Mulugeta",
      slug: "dr-yonas-mulugeta",
      specialty: "General & Laparoscopic Surgeon",
      position: "Senior Consultant General Surgeon",
      biography: "Dr. Yonas has performed over 3,000 successful surgical procedures across abdominal and trauma cases.",
      qualifications: ["MD", "FACS", "Fellow of the College of Surgeons of East Africa"],
      experience: "16+ years general and emergency surgical practice.",
      languages: ["English", "Amharic"],
      areasOfExpertise: ["Laparoscopic Cholecystectomy", "Hernia Repair", "Gastrointestinal Surgery", "Trauma Care"],
      availability: "Wed, Fri: 8:00 AM – 4:00 PM",
      departmentId: departments["surgery"].id,
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 4,
      publishedAt: new Date(),
    },
  ];

  for (const doc of doctorsData) {
    await prisma.doctor.create({ data: doc });
  }
  console.log(`✅ Seeded ${doctorsData.length} doctor profiles.`);

  // ─── 9. Seed News Categories & News (§12) ──────────────────────────────────
  const category1 = await prisma.newsCategory.create({
    data: {
      name: "Hospital News",
      slug: "hospital-news",
      description: "Official announcements, new facilities, and institutional updates.",
    },
  });

  const category2 = await prisma.newsCategory.create({
    data: {
      name: "Health Insights",
      slug: "health-insights",
      description: "Health education, medical tips, and wellness articles from our physicians.",
    },
  });

  const newsData = [
    {
      title: "New Cardiac Catheterisation Laboratory Opens at Medhen Beza",
      slug: "new-cardiac-catheterisation-lab-opens",
      summary: "Expanding interventional heart services with state-of-the-art imaging and catheterisation equipment.",
      content: "Medhen Beza Hospital is proud to announce the commissioning of our new cardiac cath lab. This facility allows our cardiology team to deliver immediate life-saving interventions for acute myocardial infarction, coronary artery disease, and peripheral vascular disorders.",
      authorName: "Dr. Dawit Haile",
      category: { connect: { id: category1.id } },
      tags: ["Cardiology", "Facilities", "Healthcare Innovation"],
      metaTitle: "New Cardiac Cath Lab | Medhen Beza Hospital",
      metaDescription: "Medhen Beza Hospital expands cardiac care with a new state-of-the-art catheterisation lab in Addis Ababa.",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      publishedAt: new Date("2026-09-01"),
    },
    {
      title: "Understanding Heart Disease Risk Factors: Prevention & Early Care",
      slug: "understanding-heart-disease-risk-factors",
      summary: "Key steps to recognize cardiovascular symptoms early and maintain optimal cardiovascular wellness.",
      content: "Cardiovascular diseases remain the leading cause of premature mortality worldwide. By maintaining healthy lifestyle choices, monitoring blood pressure, and scheduling regular cardiac screenings, individuals can prevent up to 80% of premature heart attacks and strokes.",
      authorName: "Clinical Health Team",
      category: { connect: { id: category2.id } },
      tags: ["Heart Health", "Wellness", "Preventive Care"],
      metaTitle: "Heart Disease Prevention | Medhen Beza Hospital",
      metaDescription: "Learn key cardiovascular risk factors and preventative strategies from specialists at Medhen Beza Hospital.",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      publishedAt: new Date("2026-08-25"),
    },
  ];

  for (const n of newsData) {
    await prisma.news.create({ data: n });
  }
  console.log("✅ Seeded news categories and articles.");

  // ─── 10. Seed Careers (§14) ─────────────────────────────────────────────────
  const careersData = [
    {
      position: "Senior ICU Nurse",
      slug: "senior-icu-nurse",
      employmentType: EmploymentType.FULL_TIME,
      location: "Addis Ababa, Ethiopia",
      departmentId: departments["surgery"].id,
      description: "We are seeking a compassionate, skilled Senior ICU Nurse to provide critical nursing care to inpatient surgical and trauma patients.",
      responsibilities: [
        "Monitor vital signs and hemodynamic parameters of critically ill patients.",
        "Administer IV medications and manage mechanical ventilation equipment.",
        "Collaborate with intensive care physicians to update patient care plans.",
        "Maintain patient dignity and provide compassionate communication with family members.",
      ],
      requirements: [
        "BSc in Nursing with valid professional practice license in Ethiopia.",
        "Minimum 3 years of clinical ICU or Emergency nursing experience.",
        "Certified in Basic Life Support (BLS) and Advanced Cardiac Life Support (ACLS).",
      ],
      qualifications: ["BSc in Nursing", "BLS / ACLS Certification"],
      deadline: new Date("2026-10-31"),
      applicationInstructions: "Apply by sending your CV and credentials to careers@medhenbeza.com with subject 'Application: Senior ICU Nurse'",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      position: "Laboratory Technologist",
      slug: "laboratory-technologist",
      employmentType: EmploymentType.FULL_TIME,
      location: "Addis Ababa, Ethiopia",
      description: "Perform automated and manual diagnostic assays in hematology, clinical chemistry, and microbiology.",
      responsibilities: [
        "Operate diagnostic lab analyzers following rigorous QA/QC protocols.",
        "Process blood, serum, and tissue samples with high accuracy and turnaround speed.",
        "Maintain lab equipment logs and calibration schedules.",
      ],
      requirements: [
        "BSc in Medical Laboratory Sciences with active professional license.",
        "Minimum 2 years of hospital laboratory experience.",
      ],
      qualifications: ["BSc in Medical Laboratory Sciences"],
      deadline: new Date("2026-10-15"),
      applicationInstructions: "Apply by sending your CV to careers@medhenbeza.com with subject 'Application: Laboratory Technologist'",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      publishedAt: new Date(),
    },
  ];

  for (const c of careersData) {
    await prisma.career.create({ data: c });
  }
  console.log("✅ Seeded careers and vacancies.");

  // ─── 11. Seed Gallery Items (§13) ───────────────────────────────────────────
  const galleryData = [
    {
      title: "Main Hospital Inpatient Campus",
      description: "Exterior overview of the Medhen Beza medical pavilion and emergency arrival bay.",
      album: "Facilities",
      type: MediaType.IMAGE,
      url: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80",
      status: ContentStatus.PUBLISHED,
      order: 1,
    },
    {
      title: "Cardiology Diagnostic Wing Tour",
      description: "Virtual walkthrough of the non-invasive and interventional cardiac suite.",
      album: "Facilities",
      type: MediaType.VIDEO,
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "2:14",
      status: ContentStatus.PUBLISHED,
      order: 2,
    },
    {
      title: "Modern Surgical Theatre Suite",
      description: "Fully sterile, laminar airflow surgical theaters equipped with HD endoscopic columns.",
      album: "Facilities",
      type: MediaType.IMAGE,
      url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
      status: ContentStatus.PUBLISHED,
      order: 3,
    },
  ];

  for (const g of galleryData) {
    await prisma.gallery.create({ data: g });
  }
  console.log("✅ Seeded gallery media.");

  // ─── 12. Seed FAQs ──────────────────────────────────────────────────────────
  const faqsData = [
    {
      question: "What are your emergency department hours?",
      answer: "Our emergency department operates 24 hours a day, 7 days a week, 365 days a year with full trauma teams and diagnostics on standby.",
      category: "Emergency & General",
      order: 1,
      status: ContentStatus.PUBLISHED,
    },
    {
      question: "How do I consult with a specialist physician?",
      answer: "You can consult by visiting our outpatient clinic, calling our direct line at +251 116 000 111, or reaching us via the website contact form.",
      category: "Appointments & Visits",
      order: 2,
      status: ContentStatus.PUBLISHED,
    },
    {
      question: "Does Medhen Beza Hospital accept insurance coverage?",
      answer: "Yes, we partner with major Ethiopian health insurers and international healthcare plans. Please present your insurance membership card at reception.",
      category: "Billing & Insurance",
      order: 3,
      status: ContentStatus.PUBLISHED,
    },
  ];

  for (const f of faqsData) {
    await prisma.fAQ.create({ data: f });
  }
  console.log("✅ Seeded FAQs.");

  // ─── 13. Seed Site Settings (§22) ───────────────────────────────────────────
  const settingsData = [
    { key: "hospital_name", value: "Medhen Beza Hospital", group: "general", description: "Official hospital name" },
    { key: "tagline", value: "Leading Healthcare Excellence", group: "general", description: "Hospital brand tagline" },
    { key: "hero_headline", value: "Compassionate care.", group: "content", description: "Homepage hero main headline" },
    { key: "hero_headline_accent", value: "Trusted healthcare.", group: "content", description: "Homepage hero accented headline" },
    { key: "hero_supporting_text", value: "Close to you, committed to you — exceptional clinical care delivered by specialists who put patients first.", group: "content", description: "Homepage hero description" },
    { key: "stat_specialists", value: "50+", group: "content", description: "Highlight stat specialists" },
    { key: "stat_emergency", value: "24 / 7", group: "content", description: "Highlight stat emergency" },
    { key: "stat_departments", value: "15+", group: "content", description: "Highlight stat departments" },
    { key: "hospital_intro_title", value: "Trusted care for every stage of life", group: "content", description: "Hospital intro title" },
    { key: "emergency_phone", value: "+251 911 000 999", group: "emergency", description: "24/7 emergency dispatch hotline" },
    { key: "ambulance_phone", value: "+251 911 000 999", group: "emergency", description: "Ambulance trauma line" },
    { key: "emergency_gate", value: "Gate 1 (Dedicated Ambulance & Emergency Driveway), Bole Road", group: "emergency", description: "Emergency gate directions" },
    { key: "emergency_hours", value: "Open 24 Hours · 7 Days a Week · All Holidays", group: "emergency", description: "Emergency department hours" },
    { key: "visiting_hours", value: "Mon - Sun: 06:00 - 08:00, 12:00 - 14:00, 17:00 - 19:30", group: "general", description: "General ward visiting hours" },
    { key: "general_phone", value: "+251 116 000 111", group: "contact", description: "Main reception and inquiry line" },
    { key: "hospital_phone", value: "+251 116 000 111", group: "contact", description: "Hospital switchboard phone" },
    { key: "email", value: "info@medhenbeza.com", group: "contact", description: "General inquiry email address" },
    { key: "hospital_email", value: "info@medhenbeza.com", group: "contact", description: "Hospital email" },
    { key: "address", value: "Bole Road, Addis Ababa, Ethiopia", group: "contact", description: "Physical campus address" },
    { key: "hospital_address", value: "Bole Road, Addis Ababa, Ethiopia", group: "contact", description: "Hospital physical address" },
    { key: "working_hours", value: "24/7 Emergency & Inpatient Services", group: "general", description: "Operating schedule overview" },
  ];

  for (const s of settingsData) {
    await prisma.siteSetting.create({ data: s });
  }
  console.log(`✅ Seeded ${settingsData.length} site settings.`);

  // ─── 14. Seed CMS Pages (§14) ───────────────────────────────────────────────
  const pagesData = [
    {
      title: "About Medhen Beza Hospital",
      slug: "about",
      excerpt: "Dedicated to clinical excellence, compassionate patient recovery, and advanced medical practice in Addis Ababa.",
      content: JSON.stringify({
        hero: {
          title: "About Medhen Beza Hospital",
          supportingText: "Dedicated to clinical excellence, compassionate patient recovery, and advanced medical practice in Addis Ababa.",
        },
        introduction: {
          eyebrow: "Our Story & Commitment",
          title: "A modern healthcare institution built on trust and clinical expertise",
          paragraphs: [
            "Medhen Beza Hospital was founded with a singular purpose: to bring accessible, world-class specialized healthcare to patients and families across Addis Ababa and throughout Ethiopia.",
            "From routine outpatient consultations to complex multi-stage surgical procedures, our hospital operates around the clock to ensure every patient receives dignity, clinical precision, and compassionate support.",
            "We invest continuously in our medical workforce, international standards of clinical safety, and the latest diagnostic technologies.",
          ],
        },
        missionVision: {
          mission: "To deliver accessible, patient-centered clinical care of the highest standard, treating every individual with compassion, clinical integrity, and dignity.",
          vision: "To be Ethiopia's most trusted hospital for specialized and emergency medicine, recognized across East Africa for clinical innovation, safety, and patient outcomes.",
        },
      }),
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
    {
      title: "Emergency Medical Services",
      slug: "emergency",
      excerpt: "Immediate emergency care and rapid trauma response available 24 hours a day, 365 days a year.",
      content: "Full-service emergency and trauma care center equipped with rapid resuscitation suites, acute cardiac monitoring, and direct ambulance access.",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
    {
      title: "Privacy Policy",
      slug: "privacy",
      excerpt: "Patient data confidentiality, health record protection, and digital privacy policy.",
      content: "Medhen Beza Hospital maintains strict patient data confidentiality in accordance with medical ethics and applicable legal standards in Ethiopia.",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
    {
      title: "Terms of Service",
      slug: "terms",
      excerpt: "Terms governing use of hospital website and appointment booking services.",
      content: "By accessing the Medhen Beza Hospital portal, visitors and patients agree to comply with our institutional policies and digital communication guidelines.",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  ];

  for (const p of pagesData) {
    await prisma.page.create({ data: p });
  }
  console.log(`✅ Seeded ${pagesData.length} CMS published pages.`);

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
