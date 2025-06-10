// src/components/appointments/appointment-card.tsx

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
  showPatientName?: boolean;
  onCancel?: () => void;
}

export function AppointmentCard({
  appointment,
  showStatus = false,
  showPatientName = false,
  onCancel
}: AppointmentCardProps) {
  // Desestruture serviceAvailableAt
  const {
    caregiver,
    senior,
    status,
    notes,
    patientName,
    patientAge,
    address,
    serviceTitle,
    serviceDescription,
    serviceHourlyRate,
    serviceLocation,
    serviceAvailableAt // <-- Use este aqui!
  } = appointment;

  // Formate serviceAvailableAt para o cabeçalho
  const formattedAppointmentDateTime = serviceAvailableAt 
    ? format(parseISO(serviceAvailableAt), "PPP 'às' HH:mm", { locale: ptBR }) 
    : "Data e Hora Indisponíveis"; // Mensagem de fallback

  const getStatusBadge = () => {
    switch(status) {
      case "agendado": return <Badge className="bg-amber-400 hover:bg-amber-500">Agendado</Badge>;
      case "concluido": return <Badge className="bg-green-500 hover:bg-green-600">Concluído</Badge>;
      case "cancelado": return <Badge className="bg-red-500 hover:bg-red-600">Cancelado</Badge>;
      default: return null;
    }
  };

  return (
    <Card className="bg-white hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between pb-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{showPatientName ? patientName : caregiver?.user?.name}</CardTitle>
            {showStatus && getStatusBadge()}
          </div>
          <CardDescription className="text-sm">
            {formattedAppointmentDateTime} {/* <-- Use a data/hora formatada da oferta */}
          </CardDescription>
        </div>
        
        {!showStatus && status === "agendado" && (
          <div className="mt-4 md:mt-0 flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">Cancelar</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Cancelar Agendamento</DialogTitle>
                  <DialogDescription>
                    Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button type="button" variant="outline">Voltar</Button>
                  <Button type="button" variant="destructive" onClick={onCancel}>Confirmar Cancelamento</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm">Detalhes</Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-col text-sm text-gray-600 space-y-2">
          {serviceTitle && (
            <p><span className="font-medium">Serviço:</span> {serviceTitle}</p>
          )}
          {serviceDescription && (
            <p><span className="font-medium">Descrição:</span> {serviceDescription}</p>
          )}
          {serviceLocation && (
            <p><span className="font-medium">Local do Serviço:</span> {serviceLocation}</p>
          )}
          {serviceHourlyRate !== undefined && (
            <p><span className="font-medium">Valor por Hora:</span> R$ {serviceHourlyRate.toFixed(2).replace(".", ",")}</p>
          )}
          {/* serviceAvailableAt já está sendo usado no cabeçalho, pode ser removido daqui se quiser evitar duplicidade */}
          {/* {serviceAvailableAt && (
             <p><span className="font-medium">Disponibilidade Original:</span> {formattedServiceAvailableAt}</p>
           )} 
          */}

          {showPatientName && (
            <>
              <p><span className="font-medium">Paciente:</span> {patientName}</p>
              <p><span className="font-medium">Idade do Paciente:</span> {patientAge}</p>
              <p><span className="font-medium">Endereço do Atendimento:</span> {address}</p>
            </>
          )}

          {notes && (
            <p><span className="font-medium">Observações:</span> {notes}</p>
          )}
        </div>
        
        {showStatus && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm">Ver Detalhes</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}