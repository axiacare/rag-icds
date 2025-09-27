import axiacareImage from "@/assets/axiacare-logo.png";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-8 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <img 
            src={axiacareImage} 
            alt="AxiaCare" 
            className="h-12 sm:h-16 w-auto opacity-90" 
          />
          
          <div className="space-y-2">
            <p className="text-sm sm:text-base font-medium text-foreground">
              AxView™ | WebApps – Gestão e Consultoria em Saúde
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center text-xs sm:text-sm text-muted-foreground space-y-1 sm:space-y-0 sm:space-x-2">
              <span>axcare.com.br</span>
              <span className="hidden sm:inline">|</span>
              <span>Copyright © 2025 AxiaCare</span>
              <span className="hidden sm:inline">|</span>
              <span>Todos os direitos reservados</span>
              <span className="hidden sm:inline">|</span>
              <span>Uma empresa do Grupo CSV</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;