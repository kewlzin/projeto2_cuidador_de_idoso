// src/pages/Offers.tsx (ou Caregivers.tsx, conforme seu roteiro)

import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { FilterSidebar, FilterValues } from "@/components/caregivers/filter-sidebar";
import { CaregiverCard } from "@/components/caregivers/caregiver-card";
import { ServiceOffer, CaregiverProfile, UserType } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "../lib/api";
import { toast } from "sonner";

const Offers = () => {
  // Estado que guardará todas as ofertas vindas do backend
  const [offers, setOffers] = useState<ServiceOffer[]>([]);
  // Estado para armazenar as ofertas filtradas
  const [filteredOffers, setFilteredOffers] = useState<ServiceOffer[]>([]);

  const { isAuthenticated } = useAuth();

  // Função que aplica filtros sobre o array de ofertas
  const handleFilterChange = (filters: FilterValues) => {
    let result = [...offers];

    // 1) Filtrar apenas cuidadores verificados
    if (filters.verifiedOnly) {
      result = result.filter((offer) => offer.caregiver?.verified);
    }

    // 2) Filtrar por localização (oferta.location)
    if (filters.location && filters.location.trim() !== "") {
      const locLower = filters.location.toLowerCase();
      result = result.filter(
        (offer) =>
          offer.location?.toLowerCase().includes(locLower)
      );
    }

    // 3) Filtrar por faixa de preço (hourlyRate da oferta)
    result = result.filter((offer) => {
      const rate = offer.hourlyRate ?? 0;
      return rate >= filters.priceRange[0] && rate <= filters.priceRange[1];
    });

    // 4) Filtrar por anos de experiência (caregiver.experienceYears)
    result = result.filter((offer) => {
      const years = offer.caregiver?.experienceYears ?? 0;
      return (
        years >= filters.experienceYears[0] &&
        years <= filters.experienceYears[1]
      );
    });

    // Se quiser adicionar outros filtros (especialidades, disponibilidade),
    // é necessário que a API retorne esses campos dentro de offer.caregiver.

    setFilteredOffers(result);
  };

  // Busca as ofertas do backend assim que o componente montar
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await api.get<ServiceOffer[]>("/api/services/offers");
        setOffers(response.data);
        setFilteredOffers(response.data);
      } catch (err: any) {
        console.error("Erro ao carregar ofertas:", err);
        toast.error(
          err.response?.data?.error ||
            "Falha ao buscar ofertas. Tente recarregar a página."
        );
      }
    };

    fetchOffers();
  }, []);

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
            <h1 className="text-3xl font-bold text-gray-900">Ofertas de Serviço</h1>
            <p className="text-lg text-gray-600 mt-2">
              Escolha um cuidador com base na disponibilidade e valores.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar com filtros */}
            <div className="w-full lg:w-1/4">
              <FilterSidebar onFilterChange={handleFilterChange} />
            </div>

            {/* Conteúdo principal – lista de ofertas */}
            <div className="w-full lg:w-3/4">
              <div className="grid grid-cols-1 gap-6">
                {filteredOffers.map((offer) => {
                  // Garante que o "caregiver" exista antes de passar para o Card.
                  if (!offer.caregiver) return null;

                  // Monta um CaregiverProfile que inclui hourlyRate e location vindos de ServiceOffer
                  const profileParaCard: CaregiverProfile = {
                    ...offer.caregiver,
                    // As propriedades abaixo já existem como opcionais em CaregiverProfile:
                    hourlyRate: offer.hourly_rate,
                    location: offer.location,
                    // specialties e availability ficam vazias, pois a API /offers não as retorna.
                    specialties: offer.caregiver.specialties ?? [],
                    availability: offer.caregiver.availability ?? [],
                  };

                  return (
                    <CaregiverCard
                      key={offer.id}
                      caregiver={profileParaCard}
                      offerid={offer.offer_id}
                    />
                  );
                })}

                {filteredOffers.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-xl text-gray-600">
                      Nenhuma oferta encontrada com esses filtros.
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

export default Offers;
