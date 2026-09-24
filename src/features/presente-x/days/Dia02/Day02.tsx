import React, { useEffect, useMemo, useState } from "react";
import { Share2, Sparkles, Video } from "lucide-react";
import confetti from "canvas-confetti";
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

const normalizeWord = (value: string) =>
  value
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .trim();

const WORDS = [
  { label: "Incrível", value: "INCRIVEL" },
  { label: "Especial", value: "ESPECIAL" },
  { label: "Plena", value: "PLENA" },
  { label: "Leve", value: "LEVE" },
  { label: "Paz", value: "PAZ" },
  { label: "Alegria", value: "ALEGRIA" },
  { label: "Coração", value: "CORACAO" },
  { label: "Generosa", value: "GENEROSA" },
  { label: "Mágica", value: "MAGICA" },
  { label: "Foco", value: "FOCO" },
  { label: "Luz", value: "LUZ" },
  { label: "Doce", value: "DOCE" },
];

const GRID_SIZE = 12;
const DIRECTIONS = [
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 1, dy: 1 },
  { dx: -1, dy: 1 },
];

const randomLetter = () => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet[Math.floor(Math.random() * alphabet.length)];
};

const generateGrid = () => {
  const grid = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => ""),
  );
  const placements: { word: string; cells: Array<[number, number]> }[] = [];

  for (const word of WORDS.map((w) => w.value)) {
    const letters = word.split("");
    let placed = false;

    for (let attempt = 0; attempt < 200 && !placed; attempt += 1) {
      const direction =
        DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const maxRow =
        direction.dy === 0 ? GRID_SIZE - 1 : GRID_SIZE - letters.length;
      const minRow = 0;
      const maxCol =
        direction.dx === 0
          ? GRID_SIZE - 1
          : direction.dx > 0
            ? GRID_SIZE - letters.length
            : GRID_SIZE - 1;
      const minCol = direction.dx < 0 ? letters.length - 1 : 0;

      const startRow =
        Math.floor(Math.random() * (maxRow - minRow + 1)) + minRow;
      const startCol =
        Math.floor(Math.random() * (maxCol - minCol + 1)) + minCol;

      const cells: Array<[number, number]> = [];
      let fits = true;

      for (let i = 0; i < letters.length; i += 1) {
        const r = startRow + direction.dy * i;
        const c = startCol + direction.dx * i;
        if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) {
          fits = false;
          break;
        }
        const current = grid[r][c];
        if (current && current !== letters[i]) {
          fits = false;
          break;
        }
        cells.push([r, c]);
      }

      if (fits) {
        cells.forEach(([r, c], idx) => {
          grid[r][c] = letters[idx];
        });
        placements.push({ word, cells });
        placed = true;
      }
    }
  }

  for (let r = 0; r < GRID_SIZE; r += 1) {
    for (let c = 0; c < GRID_SIZE; c += 1) {
      if (!grid[r][c]) grid[r][c] = randomLetter();
    }
  }

  return { grid, placements };
};

const serializeGrid = (grid: string[][]) => grid.map((row) => row.join(""));
const deserializeGrid = (rows: string[]) => rows.map((row) => row.split(""));

const findWordCells = (grid: string[][], word: string) => {
  const letters = word.split("");
  const cells: Array<[number, number]> = [];
  for (let r = 0; r < GRID_SIZE; r += 1) {
    for (let c = 0; c < GRID_SIZE; c += 1) {
      for (const dir of DIRECTIONS) {
        let ok = true;
        const temp: Array<[number, number]> = [];
        for (let i = 0; i < letters.length; i += 1) {
          const rr = r + dir.dy * i;
          const cc = c + dir.dx * i;
          if (rr < 0 || rr >= GRID_SIZE || cc < 0 || cc >= GRID_SIZE) {
            ok = false;
            break;
          }
          if (grid[rr][cc] !== letters[i]) {
            ok = false;
            break;
          }
          temp.push([rr, cc]);
        }
        if (ok) return temp;
      }
    }
  }
  return cells;
};

const getAgeBreakdown = (birthDate: Date, now: Date) => {
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += previousMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
};

const formatElapsed = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

interface Day02Props {
  onClose: () => void;
}

export const Day02: React.FC<Day02Props> = ({ onClose }) => {
  const { currentUser, setCurrentUser } = usePresenterUser();
  const [temperature, setTemperature] = useState<number | null>(null);
  const [{ grid }, setPuzzle] = useState(() => generateGrid());
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [startCell, setStartCell] = useState<{ r: number; c: number } | null>(
    null,
  );
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [started, setStarted] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const firstName = useMemo(() => {
    if (!currentUser?.full_name) return "";
    return currentUser.full_name.split(" ")[0];
  }, [currentUser]);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=-19.932&longitude=-44.053&current=temperature_2m",
        );
        const data = await response.json();
        const temp = data?.current?.temperature_2m;
        if (typeof temp === "number") setTemperature(temp);
      } catch (error) {
        console.warn("Weather API failed", error);
      }
    };
    loadWeather();
  }, []);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  useEffect(() => {
    const loadProgress = async () => {
      if (!currentUser) return;
      setLoadingProgress(true);
      const existing = await getDayProgress(currentUser.id, 2);
      if (existing) {
        setAlreadyClaimed(true);
        setCompleted(true);
        setStarted(true);
        setCoinsEarned(existing.points_earned || 0);
        const answers = (existing as any).answers;
        if (answers?.grid) {
          const storedGrid = deserializeGrid(answers.grid as string[]);
          setPuzzle({ grid: storedGrid, placements: [] });
        }
        if (answers?.timeSeconds) {
          setElapsedSeconds(answers.timeSeconds);
        }
        if (answers?.foundWords) {
          const words = answers.foundWords as string[];
          setFoundWords(words);
          const foundSet = new Set<string>();
          const activeGrid = answers?.grid
            ? deserializeGrid(answers.grid as string[])
            : grid;
          words.forEach((w) => {
            const cells = findWordCells(activeGrid, w);
            cells.forEach(([r, c]) => foundSet.add(`${r}-${c}`));
          });
          setFoundCells(foundSet);
        }
      }
      setLoadingProgress(false);
    };

    loadProgress();
  }, [currentUser]);

  const greetingData = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    const greeting =
      hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
    const period = hour < 12 ? "manhã" : hour < 18 ? "tarde" : "noite";
    const timeLabel = now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const weekday = now
      .toLocaleDateString("pt-BR", { weekday: "long" })
      .toLowerCase();

    // Ajuste a data de nascimento se necessário
    const birthDate = new Date(2002, 4, 24);
    const { years, months, days } = getAgeBreakdown(birthDate, now);

    return { greeting, period, timeLabel, weekday, years, months, days };
  }, []);

  const temperatureText =
    temperature !== null ? Math.round(temperature).toString() : "alguns";

  const canPlay = started || completed || alreadyClaimed;

  const startGame = () => {
    if (alreadyClaimed || completed) return;
    setStarted(true);
    setElapsedSeconds(0);
    setTimerRunning(true);
  };

  const handleCellClick = (r: number, c: number) => {
    if (alreadyClaimed || completed) return;
    if (!started) return;

    if (!startCell) {
      setStartCell({ r, c });
      return;
    }

    const dx = c - startCell.c;
    const dy = r - startCell.r;

    const isHorizontal = dy === 0 && dx > 0;
    const isVertical = dx === 0 && dy > 0;
    const isDiagonal = Math.abs(dx) === Math.abs(dy) && dy > 0;

    if (!isHorizontal && !isVertical && !isDiagonal) {
      setStartCell(null);
      return;
    }

    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    const stepX = dx === 0 ? 0 : dx / Math.abs(dx);
    const stepY = dy === 0 ? 0 : dy / Math.abs(dy);

    const letters: string[] = [];
    const cells: Array<[number, number]> = [];
    for (let i = 0; i <= steps; i += 1) {
      const rr = startCell.r + stepY * i;
      const cc = startCell.c + stepX * i;
      letters.push(grid[rr][cc]);
      cells.push([rr, cc]);
    }

    const word = letters.join("");
    const wordEntry = WORDS.find((w) => w.value === word);
    if (wordEntry && !foundWords.includes(wordEntry.value)) {
      const nextFound = [...foundWords, wordEntry.value];
      setFoundWords(nextFound);
      const nextCells = new Set(foundCells);
      cells.forEach(([rr, cc]) => nextCells.add(`${rr}-${cc}`));
      setFoundCells(nextCells);

      if (nextFound.length === WORDS.length) {
        finishChallenge(nextFound);
      }
    }

    setStartCell(null);
  };

  const finishChallenge = async (finalWords: string[]) => {
    if (!currentUser) {
      toast.error("Entre com seu nome primeiro.");
      return;
    }

    setTimerRunning(false);
    setCompleted(true);

    try {
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.4 },
        });
      }, 300);
    } catch (error) {
      console.warn("Confetti failed", error);
    }

    const minutes = elapsedSeconds / 60;
    const earned = minutes < 5 ? 200 : minutes <= 10 ? 100 : 50;
    setCoinsEarned(earned);

    const existing = await getDayProgress(currentUser.id, 2);
    if (existing) {
      setAlreadyClaimed(true);
      return;
    }

    const newBalance = (currentUser.coins_balance ?? 0) + earned;
    const updated = await updateUserCoins(currentUser.id, newBalance);
    if (updated) {
      const answers = {
        foundWords: finalWords,
        timeSeconds: elapsedSeconds,
        grid: serializeGrid(grid),
      };
      const recorded = await recordDayProgress(
        currentUser.id,
        2,
        earned,
        answers,
      );
      if (!recorded) {
        toast.error("Não foi possível registrar a conclusão do dia.");
        return;
      }
      setCurrentUser({
        ...currentUser,
        coins_balance: newBalance,
      });
      toast.success(`Você ganhou ${earned} moedas!`);
    } else {
      toast.error("Não foi possível salvar as moedas. Verifique o banco.");
    }
  };

  const youtubeId = getYoutubeId(VIDEO_URL);

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
    ctx.font = "700 60px Inter, sans-serif";
    ctx.fillText("Presente • Dia 02", canvas.width / 2, 120);

    ctx.font = "500 30px Inter, sans-serif";
    ctx.fillStyle = "#9B8968";
    ctx.fillText(
      `Tempo: ${formatElapsed(elapsedSeconds)} • +${coinsEarned} moedas`,
      canvas.width / 2,
      180,
    );

    const cellSize = 42;
    const gridSizePx = GRID_SIZE * cellSize;
    const startX = (canvas.width - gridSizePx) / 2;
    const startY = 260;

    ctx.font = "600 20px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let r = 0; r < GRID_SIZE; r += 1) {
      for (let c = 0; c < GRID_SIZE; c += 1) {
        const x = startX + c * cellSize;
        const y = startY + r * cellSize;
        const key = `${r}-${c}`;
        const isFound = foundCells.has(key);
        ctx.fillStyle = isFound ? "#F5D5C8" : "#FFFFFF";
        ctx.strokeStyle = "#E8B4A0";
        ctx.lineWidth = 2;
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.strokeRect(x, y, cellSize, cellSize);
        ctx.fillStyle = "#5A4B44";
        ctx.fillText(grid[r][c], x + cellSize / 2, y + cellSize / 2);
      }
    }

    ctx.fillStyle = "#6B5D52";
    ctx.font = "500 28px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      `Caça-palavras completo por ${firstName || "Sthefany"}`,
      canvas.width / 2,
      startY + gridSizePx + 60,
    );

    return new Promise<Blob | null>((resolve) =>
      canvas.toBlob((blob) => resolve(blob), "image/png"),
    );
  };

  const handleShare = async () => {
    if (!completed) return;
    const blob = await buildShareImage();
    if (!blob) {
      toast.error("Não foi possível gerar a imagem.");
      return;
    }

    const file = new File([blob], "presente-dia02.png", { type: "image/png" });
    const url = URL.createObjectURL(blob);
    setShareUrl(url);

    const canShare =
      typeof navigator !== "undefined" &&
      "share" in navigator &&
      // @ts-expect-error: canShare may not exist in older browsers
      (!navigator.canShare || navigator.canShare({ files: [file] }));

    if (canShare) {
      try {
        // @ts-expect-error: share with files
        await navigator.share({
          title: "Presente - Dia 02",
          text: `Terminei o caça-palavras em ${formatElapsed(elapsedSeconds)}!`,
          files: [file],
        });
        return;
      } catch (error) {
        console.error("Share cancelled", error);
      }
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = "presente-dia02.png";
    link.click();
  };

  return (
    <div className="presente-x-modal-content">
      <div className="presente-x-modal-header">
        <div>
          <p className="presente-x-heading text-2xl">
            Dia 02 - Bom dia, Sthefany
          </p>
          <p className="presente-x-text text-sm">
            Um texto rápido e um desafio divertido.
          </p>
        </div>
        <button className="presente-x-btn" onClick={onClose}>
          Fechar
        </button>
      </div>

      <div className="presente-x-modal-section">
        <div className="presente-x-card p-6 space-y-4">
          <p className="presente-x-text leading-relaxed">
            {greetingData.greeting} {firstName || "Sthefany"}, hoje é sábado e
            provavelmente está fazendo uns {temperatureText} graus aí em
            Contagem. O dia deve estar lindo, ótimo para dar um passeio — ou, se
            você tiver que trabalhar, talvez não seja tão ruim assim. Eu estou
            tentando prever o futuro, mas se tem uma coisa que eu vou acertar é
            que você está lendo isso provavelmente às {greetingData.timeLabel}{" "}
            da {greetingData.period}. E você deve estar se perguntando como eu
            sei disso. A resposta é simples: eu sou um mágico. Ou você pode só
            acreditar que eu sou um garoto de programa e está tudo certo também.
          </p>
          <p className="presente-x-text leading-relaxed">
            Mas você, Sthefany, é o foco aqui. Por que eu estou fazendo tudo
            isso? Primeiro, porque nunca vou me cansar de dizer que você é
            incrível e merece coisas incríveis. Segundo, porque eu amei muito o
            presente que você fez pra mim no meu aniversário e queria retribuir
            em um nível acima. Terceiro, porque você merece se sentir especial
            todos os dias da sua vida. E nesses {greetingData.years} anos,{" "}
            {greetingData.months} meses e {greetingData.days} dias, você foi
            muito plena nas suas escolhas.
          </p>
          <p className="presente-x-text leading-relaxed">
            Você leva a vida de uma forma leve, traz paz e alegria até nos dias
            difíceis, e tudo isso parte do seu coração. Você faz isso mesmo
            quando dói em você: seu espírito de ajudar o próximo fala mais alto.
            Não importa se você está passando mal; se você vê alguém que ama
            numa situação ruim, você vai ajudar. Isso é o ato mais bonito que um
            ser humano pode fazer por outro.
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
                title="Video do Dia 02"
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
            <p className="presente-x-heading text-xl">Caça-palavras do Dia</p>
          </div>

          <div className="presente-x-wordsearch">
            <div className="presente-x-wordsearch-header">
              <p className="presente-x-text text-sm">
                Para encontrar uma palavra, clique na primeira letra e depois na
                última letra. As palavras podem estar em qualquer direção, mas
                não aparecem de trás para frente.
              </p>
              <div className="presente-x-timer">
                ⏱ {formatElapsed(elapsedSeconds)}
              </div>
            </div>

            {!canPlay ? (
              <div className="presente-x-card p-4 flex flex-col gap-3">
                <p className="presente-x-text">
                  Quando estiver pronta, clique em começar para iniciar o
                  cronômetro.
                </p>
                <button className="presente-x-btn w-fit" onClick={startGame}>
                  Começar
                </button>
              </div>
            ) : (
              <>
                <div className="presente-x-wordsearch-grid">
                  {grid.map((row, r) => (
                    <div key={`row-${r}`} className="presente-x-wordsearch-row">
                      {row.map((letter, c) => {
                        const key = `${r}-${c}`;
                        const isFound = foundCells.has(key);
                        const isStart =
                          startCell?.r === r && startCell?.c === c;
                        return (
                          <button
                            key={key}
                            type="button"
                            className={`presente-x-wordsearch-cell ${isFound ? "found" : ""} ${isStart ? "start" : ""}`}
                            onClick={() => handleCellClick(r, c)}
                            disabled={alreadyClaimed || completed}
                          >
                            {letter}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div className="presente-x-wordsearch-words">
                  {WORDS.map((word) => (
                    <span
                      key={word.value}
                      className={`presente-x-word ${foundWords.includes(word.value) ? "found" : ""}`}
                    >
                      {word.label}
                    </span>
                  ))}
                </div>
              </>
            )}

            {completed && (
              <div className="presente-x-quiz-result">
                <p className="presente-x-heading text-lg">
                  Você terminou em {formatElapsed(elapsedSeconds)} e ganhou{" "}
                  {coinsEarned} moedas!
                </p>
                {alreadyClaimed && (
                  <p className="text-sm text-[#9B8968]">
                    Você já recebeu as moedas desse dia.
                  </p>
                )}
                <button
                  className="presente-x-btn flex items-center gap-2 w-fit"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                  Compartilhar resultado
                </button>
                {shareUrl && (
                  <div className="presente-x-share-preview">
                    <img src={shareUrl} alt="Resultado do Dia 02" />
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
