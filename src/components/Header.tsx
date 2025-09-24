import { FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import icdsLogo from "@/assets/icds-logo.png";

const Header = () => {
  return (
    <header className="bg-gradient-medical shadow-medical sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <div className="p-2 bg-white/90 rounded-lg backdrop-blur-sm">
              <img 
                src={icdsLogo} 
                alt="ICDS Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">
                RAG
              </h1>
              <p className="text-white/90 text-xs md:text-sm leading-tight">
                Requisitos de Apoio a Gestão
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-white">RAG</h1>
            </div>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm hidden sm:flex"
            >
              <FileText className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Relatórios</span>
            </Button>
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