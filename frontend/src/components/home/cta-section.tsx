
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-16 bg-brand-blue">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para oferecer o melhor cuidado?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Seja como responsável ou profissional, junte-se à nossa plataforma e faça parte desta comunidade de cuidados.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register">
              <Button size="lg" variant="secondary">Cadastrar como Responsável</Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white hover:bg-white hover:text-brand-blue">
                Sou Profissional
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
