import { useEffect } from "react";

const assetUrl = new URL("./proposta-etal/index.html", import.meta.url).href;

const PropostaEtal = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <iframe
        src={assetUrl}
        title="Proposta Sistema de Gestão Integrado"
        className="flex-1 w-full border-0"
        style={{ minHeight: "100vh" }}
      />
    </div>
  );
};

export default PropostaEtal;
