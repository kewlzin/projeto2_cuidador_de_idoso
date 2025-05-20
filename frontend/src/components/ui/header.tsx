import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigationLinks = !isAuthenticated ? (
    <>
      <Link to="/" className="text-gray-600 hover:text-brand-primary">
        Início
      </Link>
      <Link to="/como-funciona" className="text-gray-600 hover:text-brand-primary">
        Como Funciona
      </Link>
      <Link to="/profissionais" className="text-gray-600 hover:text-brand-primary">
        Para Profissionais
      </Link>
      <Link to="/contato" className="text-gray-600 hover:text-brand-primary">
        Contato
      </Link>
    </>
  ) : null;

  const authLinks = isAuthenticated ? (
    <>
      <Link
        to="/dashboard"
        className="text-gray-600 hover:text-brand-primary"
      >
        Dashboard
      </Link>
      <button
        onClick={handleLogout}
        className="text-gray-600 hover:text-brand-primary"
      >
        Sair
      </button>
    </>
  ) : (
    <>
      <Link
        to="/login"
        className="text-gray-600 hover:text-brand-primary"
      >
        Entrar
      </Link>
      <Link
        to="/register"
        className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-primary-dark"
      >
        Cadastrar
      </Link>
    </>
  );

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-brand-primary">
            CuidarBem
          </Link>

          {/* Links de navegação - visíveis apenas quando não autenticado */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationLinks}
          </div>

          {/* Links de autenticação */}
          <div className="hidden md:flex items-center space-x-4">
            {authLinks}
          </div>

          {/* Menu mobile */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Menu mobile expandido */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            {navigationLinks}
            <div className="pt-4 border-t">
              {authLinks}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
