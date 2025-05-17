
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Appointment } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AppointmentCardProps {
  appointment: Appointment;
  showStatus?: boolean;
  onCancel?: () => void;
}

export function AppointmentCard({ 
  appointment, 
  showStatus = false,
  onCancel 
}: AppointmentCardProps) {
  const { caregiver, date, time, status, notes } = appointment;
  
  const formattedDate = date ? format(parseISO(date), "PPP", { locale: ptBR }) : "";
  
  const getStatusBadge = () => {
    switch(status) {
      case "agendado":
        return <Badge className="bg-amber-400 hover:bg-amber-500">Agendado</Badge>;
      case "concluido":
        return <Badge className="bg-green-500 hover:bg-green-600">Concluído</Badge>;
      case "cancelado":
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelado</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Card className="bg-white hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between pb-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{caregiver?.user?.name}</CardTitle>
            {showStatus && getStatusBadge()}
          </div>
          <CardDescription className="text-sm">
            {formattedDate} às {time}
          </CardDescription>
        </div>
        
        {!showStatus && status === "agendado" && (
          <div className="mt-4 md:mt-0 flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Cancelar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Cancelar Agendamento</DialogTitle>
                  <DialogDescription>
                    Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button type="button" variant="outline">
                    Voltar
                  </Button>
                  <Button type="button" variant="destructive" onClick={onCancel}>
                    Confirmar Cancelamento
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" size="sm">
              Detalhes
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center text-sm text-gray-600">
          <div className="flex-1">
            <p>
              <span className="font-medium">Especialidade:</span> Cuidados Gerais
            </p>
            {notes && (
              <p className="mt-2">
                <span className="font-medium">Observações:</span> {notes}
              </p>
            )}
          </div>
          
          {showStatus && (
            <div className="mt-4 md:mt-0 md:ml-4 flex gap-2">
              <Button variant="outline" size="sm">
                Ver Detalhes
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
