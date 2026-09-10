import Link from "next/link";
import { HeartPulse, Phone, Mail, MapPin } from "lucide-react";
import { HOSPITAL_INFO } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-white">Medhen Beza Hospital</span>
          </div>
          <p className="text-sm text-slate-400">
            {HOSPITAL_INFO.tagline}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#services" className="hover:text-teal-400">Services & Departments</Link></li>
            <li><Link href="#doctors" className="hover:text-teal-400">Medical Specialists</Link></li>
            <li><Link href="#appointments" className="hover:text-teal-400">Patient Appointments</Link></li>
            <li><Link href="/admin" className="hover:text-teal-400 text-slate-400">Admin Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Emergency Care</h4>
          <p className="text-sm text-slate-400 mb-2">24/7 Rapid Emergency Response & Intensive Care Unit</p>
          <div className="text-teal-400 font-bold text-base flex items-center gap-2">
            <Phone className="w-4 h-4" /> {HOSPITAL_INFO.emergencyPhone}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Contact Information</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-teal-400" /> {HOSPITAL_INFO.location}</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-teal-400" /> {HOSPITAL_INFO.generalPhone}</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-teal-400" /> {HOSPITAL_INFO.email}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {HOSPITAL_INFO.name}. All rights reserved.
      </div>
    </footer>
  );
}
