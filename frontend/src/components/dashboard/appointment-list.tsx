
import React from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Appointment } from "@/types";
import { AppointmentCard } from "@/components/appointments/appointment-card";
import { Card, CardContent } from "@/components/ui/card";

interface AppointmentListProps {
  appointments: Appointment[];
  showStatus?: boolean;
  emptyMessage?: string;
  onCancelAppointment?: (appointmentId: number) => void;
}

export function AppointmentList({ 
  appointments, 
  showStatus = false,
  emptyMessage = "Nenhum agendamento encontrado.",
  onCancelAppointment
}: AppointmentListProps) {
  // Sort appointments by date (most recent first)
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });

  if (appointments.length === 0) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6 text-center text-gray-500">
          {emptyMessage}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sortedAppointments.map((appointment) => (
        <AppointmentCard 
          key={appointment.id} 
          appointment={appointment}
          showStatus={showStatus}
          onCancel={
            appointment.status === "agendado" && onCancelAppointment 
              ? () => onCancelAppointment(appointment.id) 
              : undefined
          }
        />
      ))}
    </div>
  );
}
