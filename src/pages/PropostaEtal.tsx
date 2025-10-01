import { useEffect } from "react";
import PropostaPresentation from "@/features/proposta/PropostaPresentation";

const PropostaEtal = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <PropostaPresentation />;
};

export default PropostaEtal;
