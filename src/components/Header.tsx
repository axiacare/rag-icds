import { FileText, Hospital } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-gradient-medical shadow-medical sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Hospital className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">RAG</h1>
              <p className="text-white/80 text-sm">Sistema de Auditoria Hospitalar</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm">
              <FileText className="w-4 h-4 mr-2" />
              Relatórios
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;