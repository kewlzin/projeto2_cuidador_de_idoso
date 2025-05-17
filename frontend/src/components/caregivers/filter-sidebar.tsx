
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

export interface FilterValues {
  location?: string;
  priceRange: number[];
  experienceYears: number[];
  availability: {
    morning: boolean;
    afternoon: boolean;
    night: boolean;
    weekend: boolean;
  };
  specialties: {
    basic: boolean;
    mobility: boolean;
    medication: boolean;
    physio: boolean;
    dementia: boolean;
  };
  verifiedOnly: boolean;
}

interface FilterSidebarProps {
  onFilterChange: (filters: FilterValues) => void;
}

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState([30, 150]);
  const [experienceYears, setExperienceYears] = useState([0, 25]);
  const [availability, setAvailability] = useState({
    morning: false,
    afternoon: false,
    night: false,
    weekend: false,
  });
  const [specialties, setSpecialties] = useState({
    basic: false,
    mobility: false,
    medication: false,
    physio: false,
    dementia: false,
  });
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const handleFilterChange = () => {
    onFilterChange({
      location,
      priceRange,
      experienceYears,
      availability,
      specialties,
      verifiedOnly,
    });
  };

  const clearFilters = () => {
    setLocation("");
    setPriceRange([30, 150]);
    setExperienceYears([0, 25]);
    setAvailability({
      morning: false,
      afternoon: false,
      night: false,
      weekend: false,
    });
    setSpecialties({
      basic: false,
      mobility: false,
      medication: false,
      physio: false,
      dementia: false,
    });
    setVerifiedOnly(false);
    onFilterChange({
      location: "",
      priceRange: [30, 150],
      experienceYears: [0, 25],
      availability: {
        morning: false,
        afternoon: false,
        night: false,
        weekend: false,
      },
      specialties: {
        basic: false,
        mobility: false,
        medication: false,
        physio: false,
        dementia: false,
      },
      verifiedOnly: false,
    });
  };

  return (
    <div className="w-full space-y-6 p-4 bg-white rounded-lg shadow">
      <div>
        <h3 className="font-medium text-lg mb-4">Filtros</h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              placeholder="Digite uma cidade ou bairro"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Faixa de Preço (por hora)</Label>
              <span className="text-sm">
                R${priceRange[0]} - R${priceRange[1]}
              </span>
            </div>
            <Slider
              defaultValue={[30, 150]}
              min={20}
              max={200}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
              className="py-4"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Anos de Experiência</Label>
              <span className="text-sm">
                {experienceYears[0]} - {experienceYears[1]}+ anos
              </span>
            </div>
            <Slider
              defaultValue={[0, 25]}
              min={0}
              max={25}
              step={1}
              value={experienceYears}
              onValueChange={setExperienceYears}
              className="py-4"
            />
          </div>
          
          <div className="space-y-3">
            <Label>Disponibilidade</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="availability-morning"
                  checked={availability.morning}
                  onCheckedChange={(checked) => 
                    setAvailability(prev => ({ ...prev, morning: checked === true }))
                  }
                />
                <Label htmlFor="availability-morning">Manhã</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="availability-afternoon"
                  checked={availability.afternoon}
                  onCheckedChange={(checked) => 
                    setAvailability(prev => ({ ...prev, afternoon: checked === true }))
                  }
                />
                <Label htmlFor="availability-afternoon">Tarde</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="availability-night"
                  checked={availability.night}
                  onCheckedChange={(checked) => 
                    setAvailability(prev => ({ ...prev, night: checked === true }))
                  }
                />
                <Label htmlFor="availability-night">Noite</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="availability-weekend"
                  checked={availability.weekend}
                  onCheckedChange={(checked) => 
                    setAvailability(prev => ({ ...prev, weekend: checked === true }))
                  }
                />
                <Label htmlFor="availability-weekend">Finais de semana</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Especialidades</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="speciality-basic"
                  checked={specialties.basic}
                  onCheckedChange={(checked) => 
                    setSpecialties(prev => ({ ...prev, basic: checked === true }))
                  }
                />
                <Label htmlFor="speciality-basic">Cuidados básicos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="speciality-mobility"
                  checked={specialties.mobility}
                  onCheckedChange={(checked) => 
                    setSpecialties(prev => ({ ...prev, mobility: checked === true }))
                  }
                />
                <Label htmlFor="speciality-mobility">Mobilidade</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="speciality-medication"
                  checked={specialties.medication}
                  onCheckedChange={(checked) => 
                    setSpecialties(prev => ({ ...prev, medication: checked === true }))
                  }
                />
                <Label htmlFor="speciality-medication">Medicação</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="speciality-physio"
                  checked={specialties.physio}
                  onCheckedChange={(checked) => 
                    setSpecialties(prev => ({ ...prev, physio: checked === true }))
                  }
                />
                <Label htmlFor="speciality-physio">Fisioterapia</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="speciality-dementia"
                  checked={specialties.dementia}
                  onCheckedChange={(checked) => 
                    setSpecialties(prev => ({ ...prev, dementia: checked === true }))
                  }
                />
                <Label htmlFor="speciality-dementia">Demência</Label>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="verified-only"
              checked={verifiedOnly}
              onCheckedChange={(checked) => setVerifiedOnly(checked === true)}
            />
            <Label htmlFor="verified-only">Apenas verificados</Label>
          </div>
          
          <Button className="w-full" onClick={handleFilterChange}>Aplicar Filtros</Button>
          <Button variant="outline" className="w-full" onClick={clearFilters}>Limpar Filtros</Button>
        </div>
      </div>
    </div>
  );
}
