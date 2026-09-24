import { PrismaClient, ContentStatus, MediaType, EmploymentType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding for Medhen Beza Hospital (Multilingual: EN, AM, OM)...");

  // ─── 1. Clean existing records (in reverse dependency order) ───────────────
  await prisma.auditLog.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.page.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.facility.deleteMany();
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
    "FACILITIES",
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

  // Medical Director: DOCTORS, DEPARTMENTS, SERVICES, FACILITIES (Create, Read, Update, Delete) + READ for rest
  const medicalDirectorResources = ["DOCTORS", "DEPARTMENTS", "SERVICES", "FACILITIES"];
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
      image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=1200&q=80",
      ogImage: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=1200&q=80",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 1,
      translations: {
        am: {
          name: "የልብ ህክምና ክፍል",
          description: "የልብ ህክምና ክፍላችን በዘመናዊ ኢኮካርዲዮግራፊ፣ የልብ ጫና መመርመሪያ (Stress test) እና የልብ ካቴተራይዜሽን (Cath-lab) ቴክኖሎጂ የተሟላ ነው።",
          location: "ህንፃ ሀ፣ 2ኛ ፎቅ",
          workingHours: "ከሰኞ – ቅዳሜ: ከጠዋቱ 2:00 – ማታ 12:00 (ድንገተኛ 24/7)",
          headDoctor: "ዶ/ር ዳዊት ኃይሌ",
        },
        om: {
          name: "Kutaa Yaala Onnee",
          description: "Kutaan yaala onnee keenya meeshaalee ammayyaa kanneen akka eekoo, qorannoo dhiphina onneefi teknooloojii kaat-laabii tiin guutameera.",
          location: "Gamoo A, Fooxaa 2ffaa",
          workingHours: "Wixata – Sanbata: Ganama 2:00 – Waaree Booda 12:00 (Balaa Tasaa 24/7)",
          headDoctor: "Dr. Daawwit Hayilee",
        },
      },
    },
    {
      name: "Maternity & Neonatal",
      slug: "maternity",
      description: "A dedicated ward with private labour suites, NICU, and round-the-clock midwifery support.",
      phone: "+251 116 000 113",
      email: "maternity@medhenbeza.com",
      location: "Building B, 3rd Floor",
      workingHours: "24/7 Inpatient & Delivery Services",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      ogImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 2,
      translations: {
        am: {
          name: "የማዋለጃና አዲስ የተወለዱ ህፃናት ክፍል",
          description: "የግል የማዋለጃ ክፍሎች፣ የጨቅላ ህፃናት ከፍተኛ እንክብካቤ ማዕከል (NICU) እና የ24 ሰዓት የአዋላጅ ነርሶች ድጋፍ ያለው ልዩ ክፍል ነው።",
          location: "ህንፃ ለ፣ 3ኛ ፎቅ",
          workingHours: "24/7 የተኝቶ ህክምና እና የማዋለድ አገልግሎት",
          headDoctor: "ዶ/ር ሰናይት በቀለ",
        },
        om: {
          name: "Kutaa Deessisuufi Daa'immanreef Dhalatanii",
          description: "Kutaa addaa ciisicha deumsaa dhuunfaa, kutaa yaala cimaa daa'immanreef dhalatanii (NICU) fi gargaarsa ogeeyyii deessistootaa sa'aatii 24 qabuudha.",
          location: "Gamoo B, Fooxaa 3ffaa",
          workingHours: "Tajaajila Ciisichaafi Deessisuu 24/7",
          headDoctor: "Dr. Saanaayit Baqqalaa",
        },
      },
    },
    {
      name: "Pediatrics",
      slug: "pediatrics",
      description: "Child-friendly spaces and specialist paediatric care for newborns through adolescents.",
      phone: "+251 116 000 114",
      email: "pediatrics@medhenbeza.com",
      location: "Building A, 1st Floor",
      workingHours: "Mon – Sat: 8:00 AM – 5:00 PM",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
      ogImage: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 3,
      translations: {
        am: {
          name: "የህፃናት ህክምና ክፍል",
          description: "ለህፃናት ምቹ የሆኑ ክፍሎች እና ከጨቅላነት እስከ ጉርምስና ዕድሜ ላሉ ልጆች የሚሰጥ ልዩ የህፃናት ህክምና።",
          location: "ህንፃ ሀ፣ 1ኛ ፎቅ",
          workingHours: "ከሰኞ – ቅዳሜ: ከጠዋቱ 2:00 – 11:00",
        },
        om: {
          name: "Kutaa Yaala Daa'immanii",
          description: "Iddoo daa'immaniif mijataa ta'eefi yaala addaa daa'immanreef dhalatan irraa hanga dargaggootaatti kennamu.",
          location: "Gamoo A, Fooxaa 1ffaa",
          workingHours: "Wixata – Sanbata: Ganama 2:00 – Waaree Booda 11:00",
        },
      },
    },
    {
      name: "Surgery",
      slug: "surgery",
      description: "Elective and emergency surgical services supported by modern operating theatres.",
      phone: "+251 116 000 115",
      email: "surgery@medhenbeza.com",
      location: "Building C, 4th Floor",
      workingHours: "24/7 Emergency Surgery & Mon-Fri Elective",
      image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80",
      ogImage: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 4,
      translations: {
        am: {
          name: "የቀዶ ህክምና ክፍል",
          description: "በዘመናዊ የቀዶ ጥገና ክፍሎች የሚሰጡ የታቀዱና የድንገተኛ ቀዶ ህክምና አገልግሎቶች።",
          location: "ህንፃ ሐ፣ 4ኛ ፎቅ",
          workingHours: "24/7 የድንገተኛ ቀዶ ጥገና እና ሰኞ-አርብ መደበኛ ቀዶ ጥገና",
          headDoctor: "ዶ/ር ዮናስ ሙሉጌታ",
        },
        om: {
          name: "Kutaa Yaala Baqaqsanii Yaaluu",
          description: "Tajaajila baqaqsanii yaaluu karoorfameefi tasaa manneen yaalaa ammayyaa keessatti kennamu.",
          location: "Gamoo C, Fooxaa 4ffaa",
          workingHours: "Yaala Baqaqsanii Yaaluu Tasaa 24/7 fi Wixata-Jimaata Karoorfame",
          headDoctor: "Dr. Yoonaas Mulugetaa",
        },
      },
    },
    {
      name: "Neurology",
      slug: "neurology",
      description: "Expert diagnosis and treatment for conditions of the brain, spine, and nervous system.",
      phone: "+251 116 000 116",
      email: "neurology@medhenbeza.com",
      location: "Building A, 3rd Floor",
      workingHours: "Mon – Fri: 8:30 AM – 5:00 PM",
      image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1200&q=80",
      ogImage: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1200&q=80",
      status: ContentStatus.PUBLISHED,
      isFeatured: false,
      order: 5,
      translations: {
        am: {
          name: "የነርቭና አንጎል ህክምና ክፍል",
          description: "የአንጎል፣ የህብረ-ሰረሰር እና የነርቭ ስርዓት በሽታዎች የላቀ ምርመራና ህክምና።",
          location: "ህንፃ ሀ፣ 3ኛ ፎቅ",
          workingHours: "ከሰኞ – አርብ: ከጠዋቱ 2:30 – 11:00",
          headDoctor: "ዶ/ር ሄለን ታደሰ",
        },
        om: {
          name: "Kutaa Yaala Narviifi Sammuu",
          description: "Qorannoo fi yaala addaa dhibeewwan sammuu, dugugguruufi sirna narvii.",
          location: "Gamoo A, Fooxaa 3ffaa",
          workingHours: "Wixata – Jimaata: Ganama 2:30 – Waaree Booda 11:00",
          headDoctor: "Dr. Heelana Taaddasaa",
        },
      },
    },
  ];

  const departments: Record<string, { id: string; name: string }> = {};
  for (const d of departmentsData) {
    const created = await prisma.department.create({ data: d });
    departments[d.slug] = created;
  }
  console.log(`✅ Seeded ${departmentsData.length} clinical departments with multilingual data.`);

  // ─── 7. Seed Services (§10) ─────────────────────────────────────────────────
  const servicesData = [
    {
      title: "Cardiology Consultations & Diagnostics",
      slug: "cardiology-consultation",
      description: "Comprehensive heart care from routine screenings to advanced interventional procedures.",
      content: "Complete cardiac evaluation including ECG, Echocardiography, Stress Testing, and 24-hour Holter monitoring.",
      departmentId: departments["cardiology"].id,
      availabilityInfo: "Daily, 8:00 AM – 6:00 PM",
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
      ogImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 1,
      translations: {
        am: {
          title: "የልብ ህክምና ምክክር እና ምርመራዎች",
          description: "ከተለመደው የልብ ምርመራ ጀምሮ እስከ ከፍተኛ ደረጃ የልብ ውስጥ ህክምና የሚደርስ የተሟላ እንክብካቤ።",
          content: "ኢሲጂ (ECG)፣ ኢኮካርዲዮግራፊ፣ የልብ ጫና ምርመራ እና የ24 ሰዓት የሆልተር ክትትልን ጨምሮ የተሟላ የልብ ምርመራ።",
          availabilityInfo: "በየቀኑ፣ ከጠዋቱ 2:00 – ማታ 12:00",
        },
        om: {
          title: "Gorsaa fi Qorannoo Yaala Onnee",
          description: "Kunuunsa onnee guutuu qorannoo idilee irraa hanga yaala onnee keessoo olaanaatti.",
          content: "Qorannoo onnee guutuu ECG, Eekookardiyoogiraafii, qorannoo dhiphinaa fi hordoffii kooltaraa sa'aatii 24 dabalatee.",
          availabilityInfo: "Guyyoota hunda, Ganama 2:00 – Waaree Booda 12:00",
        },
      },
    },
    {
      title: "Neurology & Stroke Care",
      slug: "neurology-care",
      description: "Expert diagnosis and treatment for conditions of the brain, spine, and nervous system.",
      content: "Advanced neurological diagnostics, EEG, nerve conduction studies, and comprehensive post-stroke rehabilitation.",
      departmentId: departments["neurology"].id,
      availabilityInfo: "Mon – Fri, 8:30 AM – 5:00 PM",
      image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1200&q=80",
      ogImage: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1200&q=80",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 2,
      translations: {
        am: {
          title: "የነርቭ እና የስትሮክ (የደም መርጋት) ህክምና",
          description: "ለአንጎል፣ ለአከርካሪ እና ለነርቭ ስርዓት ህመሞች የተካነ ምርመራና ህክምና።",
          content: "የላቀ የነርቭ ምርመራ፣ ኢኢጂ (EEG)፣ የነርቭ እንቅስቃሴ ምርመራ እና ከስትሮክ በኋላ የተሟላ የማገገሚያ ህክምና።",
          availabilityInfo: "ከሰኞ – አርብ፣ ከጠዋቱ 2:30 – 11:00",
        },
        om: {
          title: "Yaala Narvii fi Dhibee Istirookii",
          description: "Qorannoo fi yaala ogeessotaa kan dhukkuboota sammuu, dugugguruu fi sirna narvii.",
          content: "Qorannoo narvii olaanaa, EEG, qorannoo daddarbinsa narvii fi tajaajila dandamannaa istirookii boodaa guutuu.",
          availabilityInfo: "Wixata – Jimaata, Ganama 2:30 – Waaree Booda 11:00",
        },
      },
    },
    {
      title: "Maternity & Obstetrics",
      slug: "maternity-obstetrics",
      description: "Full-spectrum pregnancy support, labor & delivery, and postnatal care for mother and child.",
      content: "Antenatal clinic, high-risk pregnancy monitoring, modern delivery rooms, and 24/7 neonatal intensive care (NICU).",
      departmentId: departments["maternity"].id,
      availabilityInfo: "24/7 Delivery & Inpatient",
      image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1200&q=80",
      ogImage: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1200&q=80",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 3,
      translations: {
        am: {
          title: "የማዋለድና የፅንስ ህክምና",
          description: "የሙሉ ጊዜ የእርግዝና ክትትል፣ ምጥና ማዋለድ እንዲሁም ለእናትና ህፃኑ ድህረ-ወሊድ እንክብካቤ።",
          content: "የቅድመ ወሊድ ክሊኒክ፣ ከፍተኛ ስጋት ያለባቸው እርግዝናዎች ክትትል፣ ዘመናዊ የማዋለጃ ክፍሎች እና የ24/7 የጨቅላ ህፃናት ከፍተኛ እንክብካቤ (NICU)።",
          availabilityInfo: "24/7 የማዋለድ እና የተኝቶ ህክምና",
        },
        om: {
          title: "Yaala Ulfaafi Deessisuu",
          description: "Hordoffii ulfaa guutuu, ciniinsuufi deessisuu, akkasumas kunuunsa deumsa boodaa haadhaafi daa'imaaf.",
          content: "Kiliniika ulfaa duraa, hordoffii ulfa sodachisaa, kutaalee deumsaa ammayyaafi kutaa yaala cimaa daa'immanii (NICU) 24/7.",
          availabilityInfo: "Deessisuu fi Ciisicha 24/7",
        },
      },
    },
    {
      title: "General & Laparoscopic Surgery",
      slug: "general-surgery",
      description: "Surgical treatment for abdominal, trauma, and soft tissue conditions with minimally invasive techniques.",
      content: "State-of-the-art operating theaters equipped with HD laparoscopy towers, advanced anesthesia, and dedicated recovery rooms.",
      departmentId: departments["surgery"].id,
      availabilityInfo: "24/7 Emergency / Scheduled elective surgeries",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
      ogImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 4,
      translations: {
        am: {
          title: "አጠቃላይና በላፓሮስኮፒ (በትንንሽ ቀዳዳዎች) የሚከናወን ቀዶ ህክምና",
          description: "ለሆድ ዕቃ፣ ለአደጋ ጉዳቶችና ለስላሳ ቲሹዎች በዘመናዊ አነስተኛ ጠባሳ ቴክኒኮች የሚሰጥ የቀዶ ህክምና።",
          content: "በከፍተኛ ጥራት ላፓሮስኮፒ፣ ዘመናዊ ማደንዘዣና ልዩ የማገገሚያ ክፍሎች የተሟሉ ዘመናዊ የቀዶ ህክምና ማዕከላት።",
          availabilityInfo: "24/7 የድንገተኛ / የታቀዱ መደበኛ ቀዶ ህክምናዎች",
        },
        om: {
          title: "Yaala Baqaqsanii Yaaluu Waliigalaafi Laaparooskoolii",
          description: "Yaala baqaqsanii yaaluu garaacha, miidhaa balaafi tishuuwwan laafaa mala ammayyaa madaa xiqqaa fayyadamuun.",
          content: "Manneen yaala baqaqsanii yaaluu ammayyaa kanneen tawarii laaparooskoolii HD, waraansa miidhamuu dhorkuufi kutaa dandamannaa addaa qaban.",
          availabilityInfo: "Balaa Tasaa 24/7 / Baqaqsanii yaaluu karoorfame",
        },
      },
    },
    {
      title: "Pediatric & Neonatal Care",
      slug: "pediatric-care",
      description: "Dedicated healthcare for infants, children, and adolescents delivered by experienced pediatric specialists.",
      content: "Well-child checkups, immunization programs, pediatric emergency care, and specialized inpatient facilities.",
      departmentId: departments["pediatrics"].id,
      availabilityInfo: "Mon – Sat, 8:00 AM – 6:00 PM",
      image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1200&q=80",
      ogImage: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1200&q=80",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 5,
      translations: {
        am: {
          title: "የህፃናት እና የጨቅላዎች እንክብካቤ",
          description: "ለጨቅላ ህፃናት፣ ለህፃናትና ለታዳጊዎች ልምድ ባላቸው የህፃናት ስፔሻሊስቶች የሚሰጥ የህክምና አገልግሎት።",
          content: "የጤናማ ህፃናት ክትትል፣ የክትባት ፕሮግራሞች፣ የህፃናት ድንገተኛ ህክምና እና ልዩ የተኝቶ ህክምና ክፍሎች።",
          availabilityInfo: "ከሰኞ – ቅዳሜ፣ ከጠዋቱ 2:00 – ማታ 12:00",
        },
        om: {
          title: "Kunuunsa Daa'immaniifi Daa'imman Dhalatanii",
          description: "Kunuunsa fayyaa daa'immanreef dhalatan, ijoolleefi dargaggootaaf ogeeyyii addaa daa'immaniitiin kennamu.",
          content: "Sakatta'iinsa fayyaa daa'immanii, sagantaalee talaallii, yaala tasaa daa'immaniifi kutaalee ciisichaa addaa.",
          availabilityInfo: "Wixata – Sanbata, Ganama 2:00 – Waaree Booda 12:00",
        },
      },
    },
  ];

  for (const s of servicesData) {
    await prisma.service.create({ data: s });
  }
  console.log(`✅ Seeded ${servicesData.length} hospital services with multilingual data.`);

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
      profilePhoto: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
      ogImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 1,
      publishedAt: new Date(),
      translations: {
        am: {
          fullName: "ዶ/ር ዳዊት ኃይሌ",
          specialty: "የልብ ስፔሻሊስት (ካርዲዮሎጂስት)",
          position: "ሲኒየር አማካሪ የልብ ቀዶና ካቴተራይዜሽን ስፔሻሊስት",
          biography: "ዶ/ር ዳዊት በልብ ህክምና እና በካቴተራይዜሽን የልብ ቧንቧ ህክምና ላይ ከ15 ዓመታት በላይ የበለፀገ ልምድ አላቸው።",
          experience: "በዋና ዋና ማስተማሪያና ሪፈራል ሆስፒታሎች ውስጥ ከ15 ዓመት በላይ ክሊኒካዊ የስራ ልምድ።",
          areasOfExpertise: ["ኢኮካርዲዮግራፊ", "የልብ ቧንቧ ምርመራ (Angiography)", "የልብ ድካም ህክምና", "የደም ግፊት ቁጥጥር"],
          availability: "ሰኞ፣ ረቡዕ፣ አርብ: ከጠዋቱ 3:00 – 8:00",
        },
        om: {
          fullName: "Dr. Daawwit Hayilee",
          specialty: "Ogeessa Addaa Onnee",
          position: "Gorsaa Olaanaa Yaala Onnee fi Kaateeterayizeeshinii",
          biography: "Dr. Daawwit yaala onnee fi yaala hidda dhiiga onnee keessatti muuxannoo waggaa 15 ol qabu.",
          experience: "Hospitaalota barsiisaniifi riifaralaa gurguddoo keessatti muuxannoo waggaa 15 ol.",
          areasOfExpertise: ["Eekookardiyoogiraafii", "Koronarii Anjiyoogiraafii", "Hoggansa Dadhabbi Onnee", "Dhiibbaa Dhiigaa"],
          availability: "Wixata, Roobii, Jimaata: Ganama 3:00 – Sa'aatii 8:00",
        },
      },
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
      profilePhoto: "https://images.unsplash.com/photo-1594824813520-a7d57f12e2c5?auto=format&fit=crop&w=800&q=80",
      ogImage: "https://images.unsplash.com/photo-1594824813520-a7d57f12e2c5?auto=format&fit=crop&w=800&q=80",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 2,
      publishedAt: new Date(),
      translations: {
        am: {
          fullName: "ዶ/ር ሄለን ታደሰ",
          specialty: "የነርቭና አንጎል ስፔሻሊስት (ኒውሮሎጂስት)",
          position: "ዋና የነርቭ እና የስትሮክ ስፔሻሊስት",
          biography: "ዶ/ር ሄለን በስትሮክ፣ የሚጥል በሽታ (ኤፒሌፕሲ) እና የነርቭ መጎዳት ህመሞች ላይ ልዩ ጥናትና ህክምና ይሰጣሉ።",
          experience: "ከ12 ዓመታት በላይ በልዩ ክሊኒካዊ ኒውሮሎጂ ህክምና የተካነ ልምድ።",
          areasOfExpertise: ["የስትሮክ ህክምናና እንክብካቤ", "የሚጥል በሽታ (ኤፒሌፕሲ)", "የራስ ምታት ህመሞች", "የነርቭ መጎዳት (Neuropathy)"],
          availability: "ማክሰኞ፣ ሐሙስ: ከጠዋቱ 2:30 – 10:00",
        },
        om: {
          fullName: "Dr. Heelana Taaddasaa",
          specialty: "Ogeettii Addaa Narvii",
          position: "Ogeettii Olaantuu Narviifi Istirookii",
          biography: "Dr. Heelanan dhibee hidda dhiiga sammuu, gaggabdoo (epilepsy) fi miidhaa narvii qaamaa irratti dandeettii addaa qabdi.",
          experience: "Muuxannoo kilinikaalii yaala narvii addaa waggaa 12 ol.",
          areasOfExpertise: ["Yaala Istirookii", "Dhibee Gaggabdoo", "Dhukkubbii Mataa", "Miidhaa Narvii"],
          availability: "Kibxata, Kamisa: Ganama 2:30 – Waaree Booda 10:00",
        },
      },
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
      profilePhoto: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
      ogImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 3,
      publishedAt: new Date(),
      translations: {
        am: {
          fullName: "ዶ/ር ሰናይት በቀለ",
          specialty: "የማህፀንና ፅንስ ስፔሻሊስት",
          position: "የእናትና ፅንስ ህክምና ክፍል ኃላፊ",
          biography: "ዶ/ር ሰናይት ለአስተማማኝ እናትነት፣ ከፍተኛ ስጋት ላለባቸው እርግዝናዎች እና ለማህፀን ላፓሮስኮፒ ቀዶ ህክምና ትኩረት ሰጥተው ይሰራሉ።",
          experience: "በእናቶችና ህፃናት ጤና አጠባበቅ ላይ ከ14 ዓመታት በላይ የበለፀገ ልምድ።",
          areasOfExpertise: ["ከፍተኛ ስጋት ያለበት እርግዝና", "በትንንሽ ቀዳዳዎች የሚከናወን የማህፀን ቀዶ ጥገና", "የመካንነት ምርመራና ድጋፍ"],
          availability: "ከሰኞ – ሐሙስ: ከጠዋቱ 2:00 – 9:00",
        },
        om: {
          fullName: "Dr. Saanaayit Baqqalaa",
          specialty: "Ogeettii Addaa Gadameessaafi Ulfaa",
          position: "Hoogganntuu Yaala Haadhaafi Daa'ima Garaa Keessaa",
          biography: "Dr. Saanaayit haadhummaa nagaa qabu, kunuunsa ulfa ulfaataafi yaala baqaqsanii yaaluu gadameessaa laaparooskoolii irratti kutannoodhaan hojjetti.",
          experience: "Fayyaa haadholii fi daa'immanii keessatti muuxannoo waggaa 14 ol.",
          areasOfExpertise: ["Ulfa Balaa Qabu", "Baqaqsanii Yaaluu Madaa Xiqqaa", "Qorannoo Dhabamuu Ulfaa"],
          availability: "Wixata – Kamisa: Ganama 2:00 – Sa'aatii 9:00",
        },
      },
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
      profilePhoto: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
      ogImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      order: 4,
      publishedAt: new Date(),
      translations: {
        am: {
          fullName: "ዶ/ር ዮናስ ሙሉጌታ",
          specialty: "አጠቃላይና ላፓሮስኮፒክ ቀዶ ህክምና ስፔሻሊስት",
          position: "ሲኒየር አማካሪ አጠቃላይ የቀዶ ህክምና ስፔሻሊስት",
          biography: "ዶ/ር ዮናስ በሆድ ዕቃና በአደጋ ጉዳቶች ላይ ከ3,000 በላይ የተሳኩ የቀዶ ጥገናዎችን አከናውነዋል።",
          experience: "በአጠቃላይ እና በድንገተኛ ቀዶ ህክምና ከ16 ዓመታት በላይ የበለፀገ ልምድ።",
          areasOfExpertise: ["የሃሞት ከረጢት ቀዶ ጥገና በላፓሮስኮፒ", "የእጢ (Hernia) ቀዶ ጥገና", "የጨጓራና አንጀት ቀዶ ጥገና", "የአደጋ ጉዳቶች ህክምና"],
          availability: "ረቡዕ፣ አርብ: ከጠዋቱ 2:00 – 10:00",
        },
        om: {
          fullName: "Dr. Yoonaas Mulugetaa",
          specialty: "Ogeessa Baqaqsanii Yaaluu Waliigalaafi Laaparooskoolii",
          position: "Gorsaa Olaanaa Baqaqsanii Yaaluu Waliigalaa",
          biography: "Dr. Yoonaas garaachaafi balaa tasaa irratti baqaqsanii yaaluu milkaa'aa 3,000 ol raawwateera.",
          experience: "Yaala baqaqsanii yaaluu waliigalaafi balaa tasaa keessatti muuxannoo waggaa 16 ol.",
          areasOfExpertise: ["Baqaqsanii Yaaluu Kottee Haamtuu Laaparooskooliitiin", "Yaala Heerniyaa", "Baqaqsanii Yaaluu Mar'umaanii", "Yaala Balaa Tasaa"],
          availability: "Roobii, Jimaata: Ganama 2:00 – Waaree Booda 10:00",
        },
      },
    },
  ];

  for (const doc of doctorsData) {
    await prisma.doctor.create({ data: doc });
  }
  console.log(`✅ Seeded ${doctorsData.length} doctor profiles with multilingual data.`);

  // ─── 9. Seed News Categories & News (§12) ──────────────────────────────────
  const category1 = await prisma.newsCategory.create({
    data: {
      name: "Hospital News",
      slug: "hospital-news",
      description: "Official announcements, new facilities, and institutional updates.",
      translations: {
        am: {
          name: "የሆስፒታሉ ዜናዎች",
          description: "ይፋዊ ማስታወቂያዎች፣ አዳዲስ ተቋማትና የሆስፒታሉ ወቅታዊ መረጃዎች።",
        },
        om: {
          name: "Oduu Hospitaalaa",
          description: "Beeksisa ifaa, dhaabbilee haaraafi odeeffannoo yeroo hospitaalichaa.",
        },
      },
    },
  });

  const category2 = await prisma.newsCategory.create({
    data: {
      name: "Health Insights",
      slug: "health-insights",
      description: "Health education, medical tips, and wellness articles from our physicians.",
      translations: {
        am: {
          name: "የጤና ግንዛቤዎች",
          description: "የጤና ትምህርቶች፣ የህክምና ምክሮችና የደህንነት ጽሁፎች ከሀኪሞቻችን።",
        },
        om: {
          name: "Hubannoo Fayyaa",
          description: "Barnoota fayyaa, gorsa yaalaafi barreeffamoota fayyummaa ogeeyyii keenya irraa.",
        },
      },
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
      metaDescription: "Medhen Beza Hospital expands cardiac care with a new state-of-the-art catheterisation lab in Adama.",
      featuredImage: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
      ogImage: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      publishedAt: new Date("2026-09-01"),
      translations: {
        am: {
          title: "አዲሱ የልብ ካቴተራይዜሽን ላቦራቶሪ በመድህን ቤዛ ተመርቆ ስራ ጀመረ",
          summary: "የልብ ህክምና አገልግሎታችንን በዘመናዊ የምስልና የካቴተር ቴክኖሎጂዎች ይበልጥ እያሰፋን ነው።",
          content: "መድህን ቤዛ ሆስፒታል አዲሱን የልብ ካቴተራይዜሽን ላቦራቶሪ (Cath Lab) በይፋ ስራ ማስጀመሩን በደስታ ያበስራል። ይህ ተቋም የልብ ህክምና ቡድናችን ለድንገተኛ የልብ ህመም፣ ለልብ ቧንቧ መዘጋትና ለደም ቧንቧ ህመሞች ፈጣንና ህይወት አድን ህክምናዎችን እንዲሰጥ ያስችለዋል።",
          authorName: "ዶ/ር ዳዊት ኃይሌ",
        },
        om: {
          title: "Laaboraatoriin Kaateeterayizeeshinii Onnee Haaraan Hospitaala Medhen Bezaatti Eebbifame",
          summary: "Tajaajila yaala onnee meeshaalee ammayyaa suuraafi kaateeterayizeeshiniitiin bal'isaa jira.",
          content: "Hospitaalli Medhen Beza laaboraatorii kaateeterayizeeshinii onnee haaraa tajaajilaaf banaa gochuu isaa gammachuudhaan beeksisa. Dhaabbanni kun gareen yaala onnee keenya dhukkuba onnee tasaa, cufamuu hidda dhiigaa fi rakkoolee sirna dhiigaatiif yaala lubbuu baraaru hatattamaan akka kennu dandeessisa.",
          authorName: "Dr. Daawwit Hayilee",
        },
      },
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
      featuredImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
      ogImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      publishedAt: new Date("2026-08-25"),
      translations: {
        am: {
          title: "የልብ ህመም መንስኤዎችን ማወቅ: መከላከያና ቅድመ ጥንቃቄ",
          summary: "የልብ ህመም ምልክቶችን ቀድሞ ለመለየትና ጤናማ ልብ እንዲኖርዎ የሚረዱ ዋና ዋና ነጥቦች።",
          content: "የልብና የደም ቧንቧ በሽታዎች በዓለም ዙሪያ ለሞት ቀዳሚ ምክንያቶች እንደሆኑ ቀጥለዋል። ጤናማ የአኗኗር ዘይቤን በመከተል፣ የደም ግፊትን ዘወትር በመከታተልና መደበኛ የልብ ምርመራዎችን በማድረግ እስከ 80 በመቶ የሚደርሱ ድንገተኛ የልብ ጥቃቶችንና ስትሮክን መከላከል ይቻላል።",
          authorName: "የክሊኒካል ጤና ቡድን",
        },
        om: {
          title: "Sababoota Dhibee Onnee Hubachuu: Ittisaafi Kunuunsa Yeroo Dhiyoo",
          summary: "Mallattoolee dhibee onnee dursanii beekuufi fayyummaa onnee eeguuf tarkaanfilee ijoo.",
          content: "Dhukkuboonni onneefi hidda dhiigaa addunyaa irratti sababa du'a duraa ta'anii itti fufaniiru. Sirna jireenya fayya qabeessa hordofuu, dhiibbaa dhiigaa yeroo hunda to'achuufi sakatta'iinsa onnee idilee taasisuudhaan dhukkuba onnee tasaafi istirookii hanga dhibbeentaa 80 ittisuun ni danda'ama.",
          authorName: "Garee Fayyaa Kilinikaalaa",
        },
      },
    },
  ];

  for (const n of newsData) {
    await prisma.news.create({ data: n });
  }
  console.log("✅ Seeded news categories and articles with multilingual data.");

  // ─── 10. Seed Careers (§14) ─────────────────────────────────────────────────
  const careersData = [
    {
      position: "Senior ICU Nurse",
      slug: "senior-icu-nurse",
      employmentType: EmploymentType.FULL_TIME,
      location: "Adama, Ethiopia",
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
      translations: {
        am: {
          position: "ሲኒየር የፅኑ ህሙማን (ICU) ነርስ",
          location: "አዳማ፣ ኢትዮጵያ",
          description: "ለቀዶ ህክምና እና ለአደጋ ተጎጂ ለሆኑ የፅኑ ህሙማን ክፍሎች ጥንቁቅና ሩህሩህ ነርሲንግ አገልግሎት የሚሰጡ ባለሙያ እንፈልጋለን።",
          responsibilities: [
            "የፅኑ ህሙማንን የህይወት ምልክቶችና የደም ዝውውር ሁኔታዎች በንቃት መከታተል።",
            "የደም ስር መድሃኒቶችን በአግባቡ መስጠትና የመተንፈሻ አጋዥ መሳሪያዎችን መቆጣጠር።",
            "ከፅኑ ህክምና ሀኪሞች ጋር በመተባበር የታካሚውን የእንክብካቤ እቅድ ማዘመን።",
            "የታካሚውን ክብር መጠበቅ እና ከቤተሰቦች ጋር ሩህሩህ ተግባቦት መፍጠር።",
          ],
          requirements: [
            "በነርሲንግ የቢኤስሲ (BSc) ዲግሪና በኢትዮጵያ ህጋዊ የስራ ፈቃድ ያለው/ያላት።",
            "ቢያንስ 3 ዓመት በፅኑ ህሙማን (ICU) ወይም በድንገተኛ ክፍል የነርሲንግ የስራ ልምድ።",
            "የBLS እና የACLS የህይወት አድን ስልጠና ሰርተፍኬት ያለው/ያላት።",
          ],
          qualifications: ["በነርሲንግ የቢኤስሲ ዲግሪ", "የBLS / ACLS ሰርተፍኬት"],
          applicationInstructions: "የስራ ማመልከቻዎንና ሲቪዎን ወደ careers@medhenbeza.com በርዕሱ ላይ 'Application: Senior ICU Nurse' በማለት ይላኩ።",
        },
        om: {
          position: "Narsii Kutaa Yaala Cimaa (ICU) Olaanaa",
          location: "Adaamaa, Itoophiyaa",
          description: "Dhukkubsattoota baqaqsanii yaalamaniifi balaan miidhamaniif kunuunsa narsiingii olaanaa kennuuf Narsii ICU garaa laafummaa qabu barbaanna.",
          responsibilities: [
            "Mallattoolee lubbuufi haala dhiigaa dhukkubsattoota yaala cimaa keessa jiranii to'achuu.",
            "Qorichoota hidda dhiigaa kennuufi meeshaalee hargansuu gargaaran to'achuu.",
            "Doktoroota yaala cimaa wajjin ta'uun karoora kunuunsa dhukkubsataa haaromsuu.",
            "Kabaja dhukkubsataa eeguufi maatii wajjin qunnamtii gaarii uumuu.",
          ],
          requirements: [
            "Digrii BSc Narsiingiitiin kan qabuufi hayyama hojii Itoophiyaa kan qabu.",
            "Kutaa ICU ykn kutaa balaa tasaa keessatti muuxannoo waggaa 3 ol kan qabu.",
            "Waraqaa ragaa leenjii BLS fi ACLS kan qabu/qabdu.",
          ],
          qualifications: ["Digrii BSc Narsiingii", "Waraqaa Ragaa BLS / ACLS"],
          applicationInstructions: "Iyyannoo fi CV keessan gara careers@medhenbeza.com tti mata duree 'Application: Senior ICU Nurse' jedhuun ergaa.",
        },
      },
    },
    {
      position: "Laboratory Technologist",
      slug: "laboratory-technologist",
      employmentType: EmploymentType.FULL_TIME,
      location: "Adama, Ethiopia",
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
      translations: {
        am: {
          position: "የህክምና ላቦራቶሪ ቴክኖሎጂስት",
          location: "አዳማ፣ ኢትዮጵያ",
          description: "በሄማቶሎጂ፣ በክሊኒካል ኬሚስትሪና በማይክሮባዮሎጂ ዘርፎች ዘመናዊና በእጅ የሚከናወኑ የላቦራቶሪ ምርመራዎችን ማካሄድ።",
          responsibilities: [
            "የላቀ የጥራት ቁጥጥር (QA/QC) ስርዓቶችን በመከተል የላቦራቶሪ መመርመሪያ መሳሪያዎችን ማስተዳደር።",
            "የደም፣ የፈሳሽ እና የቲሹ ናሙናዎችን በከፍተኛ ጥንቃቄና ፍጥነት መመርመር።",
            "የመሳሪያዎችን መዝገብና የካሊብሬሽን መርሃ-ግብር በአግባቡ መያዝ።",
          ],
          requirements: [
            "በሜዲካል ላቦራቶሪ ሳይንስ የቢኤስሲ ዲግሪና ንቁ የስራ ፈቃድ ያለው/ያላት።",
            "በሆስፒታል ላቦራቶሪ ውስጥ ቢያንስ 2 ዓመት የስራ ልምድ።",
          ],
          qualifications: ["በሜዲካል ላቦራቶሪ ሳይንስ የቢኤስሲ ዲግሪ"],
          applicationInstructions: "ሲቪዎን ወደ careers@medhenbeza.com በርዕሱ ላይ 'Application: Laboratory Technologist' በማለት ይላኩ።",
        },
        om: {
          position: "Teeknooloojistii Laaboraatorii Yaalaa",
          location: "Adaamaa, Itoophiyaa",
          description: "Qorannoowwan heemaatooloojii, keemistirii kilinikaalaafi maayikiroobaayooloojii meeshaalee ammayyaafi harkaan gaggeessuu.",
          responsibilities: [
            "Sirna to'annoo qulqullinaa (QA/QC) cimsuun meeshaalee laaboraatorii hojjechiisuu.",
            "Saampilii dhiigaa, dhangala'aafi tishuu of eeggannoo guddaafi saffisaan qorachuu.",
            "Galmee meeshaaleefi sagantaa qulqulleessuu sirriitti qabachuu.",
          ],
          requirements: [
            "Digrii BSc Saayinsii Laaboraatorii Yaalaatiin kan qabuufi hayyama hojii qabu.",
            "Laaboraatorii hospitaalaa keessatti muuxannoo hojii waggaa 2 ol.",
          ],
          qualifications: ["Digrii BSc Saayinsii Laaboraatorii Yaalaa"],
          applicationInstructions: "CV keessan gara careers@medhenbeza.com tti mata duree 'Application: Laboratory Technologist' jedhuun ergaa.",
        },
      },
    },
  ];

  for (const c of careersData) {
    await prisma.career.create({ data: c });
  }
  console.log("✅ Seeded careers and vacancies with multilingual data.");

  // ─── 11. Seed Gallery Items (§13) ───────────────────────────────────────────
  const galleryData = [
    {
      title: "Main Hospital Inpatient Campus",
      description: "Exterior overview of the Medhen Beza medical pavilion and emergency arrival bay in Adama.",
      album: "Facilities",
      type: MediaType.IMAGE,
      url: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80",
      status: ContentStatus.PUBLISHED,
      order: 1,
      translations: {
        am: {
          title: "ዋናው የሆስፒታሉ ግቢ እና የተኝቶ ህክምና ህንፃ",
          description: "የመድህን ቤዛ ህክምና ህንፃ እና የአዳማ የድንገተኛ አምቡላንስ መግቢያ ውጫዊ ገጽታ።",
          album: "ተቋማት",
        },
        om: {
          title: "Gamoo Guddaa Ciisicha Hospitaalaa",
          description: "Ilaalcha alaa gamoo yaala Medhen Bezaa fi karra dhufeensa ambaalaansii Adaamaa.",
          album: "Dhaabbilee",
        },
      },
    },
    {
      title: "Sterile Laminar Flow Surgical Theatre",
      description: "Fully sterile surgical theatre equipped with laminar airflow, advanced anesthesia, and HD laparoscopic towers.",
      album: "Facilities",
      type: MediaType.IMAGE,
      url: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80",
      status: ContentStatus.PUBLISHED,
      order: 2,
      translations: {
        am: {
          title: "ከፍተኛ ንጽህና ያለው የቀዶ ህክምና ክፍል",
          description: "የላሚናር አየር ፍሰት፣ ዘመናዊ ማደንዘዣና ከፍተኛ ጥራት ያለው የላፓሮስኮፒ ማማዎች የተገጠሙለት የቀዶ ህክምና አዳራሽ።",
          album: "ተቋማት",
        },
        om: {
          title: "Kutaa Yaala Baqaqsanii Qulqullinni Isaa Eegame",
          description: "Kutaa baqaqsanii yaaluu qilleensa qulqulluu qabu, kan meeshaalee ammayyaatiin guutame.",
          album: "Dhaabbilee",
        },
      },
    },
    {
      title: "Intensive Care Unit (ICU & CCU)",
      description: "Round-the-clock intensive care monitoring with invasive hemodynamic support and dedicated nursing stations.",
      album: "Facilities",
      type: MediaType.IMAGE,
      url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80",
      status: ContentStatus.PUBLISHED,
      order: 3,
      translations: {
        am: {
          title: "የፅኑ ህሙማን ማገገሚያ ክፍል (ICU & CCU)",
          description: "የ24 ሰዓት የልብና የደም ዝውውር ክትትል ከልዩ የነርሲንግ አገልግሎት ጋር።",
          album: "ተቋማት",
        },
        om: {
          title: "Kutaa Yaala Cimaa (ICU & CCU)",
          description: "Hordoffii yaala cimaa sa'aatii 24 fi buufata narsii addaa.",
          album: "Dhaabbilee",
        },
      },
    },
    {
      title: "Digital Radiology & CT Diagnostic Center",
      description: "High-resolution computerized tomography (CT) and digital fluoroscopy imaging suites.",
      album: "Facilities",
      type: MediaType.IMAGE,
      url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80",
      status: ContentStatus.PUBLISHED,
      order: 4,
      translations: {
        am: {
          title: "ዲጂታል ራዲዮሎጂ እና የሲቲ ስካን መመርመሪያ ማዕከል",
          description: "ከፍተኛ ጥራት ያለው የኮምፒዩተራይዝድ ቶሞግራፊ (CT) እና የዲጂታል ፍሎሮስኮፒ ምስል ክፍሎች።",
          album: "ተቋማት",
        },
        om: {
          title: "Wiirtuu Qorannoo Raadiyooloojiifi CT Iskaanii",
          description: "Kutaalee suuraa CT iskaaniifi raajii dijiitaalaa qulqullina olaanaa qaban.",
          album: "Dhaabbilee",
        },
      },
    },
    {
      title: "Private VIP Inpatient Recovery Suite",
      description: "Spacious private recovery room with natural lighting, ergonomic electric beds, and patient comfort amenities.",
      album: "Facilities",
      type: MediaType.IMAGE,
      url: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80",
      status: ContentStatus.PUBLISHED,
      order: 5,
      translations: {
        am: {
          title: "የግል ቪአይፒ (VIP) የተኝቶ ህክምና ክፍል",
          description: "ተፈጥሯዊ ብርሃን፣ ምቹ ኤሌክትሪክ አልጋዎችና የተሟሉ ማሟያዎች ያሉት ሰፊ የግል ክፍል፤",
          album: "ተቋማት",
        },
        om: {
          title: "Kutaa Ciisichaa Dhuunfaa VIP",
          description: "Kutaa ciisichaa bal'aa ifa qabu, siree elektiriikiifi meeshaalee boqonnaa qabu.",
          album: "Dhaabbilee",
        },
      },
    },
    {
      title: "Automated Clinical Pathology Laboratory",
      description: "Automated clinical chemistry, hematology, and microbiology analyzer benches ensuring rapid test turnaround.",
      album: "Facilities",
      type: MediaType.IMAGE,
      url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
      status: ContentStatus.PUBLISHED,
      order: 6,
      translations: {
        am: {
          title: "አውቶሜትድ የክሊኒካል ፓቶሎጂ ላቦራቶሪ",
          description: "ፈጣንና አስተማማኝ የምርመራ ውጤት የሚሰጡ ዘመናዊ የኬሚስትሪና የደም መመርመሪያ መሳሪያዎች።",
          album: "ተቋማት",
        },
        om: {
          title: "Laaboraatorii Paatooloojii Kilinikaalaa Ammayyaa",
          description: "Meeshaalee qorannoo keemistiriifi dhiigaa saffisaafi amansiisaa ta'an.",
          album: "Dhaabbilee",
        },
      },
    },
    {
      title: "Emergency Trauma & Resuscitation Center",
      description: "Rapid triage and resuscitation bays equipped with cardiac defibrillators and trauma stabilization gear.",
      album: "Facilities",
      type: MediaType.IMAGE,
      url: "https://images.unsplash.com/photo-1587351021350-a4ce092073ef?auto=format&fit=crop&w=1200&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1587351021350-a4ce092073ef?auto=format&fit=crop&w=600&q=80",
      status: ContentStatus.PUBLISHED,
      order: 7,
      translations: {
        am: {
          title: "የድንገተኛ አደጋና ህይወት አድን ማዕከል",
          description: "የልብ ማነቃቂያ ዲፊብሪሌተሮችና ፈጣን ህይወት አድን መሳሪያዎች የተሟሉለት የድንገተኛ ክፍል፤",
          album: "ተቋማት",
        },
        om: {
          title: "Wiirtuu Yaala Balaa Tasaafi Lubbuu Baraaruu",
          description: "Kutaalee daddafanii yaaluu meeshaalee diifibrileetaraafi deebisanii dammaqsuun guutaman.",
          album: "Dhaabbilee",
        },
      },
    },
    {
      title: "Maternal Care & Neonatal Nursery",
      description: "Sterile neonatal intensive care incubators and private mother-baby bonding suites.",
      album: "Facilities",
      type: MediaType.IMAGE,
      url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
      status: ContentStatus.PUBLISHED,
      order: 8,
      translations: {
        am: {
          title: "የእናቶች እንክብካቤና የጨቅላ ህፃናት ማቆያ",
          description: "ንጹህ የጨቅላ ህፃናት ኢንኩቤተሮችና የእናትና ልጅ ቅርርብ ማቆያ ክፍሎች።",
          album: "ተቋማት",
        },
        om: {
          title: "Kunuunsa Haadholiifi Daa'immanreef Dhalatanii",
          description: "Kutaalee inkiwubeetara daa'immaniifi boqonnaa haadholiifi ijoollee.",
          album: "Dhaabbilee",
        },
      },
    },
    {
      title: "Cardiology Diagnostic Wing Tour",
      description: "Virtual walkthrough of the non-invasive and interventional cardiac suite.",
      album: "Facilities",
      type: MediaType.VIDEO,
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=600&q=80",
      duration: "2:14",
      status: ContentStatus.PUBLISHED,
      order: 9,
      translations: {
        am: {
          title: "የልብ ህክምና ክፍል ቪዲዮ ጉብኝት",
          description: "የልብ መመርመሪያና የካቴተራይዜሽን ክፍሎች ምናባዊ የቪዲዮ ጉብኝት።",
          album: "ተቋማት",
        },
        om: {
          title: "Daawwannaa Viidiyoo Kutaa Yaala Onnee",
          description: "Daawwannaa kutaalee qorannoo onneefi kaateeterayizeeshinii.",
          album: "Dhaabbilee",
        },
      },
    },
  ];

  for (const g of galleryData) {
    await prisma.gallery.create({ data: g });
  }
  console.log(`✅ Seeded ${galleryData.length} gallery media items with multilingual data.`);

  // ─── 11b. Seed Hospital Events (§12) ────────────────────────────────────────
  const eventsData = [
    {
      title: "Annual Community Cardiovascular Health Screening",
      slug: "annual-cardiovascular-health-screening-2026",
      description: "Free blood pressure checkups, BMI assessment, cholesterol testing, and consultation with our cardiology specialists in Adama.",
      eventDate: new Date("2026-10-10T09:00:00Z"),
      location: "Medhen Beza Hospital Main Pavilion, Adama",
      image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80",
      isFeatured: true,
      status: ContentStatus.PUBLISHED,
      translations: {
        am: {
          title: "ዓመታዊ የማህበረሰብ የልብ ጤና ምርመራ ዘመቻ",
          description: "ነፃ የደም ግፊት ምርመራ፣ የሰውነት ክብደት ምጣኔ (BMI)፣ የኮሌስትሮል ምርመራ እና ከአዳማ የልብ ስፔሻሊስቶቻችን ጋር ነፃ ምክክር።",
          location: "መድህን ቤዛ ሆስፒታል ዋና አዳራሽ፣ አዳማ",
        },
        om: {
          title: "Duula Sakatta'iinsa Fayyaa Onnee Hawaasaa Waggaa",
          description: "Qorannoo dhiibbaa dhiigaa tolaa, madaallii ulfaatina qaamaa (BMI), qorannoo koolestrooliifi gorsa ogeeyyii onnee keenya waliin Adaamaatti.",
          location: "Wiirtuu Guddaa Hospitaala Medhen Beza, Adaamaa",
        },
      },
    },
    {
      title: "Symposium on Modern Maternal & Neonatal Care",
      slug: "maternal-neonatal-symposium-2026",
      description: "A dedicated medical conference gathering obstetricians, pediatricians, and midwives to discuss the latest evidence-based protocols in safe delivery and neonatal intensive care.",
      eventDate: new Date("2026-11-05T08:30:00Z"),
      location: "Hospital Auditorium (Building B), Adama",
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80",
      isFeatured: true,
      status: ContentStatus.PUBLISHED,
      translations: {
        am: {
          title: "የዘመናዊ እናቶችና ጨቅላ ህፃናት ህክምና ሲምፖዚየም",
          description: "የማህፀንና ፅንስ፣ የህፃናት ሀኪሞችና አዋላጅ ነርሶች በአስተማማኝ ወሊድና በጨቅላ ህፃናት ከፍተኛ እንክብካቤ ዙሪያ የሚመክሩበት የህክምና ኮንፈረንስ።",
          location: "የሆስፒታሉ ኦዲቶሪየም (ህንፃ ለ)፣ አዳማ",
        },
        om: {
          title: "Simpooziyemii Yaala Haadholiifi Daa'imman Dhalatanii Ammayyaa",
          description: "Konfiraansii yaalaa doktoorota gadameessaa, daa'immaniifi deessistoota walitti fiduun waa'ee deumsa nageenya qabuufi yaala cimaa irratti mari'atan.",
          location: "Ooditooriyemii Hospitaalaa (Gamoo B), Adaamaa",
        },
      },
    },
  ];

  for (const ev of eventsData) {
    await prisma.hospitalEvent.create({ data: ev });
  }
  console.log(`✅ Seeded ${eventsData.length} upcoming hospital events with multilingual data.`);

  // ─── 11c. Seed Hospital Facilities ──────────────────────────────────────────
  const facilitiesData = [
    {
      name: "Intensive Care Unit (ICU & CCU)",
      slug: "intensive-care-unit",
      tagline: "24/7 Advanced Hemodynamic & Critical Care",
      description: "Specialized clinical unit equipped with invasive hemodynamic monitors, mechanical ventilators, and 24/7 intensivist coverage.",
      category: "Critical Care",
      capacity: "24 Monitored Beds",
      location: "Building B, 2nd Floor",
      hours: "24/7 Continuous Monitoring",
      phone: "+251 116 000 120",
      features: [
        "Mechanical ventilators with high-flow oxygen",
        "Continuous arterial and central venous monitoring",
        "Dedicated round-the-clock critical care nursing",
        "Direct emergency theatre and cath lab connectivity",
      ],
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
      order: 1,
      status: ContentStatus.PUBLISHED,
      translations: {
        am: {
          name: "የፅኑ ህሙማን ማዕከል (ICU & CCU)",
          tagline: "የ24 ሰዓት የላቀ ህይወት አድን እንክብካቤ",
          description: "የተሟላ የደም ዝውውር፣ የልብና የመተንፈሻ ድጋፍ የሚሰጥበት ከፍተኛ ክሊኒካዊ ደረጃውን የጠበቀ የፅኑ ህሙማን ክፍል ነው።",
          category: "የፅኑ ህክምና ክፍል",
          capacity: "24 ክትትል የሚደረግባቸው አልጋዎች",
          location: "ህንፃ ለ፣ 2ኛ ፎቅ",
          hours: "24/7 ቀጣይነት ያለው ክትትል",
          features: [
            "የላቀ የመተንፈሻ አጋዥ መሳሪያዎች (Ventilators)",
            "የልብና የደም ዝውውር ክትትል",
            "የ24 ሰዓት የፅኑ ህክምና ስፔሻሊስቶች",
            "የተለዩ የኢንፌክሽን መከላከያ ክፍሎች",
          ],
        },
        om: {
          name: "Wiirtuu Yaala Cimaa (ICU & CCU)",
          tagline: "Kunuunsa Lubbuu Baraaruu Sa'aatii 24",
          description: "Kutaa yaala cimaa sadarkaa olaanaa qabu kan hargansuu, hidda dhiigaafi dandeettii onnee deggeru.",
          category: "Kutaa Yaala Cimaa",
          capacity: "Sireewwan Hordofaman 24",
          location: "Gamoo B, Fooxaa 2ffaa",
          hours: "Hordoffii Walirraa Hin Cinne 24/7",
          features: [
            "Meeshaalee Hargansuu Ammayyaa",
            "Hordoffii Onneefi Dhiigaa",
            "Ogeeyyii Yaala Cimaa Sa'aatii 24",
            "Kutaalee Dhukkuba Daddarbaa Ittisan",
          ],
        },
      },
    },
    {
      name: "Advanced Cardiac Catheterization Lab",
      slug: "cardiac-catheterization-lab",
      tagline: "Rapid Angiography & Coronary Stenting",
      description: "State-of-the-art cath lab dedicated to emergency primary percutaneous coronary interventions (PCI), diagnostic angiography, and pacemaker implantations.",
      category: "Diagnostic & Interventional",
      capacity: "2 Modern Cath Suites",
      location: "Building A, 2nd Floor",
      hours: "24/7 Emergency & Mon-Sat Scheduled",
      phone: "+251 116 000 121",
      features: [
        "High-definition digital fluoroscopy imaging",
        "Immediate acute heart attack primary PCI",
        "Permanent pacemaker and defibrillator implantation",
        "Dedicated post-procedure radial recovery lounge",
      ],
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
      order: 2,
      status: ContentStatus.PUBLISHED,
      translations: {
        am: {
          name: "የላቀ የልብ ካቴተራይዜሽን ላቦራቶሪ",
          tagline: "ፈጣንና ዘመናዊ የልብ ቧንቧ ህክምና",
          description: "ለድንገተኛ የልብ ህመም፣ የልብ ቧንቧ መዘጋትና ስቴንት (Stent) ለማስገባት የሚያስችል ዘመናዊ ዲጂታል ማዕከል።",
          category: "የምርመራና የልብ ህክምና",
          capacity: "2 የተሟሉ የካቴተራይዜሽን ክፍሎች",
          location: "ህንፃ ሀ፣ 2ኛ ፎቅ",
          hours: "24/7 ድንገተኛ እና የታቀዱ ህክምናዎች",
        },
        om: {
          name: "Laaboraatorii Kaateeterayizeeshinii Onnee Olaanaa",
          tagline: "Yaala Hidda Dhiiga Onnee Saffisaafi Ammayyaa",
          description: "Wiirtuu dijiitaalaa ammayyaa dhukkuba onnee tasaa, hidda cufame banuufi isteentii galchuuf oolu.",
          category: "Qorannoofi Yaala Onnee",
          capacity: "Kutaalee Kaat-laabii Guutuu 2",
          location: "Gamoo A, Fooxaa 2ffaa",
          hours: "Tasaafi Karoorfame 24/7",
        },
      },
    },
    {
      name: "Modern Maternity & NICU Center",
      slug: "maternity-nicu-center",
      tagline: "Safe Motherhood & Advanced Neonatal Care",
      description: "Dedicated maternal pavilion with private labour suites, surgical delivery theatres, and a level III neonatal intensive care unit.",
      category: "Maternal & Child Health",
      capacity: "30 Inpatient Suites & 12 Incubators",
      location: "Building B, 3rd Floor",
      hours: "24/7 Delivery & Neonatal Care",
      phone: "+251 116 000 122",
      features: [
        "Private en-suite delivery rooms",
        "Temperature-controlled neonatal incubators",
        "Specialized neonatal phototherapy and CPAP systems",
        "Continuous 24/7 obstetrician and midwife attendance",
      ],
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      order: 3,
      status: ContentStatus.PUBLISHED,
      translations: {
        am: {
          name: "ዘመናዊ የማዋለጃና የጨቅላ ህፃናት ማዕከል",
          tagline: "አስተማማኝ እናትነትና የጨቅላዎች እንክብካቤ",
          description: "ለእናቶች ምቹ የግል ማዋለጃ ክፍሎችን እና ለአዳዲስ ጨቅላዎች የላቀ የኢንኩቤተር ማዕከልን የያዘ ልዩ ክፍል ነው።",
          category: "የእናቶችና ህፃናት ጤና",
          capacity: "30 የተኝቶ ማዋለጃ ክፍሎች እና 12 ኢንኩቤተሮች",
          location: "ህንፃ ለ፣ 3ኛ ፎቅ",
          hours: "24/7 የማዋለድና የጨቅላዎች እንክብካቤ",
        },
        om: {
          name: "Wiirtuu Deessisuufi NICU Ammayyaa",
          tagline: "Haadhummaa Nagaafi Kunuunsa Daa'immanii",
          description: "Kutaalee deessisuu dhuunfaa haadholiif mijatoofi wiirtuu inkiwubeetara daa'immanreef dhalataniif oolu.",
          category: "Fayyaa Haadholiifi Daa'immanii",
          capacity: "Kutaalee Ciisichaa 30 fi Inkiwubeetara 12",
          location: "Gamoo B, Fooxaa 3ffaa",
          hours: "Deessisuufi Kunuunsa Daa'immanii 24/7",
        },
      },
    },
    {
      name: "Emergency Trauma & Resuscitation Center",
      slug: "emergency-trauma-center",
      tagline: "Rapid Response & Comprehensive Trauma Care",
      description: "Full-scale emergency centre equipped for immediate resuscitation of polytrauma, cardiac arrests, acute respiratory emergencies, and acute surgical conditions.",
      category: "Emergency Medicine",
      capacity: "18 Emergency Bays",
      location: "Building A, Ground Floor (Gate 1)",
      hours: "Open 24 Hours / 365 Days",
      phone: "+251 911 000 999",
      features: [
        "Dedicated ambulance bay with direct triage intake",
        "Two fully equipped surgical resuscitation rooms",
        "Point-of-care ultrasound and immediate blood gas analysis",
        "Trauma team on continuous active duty",
      ],
      image: "https://images.unsplash.com/photo-1587351021350-a4ce092073ef?auto=format&fit=crop&w=1200&q=80",
      order: 4,
      status: ContentStatus.PUBLISHED,
      translations: {
        am: {
          name: "የድንገተኛ አደጋና ህይወት አድን ማዕከል",
          tagline: "ፈጣን፣ የሰለጠነና 24 ሰዓት ክፍት የድንገተኛ ህክምና",
          description: "ለከባድ አደጋዎች፣ ለድንገተኛ የልብና የመተንፈስ ችግሮች ቅጽበታዊ ህይወት አድን ህክምና የሚሰጥበት ዋና ክፍል ነው።",
          category: "የድንገተኛ ህክምና",
          capacity: "18 የድንገተኛ ማስተናገጃ ክፍሎች",
          location: "ህንፃ ሀ፣ ምድር ቤት (በር 1)",
          hours: "24 ሰዓት ክፍት / በዓመት 365 ቀናት",
        },
        om: {
          name: "Wiirtuu Yaala Balaa Tasaafi Lubbuu Baraaruu",
          tagline: "Yaala Balaa Tasaa Saffisaa, Ogeessotaafi Sa'aatii 24",
          description: "Balaawwan cimaa, rakkoo onneefi hargansuu tasaatiif yaala lubbuu baraaru hatattamaan kennuuf kan qophaa'e.",
          category: "Yaala Balaa Tasaa",
          capacity: "Kutaalee Tasaa 18",
          location: "Gamoo A, Dachaa (Karra 1)",
          hours: "Sa'aatii 24 Banaa / Waggaatti Guyyoota 365",
        },
      },
    },
  ];

  for (const fac of facilitiesData) {
    await prisma.facility.create({ data: fac });
  }
  console.log(`✅ Seeded ${facilitiesData.length} hospital facilities with multilingual data.`);

  // ─── 12. Seed FAQs ──────────────────────────────────────────────────────────
  const faqsData = [
    {
      question: "What are your emergency department hours?",
      answer: "Our emergency department operates 24 hours a day, 7 days a week, 365 days a year with full trauma teams and diagnostics on standby.",
      category: "Emergency & General",
      order: 1,
      status: ContentStatus.PUBLISHED,
      translations: {
        am: {
          question: "የድንገተኛ ህክምና ክፍላችሁ የስራ ሰዓት እንዴት ነው?",
          answer: "የድንገተኛ ህክምና ክፍላችን በቀን 24 ሰዓት፣ በሳምንት 7 ቀናት፣ በዓመት 365 ቀናት ሙሉ የህክምና ቡድኖችና የምርመራ ክፍሎች ተዘጋጅተው አገልግሎት ይሰጣል።",
          category: "ድንገተኛ እና አጠቃላይ",
        },
        om: {
          question: "Sa'aatiin hojii kutaa yaala balaa tasaa akkamii?",
          answer: "Kutaan yaala balaa tasaa keenya guyyatti sa'aatii 24, torbanitti guyyaa 7, waggaatti guyyoota 365 garee yaalaafi meeshaalee guutuudhaan banaadha.",
          category: "Balaa Tasaafi Waliigalaa",
        },
      },
    },
    {
      question: "How do I consult with a specialist physician?",
      answer: "You can consult by visiting our outpatient clinic, calling our direct line at +251 116 000 111, or reaching us via the website contact form.",
      category: "Appointments & Visits",
      order: 2,
      status: ContentStatus.PUBLISHED,
      translations: {
        am: {
          question: "ከስፔሻሊስት ሀኪም ጋር ለመገናኘትና ለመታከም ምን ማድረግ አለብኝ?",
          answer: "ወደ ተመላላሽ ክሊኒካችን በአካል በመምጣት፣ በቀጥታ ስልክ መስመራችን +251 116 000 111 በመደወል ወይም በድረ-ገጻችን የግንኙነት ቅጽ በመጠቀም መመዝገብና መታከም ይችላሉ።",
          category: "ቀጠሮዎችና ጉብኝት",
        },
        om: {
          question: "Doktoora addaa akkamitti qunnamuu danda'a?",
          answer: "Kilinika keenya qaamaan dhufuun, sarara bilbilaa kallattii +251 116 000 111 bilbiluun ykn foomii qunnamtii weebsaayitii keenyaa fayyadamuun danda'ama.",
          category: "Beellamaafi Gaafannoo",
        },
      },
    },
    {
      question: "Does Medhen Beza Hospital accept insurance coverage?",
      answer: "Yes, we partner with major Ethiopian health insurers and international healthcare plans. Please present your insurance membership card at reception.",
      category: "Billing & Insurance",
      order: 3,
      status: ContentStatus.PUBLISHED,
      translations: {
        am: {
          question: "መድህን ቤዛ ሆስፒታል የህክምና መድን (ኢንሹራንስ) ይቀበላል?",
          answer: "አዎ፣ ከዋና ዋና የኢትዮጵያ የጤና መድን ሰጪዎችና ከዓለም አቀፍ የጤና መድን ተቋማት ጋር እንሰራለን። እባክዎ ወደ ሆስፒታሉ ሲመጡ የመድን አባልነት ካርድዎን ይዘው ይምጡ።",
          category: "ክፍያና ኢንሹራንስ",
        },
        om: {
          question: "Hospitaalli Medhen Beza Inshuraansii fayyaa ni fudhataa?",
          answer: "Eeyyee, dhaabbilee inshuraansii fayyaa gurguddoo Itoophiyaafi idil-addunyaa wajjin waliigaltee qabna. Maaloo kaardii miseensummaa keessan fuulduratti dhiheessaa.",
          category: "Kaffaltiifi Inshuraansii",
        },
      },
    },
  ];

  for (const f of faqsData) {
    await prisma.fAQ.create({ data: f });
  }
  console.log("✅ Seeded FAQs with multilingual data.");

  // ─── 13. Seed Site Settings (§22) ───────────────────────────────────────────
  const settingsData = [
    // Base Settings (English)
    { key: "hospital_name", value: "Medhen Beza Hospital", group: "general", description: "Official hospital name" },
    { key: "tagline", value: "Leading Healthcare Excellence", group: "general", description: "Hospital brand tagline" },
    { key: "hero_headline", value: "Compassionate care.", group: "content", description: "Homepage hero main headline" },
    { key: "hero_headline_accent", value: "Trusted healthcare.", group: "content", description: "Homepage hero accented headline" },
    { key: "hero_supporting_text", value: "Close to you, committed to you — exceptional clinical care delivered by specialists who put patients first.", group: "content", description: "Homepage hero description" },
    { key: "hero_image", value: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80", group: "content", description: "Homepage hero right-column photo" },
    { key: "stat_specialists", value: "50+", group: "content", description: "Highlight stat specialists" },
    { key: "stat_emergency", value: "24 / 7", group: "content", description: "Highlight stat emergency" },
    { key: "stat_departments", value: "15+", group: "content", description: "Highlight stat departments" },
    { key: "hospital_intro_title", value: "Trusted care for every stage of life", group: "content", description: "Hospital intro title" },
    { key: "hospital_intro_image", value: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80", group: "content", description: "Homepage intro section campus photo" },
    { key: "emergency_phone", value: "+251 911 000 999", group: "emergency", description: "24/7 emergency dispatch hotline" },
    { key: "ambulance_phone", value: "+251 911 000 999", group: "emergency", description: "Ambulance trauma line" },
    { key: "emergency_gate", value: "Gate 1 (Emergency & Ambulance Entrance), H73F+R49, Adama", group: "emergency", description: "Emergency gate directions" },
    { key: "emergency_hours", value: "Open 24 Hours · 7 Days a Week · All Holidays", group: "emergency", description: "Emergency department hours" },
    { key: "visiting_hours", value: "Mon - Sun: 06:00 - 08:00, 12:00 - 14:00, 17:00 - 19:30", group: "general", description: "General ward visiting hours" },
    { key: "general_phone", value: "+251 116 000 111", group: "contact", description: "Main reception and inquiry line" },
    { key: "hospital_phone", value: "+251 116 000 111", group: "contact", description: "Hospital switchboard phone" },
    { key: "email", value: "info@medhenbeza.com", group: "contact", description: "General inquiry email address" },
    { key: "hospital_email", value: "info@medhenbeza.com", group: "contact", description: "Hospital email" },
    { key: "address", value: "H73F+R49, Adama, Ethiopia", group: "contact", description: "Physical campus address" },
    { key: "hospital_address", value: "H73F+R49, Adama, Ethiopia", group: "contact", description: "Hospital physical address" },
    { key: "city", value: "Adama", group: "contact", description: "Hospital city" },
    { key: "location", value: "Adama, Ethiopia", group: "contact", description: "Hospital location" },
    { key: "working_hours", value: "24/7 Emergency & Inpatient Services", group: "general", description: "Operating schedule overview" },

    // Amharic Settings (_am)
    { key: "hospital_name_am", value: "መድህን ቤዛ ሆስፒታል", group: "general", description: "Official hospital name in Amharic" },
    { key: "tagline_am", value: "ቀዳሚ የህክምና የላቀ ደረጃ", group: "general", description: "Hospital brand tagline in Amharic" },
    { key: "hero_headline_am", value: "ሩህሩህና የተሟላ እንክብካቤ።", group: "content", description: "Homepage hero headline in Amharic" },
    { key: "hero_headline_accent_am", value: "አስተማማኝ የህክምና አገልግሎት።", group: "content", description: "Homepage hero accent in Amharic" },
    { key: "hero_supporting_text_am", value: "ለእርስዎ ቅርብ፣ ለጤናዎ ታማኝ — ለህሙማን ቅድሚያ በሚሰጡ ስመ-ጥር ስፔሻሊስቶች የሚሰጥ የላቀ ክሊኒካዊ እንክብካቤ።", group: "content", description: "Hero description in Amharic" },
    { key: "hospital_intro_title_am", value: "ለሁሉም የህይወት ደረጃ አስተማማኝ እንክብካቤ", group: "content", description: "Intro title in Amharic" },
    { key: "emergency_hours_am", value: "24 ሰዓት ክፍት · በሳምንት 7 ቀናት · በሁሉም በዓላት", group: "emergency", description: "Emergency hours in Amharic" },
    { key: "visiting_hours_am", value: "ሰኞ - እሑድ: 12:00 - 02:00፣ 06:00 - 08:00፣ 11:00 - 01:30 (የኢትዮጵያ ሰዓት)", group: "general", description: "Visiting hours in Amharic" },
    { key: "working_hours_am", value: "24/7 የድንገተኛና የተኝቶ ህክምና አገልግሎት", group: "general", description: "Working hours in Amharic" },
    { key: "location_am", value: "አዳማ፣ ኢትዮጵያ", group: "contact", description: "Location in Amharic" },

    // Afan Oromo Settings (_om)
    { key: "hospital_name_om", value: "Hospitaala Medhen Beza", group: "general", description: "Official hospital name in Afan Oromo" },
    { key: "tagline_om", value: "Tajaajila Yaalaa Ol'aanaa", group: "general", description: "Hospital brand tagline in Afan Oromo" },
    { key: "hero_headline_om", value: "Kunuunsa garaa laafummaa.", group: "content", description: "Homepage hero headline in Afan Oromo" },
    { key: "hero_headline_accent_om", value: "Tajaajila yaalaa amanamaa.", group: "content", description: "Homepage hero accent in Afan Oromo" },
    { key: "hero_supporting_text_om", value: "Isinitti dhiyoo, fayyaa keessaniif kan dhaabbate — yaala olaanaa ogeeyyii dursa dhukkubsattootaaf kennaniin.", group: "content", description: "Hero description in Afan Oromo" },
    { key: "hospital_intro_title_om", value: "Sadarkaa jireenyaa hundaaf kunuunsa amanamaa", group: "content", description: "Intro title in Afan Oromo" },
    { key: "emergency_hours_om", value: "Sa'aatii 24 Banaa · Torbanitti Guyyaa 7 · Ayyaana Hundatti", group: "emergency", description: "Emergency hours in Afan Oromo" },
    { key: "visiting_hours_om", value: "Wixata - Dilbata: 06:00 - 08:00, 12:00 - 14:00, 17:00 - 19:30", group: "general", description: "Visiting hours in Afan Oromo" },
    { key: "working_hours_om", value: "Tajaajila Yaala Balaafi Ciisichaa 24/7", group: "general", description: "Working hours in Afan Oromo" },
    { key: "location_om", value: "Adaamaa, Itoophiyaa", group: "contact", description: "Location in Afan Oromo" },
  ];

  for (const s of settingsData) {
    await prisma.siteSetting.create({ data: s });
  }
  console.log(`✅ Seeded ${settingsData.length} site settings (EN, AM, OM).`);

  // ─── 14. Seed CMS Pages (§14) ───────────────────────────────────────────────
  const pagesData = [
    {
      title: "About Medhen Beza Hospital",
      slug: "about",
      excerpt: "Dedicated to clinical excellence, compassionate patient recovery, and advanced medical practice in Adama and beyond.",
      content: JSON.stringify({
        hero: {
          title: "About Medhen Beza Hospital",
          supportingText: "Dedicated to clinical excellence, compassionate patient recovery, and advanced medical practice in Adama and beyond.",
          image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80",
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
          photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=80",
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
            photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
            photoAlt: "Dr. Dawit Haile — Hospital Director",
          },
          {
            name: "Dr. Helen Tadesse",
            position: "Medical Director & Chief Neurologist",
            photo: "https://images.unsplash.com/photo-1594824813520-a7d57f12e2c5?auto=format&fit=crop&w=800&q=80",
            photoAlt: "Dr. Helen Tadesse — Medical Director",
          },
          {
            name: "Dr. Senait Bekele",
            position: "Head of Maternal-Fetal Medicine",
            photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
            photoAlt: "Dr. Senait Bekele — Head of Maternal-Fetal Medicine",
          },
          {
            name: "Dr. Yonas Mulugeta",
            position: "Chief of Surgery & Trauma Care",
            photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
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
      }),
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
      translations: {
        am: {
          title: "ስለ መድህን ቤዛ ሆስፒታል",
          excerpt: "በአዳማና ከዚያም ባሻገር ለክሊኒካዊ የላቀ ደረጃ፣ ለሩህሩህ የህሙማን ማገገም እና ለዘመናዊ የህክምና አሰራር የቆመ።",
          content: JSON.stringify({
            hero: {
              title: "ስለ መድህን ቤዛ ሆስፒታል",
              supportingText: "በአዳማና ከዚያም ባሻገር ለክሊኒካዊ የላቀ ደረጃ፣ ለሩህሩህ የህሙማን ማገገም እና ለዘመናዊ የህክምና አሰራር የቆመ።",
              image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80",
              imageAlt: "የመድህን ቤዛ ሆስፒታል ግቢ በአዳማ",
            },
            introduction: {
              eyebrow: "ታሪካችን እና ዓላማችን",
              title: "በእምነት፣ በክሊኒካዊ እውቀትና በርህራሄ ላይ የተገነባ ዘመናዊ የህክምና ተቋም",
              paragraphs: [
                "መድህን ቤዛ ሆስፒታል በአዳማ እና በመላው ኢትዮጵያ ለሚገኙ ታካሚዎችና ቤተሰቦች ተደራሽና ዓለም አቀፍ ደረጃውን የጠበቀ ልዩ የህክምና አገልግሎት ለማቅረብ ተቋቋመ።",
                "ከተለመደው የተመላላሽ ታካሚ ምርመራ ጀምሮ እስከ ውስብስብ የቀዶ ጥገና ሂደቶች ድረስ ሆስፒታላችን እያንዳንዱ ታካሚ ክብር፣ ክሊኒካዊ ጥንቃቄና ሩህሩህ ድጋፍ እንዲያገኝ ሌት ተቀን ይሰራል።",
                "በህክምና ባለሙያዎቻችን፣ በዓለም አቀፍ የክሊኒካዊ ደህንነት ደረጃዎች እና በዘመናዊ የምርመራ ቴክኖሎጂዎች ላይ ያለማቋረጥ ኢንቨስት እናደርጋለን።",
              ],
              photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=80",
              photoAlt: "የመድህን ቤዛ ሆስፒታል የህክምና አመራሮችና ባለሙያዎች",
              ctaLabel: "ያግኙን",
              ctaHref: "/contact",
            },
            missionVision: {
              mission: {
                eyebrow: "ተልዕኳችን",
                title: "ሩህሩህና ከፍተኛ ደረጃውን የጠበቀ የህክምና አገልግሎት ለእያንዳንዱ ታካሚ",
                text: "እያንዳንዱን ግለሰብ በርህራሄ፣ በክሊኒካዊ ታማኝነትና በክብር በማስተናገድ ከፍተኛ ደረጃውን የጠበቀ፣ በታካሚው ላይ ያተኮረ ተደራሽ የህክምና አገልግሎት መስጠት።",
              },
              vision: {
                eyebrow: "ራዕያችን",
                title: "በመላው ኢትዮጵያ የህክምና የላቀ ደረጃ መለኪያ መሆን",
                text: "ለልዩ እና ለድንገተኛ ህክምና በኢትዮጵያ ውስጥ እጅግ የታመነ ሆስፒታል መሆን፣ እንዲሁም በምስራቅ አፍሪካ በክሊኒካዊ ፈጠራ፣ በደህንነት እና በታካሚ ውጤቶች እውቅና ማግኘት።",
              },
            },
            values: [
              {
                icon: "Heart",
                label: "ርህራሄ",
                description: "እያንዳንዱን ታካሚ እና የቤተሰብ አባል በእውነተኛ ሰብአዊ ደግነት፣ እንክብካቤና አክብሮት ማስተናገድ።",
              },
              {
                icon: "Award",
                label: "የላቀ ጥራት",
                description: "በሁሉም ክፍሎቻችንና አገልግሎቶቻችን ከፍተኛውን ክሊኒካዊና የአሰራር ደረጃ መከተል።",
              },
              {
                icon: "ShieldCheck",
                label: "ታማኝነት",
                description: "በእያንዳንዱ ግንኙነት የህክምና ምስጢራዊነትን፣ ሙያዊ ስነ-ምግባርን እና ሙሉ ታማኝነትን መጠበቅ።",
              },
              {
                icon: "Users",
                label: "ትብብር",
                description: "የተቀናጀና የተሟላ ምርመራና ህክምና ለመስጠት በጋራ በቡድን መስራት።",
              },
              {
                icon: "HeartHandshake",
                label: "አክብሮት",
                description: "በሁሉም የህክምና ደረጃ የታካሚዎችን ክብር፣ ባህላዊ ልዩነትና የግል ምርጫዎች ማክበር።",
              },
              {
                icon: "UserCheck",
                label: "ደህንነት",
                description: "ጥብቅ የኢንፌክሽን መከላከያ፣ የንጽህና ፕሮቶኮሎችና ቀጣይነት ያለው የታካሚ ደህንነት ክትትል ማረጋገጥ።",
              },
            ],
            leadership: [
              {
                name: "ዶ/ር ዳዊት ኃይሌ",
                position: "የሆስፒታሉ ዳይሬክተር እና ሲኒየር ካርዲዮሎጂስት",
                photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
                photoAlt: "ዶ/ር ዳዊት ኃይሌ — የሆስፒታሉ ዳይሬክተር",
              },
              {
                name: "ዶ/ር ሄለን ታደሰ",
                position: "የህክምና ዳይሬክተር እና ዋና ኒውሮሎጂስት",
                photo: "https://images.unsplash.com/photo-1594824813520-a7d57f12e2c5?auto=format&fit=crop&w=800&q=80",
                photoAlt: "ዶ/ር ሄለን ታደሰ — የህክምና ዳይሬክተር",
              },
              {
                name: "ዶ/ር ሰናይት በቀለ",
                position: "የእናትና ፅንስ ህክምና ክፍል ኃላፊ",
                photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
                photoAlt: "ዶ/ር ሰናይት በቀለ — የእናትና ፅንስ ክፍል ኃላፊ",
              },
              {
                name: "ዶ/ር ዮናስ ሙሉጌታ",
                position: "የቀዶ ህክምና እና የአደጋ ጉዳት ዋና ኃላፊ",
                photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
                photoAlt: "ዶ/ር ዮናስ ሙሉጌታ — የቀዶ ህክምና ኃላፊ",
              },
            ],
            environment: {
              eyebrow: "ፈዋሽ የሆስፒታል ድባብ",
              title: "ለምቾት፣ ለማገገምና ለደህንነት የተገነቡ መሰረተ ልማቶች",
              description: "የሆስፒታላችን ግቢ ታካሚዎች በፍጥነት እንዲያገግሙና ቤተሰቦች እንዲጽናኑ ዘመናዊ የህክምና ክፍሎችን ከምቹ ስነ-ህንፃ ጋር አቀናጅቶ ይዟል።",
              featured: {
                name: "የተኝቶ ህክምና ህንፃ",
                category: "የተኝቶ ህክምና ክፍሎች",
                image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
                imageAlt: "ምቹና ሰፊ የግል የተኝቶ ህክምና ክፍል",
              },
              supporting: [
                {
                  name: "የቀዶ ህክምና አዳራሾች",
                  category: "የቀዶ ህክምና ክፍሎች",
                  image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80",
                  imageAlt: "ዘመናዊ የቀዶ ህክምና አዳራሽ",
                },
                {
                  name: "የምርመራና ላቦራቶሪ ህንፃ",
                  category: "ራዲዮሎጂና ላቦራቶሪ",
                  image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
                  imageAlt: "ዲጂታል ሲቲ ስካን እና ላቦራቶሪ",
                },
                {
                  name: "የተመላላሽ ታካሚ ክሊኒክ",
                  category: "የምክክር ክፍሎች",
                  image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
                  imageAlt: "የተመላላሽ ታካሚዎች ምክክር ክፍል",
                },
              ],
            },
            accreditations: [
              {
                name: "የኢትዮጵያ ጤና ጥበቃ ሚኒስቴር እውቅና",
                issuer: "የፌዴራል ጤና ጥበቃ ሚኒስቴር",
              },
              {
                name: "የISO 9001:2015 የጥራት አስተዳደር ስርዓት",
                issuer: "ዓለም አቀፍ የደረጃዎች ድርጅት",
              },
            ],
            finalCta: {
              title: "ሩህሩህና ከፍተኛ ጥራት ያለው የህክምና አገልግሎት ያግኙ",
              description: "መደበኛ የጤና ምርመራ፣ የስፔሻሊስት ምክክር ወይም የድንገተኛ ህክምና ቢፈልጉ የህክምና ቡድናችን 24/7 እርስዎን ለማገልገል ዝግጁ ነው።",
              ctaLabel: "ዛሬውኑ ያግኙን",
              ctaHref: "/contact",
            },
          }),
        },
        om: {
          title: "Waa'ee Hospitaala Medhen Beza",
          excerpt: "Dandeettii kilinikaalaa olaanaa, dandamannaa dhukkubsattootaafi yaala ammayyaaf Adaamaafi naannoo isaatti kan dhaabbate.",
          content: JSON.stringify({
            hero: {
              title: "Waa'ee Hospitaala Medhen Beza",
              supportingText: "Dandeettii kilinikaalaa olaanaa, dandamannaa dhukkubsattootaafi yaala ammayyaaf Adaamaafi naannoo isaatti kan dhaabbate.",
              image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80",
              imageAlt: "Gamoo Hospitaala Medhen Beza Adaamaa",
            },
            introduction: {
              eyebrow: "Seenaa fi Kaayyoo Keenya",
              title: "Dhaabbata yaala ammayyaa amantummaa, ogeessotaafi garaa laafummaa irratti ijaarame",
              paragraphs: [
                "Hospitaalli Medhen Beza kaayyoo tokkoon hundeeffame: dhukkubsattootaafi maatiiwwan Adaamaafi guutuu Itoophiyaa jiraniif tajaajila yaala addaa sadarkaa addunyaa dhiheessuudhaaf.",
                "Sakatta'iinsa idilee irraa hanga yaala baqaqsanii yaaluu walxaxaa ta'etti, hospitaalli keenya dhukkubsataan hundi kabaja, of eeggannoofi deeggarsa garaa laafummaa akka argatu sa'aatii 24 hojjeta.",
                "Garee yaalaa keenya, ulaagaalee nageenya yaala idil-addunyaafi teknooloojiiwwan qorannoo ammayyaa irratti yeroo hunda invast goona.",
              ],
              photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=80",
              photoAlt: "Garee hooggana yaala Hospitaala Medhen Beza",
              ctaLabel: "Nu Qunnamaa",
              ctaHref: "/contact",
            },
            missionVision: {
              mission: {
                eyebrow: "Ergama Keenya",
                title: "Yaala sadarkaa olaanaafi garaa laafummaa qabu dhukkubsataa hundaaf",
                text: "Tajaajila yaala dhukkubsattoota irratti xiyyeeffate, sadarkaa olaanaa qabu, nama hundaaf kabajaafi amantummaadhaan dhiheessuu.",
              },
              vision: {
                eyebrow: "Mul'ata Keenya",
                title: "Itoophiyaa keessatti madaallii yaala olaanaa ta'uu",
                text: "Itoophiyaa keessatti yaala addaafi balaa tasaatiif hospitaala caalaatti amanamaa ta'uufi Baha Afrikaa keessatti beekamtii argachuu.",
              },
            },
            values: [
              {
                icon: "Heart",
                label: "Garaa Laafummaa",
                description: "Dhukkubsataa fi maatii hunda jaalala, ho'inaafi gaarummaa dhugaatiin keessummeessuu.",
              },
              {
                icon: "Award",
                label: "Qulqullina Olaanaa",
                description: "Tajaajilootaafi kutaalee keenya hunda keessatti sadarkaa kilinikaalaa ol'aanaa hordofuu.",
              },
              {
                icon: "ShieldCheck",
                label: "Amanamummaa",
                description: "Qunnamtii hunda keessatti iccitii yaalaa, naamusa ogeessaafi amanamummaa guutuu eeguu.",
              },
              {
                icon: "Users",
                label: "Gamtaa",
                description: "Qorannoo fi yaala qindaa'aa kennuuf garee ogeeyyii adda addaatiin waliin hojjechuu.",
              },
              {
                icon: "HeartHandshake",
                label: "Kabaja",
                description: "Sadarkaa yaalaa hundatti ulfina dhukkubsataa, addaddummaa aadaafi filannoo dhuunfaa kabajuu.",
              },
              {
                icon: "UserCheck",
                label: "Nageenya",
                description: "To'annoo daddarbinsa dhibee, qulqullina meeshaaleefi hordoffii nageenya dhukkubsataa walirraa hin cinne mirkaneessuu.",
              },
            ],
            leadership: [
              {
                name: "Dr. Daawwit Hayilee",
                position: "Daayireektara Hospitaalaafi Ogeessa Onnee Olaanaa",
                photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
                photoAlt: "Dr. Daawwit Hayilee — Daayireektara Hospitaalaa",
              },
              {
                name: "Dr. Heelana Taaddasaa",
                position: "Daayireektara Yaalaafi Ogeettii Narvii Olaantuu",
                photo: "https://images.unsplash.com/photo-1594824813520-a7d57f12e2c5?auto=format&fit=crop&w=800&q=80",
                photoAlt: "Dr. Heelana Taaddasaa — Daayireektara Yaalaa",
              },
              {
                name: "Dr. Saanaayit Baqqalaa",
                position: "Hoogganntuu Yaala Haadhaafi Daa'ima Garaa Keessaa",
                photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
                photoAlt: "Dr. Saanaayit Baqqalaa — Hoogganntuu Yaala Haadholii",
              },
              {
                name: "Dr. Yoonaas Mulugetaa",
                position: "Hoogggana Yaala Baqaqsanii Yaaluufi Balaa Tasaa",
                photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
                photoAlt: "Dr. Yoonaas Mulugetaa — Hoogggana Yaala Baqaqsanii",
              },
            ],
            environment: {
              eyebrow: "Naannoo Fayyinaa Mijataa",
              title: "Bu'uuraalee Boqonnaa, Dandamannaafi Nageenyaaf Qophaa'an",
              description: "Mooraan hospitaala keenyaa saffisaan fayyuu dhukkubsattootaafi boqonnaa maatiitiif kutaalee yaalaa ammayyaa wajjin qindaa'ee ijaarame.",
              featured: {
                name: "Gamoo Ciisicha Dhukkubsattootaa",
                category: "Kutaalee Ciisichaa",
                image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
                imageAlt: "Kutaa ciisichaa dhuunfaa bal'aa",
              },
              supporting: [
                {
                  name: "Manneen Yaala Baqaqsanii",
                  category: "Kutaalee Baqaqsanii Yaaluu",
                  image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80",
                  imageAlt: "Kutaa baqaqsanii yaaluu",
                },
                {
                  name: "Tawarii Qorannoofi Laaboraatorii",
                  category: "Raadiyooloojiifi Laaboraatorii",
                  image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
                  imageAlt: "Wiirtuu qorannoo",
                },
                {
                  name: "Kilinika Deddeebi'anii Yaalaman",
                  category: "Kutaalee Gorsaa",
                  image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
                  imageAlt: "Kilinika gorsaa",
                },
              ],
            },
            accreditations: [
              {
                name: "Beekamtii Ministeera Fayyaa Itoophiyaa",
                issuer: "Ministeera Fayyaa Federaalaa",
              },
              {
                name: "Sirna Hoggansa Qulqullinaa ISO 9001:2015",
                issuer: "Dhaabbata Sadarkaa Idil-Addunyaa",
              },
            ],
            finalCta: {
              title: "Tajaajila Yaala Sadarkaa Olaanaafi Garaa Laafummaa Argadhaa",
              description: "Sakatta'iinsa fayyaa idilee, gorsa ogeessa addaa ykn yaala balaa tasaa yoo barbaaddan, gareen keenya 24/7 isin tajaajiluuf qophiidha.",
              ctaLabel: "Har'uma Nu Qunnamaa",
              ctaHref: "/contact",
            },
          }),
        },
      },
    },
    {
      title: "Emergency Medical Services",
      slug: "emergency",
      excerpt: "Immediate emergency care and rapid trauma response available 24 hours a day, 365 days a year.",
      content: "Full-service emergency and trauma care center equipped with rapid resuscitation suites, acute cardiac monitoring, and direct ambulance access.",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
      translations: {
        am: {
          title: "የድንገተኛ ህክምና አገልግሎቶች",
          excerpt: "ቀን ከሌት 24 ሰዓት፣ በዓመት 365 ቀናት የሚሰጥ አፋጣኝ የድንገተኛ ህክምናና የጉዳት ማስታገሻ።",
          content: "የፈጣን ህይወት ማዳኛ ክፍሎች፣ የልብና የደም ዝውውር ክትትል እና የቀጥታ አምቡላንስ መዳረሻ ያለው የተሟላ የድንገተኛ እና የጉዳት ህክምና ማዕከል።",
        },
        om: {
          title: "Tajaajila Yaala Balaa Tasaa",
          excerpt: "Yaala balaa tasaa hatattamaafi deebii saffisaa guyyatti sa'aatii 24, waggaatti guyyoota 365 banaa ta'e.",
          content: "Wiirtuu yaala balaa tasaa guutuu kutaalee dandamannaa saffisaa, to'annoo onneefi karaa ambaalaansii kallattii qabu.",
        },
      },
    },
    {
      title: "Privacy Policy",
      slug: "privacy",
      excerpt: "Patient data confidentiality, health record protection, and digital privacy policy.",
      content: "Medhen Beza Hospital maintains strict patient data confidentiality in accordance with medical ethics and applicable legal standards in Ethiopia.",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
      translations: {
        am: {
          title: "የግላዊነት ፖሊሲ",
          excerpt: "የታካሚ መረጃ ምስጢራዊነት፣ የጤና መዝገብ ጥበቃ እና የዲጂታል ግላዊነት ፖሊሲ።",
          content: "መድህን ቤዛ ሆስፒታል በህክምና ስነ-ምግባርና በኢትዮጵያ ህጎች መሰረት የታካሚዎችን የህክምና መረጃዎች ሚስጥራዊነት በጥብቅ ይጠብቃል።",
        },
        om: {
          title: "Iggita Iccitii",
          excerpt: "Iccitii ragaa dhukkubsataa, eegumsa galmee fayyaafi imaammata iccitii dijiitaalaa.",
          content: "Hospitaalli Medhen Beza akka heera yaalaafi seera Itoophiyaatti iccitii ragaa dhukkubsattootaa cimsee eega.",
        },
      },
    },
    {
      title: "Terms of Service",
      slug: "terms",
      excerpt: "Terms governing use of hospital website and appointment booking services.",
      content: "By accessing the Medhen Beza Hospital portal, visitors and patients agree to comply with our institutional policies and digital communication guidelines.",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
      translations: {
        am: {
          title: "የአገልግሎት ውሎችና ደንቦች",
          excerpt: "የሆስፒታሉን ድረ-ገጽ እና የቀጠሮ መያዣ አገልግሎቶችን አጠቃቀም የሚመለከቱ ደንቦች።",
          content: "የመድህን ቤዛ ሆስፒታልን ፖርታል በመጠቀም፣ ጎብኚዎችና ታካሚዎች የተቋማችንን ፖሊሲዎችና የዲጂታል መመሪያዎች ለማክበር ይስማማሉ።",
        },
        om: {
          title: "Waliigaltee Tajaajilaa",
          excerpt: "Ulaagaalee weebsaayitii hospitaalaafi tajaajila beellama qabachuu to'atan.",
          content: "Poortaalii Hospitaala Medhen Beza fayyadamuudhaan, maamiltoonni imaammata dhaabbatichaa kabajuuf walii galu.",
        },
      },
    },
  ];

  for (const p of pagesData) {
    await prisma.page.create({ data: p });
  }
  console.log(`✅ Seeded ${pagesData.length} CMS published pages with multilingual data.`);

  console.log("🎉 Database seeding with English, Amharic, and Afan Oromo completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
