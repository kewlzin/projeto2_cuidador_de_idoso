// src/pages/ScheduleAppointment.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { AppointmentForm } from "@/components/appointments/appointment-form";
import { CaregiverProfile, ServiceOffer } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "../lib/api";

const ScheduleAppointment = () => {
  // Agora useParams vai ler da rota '/schedule/:offerId'
  const { offerId } = useParams<{ offerId: string }>();
  const navigate = useNavigate();
  const [caregiver, setCaregiver] = useState<CaregiverProfile | null>(null);
  const [hourlyRate, setHourlyRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Se offerId for undefined, abortamos e mostramos “não encontrado”
    if (!offerId) {
      setIsLoading(false);
      return;
    }

    const fetchOffer = async () => {
      try {
        // Como baseURL = 'http://localhost:3001', chame exatamente '/api/services/offers/:id'
        const response = await api.get<ServiceOffer>(`/api/services/offers/${offerId}`);
        console.log("Resposta da oferta:", response.data);
        const serviceOffer = response.data;

        if (!serviceOffer.caregiver) {
          toast.error("Cuidador não encontrado.");
          setCaregiver(null);
          setHourlyRate(null);
        } else {
          setCaregiver(serviceOffer.caregiver);
          setHourlyRate(serviceOffer.hourlyRate ?? null);
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          toast.error("Cuidador não encontrado.");
        } else {
          toast.error("Falha ao carregar dados do cuidador. Tente novamente.");
        }
        setCaregiver(null);
        setHourlyRate(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffer();
  }, [offerId]);

  const handleAppointmentSubmit = async (appointmentData: {
    caregiverId: number;
    date: Date;
    time: string;
    patientName: string;
    patientAge: string;
    address: string;
    notes: string;
  }) => {
    try {
      const formattedDate = appointmentData.date.toISOString().split("T")[0];

      await api.post("/api/appointments", {
        caregiverId: appointmentData.caregiverId,
        date: formattedDate,
        time: appointmentData.time,
        patientName: appointmentData.patientName.trim(),
        patientAge: Number(appointmentData.patientAge),
        address: appointmentData.address.trim(),
        notes: appointmentData.notes.trim() || null,
      });

      toast.success("Agendamento realizado com sucesso!", {
        description: `Visita agendada com ${caregiver?.user?.name} para ${format(
          appointmentData.date,
          "PPP",
          { locale: ptBR }
        )} às ${appointmentData.time}.`,
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err: any) {
      console.error("Erro ao criar agendamento:", err);
      if (err.response?.data?.errors) {
        const msgs = Object.values(err.response.data.errors).join(" • ");
        toast.error(msgs);
      } else if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Falha ao criar agendamento. Tente novamente.");
      }
    }
  };

  return (
    <div className="h-screen flex flex-col relative">
      <Header />

      <main
        className={`flex-1 overflow-y-auto pt-[72px] relative z-0 ${
          isAuthenticated ? "mb-[4rem]" : "mb-[12rem]"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Agendar Atendimento</h1>

            {isLoading ? (
              <p className="text-lg text-gray-600 mt-2">
                Carregando informações do cuidador...
              </p>
            ) : caregiver ? (
              <p className="text-lg text-gray-600 mt-2">
                Agende um atendimento com {caregiver.user?.name}
              </p>
            ) : (
              <p className="text-lg text-red-600 mt-2">
                Cuidador não encontrado.
              </p>
            )}
          </div>

          {!isLoading && caregiver && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <AppointmentForm caregiver={caregiver} onSubmit={handleAppointmentSubmit} />
              </div>

              <div>
                <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                  <h3 className="text-xl font-semibold mb-4">Resumo do Cuidador</h3>
                  <div className="flex items-center mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80"
                      alt={caregiver.user?.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-medium">{caregiver.user?.name}</h4>
                      {caregiver.experienceYears !== undefined && (
                        <p className="text-sm text-gray-600">
                          {caregiver.experienceYears}{" "}
                          {caregiver.experienceYears === 1 ? "ano" : "anos"} de experiência
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-medium mb-1">Especialidades</h5>
                    <div className="flex flex-wrap gap-1">
                      {caregiver.specialties && caregiver.specialties.length > 0 ? (
                        caregiver.specialties.map((spec) => (
                          <span
                            key={spec}
                            className="bg-brand-blue-light text-brand-blue-dark text-xs px-2 py-1 rounded"
                          >
                            {spec}
                          </span>
                        ))
                      ) : (
                        <span className="bg-brand-blue-light text-brand-blue-dark text-xs px-2 py-1 rounded">
                          Cuidados básicos
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Valor por hora</span>
                      <span className="font-semibold">
                        {hourlyRate !== null
                          ? `R$ ${hourlyRate.toFixed(2).replace(".", ",")}`
                          : "—"}
                        <span className="text-sm text-gray-600">/hora</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ScheduleAppointment;
