import { useEffect, useState } from "react";
import styles from "./PropostaPresentation.module.css";

interface CountdownPriceProps {
  finalValue: number;
  duration?: number;
}

const CountdownPrice = ({
  finalValue,
  duration = 2000,
}: CountdownPriceProps) => {
  const [value, setValue] = useState(100000);
  const [isComplete, setIsComplete] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    if (!isRevealed) {
      setIsRevealed(true);
    }
  };

  useEffect(() => {
    if (!isRevealed) return;

    const startValue = 100000;
    const startTime = Date.now();
    const endTime = startTime + duration;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function (ease-out cubic for smooth deceleration)
      const eased = 1 - Math.pow(1 - progress, 3);

      const current = Math.round(
        startValue - (startValue - finalValue) * eased
      );
      setValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setValue(finalValue);
        setIsComplete(true);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 400);

    return () => clearTimeout(timer);
  }, [finalValue, duration, isRevealed]);

  return (
    <button
      type="button"
      onClick={handleReveal}
      className={`${styles.amountLarge} ${styles.priceRevealButton} ${
        isRevealed
          ? isComplete
            ? styles.amountComplete
            : styles.amountCounting
          : styles.amountHidden
      }`}
      disabled={isRevealed}
    >
      {isRevealed ? `R$ ${value.toLocaleString("pt-BR")}` : "R$ ??.???"}
    </button>
  );
};

export default CountdownPrice;
