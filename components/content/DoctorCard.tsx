import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UserCheck, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DoctorCardProps {
  name: string;
  specialty: string;
  qualification: string;
  department: string;
}

export function DoctorCard({ name, specialty, qualification, department }: DoctorCardProps) {
  return (
    <Card className="text-center p-4">
      <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-teal-500 mx-auto flex items-center justify-center text-teal-700 my-4">
        <UserCheck className="w-10 h-10" />
      </div>
      <CardHeader className="p-2">
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription className="text-xs text-teal-600 font-semibold">{specialty}</CardDescription>
      </CardHeader>
      <CardContent className="p-2 space-y-3">
        <p className="text-xs text-slate-500">{qualification} • {department}</p>
        <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 border-teal-200 text-teal-700 hover:bg-teal-50">
          <Calendar className="w-3.5 h-3.5" /> Book Consultation
        </Button>
      </CardContent>
    </Card>
  );
}
