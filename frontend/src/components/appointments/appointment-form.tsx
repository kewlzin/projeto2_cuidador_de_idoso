
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CaregiverProfile } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface AppointmentFormProps {
  caregiver: CaregiverProfile;
  onSubmit: (data: any) => void;
}

// Mock data for available time slots
const availableTimeSlots = [
  "08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
];

export function AppointmentForm({ caregiver, onSubmit }: AppointmentFormProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");
  const [patientAge, setPatientAge] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!date) newErrors.date = "A data é obrigatória";
    if (!time) newErrors.time = "O horário é obrigatório";
    if (!patientName) newErrors.patientName = "O nome do paciente é obrigatório";
    if (!patientAge) newErrors.patientAge = "A idade do paciente é obrigatória";
    if (!address) newErrors.address = "O endereço é obrigatório";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onSubmit({
      caregiverId: caregiver.id, 
      date,
      time,
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
                      // Disable past dates and dates more than 30 days in the future
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

          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-4">Informações do Paciente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Nome do Paciente</Label>
                <Input
                  id="patientName"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
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
