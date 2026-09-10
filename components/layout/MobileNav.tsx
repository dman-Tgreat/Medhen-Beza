import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";

export function MobileNav() {
  return (
    <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-3">
      <nav className="flex flex-col gap-2">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-sm font-medium text-slate-700 hover:text-teal-700 py-1"
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
