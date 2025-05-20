import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentList } from "@/components/dashboard/appointment-list";
import { DashboardSummary } from "@/components/dashboard/dashboard-summary";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Appointment, CaregiverProfile, UserType, User } from "@/types";
import { toast } from "sonner";
import { api } from "../lib/api";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for appointments
const mockAppointments: Appointment[] = [
  {
    id: 1,
    caregiverId: 1,
    seniorId: 10,
    date: "2025-05-10",
    time: "09:00",
    status: "agendado",
    notes: "Primeira visita para avaliação",
    caregiver: {
      id: 1,
      userId: 1,
      bio: "Enfermeiro com mais de 10 anos de experiência no cuidado de idosos.",
      experienceYears: 10,
      certifications: ["COREN-SP 123456"],
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
    }
  },
  {
    id: 2,
    caregiverId: 2,
    seniorId: 10,
    date: "2025-05-15",
    time: "14:00",
    status: "agendado",
    notes: "Acompanhamento e administração de medicamentos",
    caregiver: {
      id: 2,
      userId: 2,
      bio: "Cuidadora dedicada e paciente, com formação técnica em enfermagem.",
      experienceYears: 5,
      certifications: ["Técnico em Enfermagem"],
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
    }
  },
  {
    id: 3,
    caregiverId: 3,
    seniorId: 10,
    date: "2025-05-03",
    time: "10:00",
    status: "concluido",
    notes: "Visita de rotina realizada com sucesso",
    caregiver: {
      id: 3,
      userId: 3,
      bio: "Enfermeiro especialista em reabilitação.",
      experienceYears: 7,
      certifications: ["COREN-SP 789012"],
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
    }
  },
  {
    id: 4,
    caregiverId: 4,
    seniorId: 10,
    date: "2025-04-28",
    time: "15:00",
    status: "cancelado",
    notes: "Visita cancelada pelo responsável",
    caregiver: {
      id: 4,
      userId: 4,
      bio: "Cuidadora com experiência em home care.",
      experienceYears: 3,
      certifications: ["Curso de Primeiros Socorros"],
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
  }
];

const Dashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/api/users/me');
        setUser(response.data);
      } catch (error) {
        toast.error("Erro ao carregar dados do usuário");
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleCancelAppointment = (appointmentId: number) => {
    // In a real app, this would be an API call
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, status: "cancelado" as const }
        : appointment
    );
    
    setAppointments(updatedAppointments);
    
    toast.success("Agendamento cancelado com sucesso", {
      description: "O cuidador será notificado sobre o cancelamento."
    });
  };

  const confirmCancelAppointment = (appointmentId: number) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    setSelectedAppointment(appointment || null);
  };

  // Count appointments by status
  const scheduledAppointments = appointments.filter(a => a.status === "agendado").length;
  const completedAppointments = appointments.filter(a => a.status === "concluido").length;
  const totalAppointments = appointments.length;

  return (
    <div className="h-screen flex flex-col relative">
      <Header />
      <main className={`flex-1 overflow-y-auto pt-[72px] relative z-0 ${isAuthenticated ? 'mb-[4rem]' : 'mb-[12rem]'}`}>
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-lg text-gray-600 mt-2">
              Gerencie seus agendamentos e informações
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar with user info and stats */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Perfil</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-semibold">
                        {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '...'}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{user?.name || 'Carregando...'}</h3>
                        <p className="text-sm text-gray-600">{user?.email || 'Carregando...'}</p>
                        <p className="text-sm text-gray-600">{user?.phone || 'Carregando...'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <DashboardSummary 
                  totalAppointments={totalAppointments}
                  upcomingAppointments={scheduledAppointments}
                  completedAppointments={completedAppointments}
                />
              </div>
            </div>

            {/* Main content - appointments */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Meus Agendamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="upcoming">
                    <TabsList className="mb-4">
                      <TabsTrigger value="upcoming">Próximos</TabsTrigger>
                      <TabsTrigger value="past">Anteriores</TabsTrigger>
                      <TabsTrigger value="all">Todos</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upcoming">
                      <AppointmentList 
                        appointments={appointments.filter(a => a.status === "agendado")} 
                        emptyMessage="Nenhum agendamento futuro encontrado."
                        onCancelAppointment={confirmCancelAppointment}
                      />
                    </TabsContent>
                    
                    <TabsContent value="past">
                      <AppointmentList 
                        appointments={appointments.filter(a => a.status === "concluido" || a.status === "cancelado")} 
                        showStatus={true}
                        emptyMessage="Nenhum agendamento anterior encontrado."
                      />
                    </TabsContent>
                    
                    <TabsContent value="all">
                      <AppointmentList 
                        appointments={appointments} 
                        showStatus={true}
                        onCancelAppointment={confirmCancelAppointment}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <AlertDialog>
        <AlertDialogTrigger className="hidden">Open</AlertDialogTrigger>
        {selectedAppointment && (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Cancelamento</AlertDialogTitle>
              <AlertDialogDescription>
                Deseja realmente cancelar o agendamento com {selectedAppointment.caregiver?.user?.name} 
                para o dia {selectedAppointment.date} às {selectedAppointment.time}?
                <br /><br />
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedAppointment(null)}>Voltar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => {
                  handleCancelAppointment(selectedAppointment.id);
                  setSelectedAppointment(null);
                }}
                className="bg-red-500 hover:bg-red-600"
              >
                Sim, cancelar agendamento
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
