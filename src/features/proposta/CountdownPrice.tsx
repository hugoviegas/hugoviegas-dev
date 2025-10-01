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

  useEffect(() => {
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
  }, [finalValue, duration]);

  return (
    <p
      className={`${styles.amountLarge} ${
        isComplete ? styles.amountComplete : styles.amountCounting
      }`}
    >
      R$ {value.toLocaleString("pt-BR")}
    </p>
  );
};

export default CountdownPrice;
