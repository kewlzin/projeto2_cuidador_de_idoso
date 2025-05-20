import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function Footer() {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-white border-t border-gray-200 pb-8 fixed bottom-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        {!isAuthenticated && (
          <div className="textos grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">CuidarBem</h3>
              <p className="text-gray-600 mb-4">
                Conectando famílias a cuidadores profissionais para oferecer o melhor cuidado domiciliar para idosos.
              </p>
            </div>
            
            <div className="text-right">
              <h3 className="text-lg font-semibold text-gray-900">Contato</h3>
              <ul className="space-y-2">
                <li className="text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  +55 (11) 99999-9999
                </li>
                <li className="text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  contato@cuidarbem.com.br
                </li>
              </ul>
            </div>
          </div>
        )}
        
        <div className="termos-de-uso border-t border-gray-200 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} CuidarBem. Todos os direitos reservados.
            </p>
            <div className="flex space-x-4">
              <Link to="/termos" className="text-gray-600 text-sm hover:text-brand-blue">
                Termos de Uso
              </Link>
              <Link to="/privacidade" className="text-gray-600 text-sm hover:text-brand-blue">
                Política de Privacidade
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
