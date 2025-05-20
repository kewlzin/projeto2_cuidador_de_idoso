import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { FilterSidebar, FilterValues } from "@/components/caregivers/filter-sidebar";
import { CaregiverCard } from "@/components/caregivers/caregiver-card";
import { CaregiverProfile, UserType } from "@/types";
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
    hourlyRate: 70,
    location: "São Paulo, SP",
    specialties: ["Medicação", "Cuidados básicos", "Fisioterapia"],
    availability: ["morning", "afternoon"],
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
    hourlyRate: 50,
    location: "Campinas, SP",
    specialties: ["Demência", "Mobilidade", "Cuidados básicos"],
    availability: ["afternoon", "night", "weekend"],
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
    hourlyRate: 90,
    location: "Rio de Janeiro, RJ",
    specialties: ["Fisioterapia", "Mobilidade"],
    availability: ["morning", "afternoon"],
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
    hourlyRate: 40,
    location: "Belo Horizonte, MG",
    specialties: ["Cuidados básicos", "Medicação"],
    availability: ["night", "weekend"],
    user: {
      id: 4,
      name: "Ana Costa",
      email: "ana.costa@email.com",
      phone: "(11) 94567-8901",
      type: UserType.CAREGIVER,
      createdAt: "2023-04-01T00:00:00Z"
    }
  },
  {
    id: 5,
    userId: 5,
    bio: "Especialista em cuidados para pacientes com demência e Alzheimer. Abordagem atenciosa e técnicas específicas para melhorar a qualidade de vida.",
    experienceYears: 8,
    certifications: ["Especialização em Neurologia", "Curso Avançado em Demência"],
    verified: true,
    createdAt: "2023-05-10T00:00:00Z",
    hourlyRate: 85,
    location: "Curitiba, PR",
    specialties: ["Demência", "Medicação", "Mobilidade"],
    availability: ["morning", "afternoon", "night"],
    user: {
      id: 5,
      name: "Carlos Mendes",
      email: "carlos.mendes@email.com",
      phone: "(41) 99876-5432",
      type: UserType.CAREGIVER,
      createdAt: "2023-05-01T00:00:00Z"
    }
  }
];

const Caregivers = () => {
  const [caregivers, setCaregivers] = useState<CaregiverProfile[]>(mockCaregivers);
  const [filteredCaregivers, setFilteredCaregivers] = useState<CaregiverProfile[]>(mockCaregivers);
  const { isAuthenticated } = useAuth();

  const handleFilterChange = (filters: FilterValues) => {
    let filtered = [...mockCaregivers];

    // Filter by verified status
    if (filters.verifiedOnly) {
      filtered = filtered.filter(caregiver => caregiver.verified);
    }

    // Filter by location (case insensitive)
    if (filters.location && filters.location.trim() !== "") {
      const locationLower = filters.location.toLowerCase();
      filtered = filtered.filter(caregiver => {
        return caregiver.location?.toLowerCase().includes(locationLower);
      });
    }

    // Filter by experience years
    filtered = filtered.filter(caregiver => {
      const years = caregiver.experienceYears || 0;
      return years >= filters.experienceYears[0] && years <= filters.experienceYears[1];
    });

    // Filter by price range
    filtered = filtered.filter(caregiver => {
      const rate = caregiver.hourlyRate || 0;
      return rate >= filters.priceRange[0] && rate <= filters.priceRange[1];
    });

    // Filter by availability
    const hasAvailabilityFilter = Object.values(filters.availability).some(value => value);
    if (hasAvailabilityFilter) {
      filtered = filtered.filter(caregiver => {
        if (!caregiver.availability) return false;
        
        // Check if any of the selected availability periods match the caregiver's availability
        return Object.entries(filters.availability).some(([period, isSelected]) => {
          return isSelected && caregiver.availability?.includes(period);
        });
      });
    }

    // Filter by specialties
    const hasSpecialtiesFilter = Object.values(filters.specialties).some(value => value);
    if (hasSpecialtiesFilter) {
      filtered = filtered.filter(caregiver => {
        if (!caregiver.specialties) return false;
        
        // Map the checkbox values to actual specialty names
        const specialtyMap: Record<string, string> = {
          basic: "Cuidados básicos",
          mobility: "Mobilidade",
          medication: "Medicação",
          physio: "Fisioterapia",
          dementia: "Demência"
        };
        
        // Check if any of the selected specialties match the caregiver's specialties
        return Object.entries(filters.specialties).some(([specialty, isSelected]) => {
          if (!isSelected) return false;
          const specialtyName = specialtyMap[specialty];
          return caregiver.specialties?.includes(specialtyName);
        });
      });
    }

    setFilteredCaregivers(filtered);
  };

  return (
    <div className="h-screen flex flex-col relative">
      <Header />
      <main className={`flex-1 overflow-y-auto pt-[72px] relative z-0 ${isAuthenticated ? 'mb-[4rem]' : 'mb-[12rem]'}`}>
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Cuidadores Disponíveis</h1>
            <p className="text-lg text-gray-600 mt-2">
              Encontre o cuidador ideal para suas necessidades
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar with filters */}
            <div className="w-full lg:w-1/4">
              <FilterSidebar onFilterChange={handleFilterChange} />
            </div>

            {/* Main content - list of caregivers */}
            <div className="w-full lg:w-3/4">
              <div className="grid grid-cols-1 gap-6">
                {filteredCaregivers.map((caregiver) => (
                  <CaregiverCard key={caregiver.id} caregiver={caregiver} />
                ))}

                {filteredCaregivers.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-xl text-gray-600">
                      Nenhum cuidador encontrado com esses filtros.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Caregivers;
