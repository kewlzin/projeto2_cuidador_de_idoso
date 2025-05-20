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

  const scrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigationLinks = !isAuthenticated ? (
    <>
      <Link to="/" className="text-gray-600 hover:text-brand-primary">
        Início
      </Link>
      <a 
        href="#how-it-works" 
        onClick={scrollToHowItWorks}
        className="text-gray-600 hover:text-brand-primary cursor-pointer"
      >
        Como Funciona
      </a>
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
        className="text-gray-600 hover:text-brand-primary">
        Cadastrar
      </Link>
    </>
  );

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to={isAuthenticated ? "/dashboard" : "/"} 
            className="text-2xl font-bold text-brand-primary"
          >
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
