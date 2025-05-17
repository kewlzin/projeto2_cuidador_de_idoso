
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Cadastre-se",
      description: "Crie sua conta gratuita como Responsável, Cuidador ou Médico."
    },
    {
      number: "02",
      title: "Encontre o profissional ideal",
      description: "Busque cuidadores por localização, experiência e disponibilidade."
    },
    {
      number: "03",
      title: "Agende uma visita",
      description: "Escolha a data e horário mais convenientes através do sistema de agendamento."
    },
    {
      number: "04",
      title: "Receba cuidados de qualidade",
      description: "O profissional vai até a residência para fornecer os cuidados necessários."
    }
  ];

  return (
    <section className="py-16 bg-brand-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Como funciona
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Conectar-se a cuidadores qualificados nunca foi tão simples. Siga estes passos para começar:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative bg-white p-6 rounded-lg shadow-md border border-gray-100"
            >
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/cadastro">
            <Button size="lg">Comece Agora</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
