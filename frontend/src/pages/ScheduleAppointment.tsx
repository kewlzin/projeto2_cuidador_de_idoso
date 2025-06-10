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
import { AxiosError } from 'axios'; // Import para tipagem de erro

const ScheduleAppointment = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const navigate = useNavigate();
  const [caregiver, setCaregiver] = useState<CaregiverProfile | null>(null);
  const [serviceOffer, setServiceOffer] = useState<ServiceOffer | null>(null); // <--- NOVO: Armazena a oferta completa
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!offerId) {
      setIsLoading(false);
      toast.error("ID da oferta de serviço não fornecido.");
      return;
    }

    const fetchOffer = async () => {
      try {
        const response = await api.get<ServiceOffer>(`/api/services/offers/${offerId}`);
        const fetchedServiceOffer = response.data;

        if (!fetchedServiceOffer.caregiver) {
          toast.error("Cuidador não encontrado para esta oferta.");
          setCaregiver(null);
          setServiceOffer(null);
        } else {
          setCaregiver(fetchedServiceOffer.caregiver);
          setServiceOffer(fetchedServiceOffer); // <--- Guarda a oferta completa
        }
      } catch (err: unknown) { // Use 'unknown' para tipagem de erro
          if (err instanceof AxiosError && err.response) {
              if (err.response.status === 404) {
                  toast.error("Oferta de serviço não encontrada ou já expirou.");
              } else if (err.response.data?.error) {
                  toast.error(err.response.data.error);
              } else {
                  toast.error("Falha ao carregar dados da oferta de serviço. Tente novamente.");
              }
          } else {
              console.error("Erro inesperado ao carregar oferta:", err);
              toast.error("Ocorreu um erro inesperado. Tente novamente.");
          }
          setCaregiver(null);
          setServiceOffer(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffer();
  }, [offerId]);

  // handleAppointmentSubmit agora espera apenas os dados do paciente
  const handleAppointmentSubmit = async (appointmentFormFields: {
    patientName: string;
    patientAge: string;
    address: string;
    notes: string;
  }) => {
    if (!serviceOffer || !serviceOffer.caregiver) {
      toast.error("Não foi possível agendar: oferta ou cuidador inválido.");
      return;
    }

    try {
      await api.post("/api/appointments", {
        serviceOfferId: Number(offerId), // <--- Envia o ID da oferta (o backend pegará data/time dela)
        patientName: appointmentFormFields.patientName.trim(),
        patientAge: Number(appointmentFormFields.patientAge),
        address: appointmentFormFields.address.trim(),
        notes: appointmentFormFields.notes.trim() || null,
      });

      toast.success("Agendamento realizado com sucesso!", {
        // Usa a data e hora da oferta de serviço para a mensagem
        description: `Visita agendada com ${serviceOffer.caregiver.user?.name} para ${format(
          new Date(serviceOffer.availableAt), // <--- Usa availableAt da oferta
          "PPP",
          { locale: ptBR }
        )} às ${format(new Date(serviceOffer.availableAt), "HH:mm", { locale: ptBR })}.`, // <--- Usa availableAt
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err: unknown) { // Use 'unknown' para tipagem de erro
        console.error("Erro ao criar agendamento:", err);
        if (err instanceof AxiosError && err.response) {
            if (err.response.data?.errors) {
                const msgs = Object.values(err.response.data.errors).join(" • ");
                toast.error(msgs);
            } else if (err.response.data?.error) {
                toast.error(err.response.data.error);
            } else {
                toast.error("Falha ao criar agendamento. Tente novamente.");
            }
        } else {
            console.error("Erro inesperado ao criar agendamento:", err);
            toast.error("Ocorreu um erro inesperado. Tente novamente.");
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
                Carregando informações da oferta de serviço...
              </p>
            ) : serviceOffer && caregiver ? (
              <>
              </>
            ) : (
              <p className="text-lg text-red-600 mt-2">
                Oferta de serviço não encontrada ou inválida.
              </p>
            )}
          </div>

          {!isLoading && serviceOffer && caregiver && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <AppointmentForm onSubmit={handleAppointmentSubmit} />
              </div>
              {/* Resumo do Cuidador e Serviço */}
              <div>
                <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                  <h3 className="text-xl font-semibold mb-4">Resumo do Cuidador e Serviço</h3>
                  {/* ... informações do cuidador, especialidades ... */}
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
                      <span className="text-gray-600">Serviço Ofertado</span>
                      <span className="font-semibold">{serviceOffer.title}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Data e Hora do Serviço</span>
                      {/* ADICIONAR VERIFICAÇÃO PARA serviceOffer.availableAt AQUI TAMBÉM */}
                      {serviceOffer.availableAt ? (
                          <span className="font-semibold">
                              {format(new Date(serviceOffer.availableAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                          </span>
                      ) : (
                          <span className="text-red-500 font-semibold">Não informada</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Local do Serviço</span>
                      <span className="font-semibold">{serviceOffer.location}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Valor por hora</span>
                      <span className="font-semibold">
                        {serviceOffer.hourlyRate !== null
                          ? `R$ ${serviceOffer.hourlyRate.toFixed(2).replace(".", ",")}`
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