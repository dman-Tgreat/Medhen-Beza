// ─── Hospital Identity ────────────────────────────────────────────────────────
export const HOSPITAL_INFO = {
  name: "Medhen Beza Hospital",
  shortName: "Medhen Beza",
  tagline: "Compassionate Care, Advanced Medicine, Exceptional Service",
  description:
    "Medhen Beza Hospital is a leading multi-specialty hospital in Adama, " +
    "providing world-class healthcare with cutting-edge technology and compassionate clinical teams.",
  emergencyPhone: "+251 911 000 999",
  generalPhone: "+251 116 000 111",
  phone: "+251 116 000 111",
  email: "info@medhenbeza.com",
  city: "Adama",
  country: "Ethiopia",
  location: "Adama, Ethiopia",
  address: "H73F+R49, Adama, Ethiopia",
  plusCode: "H73F+R49, Adama",
  hours: "24/7 Emergency & Inpatient Services",
};

// ─── Public Site Navigation ───────────────────────────────────────────────────

/** Items shown directly in the desktop nav bar */
export const PRIMARY_NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Departments", href: "/departments" },
  { name: "Doctors", href: "/doctors" },
] as const;

/** Items hidden behind the "More" dropdown on desktop */
export const MORE_NAV_LINKS = [
  { name: "Facilities", href: "/facilities" },
  { name: "News & Blog", href: "/news" },
  { name: "Gallery", href: "/gallery" },
  { name: "Events", href: "/events" },
  { name: "Careers", href: "/careers" },
  { name: "FAQs", href: "/faqs" },
] as const;

/** Contact stands on its own — shown after More on desktop */
export const CONTACT_NAV_LINK = { name: "Contact", href: "/contact" } as const;

/**
 * Complete flattened list for mobile nav — primary nav + more items + contact,
 * in the order they should appear in the mobile drawer.
 */
export const MOBILE_NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Departments", href: "/departments" },
  { name: "Doctors", href: "/doctors" },
  { name: "Facilities", href: "/facilities" },
  { name: "News & Blog", href: "/news" },
  { name: "Gallery", href: "/gallery" },
  { name: "Events", href: "/events" },
  { name: "Careers", href: "/careers" },
  { name: "FAQs", href: "/faqs" },
  { name: "Contact", href: "/contact" },
] as const;

// ─── Footer Link Groups ───────────────────────────────────────────────────────

export const FOOTER_QUICK_LINKS = [
  { name: "About Us", href: "/about" },
  { name: "Find a Doctor", href: "/doctors" },
  { name: "Our Services", href: "/services" },
  { name: "Contact Us", href: "/contact" },
] as const;

export const FOOTER_HOSPITAL_LINKS = [
  { name: "Departments", href: "/departments" },
  { name: "Facilities", href: "/facilities" },
  { name: "Careers", href: "/careers" },
  { name: "News & Blog", href: "/news" },
  { name: "FAQs", href: "/faqs" },
] as const;

// ─── Admin Navigation ─────────────────────────────────────────────────────────
export const ADMIN_NAV_LINKS = [
  { name: "Dashboard", href: "/admin" },
  { name: "Appointments", href: "/admin/appointments" },
  { name: "Doctors", href: "/admin/doctors" },
  { name: "Services", href: "/admin/services" },
  { name: "News & Announcements", href: "/admin/news" },
  { name: "Settings", href: "/admin/settings" },
] as const;

// ─── Legacy alias (kept so existing imports don't break) ──────────────────────
/** @deprecated Use PRIMARY_NAV_LINKS or MOBILE_NAV_LINKS */
export const NAV_LINKS = MOBILE_NAV_LINKS;
