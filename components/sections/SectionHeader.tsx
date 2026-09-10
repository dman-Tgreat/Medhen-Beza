import { Badge } from "@/components/ui/badge";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export function SectionHeader({
  badge,
  title,
  description,
  centered = true,
}: SectionHeaderProps) {
  return (
    <div className={`space-y-3 ${centered ? "text-center max-w-2xl mx-auto" : ""}`}>
      {badge && <Badge variant="default">{badge}</Badge>}
      <h2 className="text-3xl font-extrabold tracking-tight text-teal-950 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="text-base text-slate-600 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
