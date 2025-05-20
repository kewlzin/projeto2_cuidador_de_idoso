
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="hero-section overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Cuidado domiciliar personalizado para quem você ama
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-lg">
              Conectamos famílias a cuidadores qualificados e médicos especialistas para oferecer o melhor atendimento domiciliar para idosos.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Encontrar Cuidador
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sou Profissional
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <img 
              src="src\assets\imagens\banner-principal.png" 
              alt="Cuidador e idoso" 
              className="rounded-lg shadow-xl max-w-full h-auto animate-fade-in"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
