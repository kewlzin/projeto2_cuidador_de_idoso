import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { AppointmentForm } from "@/components/appointments/appointment-form";
import { CaregiverProfile, UserType } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for caregivers
const mockCaregivers: CaregiverProfile[] = [
  {
    id: 1,
    userId: 1,
    bio: "Enfermeiro com mais de 10 anos de experiência no cuidado de idosos. Especializado em cuidados pós-operatórios e administração de medicamentos.",
    experienceYears: 10,
    certifications: ["COREN-SP 123456", "Especialização em Geriatria"],
    verified: true,
    createdAt: "2023-01-15T00:00:00Z",
    user: {
      id: 1,
      name: "João Silva",
      email: "joao.silva@email.com",
      phone: "(11) 98765-4321",
      type: UserType.CAREGIVER,
      createdAt: "2023-01-10T00:00:00Z"
    }
  },
  {
    id: 2,
    userId: 2,
    bio: "Cuidadora dedicada e paciente, com formação técnica em enfermagem. Experiência com pacientes com Alzheimer e Parkinson.",
    experienceYears: 5,
    certifications: ["Técnico em Enfermagem", "Curso de Cuidador de Idosos"],
    verified: true,
    createdAt: "2023-02-20T00:00:00Z",
    user: {
      id: 2,
      name: "Maria Oliveira",
      email: "maria.oliveira@email.com",
      phone: "(11) 91234-5678",
      type: UserType.CAREGIVER,
      createdAt: "2023-02-15T00:00:00Z"
    }
  },
  {
    id: 3,
    userId: 3,
    bio: "Enfermeiro especialista em reabilitação. Trabalho com muito carinho e atenção, sempre focado no bem-estar do paciente.",
    experienceYears: 7,
    certifications: ["COREN-SP 789012", "Fisioterapia Geriátrica"],
    verified: false,
    createdAt: "2023-03-10T00:00:00Z",
    user: {
      id: 3,
      name: "Pedro Santos",
      email: "pedro.santos@email.com",
      phone: "(11) 97890-1234",
      type: UserType.CAREGIVER,
      createdAt: "2023-03-05T00:00:00Z"
    }
  },
  {
    id: 4,
    userId: 4,
    bio: "Cuidadora com experiência em home care. Ofereço suporte completo em atividades diárias, alimentação e medicação.",
    experienceYears: 3,
    certifications: ["Curso de Primeiros Socorros", "Auxiliar de Enfermagem"],
    verified: true,
    createdAt: "2023-04-05T00:00:00Z",
    user: {
      id: 4,
      name: "Ana Costa",
      email: "ana.costa@email.com",
      phone: "(11) 94567-8901",
      type: UserType.CAREGIVER,
      createdAt: "2023-04-01T00:00:00Z"
    }
  }
];

const ScheduleAppointment = () => {
  const { caregiverId } = useParams<{ caregiverId: string }>();
  const navigate = useNavigate();
  const [caregiver, setCaregiver] = useState<CaregiverProfile | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Simulate fetching caregiver data
    setIsLoading(true);
    setTimeout(() => {
      const foundCaregiver = mockCaregivers.find(c => c.id === Number(caregiverId));
      if (foundCaregiver) {
        setCaregiver(foundCaregiver);
      }
      setIsLoading(false);
    }, 500);
  }, [caregiverId]);

  const handleAppointmentSubmit = (appointmentData: any) => {
    // Here we would normally send the data to an API
    console.log("Appointment data:", appointmentData);
    
    // Show success message
    toast.success("Agendamento realizado com sucesso!", {
      description: `Visita agendada com ${caregiver?.user?.name} para ${format(appointmentData.date, "PPP", { locale: ptBR })} às ${appointmentData.time}.`,
    });
    
    // Redirect to dashboard after scheduling
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="h-screen flex flex-col relative">
      <Header />
      <main className={`flex-1 overflow-y-auto pt-[72px] relative z-0 ${isAuthenticated ? 'mb-[4rem]' : 'mb-[12rem]'}`}>
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Agendar Atendimento</h1>
            {isLoading ? (
              <p className="text-lg text-gray-600 mt-2">Carregando informações do cuidador...</p>
            ) : caregiver ? (
              <p className="text-lg text-gray-600 mt-2">
                Agende um atendimento com {caregiver.user?.name}
              </p>
            ) : (
              <p className="text-lg text-red-600 mt-2">Cuidador não encontrado.</p>
            )}
          </div>

          {!isLoading && caregiver && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <AppointmentForm 
                  caregiver={caregiver} 
                  onSubmit={handleAppointmentSubmit} 
                />
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
                      <p className="text-sm text-gray-600">
                        {caregiver.experienceYears} {caregiver.experienceYears === 1 ? 'ano' : 'anos'} de experiência
                      </p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h5 className="font-medium mb-1">Especialidades</h5>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-brand-blue-light text-brand-blue-dark text-xs px-2 py-1 rounded">Cuidados básicos</span>
                      <span className="bg-brand-blue-light text-brand-blue-dark text-xs px-2 py-1 rounded">Medicação</span>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Valor por hora</span>
                      <span className="font-semibold">R$ 50,00</span>
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
