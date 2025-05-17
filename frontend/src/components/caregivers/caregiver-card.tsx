
import { CaregiverProfile } from "@/types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CaregiverCardProps {
  caregiver: CaregiverProfile;
}

export function CaregiverCard({ caregiver }: CaregiverCardProps) {
  const { user, bio, experienceYears, verified, location, specialties, hourlyRate } = caregiver;
  
  // Placeholder image - in a real app, use the user's profile image
  const profileImage = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80";
  
  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <img 
          src={profileImage} 
          alt={user?.name || "Cuidador"} 
          className="w-20 h-20 rounded-full object-cover mx-auto md:mx-0"
        />
        <div className="space-y-1 text-center md:text-left">
          <CardTitle className="text-xl">
            {user?.name || "Nome do Cuidador"}
            {verified && (
              <Badge className="ml-2 bg-green-500" variant="secondary">Verificado</Badge>
            )}
          </CardTitle>
          <CardDescription>
            {experienceYears && (
              <span className="block">{experienceYears} {experienceYears === 1 ? 'ano' : 'anos'} de experiência</span>
            )}
            <span className="block">{location || "Localização não especificada"}</span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-gray-700">
          {bio || "Este cuidador ainda não adicionou uma biografia."}
        </p>
        
        <div className="mt-4">
          <div className="text-sm text-gray-700 font-medium mb-1">Especialidades:</div>
          <div className="flex flex-wrap gap-2">
            {specialties && specialties.length > 0 ? (
              specialties.map((specialty, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-brand-blue-light text-brand-blue-dark"
                >
                  {specialty}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="bg-brand-blue-light text-brand-blue-dark">
                Cuidados básicos
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-lg font-semibold text-brand-blue">
          R$ {hourlyRate || 50}<span className="text-sm text-gray-600">/hora</span>
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/cuidadores/${caregiver.id}`}>Ver Perfil</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to={`/agendar/${caregiver.id}`}>Agendar</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
