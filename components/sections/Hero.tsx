import { ShieldCheck, Calendar, PhoneCall, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HOSPITAL_INFO } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-white to-slate-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <Badge variant="default" className="gap-1.5 py-1 px-3 text-xs bg-teal-100 text-teal-800 border-teal-200">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Leading Healthcare Excellence
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-teal-950 leading-[1.15]">
              Medhen Beza <span className="text-teal-600">Hospital</span>
            </h1>

            <p className="text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
              {HOSPITAL_INFO.tagline}. Delivering patient-centered clinical care, 24/7 emergency response, and state-of-the-art medical technology.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button size="lg" className="gap-2 bg-teal-700 hover:bg-teal-800 text-white shadow-lg shadow-teal-900/10">
                <Calendar className="w-5 h-5" /> Book Appointment
              </Button>
              <Button size="lg" variant="outline" className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-100">
                <PhoneCall className="w-5 h-5 text-teal-600" /> Emergency Services
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200/80">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-teal-950">50+</div>
                <div className="text-xs font-medium text-slate-500">Specialized Doctors</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-teal-950">24/7</div>
                <div className="text-xs font-medium text-slate-500">Emergency & Care</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-teal-950">15+</div>
                <div className="text-xs font-medium text-slate-500">Medical Departments</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl bg-gradient-to-tr from-teal-800 to-teal-600 p-8 text-white shadow-2xl space-y-6 border border-teal-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <Award className="w-6 h-6 text-teal-200" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Hospital System Status</h3>
                  <p className="text-xs text-teal-100">App Router & Tailwind CSS Ready</p>
                </div>
              </div>

              <div className="space-y-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-teal-100">Stack Status:</span>
                  <span className="font-semibold text-emerald-300">Next.js + TypeScript</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-teal-100">UI Components:</span>
                  <span className="font-semibold text-emerald-300">shadcn/ui Initialized</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-teal-100">Database ORM:</span>
                  <span className="font-semibold text-emerald-300">Prisma (PostgreSQL)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-teal-100">Icons:</span>
                  <span className="font-semibold text-emerald-300">Lucide Icons</span>
                </div>
              </div>

              <div className="pt-2 text-center text-xs text-teal-100">
                Placeholder Homepage Running Cleanly
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
