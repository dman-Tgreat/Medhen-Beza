import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ArrowRight } from "lucide-react";

interface NewsCardProps {
  title: string;
  summary: string;
  category: string;
  date: string;
}

export function NewsCard({ title, summary, category, date }: NewsCardProps) {
  return (
    <Card className="hover:border-teal-300 transition-all">
      <CardHeader>
        <div className="flex items-center justify-between gap-2 mb-1">
          <Badge variant="default">{category}</Badge>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <CalendarDays className="w-3 h-3" /> {date}
          </span>
        </div>
        <CardTitle className="text-base leading-snug">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CardDescription className="line-clamp-2">{summary}</CardDescription>
        <div className="flex items-center gap-1 text-xs font-semibold text-teal-700 cursor-pointer">
          Read Article <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </CardContent>
    </Card>
  );
}
