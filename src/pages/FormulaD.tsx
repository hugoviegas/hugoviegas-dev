import { useEffect } from "react";
import Footer from "@/components/Footer";

const FormulaD = () => {
  useEffect(() => {
    window.location.href = "/games/formula-d/index.html";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <p>Redirecionando para o jogo...</p>
    </div>
  );
};

export default FormulaD;
