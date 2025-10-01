import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Handshake, Sparkles, CheckCircle2, CalendarClock } from "lucide-react";
import styles from "./PropostaPresentation.module.css";

const CTAButtons = () => {
  const [showThankYou, setShowThankYou] = useState(false);

  const handleAcceptProposal = () => {
    setShowThankYou(true);
  };

  if (showThankYou) {
    return (
      <div className={styles.thankYouCard}>
        <div className={styles.handshakeAnimation}>
          <Handshake size={64} strokeWidth={1.5} />
        </div>
        <div className={styles.thankYouContent}>
          <div className={styles.sparklesWrapper}>
            <Sparkles className={styles.sparkle1} size={24} />
            <Sparkles className={styles.sparkle2} size={18} />
            <Sparkles className={styles.sparkle3} size={20} />
          </div>
          <h3 className={styles.thankYouTitle}>Obrigado pela confiança!</h3>
          <p className={styles.thankYouMessage}>
            Estou muito animado para construir esta solução com vocês. 
            Em breve entrarei em contato para agendar nosso kick-off e 
            começarmos esta jornada digital juntos.
          </p>
          <div className={styles.nextSteps}>
            <div className={styles.nextStepItem}>
              <CheckCircle2 size={20} />
              <span>Alinhamento de escopo</span>
            </div>
            <div className={styles.nextStepItem}>
              <CheckCircle2 size={20} />
              <span>Definição de prioridades</span>
            </div>
            <div className={styles.nextStepItem}>
              <CheckCircle2 size={20} />
              <span>Início do desenvolvimento</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.ctaGroup}>
      <Button 
        size="lg" 
        className={styles.primaryAction}
        onClick={handleAcceptProposal}
      >
        <Handshake size={20} />
        Aceitar proposta
      </Button>
      <Button
        size="lg"
        variant="outline"
        className={styles.secondaryAction}
      >
        <CalendarClock size={20} />
        Agendar reunião
      </Button>
    </div>
  );
};

export default CTAButtons;
