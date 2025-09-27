import axiacareImage from "@/assets/axiacare-logo.png";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-8 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <a 
            href="https://axcare.com.br" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img 
              src={axiacareImage} 
              alt="AxiaCare" 
              className="h-12 sm:h-16 w-auto opacity-90"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />
          </a>
          
          <p className="text-sm font-medium text-foreground">
            AxView™ | WebApps – Gestão e Consultoria em Saúde
          </p>
          
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>axcare.com.br | Copyright © 2025 AxiaCare | Todos os direitos reservados | Uma empresa do Grupo CSV</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;