import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminPlaceholderPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800/80 border border-slate-700 rounded-2xl p-8 space-y-6 text-center shadow-xl backdrop-blur-sm">
        <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <Badge variant="outline" className="border-teal-500/30 text-teal-400">
            Reserved Route
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight">CMS & Admin Portal</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            The administrative area folder structure (`app/admin`) is reserved for future CMS features, doctor schedules, and appointment management.
          </p>
        </div>
        <Link href="/" className="block w-full">
          <Button variant="secondary" className="w-full bg-teal-600 hover:bg-teal-500 text-white border-0">
            Return to Public Website
          </Button>
        </Link>
      </div>
    </div>
  );
}
