import { FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import icdsMainLogo from "@/assets/icds-main-logo.png";
import axiacareLogo from "@/assets/axiacare-logo.png";

const Header = () => {
  return (
    <header className="bg-gradient-medical shadow-medical sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <a 
              href="https://icds.org.br/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-90 transition-opacity"
            >
            <div className="bg-white rounded-lg p-2 sm:p-3 shadow-lg">
              <img 
                src={icdsMainLogo} 
                alt="ICDS Logo" 
                className="h-6 sm:h-8 md:h-10 w-auto"
                loading="eager"
                decoding="async"
              />
            </div>
            </a>
            <Link to="/" className="text-white hover:opacity-90 transition-opacity">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold">RAG</h1>
              <p className="text-xs sm:text-sm opacity-90 hidden sm:block">
                Requisitos de Apoio a Gestão
              </p>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Powered by AxiaCare */}
            <a 
              href="https://axcare.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-white/90 px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm hover:bg-white/95 transition-all shadow-sm"
            >
              <span className="text-gray-800 text-xs sm:text-sm font-medium">Powered by</span>
              <img 
                src={axiacareLogo} 
                alt="AxiaCare" 
                className="h-4 sm:h-6 object-contain"
                loading="lazy"
                decoding="async"
              />
            </a>
            
            <Link to="/reports">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm hidden sm:flex"
              >
                <FileText className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Relatórios</span>
              </Button>
            </Link>
            <Link to="/admin">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
              >
                <Settings className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;