// src/components/dashboard/appointment-list.tsx

import { Appointment } from "@/types";
import { AppointmentCard } from "@/components/appointments/appointment-card"; // Importado o card
import { Dialog, DialogTrigger } from "@/components/ui/dialog"; // Mantenha se você usa esses componentes dentro da lista

interface AppointmentListProps {
  appointments: Appointment[];
  emptyMessage: string;
  showStatus?: boolean;
  showPatientName?: boolean; // Passado para o AppointmentCard
  onCancelAppointment?: (appointmentId: number) => void;
}

export function AppointmentList({
  appointments,
  emptyMessage,
  showStatus = false,
  showPatientName = false, // Garante que a prop seja passada
  onCancelAppointment,
}: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          showStatus={showStatus}
          showPatientName={showPatientName} // <-- Passando a prop para o card
          onCancel={
            onCancelAppointment
              ? () => onCancelAppointment(appointment.id)
              : undefined
          }
        />
      ))}
    </div>
  );
}