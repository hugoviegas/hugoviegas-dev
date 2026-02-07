import React, { useEffect, useMemo, useState } from "react";
import { Star, Video, Sparkles, Share2 } from "lucide-react";
import { toast } from "sonner";
import "@/features/presente-x/styles/theme.css";
import { usePresenterUser } from "@/features/presente-x/contexts/UserContext";
import {
  getDayProgress,
  recordDayProgress,
  updateUserCoins,
} from "@/features/presente-x/services/userService";

const VIDEO_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

const getYoutubeId = (url: string) => {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match?.[1] ?? "";
};

const normalizeAnswer = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const QUESTION_ONE_CORRECT = "hugo gabriel henriques viegas";

interface Day01Props {
  onClose: () => void;
}

export const Day01: React.FC<Day01Props> = ({ onClose }) => {
  const { currentUser, setCurrentUser } = usePresenterUser();
  const [ready, setReady] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [q1Answer, setQ1Answer] = useState("");
  const [q2Answer, setQ2Answer] = useState("");
  const [q3Answer, setQ3Answer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [storedAnswers, setStoredAnswers] = useState<Record<
    string,
    string
  > | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(false);

  const firstName = useMemo(() => {
    if (!currentUser?.full_name) return "";
    return currentUser.full_name.split(" ")[0];
  }, [currentUser]);

  const inputsLocked = timedOut || submitted || alreadyClaimed;

  useEffect(() => {
    const loadProgress = async () => {
      if (!currentUser) return;
      setLoadingProgress(true);
      const existing = await getDayProgress(currentUser.id, 1);
      if (existing) {
        setAlreadyClaimed(true);
        setSubmitted(true);
        setCoinsEarned(existing.points_earned || 0);
        // load stored answers into state so the user can view them
        if ((existing as any).answers) {
          const a = (existing as any).answers as Record<string, string>;
          setStoredAnswers(a);
          setQ1Answer(a.q1 || "");
          setQ2Answer(a.q2 || "");
          setQ3Answer(a.q3 || "");
        }
      }
      setLoadingProgress(false);
    };

    loadProgress();
  }, [currentUser]);

  useEffect(() => {
    if (!timerActive) return;
    if (secondsLeft <= 0) {
      setTimerActive(false);
      setTimedOut(true);
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, secondsLeft]);

  const handleStartTimer = () => {
    if (alreadyClaimed) return;
    setReady(true);
    setSecondsLeft(30);
    setTimedOut(false);
    setTimerActive(true);
  };

  const computeScore = () => {
    let total = 0;
    if (normalizeAnswer(q1Answer) === QUESTION_ONE_CORRECT) total += 1;
    if (q2Answer === "2012") total += 1;
    if (normalizeAnswer(q3Answer) === "acai") total += 1;
    return total;
  };

  const handleSubmit = async () => {
    if (submitted) return;
    if (!currentUser) {
      toast.error("Entre com seu nome primeiro.");
      return;
    }

    if (!ready) {
      toast.error("Clique em preparada para iniciar o tempo.");
      return;
    }

    const result = computeScore();
    const earned = result * 10;
    setScore(result);
    setCoinsEarned(earned);
    setSubmitted(true);

    const existing = await getDayProgress(currentUser.id, 1);
    if (existing) {
      setAlreadyClaimed(true);
      return;
    }

    const answersObj = { q1: q1Answer, q2: q2Answer, q3: q3Answer };

    const newBalance = (currentUser.coins_balance ?? 0) + earned;
    const updated = await updateUserCoins(currentUser.id, newBalance);
    if (updated) {
      const recorded = await recordDayProgress(
        currentUser.id,
        1,
        earned,
        answersObj,
      );
      if (!recorded) {
        toast.error("Não foi possível registrar a conclusão do dia.");
        return;
      }
      setCurrentUser({
        ...currentUser,
        coins_balance: newBalance,
      });
      // persist stored answers locally as well
      setStoredAnswers(answersObj);
      toast.success(`Você ganhou ${earned} moedas!`);
    } else {
      toast.error(
        "Não foi possível salvar as moedas. Verifique se o banco foi atualizado.",
      );
    }
  };

  const buildShareImage = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
    gradient.addColorStop(0, "#FAF7F2");
    gradient.addColorStop(1, "#F5E6D3");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center";
    ctx.fillStyle = "#6B5D52";
    ctx.font = "700 64px Inter, sans-serif";
    ctx.fillText("Presente • Dia 01", canvas.width / 2, 140);

    ctx.font = "500 34px Inter, sans-serif";
    ctx.fillStyle = "#9B8968";
    ctx.fillText(
      `Resultado de ${firstName || "Visitante"}`,
      canvas.width / 2,
      200,
    );

    const starY = 270;
    const starSpacing = 80;
    const startX = canvas.width / 2 - starSpacing;
    ctx.font = "700 64px Inter, sans-serif";
    [0, 1, 2].forEach((index) => {
      ctx.fillStyle = index < score ? "#F4C95D" : "#E2D6C8";
      ctx.fillText("★", startX + index * starSpacing, starY);
    });

    ctx.fillStyle = "#D4A574";
    ctx.font = "700 46px Inter, sans-serif";
    ctx.fillText(`${score}/3 acertos`, canvas.width / 2, 350);
    ctx.fillText(`+${coinsEarned} moedas`, canvas.width / 2, 410);

    ctx.fillStyle = "#6B5D52";
    ctx.font = "600 34px Inter, sans-serif";
    ctx.fillText("Perguntas e respostas", canvas.width / 2, 510);

    ctx.font = "400 28px Inter, sans-serif";
    ctx.fillStyle = "#9B8968";
    ctx.fillText(`1) ${q1Answer || "-"}`, canvas.width / 2, 580);
    ctx.fillText(`2) ${q2Answer || "-"}`, canvas.width / 2, 640);
    ctx.fillText(`3) ${q3Answer || "-"}`, canvas.width / 2, 700);

    ctx.fillStyle = "#E8B4A0";
    ctx.font = "600 28px Inter, sans-serif";
    ctx.fillText("Que os jogos comecem...", canvas.width / 2, 820);

    return new Promise<Blob | null>((resolve) =>
      canvas.toBlob((blob) => resolve(blob), "image/png"),
    );
  };

  const handleShare = async () => {
    if (!submitted) return;
    const blob = await buildShareImage();
    if (!blob) {
      toast.error("Não foi possível gerar a imagem.");
      return;
    }

    const file = new File([blob], "presente-dia01.png", { type: "image/png" });
    const url = URL.createObjectURL(blob);
    setShareUrl(url);

    type NavigatorWithShare = Navigator & {
      canShare?: (data?: { files?: File[] }) => boolean;
      share?: (data: {
        title?: string;
        text?: string;
        files?: File[];
      }) => Promise<void>;
    };

    const nav =
      typeof navigator !== "undefined"
        ? (navigator as NavigatorWithShare)
        : undefined;

    const canShare =
      !!nav &&
      typeof nav.share === "function" &&
      (typeof nav.canShare !== "function" || nav.canShare({ files: [file] }));

    if (canShare && nav) {
      try {
        await nav.share!({
          title: "Presente - Dia 01",
          text: `Olha meu resultado de hoje! ${score}/3 e +${coinsEarned} moedas 🎁`,
          files: [file],
        });
        return;
      } catch (error) {
        console.error("Share cancelled", error);
      }
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = "presente-dia01.png";
    link.click();
  };

  const youtubeId = getYoutubeId(VIDEO_URL);

  return (
    <div className="presente-x-modal-content">
      <div className="presente-x-modal-header">
        <div>
          <p className="presente-x-heading text-2xl">
            Dia 01 - Que os jogos comecem
          </p>
          <p className="presente-x-text text-sm">
            Um começo especial para o mês mais esperado.
          </p>
        </div>
        <button className="presente-x-btn" onClick={onClose}>
          Fechar
        </button>
      </div>

      <div className="presente-x-modal-section">
        <div className="presente-x-card p-6 space-y-4">
          <p className="presente-x-text leading-relaxed">
            Então chegou o mês do seu aniversário... e eu preparei várias
            surpresas para você. Serão 24 dias até o seu aniversário de 24 anos.
            Eu comecei a planejar isso no dia que recebi o seu presente, então
            eu devo estar um pouco ansioso demais pra isso. Você terá que entrar
            aqui nesse mesmo site todos os dias. Você vai conseguir ganhar
            pontos e moedas, exatamente como um jogo haha, sim, eu fiz um jogo
            somente para você. Como eu sei que sua bateria social é bem baixa,
            alguns dias vão ter poucas coisas e outros terão desafios um pouco
            mais difíceis. Você pode solicitar dicas para o criador do jogo, mas
            terá que gastar suas moedas.
          </p>
          <p className="presente-x-text leading-relaxed">
            Ah, não sei se você já viu, mas tem uma lojinha aqui que você pode
            gastar suas moedas e isso vai te dar prêmios de verdade. Se você
            conseguir fazer tudo provavelmente será suficiente para resgatar
            vários prêmios. Eu espero que aproveite cada dia e que eu consiga
            tirar um sorriso seu e talvez algumas lágrimas, mas faz parte haha.
          </p>
          <p className="presente-x-text font-semibold">
            Que os jogos comecem...
          </p>
        </div>
      </div>

      <div className="presente-x-modal-section">
        <div className="presente-x-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-[#D4A574]" />
            <p className="presente-x-heading text-xl">Vídeo do Dia</p>
          </div>
          <div className="presente-x-video">
            {youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="Video do Dia 01"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <p className="presente-x-text">Vídeo indisponível.</p>
            )}
          </div>
          <p className="text-xs text-[#9B8968]">
            Assim que você trocar o link do vídeo, ele aparece aqui 💛
          </p>
        </div>
      </div>

      <div className="presente-x-modal-section">
        <div className="presente-x-card p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E8B4A0]" />
            <p className="presente-x-heading text-xl">Quiz do Dia</p>
          </div>

          <div className="presente-x-quiz">
            <p className="text-xs text-[#9B8968]">
              Nota: você terá 30 segundos para responder todas as questões.
            </p>
            {!ready ? (
              <button
                className="presente-x-btn"
                onClick={handleStartTimer}
                disabled={alreadyClaimed}
              >
                Preparada
              </button>
            ) : (
              <div className="presente-x-timer">
                <span>⏳ {secondsLeft}s</span>
              </div>
            )}

            {(ready || submitted || alreadyClaimed) && (
              <>
                <div className="presente-x-quiz-block">
                  <p className="presente-x-text font-semibold">
                    1) Qual o nome completo do criador desse site?
                  </p>
                  <input
                    className="presente-x-input w-full"
                    placeholder="Digite o nome completo"
                    value={q1Answer}
                    onChange={(event) => setQ1Answer(event.target.value)}
                    disabled={inputsLocked}
                  />
                </div>

                <div className="presente-x-quiz-block">
                  <p className="presente-x-text font-semibold">
                    2) Em que ano nos conhecemos?
                  </p>
                  <div className="presente-x-options">
                    {["2010", "2011", "2012", "2013"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`presente-x-option ${q2Answer === option ? "selected" : ""}`}
                        onClick={() => setQ2Answer(option)}
                        disabled={inputsLocked}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="presente-x-quiz-block">
                  <p className="presente-x-text font-semibold">
                    3) Qual sua comida favorita?
                  </p>
                  <div className="presente-x-options">
                    {["Pudim", "Pao de Queijo", "Açaí", "Sorvete"].map(
                      (option) => (
                        <button
                          key={option}
                          type="button"
                          className={`presente-x-option ${q3Answer === option ? "selected" : ""}`}
                          onClick={() => setQ3Answer(option)}
                          disabled={inputsLocked}
                        >
                          {option}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {timedOut && (
                  <p className="text-xs text-red-500">
                    Tempo esgotado! Suas respostas foram bloqueadas.
                  </p>
                )}

                <button
                  className="presente-x-btn"
                  onClick={handleSubmit}
                  disabled={submitted || alreadyClaimed}
                >
                  Finalizar Quiz
                </button>
              </>
            )}

            {submitted && (
              <div className="presente-x-quiz-result">
                <div className="flex items-center gap-2">
                  {[0, 1, 2].map((index) => (
                    <Star
                      key={index}
                      className={`w-6 h-6 ${index < score ? "text-[#F4C95D]" : "text-[#E2D6C8]"}`}
                      fill={index < score ? "#F4C95D" : "none"}
                    />
                  ))}
                </div>
                <p className="presente-x-heading text-lg">
                  Parabéns! Você acertou {score}/3 e ganhou {coinsEarned}{" "}
                  moedas! 🌟
                </p>
                {alreadyClaimed && (
                  <p className="text-sm text-[#9B8968]">
                    Você já recebeu as moedas desse dia e o quiz foi concluído.
                  </p>
                )}
                <button
                  className="presente-x-btn flex items-center gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                  Compartilhar resultado
                </button>
                <p className="text-xs text-[#9B8968]">
                  Compartilhe o resultado do dia com o criador do jogo 💬
                </p>
                {shareUrl && (
                  <div className="presente-x-share-preview">
                    <img src={shareUrl} alt="Resultado do Dia 01" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
