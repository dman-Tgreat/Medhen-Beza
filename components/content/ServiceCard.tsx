import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, Stethoscope } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  category?: string;
}

export function ServiceCard({ title, description, category }: ServiceCardProps) {
  return (
    <Card className="group hover:border-teal-300 transition-all duration-300">
      <CardHeader>
        <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-2 group-hover:bg-teal-700 group-hover:text-white transition-colors">
          <Stethoscope className="w-6 h-6" />
        </div>
        {category && <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">{category}</span>}
        <CardTitle className="group-hover:text-teal-700 transition-colors">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription>{description}</CardDescription>
        <div className="flex items-center gap-1 text-xs font-semibold text-teal-700 group-hover:translate-x-1 transition-transform cursor-pointer">
          Learn More <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </CardContent>
    </Card>
  );
}
