// src/components/appointments/appointment-form.tsx

import React, { useState } from "react";
// Imports relacionados à data e hora foram removidos
// import { format } from "date-fns";
// import { ptBR } from "date-fns/locale";
// import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { CaregiverProfile } from "@/types"; // Não é mais necessário aqui
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Mantenha o import do Button para o submit

// Definindo a interface para os dados que o formulário irá submeter
interface AppointmentFormFields {
  patientName: string;
  patientAge: string;
  address: string;
  notes: string;
}

interface AppointmentFormProps {
  // A prop 'caregiver' não é mais necessária, o id do cuidador e o horário
  // virão da ServiceOffer na página pai (ScheduleAppointment.tsx)
  onSubmit: (data: AppointmentFormFields) => void; // Tipagem mais específica
}

export function AppointmentForm({ onSubmit }: AppointmentFormProps) { // Remove 'caregiver' das props
  // Removemos os estados de data e hora
  // const [date, setDate] = useState<Date | undefined>(undefined);
  // const [time, setTime] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");
  const [patientAge, setPatientAge] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // As validações de data e hora foram removidas
    if (!patientName) newErrors.patientName = "O nome do paciente é obrigatório";
    if (!patientAge) newErrors.patientAge = "A idade do paciente é obrigatória";
    if (!address) newErrors.address = "O endereço é obrigatório";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // onSubmit agora recebe apenas os dados do paciente.
    // caregiverId, date e time são tratados na página pai (ScheduleAppointment.tsx)
    onSubmit({
      patientName,
      patientAge,
      address,
      notes
    });
  };

  return (
    <Card className="bg-white shadow">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* REMOVIDO: Bloco de seleção de data e horário */}
          {/*
          <div>
            <h3 className="text-lg font-medium mb-4">Selecione a data e horário</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Data da Visita</Label>
                <div className="border rounded">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={ptBR}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const thirtyDaysFromNow = new Date();
                      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                      return date < today || date > thirtyDaysFromNow;
                    }}
                    className="p-3 pointer-events-auto"
                  />
                </div>
                {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Horário da Visita</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {availableTimeSlots.map((slot) => (
                        <Button
                          key={slot}
                          type="button"
                          variant={time === slot ? "default" : "outline"}
                          onClick={() => setTime(slot)}
                          className="w-full"
                        >
                          {slot}
                        </Button>
                      ))}
                </div>
                {errors.time && <p className="text-sm text-red-500">{errors.time}</p>}
              </div>
            </div>
          </div>
          */}

          <div className="pt-4 border-t"> {/* Mantive o border-t, pode ajustar o estilo se quiser */}
            <h3 className="text-lg font-medium mb-4">Informações do Paciente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Nome do Paciente</Label>
                <Input
                  id="patientName"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required // Adicionar required para garantir que o campo não esteja vazio
                />
                {errors.patientName && <p className="text-sm text-red-500">{errors.patientName}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="patientAge">Idade do Paciente</Label>
                <Input
                  id="patientAge"
                  type="number"
                  min="0"
                  max="120"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  required // Adicionar required
                />
                {errors.patientAge && <p className="text-sm text-red-500">{errors.patientAge}</p>}
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <Label htmlFor="address">Endereço Completo</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rua, número, complemento, bairro, cidade"
                required // Adicionar required
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>
            
            <div className="mt-4 space-y-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Informe necessidades específicas, condições de saúde relevantes, etc."
                rows={4}
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button type="submit" className="w-full md:w-auto">
              Confirmar Agendamento
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}