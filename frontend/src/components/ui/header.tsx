import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Links que mudam de acordo com a autenticação
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
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-brand-blue">CuidarBem</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/como-funciona" className="text-gray-600 hover:text-brand-blue">
              Como Funciona
            </Link>
            <Link to="/cuidadores" className="text-gray-600 hover:text-brand-blue">
              Cuidadores
            </Link>
            <Link to="/profissionais" className="text-gray-600 hover:text-brand-blue">
              Para Profissionais
            </Link>
            <Link to="/contato" className="text-gray-600 hover:text-brand-blue">
              Contato
            </Link>
            {authLinks}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-500"
            >
              {mobileMenuOpen ? (
                <svg /* ícone de fechar */>…</svg>
              ) : (
                <svg /* ícone de menu */>…</svg>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link to="/como-funciona" className="px-4 py-2 text-gray-600 hover:text-brand-blue">
                Como Funciona
              </Link>
              <Link to="/cuidadores" className="px-4 py-2 text-gray-600 hover:text-brand-blue">
                Cuidadores
              </Link>
              <Link to="/profissionais" className="px-4 py-2 text-gray-600 hover:text-brand-blue">
                Para Profissionais
              </Link>
              <Link to="/contato" className="px-4 py-2 text-gray-600 hover:text-brand-blue">
                Contato
              </Link>
              <div className="flex flex-col space-y-2 px-4">
                {authLinks}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
