import Link from "next/link";
import { HeartPulse, Phone, Mail, MapPin, Clock } from "lucide-react";
import { HOSPITAL_INFO, FOOTER_QUICK_LINKS, FOOTER_HOSPITAL_LINKS } from "@/lib/constants";
import { EmergencyButton } from "@/components/ui/emergency-button";
import type { SupportedLocale } from "@/lib/i18n/config";
import type { PublicSiteSettings } from "@/lib/queries/public";

// ─── Footer Logo ──────────────────────────────────────────────────────────────
function FooterLogo({
  hospitalName = "Medhen Beza Hospital",
  locale = "en",
}: {
  hospitalName?: string;
  locale?: string;
}) {
  const hasHospital = hospitalName.toLowerCase().includes("hospital");
  const mainName = hasHospital
    ? hospitalName.replace(/hospital/i, "").trim()
    : hospitalName;

  return (
    <Link href={`/${locale}`} className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shrink-0">
        <HeartPulse className="w-5 h-5" aria-hidden />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-bold text-base text-white">{mainName || hospitalName}</span>
        <span className="text-[10px] font-semibold text-primary-light tracking-[0.12em] uppercase">
          {hasHospital ? "Hospital" : "Medical Care"}
        </span>
      </div>
    </Link>
  );
}

// ─── Column heading ───────────────────────────────────────────────────────────
function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
      {children}
    </h3>
  );
}

// ─── Footer link list ─────────────────────────────────────────────────────────
function FooterLinkList({
  links,
  locale = "en",
}: {
  links: ReadonlyArray<{ name: string; href: string }>;
  locale?: string;
}) {
  return (
    <ul className="flex flex-col gap-2.5">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={`/${locale}${link.href}`}
            className="text-sm text-slate-400 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-sm"
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// ─── Contact row ──────────────────────────────────────────────────────────────
function ContactRow({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 text-sm text-slate-400">
      <Icon className="w-4 h-4 text-primary-light shrink-0 mt-0.5" aria-hidden />
      <span>{children}</span>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
export function Footer({
  settings,
  currentLocale = "en",
}: {
  settings?: PublicSiteSettings;
  currentLocale?: SupportedLocale;
}) {
  const year = new Date().getFullYear();
  const hospitalName = settings?.hospitalName || HOSPITAL_INFO.name;
  const description = settings?.description || HOSPITAL_INFO.description;
  const address = settings?.address || HOSPITAL_INFO.address;
  const generalPhone = settings?.generalPhone || HOSPITAL_INFO.generalPhone;
  const email = settings?.email || HOSPITAL_INFO.email;
  const hours = settings?.hours || HOSPITAL_INFO.hours;
  const emergencyPhone = settings?.emergencyPhone || HOSPITAL_INFO.emergencyPhone;

  const headings = {
    quickLinks:
      currentLocale === "am"
        ? "ፈጣን ማገናኛዎች"
        : currentLocale === "om"
        ? "Geessituu Saffisaa"
        : "Quick Links",
    hospital:
      currentLocale === "am"
        ? "ስለ ሆስፒታሉ"
        : currentLocale === "om"
        ? "Waa'ee Hospitaalaa"
        : "Hospital",
    contact:
      currentLocale === "am"
        ? "አድራሻ እና ስልክ"
        : currentLocale === "om"
        ? "Qunnamtii"
        : "Contact",
    emergency:
      currentLocale === "am"
        ? "የድንገተኛ ህክምና"
        : currentLocale === "om"
        ? "Balaa Tasaa"
        : "Emergency",
    emergencyText:
      currentLocale === "am"
        ? "የ24 ሰዓት የድንገተኛ ህክምና ክፍላችን ዘወትር ክፍት ነው። በማንኛውም ሰዓት ይደውሉ ወይም ይምጡ።"
        : currentLocale === "om"
        ? "Gareen yaala tasaa keenya sa'aatii 24 qophiidha. Bilbilaa ykn kottaa — isiniif jirra."
        : "Our 24/7 emergency team is always ready. Call or come in — we're here.",
    rights:
      currentLocale === "am"
        ? "መብቱ በህግ የተጠበቀ ነው።"
        : currentLocale === "om"
        ? "Mirgi qophaa'aa dha."
        : "All rights reserved.",
  };

  return (
    <footer className="bg-slate-900 text-slate-300" aria-label="Site footer">
      {/* Main footer grid */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Col 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <FooterLogo hospitalName={hospitalName} locale={currentLocale} />
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              {description}
            </p>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <ColHeading>{headings.quickLinks}</ColHeading>
            <FooterLinkList links={FOOTER_QUICK_LINKS} locale={currentLocale} />
          </div>

          {/* Col 3 — Hospital */}
          <div>
            <ColHeading>{headings.hospital}</ColHeading>
            <FooterLinkList links={FOOTER_HOSPITAL_LINKS} locale={currentLocale} />
          </div>

          {/* Col 4 — Contact */}
          <div>
            <ColHeading>{headings.contact}</ColHeading>
            <div className="flex flex-col gap-3">
              <ContactRow icon={MapPin}>{address}</ContactRow>
              <ContactRow icon={Phone}>
                <a
                  href={`tel:${generalPhone.replace(/\s/g, "")}`}
                  className="hover:text-white transition-colors"
                >
                  {generalPhone}
                </a>
              </ContactRow>
              <ContactRow icon={Mail}>
                <a
                  href={`mailto:${email}`}
                  className="hover:text-white transition-colors"
                >
                  {email}
                </a>
              </ContactRow>
              <ContactRow icon={Clock}>{hours}</ContactRow>
            </div>
          </div>

          {/* Col 5 — Emergency CTA */}
          <div>
            <ColHeading>{headings.emergency}</ColHeading>
            <div className="bg-emergency/10 border border-emergency/20 rounded-xl p-4 space-y-3">
              <p className="text-sm text-slate-300 leading-snug">
                {headings.emergencyText}
              </p>
              <EmergencyButton
                phone={emergencyPhone}
                className="w-full justify-center"
                size="default"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-800">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>© {year} {hospitalName}. {headings.rights}</span>
          <div className="flex items-center gap-4">
            <Link
              href={`/${currentLocale}/privacy`}
              className="hover:text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href={`/${currentLocale}/terms`}
              className="hover:text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
