
import { Link } from "react-router-dom";

export function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
      ),
      title: "Cuidadores Verificados",
      description:
        "Todos os profissionais passam por um rigoroso processo de verificação para garantir a segurança e qualidade do atendimento."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
      ),
      title: "Agendamento Flexível",
      description:
        "Agende visitas de acordo com suas necessidades, seja para cuidados pontuais ou regulares."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2c4 0 8 1.755 8 7.001 0 4.422-1.124 8.072-3.021 10.536-.51.663-1.177 1.261-1.979 1.734-.801-.473-1.469-1.071-1.979-1.734C7.124 17.073 6 13.423 6 8.997 6 3.756 10 2 14 2c4.418 0 8 3.582 8 8s-3.582 8-8 8c-4.418 0-8-3.582-8-8 0-2.41 1.464-4.394 3.5-4.394 2.036 0 3.5 1.984 3.5 4.394 0 2.41-1.464 4.393-3.5 4.393-1.036 0-2-.42-2.5-1.5"/></svg>
      ),
      title: "Relatórios Detalhados",
      description:
        "Receba relatórios completos após cada visita, mantendo-se informado sobre o estado de saúde e bem-estar do seu familiar."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      ),
      title: "Integração Médica",
      description:
        "Quando necessário, os cuidadores podem solicitar encaminhamentos médicos, garantindo um cuidado completo e integrado."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Por que escolher a CuidarBem?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nossa plataforma oferece uma solução completa para o cuidado domiciliar de idosos, conectando famílias a profissionais dedicados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-brand-blue mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/como-funciona" className="text-brand-blue hover:underline font-medium">
            Saiba mais sobre como funciona
          </Link>
        </div>
      </div>
    </section>
  );
}
