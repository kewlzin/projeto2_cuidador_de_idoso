// src/components/dashboard/appointment-list.tsx

import React from "react";
import { Appointment } from "@/types";
import { AppointmentCard } from "@/components/appointments/appointment-card";
import { Card, CardContent } from "@/components/ui/card";

interface AppointmentListProps {
  appointments: Appointment[];
  showStatus?: boolean;
  showPatientName?: boolean;          // adicionada
  emptyMessage?: string;
  onCancelAppointment?: (appointmentId: number) => void;
}

export function AppointmentList({
  appointments,
  showStatus = false,
  showPatientName = false,           // adicionada
  emptyMessage = "Nenhum agendamento encontrado.",
  onCancelAppointment,
}: AppointmentListProps) {
  // Ordena por data (mais recente primeiro)
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
          showPatientName={showPatientName}          // repassa para o Card
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
