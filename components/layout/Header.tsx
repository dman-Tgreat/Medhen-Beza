import Link from "next/link";
import { Phone, HeartPulse, Clock } from "lucide-react";
import { HOSPITAL_INFO, NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* Top Banner */}
      <div className="bg-teal-900 text-teal-50 text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5 text-teal-300" /> Emergency: {HOSPITAL_INFO.emergencyPhone}
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-teal-200">
              <Clock className="w-3.5 h-3.5 text-teal-300" /> {HOSPITAL_INFO.hours}
            </span>
          </div>
          <div className="text-teal-200">
            {HOSPITAL_INFO.location}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md group-hover:bg-teal-700 transition-colors">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-teal-950">Medhen Beza</span>
            <span className="text-xs font-semibold text-teal-600 tracking-wider uppercase">Hospital</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-teal-700 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="default" size="sm" className="hidden sm:inline-flex">
            Book Appointment
          </Button>
        </div>
      </div>
    </header>
  );
}
