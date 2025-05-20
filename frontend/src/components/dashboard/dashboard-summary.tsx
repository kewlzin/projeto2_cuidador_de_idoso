
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckSquare, Clock } from "lucide-react";

interface DashboardSummaryProps {
  totalAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
}

export function DashboardSummary({ 
  totalAppointments, 
  upcomingAppointments, 
  completedAppointments 
}: DashboardSummaryProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Informações Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-brand-blue" />
              <span className="text-sm">Total de Agendamentos:</span>
              <span className="ml-auto font-medium">{totalAppointments}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-amber-500" />
              <span className="text-sm">Agendamentos Futuros:</span>
              <span className="ml-auto font-medium">{upcomingAppointments}</span>
            </div>
            
            <div className="flex items-center">
              <CheckSquare className="h-5 w-5 mr-2 text-green-600" />
              <span className="text-sm">Visitas Concluídas:</span>
              <span className="ml-auto font-medium">{completedAppointments}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <a 
            href="/caregivers" 
            className="block text-sm text-brand-blue hover:underline"
          >
            Buscar Cuidadores
          </a>
          <a 
            href="#" 
            className="block text-sm text-brand-blue hover:underline"
          >
            Editar Perfil
          </a>
          <a 
            href="#" 
            className="block text-sm text-brand-blue hover:underline"
          >
            Suporte
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
