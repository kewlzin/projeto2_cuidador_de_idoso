
export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "A CuidarBem mudou completamente nossa rotina. Encontramos uma cuidadora incrível para minha mãe, que além do profissionalismo, trata ela com carinho e atenção.",
      author: "Maria Silva",
      role: "Filha de paciente"
    },
    {
      quote: "Como enfermeiro, a plataforma me permite organizar meus atendimentos e manter um registro detalhado de cada paciente. Isso melhorou muito minha prática profissional.",
      author: "Carlos Oliveira",
      role: "Enfermeiro"
    },
    {
      quote: "A integração com médicos é perfeita. Quando precisei de uma consulta de emergência, o processo foi rápido e eficiente graças à comunicação direta entre o cuidador e o médico.",
      author: "Antônio Santos",
      role: "Responsável por idoso"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            O que dizem sobre nós
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Veja o que nossos usuários estão dizendo sobre a experiência com a CuidarBem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-brand-blue-light p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <svg className="w-10 h-10 text-brand-blue mb-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p className="text-gray-700 mb-4 italic">
                "{testimonial.quote}"
              </p>
              <div className="font-semibold text-gray-900">{testimonial.author}</div>
              <div className="text-sm text-gray-600">{testimonial.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
