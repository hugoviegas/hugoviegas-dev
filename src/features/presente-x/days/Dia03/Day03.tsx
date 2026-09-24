import React, { useEffect, useMemo, useState } from "react";
import { Share2, Sparkles, Video } from "lucide-react";
import { toast } from "sonner";
import "@/features/presente-x/styles/theme.css";
import { usePresenterUser } from "@/features/presente-x/contexts/UserContext";
import {
  getDayProgress,
  getSharedDayProgress,
  upsertDayProgress,
  updateUserCoins,
  getUserById,
  findUserByPartialName,
} from "@/features/presente-x/services/userService";

interface DayAnswers {
  part1?: string;
  part2?: string;
  part3?: string;
  part4?: string;
  part5?: string;
  part6?: string;
  theme?: string;
  part1_author?: string;
  part2_author?: string;
  part3_author?: string;
  part4_author?: string;
  part5_author?: string;
  part6_author?: string;
}

interface DayProgress {
  user_id?: number | null;
  answers?: DayAnswers | null;
  points_earned?: number | null;
  completedAt?: string | null;
  updatedAt?: string | null;
}

const VIDEO_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

const getYoutubeId = (url: string) => {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match?.[1] ?? "";
};

const THEME_SUGGESTIONS = [
  "Romance leve",
  "Mistério",
  "Aventura",
  "Comédia",
  "Fantasia urbana",
  "Drama",
  "Reviravolta emocional",
];

const PART3_SYSTEM_PROMPT = `Você é uma IA que vai escrever a 3ª parte de uma história colaborativa.
Regras: aproximadamente 500 caracteres, em português brasileiro informal, manter o enredo e inserir a característica escolhida.
Não finalize a história. Deixe uma brecha clara para a parte 4 continuar.`;

const FINAL_SYSTEM_PROMPT = `Você é uma IA que vai escrever o desfecho final da história colaborativa.
Regras: finalize a história com um fechamento claro, em português brasileiro informal.
Use todo o contexto fornecido e mantenha coerência com as partes anteriores.`;

const callGemini = async (prompt: string) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Chave da IA não configurada. Defina VITE_GEMINI_API_KEY.");
  }

  // Tentar usar o modelo Gemini 2.5 Flash (ou Lite) conforme disponibilidade do Free Tier
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Erro ao chamar a IA");
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return text.trim();
};

const buildShareAsset = async (
  title: string,
  storyText: string,
): Promise<{ blob: Blob; mime: string; fileName: string } | null> => {
  // page in pixels (approx A4-ish for nicer print look; still moderate size)
  const PAGE_W = 1275; // width in px
  const PAGE_H = 1754; // height in px

  // helper to wrap text into lines given ctx/font
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
  ) => {
    const words = text.split(" ");
    const lines: string[] = [];
    let line = "";
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = line ? line + " " + word : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) lines.push(line);
    return lines;
  };

  // Create a temporary canvas context to measure and split into pages
  const measureCanvas = document.createElement("canvas");
  measureCanvas.width = PAGE_W;
  measureCanvas.height = PAGE_H;
  const mctx = measureCanvas.getContext("2d");
  if (!mctx) return null;

  // Title style
  const titleFontSize = 42;
  mctx.font = `700 ${titleFontSize}px Inter, sans-serif`;
  const titleHeight = titleFontSize + 20;

  // Body font and scalable sizing
  let bodyFontSize = 30;
  const minBodyFontSize = 16;

  const maxTextWidth = PAGE_W - 120; // padding
  let lines = [] as string[];
  let lineHeight = Math.round(bodyFontSize * 1.4);

  // Find suitable font size so text fits in reasonable number of pages
  while (bodyFontSize >= minBodyFontSize) {
    mctx.font = `400 ${bodyFontSize}px Inter, sans-serif`;
    lineHeight = Math.round(bodyFontSize * 1.4);
    lines = wrapText(mctx, storyText, maxTextWidth);
    const maxLinesPerPage = Math.floor(
      (PAGE_H - titleHeight - 200) / lineHeight,
    );
    // arbitrary cutoff: prefer <= 8 pages
    const neededPages = Math.ceil(lines.length / maxLinesPerPage) || 1;
    if (neededPages <= 8) break;
    bodyFontSize -= 2;
  }

  // paginate lines into pages
  mctx.font = `400 ${bodyFontSize}px Inter, sans-serif`;
  lineHeight = Math.round(bodyFontSize * 1.4);
  const maxLinesPerPage = Math.floor((PAGE_H - titleHeight - 200) / lineHeight);

  const pages: string[][] = [];
  for (let i = 0; i < lines.length; i += maxLinesPerPage) {
    pages.push(lines.slice(i, i + maxLinesPerPage));
  }

  // If only one page, return PNG; otherwise create multi-page PDF
  if (pages.length <= 1) {
    // Single-page: produce a smaller PNG (narrower width) and left-aligned text
    const CANVAS_W = 900; // smaller for lighter PNG
    const CANVAS_H = 1200;
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // background
    ctx.fillStyle = "#FAF7F2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // title (left aligned now)
    ctx.textAlign = "left";
    ctx.fillStyle = "#6B5D52";
    ctx.font = `700 ${titleFontSize}px Inter, sans-serif`;
    ctx.fillText(title, 60, 60);

    // body (left aligned)
    ctx.fillStyle = "#9B8968";
    ctx.font = `400 ${bodyFontSize}px Inter, sans-serif`;

    const linesToRender = pages[0] || [];
    let y = 60 + titleHeight;
    const leftX = 60;
    linesToRender.forEach((l) => {
      ctx.fillText(l, leftX, y);
      y += lineHeight;
    });

    const blob: Blob | null = await new Promise(
      (resolve) => canvas.toBlob((b) => resolve(b), "image/png", 0.8), // quality param where supported
    );

    if (!blob) return null;
    return { blob, mime: "image/png", fileName: "presente-dia03.png" };
  }

  // Multi-page PDF path (dynamic import to avoid SSR issues)
  try {
    const canvases: HTMLCanvasElement[] = [];
    for (let p = 0; p < pages.length; p++) {
      const canvas = document.createElement("canvas");
      canvas.width = PAGE_W;
      canvas.height = PAGE_H;
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;

      const gradient = ctx.createLinearGradient(0, 0, PAGE_W, PAGE_H);
      gradient.addColorStop(0, "#FAF7F2");
      gradient.addColorStop(1, "#F5E6D3");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.textAlign = "center";
      ctx.fillStyle = "#6B5D52";
      ctx.font = `700 ${titleFontSize}px Inter, sans-serif`;
      ctx.fillText(title, canvas.width / 2, 80);

      ctx.fillStyle = "#9B8968";
      ctx.font = `400 ${bodyFontSize}px Inter, sans-serif`;

      let y = 120 + titleHeight;
      const pageLines = pages[p];
      pageLines.forEach((l) => {
        ctx.fillText(l, canvas.width / 2, y);
        y += lineHeight;
      });

      // page number footer
      ctx.font = `400 ${Math.max(12, bodyFontSize - 6)}px Inter, sans-serif`;
      ctx.fillStyle = "#7E6A5A";
      ctx.fillText(
        `Página ${p + 1} de ${pages.length}`,
        canvas.width / 2,
        canvas.height - 40,
      );

      canvases.push(canvas);
    }

    // Build a text-based PDF (smaller) using jsPDF text APIs
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "pt", format: "a4" });

    const margin = 40; // pt
    const pdfW = pdf.internal.pageSize.getWidth() - margin * 2;

    // Use splitTextToSize to break lines properly and write left-aligned text
    for (let p = 0; p < pages.length; p++) {
      const pageLines = pages[p];
      const textBlock = pageLines.join("\n");
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(bodyFontSize);
      const split = pdf.splitTextToSize(textBlock, pdfW);
      pdf.text(split, margin, 80, { align: "left" });

      // Page footer
      pdf.setFontSize(Math.max(8, bodyFontSize - 6));
      pdf.text(
        `Página ${p + 1} de ${pages.length}`,
        margin,
        pdf.internal.pageSize.getHeight() - 30,
        { align: "left" },
      );

      if (p < pages.length - 1) pdf.addPage();
    }

    const blob = pdf.output("blob");
    return { blob, mime: "application/pdf", fileName: "presente-dia03.pdf" };
  } catch (err) {
    console.error("Error building multi-page PDF share asset:", err);
    return null;
  }
};

// Build the first page as a PNG even when the full asset is multi-page PDF.
const buildFirstPagePNG = async (title: string, storyText: string) => {
  // reuse most parameters from buildShareAsset but only render first page
  const PAGE_W = 900;
  const PAGE_H = 1200;

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
  ) => {
    const words = text.split(" ");
    const lines: string[] = [];
    let line = "";
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = line ? line + " " + word : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) lines.push(line);
    return lines;
  };

  const measureCanvas = document.createElement("canvas");
  measureCanvas.width = PAGE_W;
  measureCanvas.height = PAGE_H;
  const mctx = measureCanvas.getContext("2d");
  if (!mctx) return null;

  const titleFontSize = 42;
  mctx.font = `700 ${titleFontSize}px Inter, sans-serif`;
  const titleHeight = titleFontSize + 20;

  let bodyFontSize = 26;
  const minBodyFontSize = 14;
  const maxTextWidth = PAGE_W - 120;
  let lines: string[] = [];
  let lineHeight = Math.round(bodyFontSize * 1.4);

  while (bodyFontSize >= minBodyFontSize) {
    mctx.font = `400 ${bodyFontSize}px Inter, sans-serif`;
    lineHeight = Math.round(bodyFontSize * 1.4);
    lines = wrapText(mctx, storyText, maxTextWidth);
    const maxLinesPerPage = Math.floor(
      (PAGE_H - titleHeight - 200) / lineHeight,
    );
    if (lines.length <= maxLinesPerPage) break;
    bodyFontSize -= 2;
  }

  const firstPageLines = lines.slice(
    0,
    Math.floor((PAGE_H - titleHeight - 200) / lineHeight),
  );

  const canvas = document.createElement("canvas");
  canvas.width = PAGE_W;
  canvas.height = PAGE_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#FAF7F2";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = "left";
  ctx.fillStyle = "#6B5D52";
  ctx.font = `700 ${titleFontSize}px Inter, sans-serif`;
  ctx.fillText(title, 60, 60);

  ctx.fillStyle = "#9B8968";
  ctx.font = `400 ${bodyFontSize}px Inter, sans-serif`;

  let y = 60 + titleHeight;
  const leftX = 60;
  firstPageLines.forEach((l) => {
    ctx.fillText(l, leftX, y);
    y += lineHeight;
  });

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/png", 0.8),
  );

  if (!blob) return null;
  return { blob, mime: "image/png", fileName: "presente-dia03-page1.png" };
};

const shareStory = async (
  title: string,
  storyText: string,
  setShareUrl: (v: string | null) => void,
  setShareMime?: (m: string | null) => void,
) => {
  const asset = await buildShareAsset(title, storyText);
  if (!asset) return;

  const file = new File([asset.blob], asset.fileName, { type: asset.mime });
  const url = URL.createObjectURL(asset.blob);
  setShareUrl(url);
  if (setShareMime) setShareMime(asset.mime);

  const canShare =
    typeof navigator !== "undefined" &&
    "share" in navigator &&
    (!navigator.canShare || navigator.canShare({ files: [file] }));

  if (canShare) {
    try {
      // Share file (PNG or PDF)
      // @ts-expect-error: navigator.share may accept files depending on browser
      await navigator.share({
        title,
        text: "Olha nossa história!",
        files: [file],
      });
      return;
    } catch (error) {
      console.error("Share cancelled", error);
    }
  }

  // fallback to download
  const link = document.createElement("a");
  link.href = url;
  link.download = asset.fileName;
  link.click();
};

interface Day03Props {
  onClose: () => void;
}

export const Day03: React.FC<Day03Props> = ({ onClose }) => {
  const { currentUser, setCurrentUser } = usePresenterUser();
  const [part1, setPart1] = useState("");
  const [part2, setPart2] = useState("");
  const [part3, setPart3] = useState("");
  const [part4, setPart4] = useState("");
  const [part5, setPart5] = useState("");
  const [part6, setPart6] = useState("");
  const [theme, setTheme] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareMime, setShareMime] = useState<string | null>(null);

  // collaborative story owner (the canonical row that everyone reads/writes)
  const [storyOwnerId, setStoryOwnerId] = useState<number | null>(null);
  const [storyOwnerName, setStoryOwnerName] = useState<string | null>(null);

  // per-part author names (kept in state for quick UI badges)
  const [part1Author, setPart1Author] = useState<string>("");
  const [part2Author, setPart2Author] = useState<string>("");
  const [part3Author, setPart3Author] = useState<string>("");
  const [part4Author, setPart4Author] = useState<string>("");
  const [part5Author, setPart5Author] = useState<string>("");
  const [part6Author, setPart6Author] = useState<string>("");

  const isCreator = useMemo(() => {
    const name = (currentUser?.full_name || "").toLowerCase();
    return name.includes("hugo");
  }, [currentUser]);

  useEffect(() => {
    const load = async () => {
      if (!currentUser) return;

      const existing = await getDayProgress(currentUser.id, 3);
      const shared = await getSharedDayProgress(3);

      const hasParts = (answers?: DayAnswers | null) => {
        if (!answers) return false;
        const keys: (keyof DayAnswers)[] = [
          "part1",
          "part2",
          "part3",
          "part4",
          "part5",
          "part6",
        ];
        return keys.some(
          (k) => ((answers[k] ?? "") as string).toString().trim().length > 0,
        );
      };

      // Choose the source to display:
      // - prefer the user's own row if it has content or is already completed
      // - otherwise prefer the most recently shared row that has content
      let source: DayProgress | null = null;

      if (
        existing &&
        (hasParts((existing as DayProgress).answers) ||
          ((existing as DayProgress).points_earned ?? 0) > 0)
      ) {
        source = existing as DayProgress;
      } else if (shared && hasParts((shared as DayProgress).answers)) {
        source = shared as DayProgress;
      } else if (existing) {
        source = existing as DayProgress;
      }

      if (source) {
        const answers = (source.answers || {}) as DayAnswers;
        setPart1(answers.part1 || "");
        setPart2(answers.part2 || "");
        setPart3(answers.part3 || "");
        setPart4(answers.part4 || "");
        setPart5(answers.part5 || "");
        setPart6(answers.part6 || "");
        setTheme(answers.theme || "");

        // load per-part authors (if present)
        setPart1Author(answers.part1_author || "");
        setPart2Author(answers.part2_author || "");
        setPart3Author(answers.part3_author || "");
        setPart4Author(answers.part4_author || "");
        setPart5Author(answers.part5_author || "");
        setPart6Author(answers.part6_author || "");

        setStoryOwnerId(source.user_id);
        if (source.user_id) {
          const u = await getUserById(source.user_id);
          setStoryOwnerName(u?.full_name || null);
        }

        if ((source.points_earned ?? 0) > 0) {
          setCompleted(true);
          setAlreadyClaimed(true);
          setCoinsEarned(source.points_earned ?? 0);
        }

        return;
      }

      // No row to show: start a fresh story owned by current user
      setStoryOwnerId(currentUser.id);
      setStoryOwnerName(currentUser.full_name || null);
    };

    load();
  }, [currentUser]);

  const persist = async (
    changedPart?: string,
    overrideCoins?: number,
    aiAuthor?: string,
  ) => {
    if (!currentUser) return;
    const payload: Partial<DayAnswers> & {
      updatedAt: string;
      [key: string]: unknown;
    } = {
      part1,
      part2,
      part3,
      part4,
      part5,
      part6,
      theme,
      updatedAt: new Date().toISOString(),
    };

    // Attach per-part author when saving a specific part
    if (changedPart) {
      payload[`${changedPart}_author`] = aiAuthor ?? currentUser.full_name;
      const authorToSet = aiAuthor ?? currentUser.full_name;
      switch (changedPart) {
        case "part1":
          // update local author state for immediate UI feedback
          // (we declare these state setters below if/when needed)
          try {
            setPart1Author(authorToSet);
          } catch (e) {
            /* noop if state not present */
            void e;
          }
          break;
        case "part2":
          try {
            setPart2Author(authorToSet);
          } catch (e) {
            /* noop if state not present */
            void e;
          }
          break;
        case "part3":
          try {
            setPart3Author(authorToSet);
          } catch (e) {
            /* noop if state not present */
            void e;
          }
          break;
        case "part4":
          try {
            setPart4Author(authorToSet);
          } catch (e) {
            /* noop if state not present */
            void e;
          }
          break;
        case "part5":
          try {
            setPart5Author(authorToSet);
          } catch (e) {
            /* noop if state not present */
            void e;
          }
          break;
        case "part6":
          try {
            setPart6Author(authorToSet);
          } catch (e) {
            /* noop if state not present */
            void e;
          }
          break;
      }
    }

    // If a story owner exists, write to that owner's row so everyone shares the same story
    const target = storyOwnerId ?? currentUser.id;

    await upsertDayProgress(
      currentUser.id,
      3,
      overrideCoins ?? coinsEarned,
      payload,
      target,
    );
  };

  const handleSavePart1 = async () => {
    if (!part1.trim()) {
      toast.error("Escreva o primeiro parágrafo.");
      return;
    }
    await persist("part1", 0);
    toast.success("Parte 1 salva!");
  };

  const handleSavePart2 = async () => {
    if (!part2.trim()) {
      toast.error("Escreva a segunda parte.");
      return;
    }
    await persist("part2", 0);
    toast.success("Parte 2 salva! Envie para continuar.");
  };

  const handleGeneratePart3 = async () => {
    if (!part1.trim() || !part2.trim()) {
      toast.error("Preencha as partes 1 e 2 primeiro.");
      return;
    }
    if (!theme) {
      toast.error("Escolha um tema para a IA.");
      return;
    }
    setLoading(true);
    try {
      const prompt = `${PART3_SYSTEM_PROMPT}\n\nTema escolhido: ${theme}.\nParte 1: ${part1}\nParte 2: ${part2}`;
      let aiText = await callGemini(prompt);
      if (aiText.length > 300) aiText = aiText.slice(0, 300).trim();
      setPart3(aiText);
      // mark IA as author
      setPart3Author("IA");
      await persist("part3", 0, "IA");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message || "Erro ao gerar a parte 3.");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePart4 = async () => {
    if (!part4.trim()) {
      toast.error("Escreva a quarta parte.");
      return;
    }
    await persist("part4", 0);
    toast.success("Parte 4 salva!");
  };

  const handleSavePart5 = async () => {
    if (!part5.trim()) {
      toast.error("Escreva a quinta parte.");
      return;
    }
    await persist("part5", 0);
    toast.success("Parte 5 salva! Agora é a vez da IA finalizar.");
  };

  const handleGenerateFinal = async () => {
    if (!part1 || !part2 || !part3 || !part4 || !part5) {
      toast.error("Complete todas as partes anteriores primeiro.");
      return;
    }
    setLoading(true);
    try {
      const prompt = `${FINAL_SYSTEM_PROMPT}\n\nHistória completa até agora:\n1) ${part1}\n2) ${part2}\n3) ${part3}\n4) ${part4}\n5) ${part5}`;
      const aiText = await callGemini(prompt);
      setPart6(aiText);
      const earned = 200;
      setCoinsEarned(earned);
      setCompleted(true);

      if (currentUser) {
        const newBalance = (currentUser.coins_balance ?? 0) + earned;
        const updated = await updateUserCoins(currentUser.id, newBalance);
        if (updated) {
          setCurrentUser({
            ...currentUser,
            coins_balance: newBalance,
          });
        }

        // Mark IA as author of the final part
        setPart6Author("IA");

        const completedAt = new Date().toISOString();

        // 1) Persist canonical story into the story owner's row (no coins credited to owner)
        const ownerId = storyOwnerId ?? currentUser.id;
        await upsertDayProgress(ownerId, 3, 0, {
          part1,
          part2,
          part3,
          part4,
          part5,
          part6: aiText,
          part6_author: "IA",
          theme,
          completedAt,
        });

        // 2) Persist finalization in the user who clicked final (give them the earned coins)
        await upsertDayProgress(currentUser.id, 3, earned, {
          part1,
          part2,
          part3,
          part4,
          part5,
          part6: aiText,
          part6_author: "IA",
          theme,
          completedAt,
        });

        // 3) Also mark other contributors (non-IA) as completed (no coins)
        const authors = new Set<string>([
          part1Author,
          part2Author,
          part3Author,
          part4Author,
          part5Author,
          part6Author,
          storyOwnerName || "",
        ]);

        // remove empties and 'IA' and the finalizer's own name if present
        authors.forEach(async (name) => {
          const n = (name || "").toString().trim();
          if (!n) return;
          if (n === "IA") return;
          if (n.toLowerCase() === (currentUser.full_name || "").toLowerCase())
            return;

          try {
            const user = await findUserByPartialName(n);
            if (user) {
              await upsertDayProgress(user.id, 3, 0, {
                part1,
                part2,
                part3,
                part4,
                part5,
                part6: aiText,
                part6_author: "IA",
                theme,
                completedAt,
              });
            } else {
              console.warn(
                "Could not map story author to a user to mark completion:",
                n,
              );
            }
          } catch (e) {
            console.error("Error marking contributor completed:", e);
          }
        });
      }
      toast.success("História finalizada! Você ganhou 200 moedas.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message || "Erro ao gerar o final.");
    } finally {
      setLoading(false);
    }
  };

  const storySoFar = [part1, part2, part3, part4, part5, part6]
    .filter(Boolean)
    .join("\n\n");

  const [fullscreenRef, setFullscreenRef] = useState<HTMLDivElement | null>(
    null,
  );
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // keep the fullscreen container visible while in fullscreen
  const openFullscreen = async () => {
    try {
      if (!fullscreenRef) return;
      fullscreenRef.style.display = "block";
      // @ts-expect-error DOM fullscreen method
      await fullscreenRef.requestFullscreen?.();
      setIsFullscreenOpen(true);
    } catch (e) {
      console.error("Error entering fullscreen:", e);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      setIsFullscreenOpen(false);
      if (fullscreenRef) fullscreenRef.style.display = "none";
    } catch (e) {
      console.error("Error exiting fullscreen:", e);
    }
  };

  // hide the fullscreen container when the user uses ESC or other exit
  React.useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreenOpen(false);
        if (fullscreenRef) fullscreenRef.style.display = "none";
      }
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [fullscreenRef]);

  const youtubeId = getYoutubeId(VIDEO_URL);

  return (
    <div className="presente-x-modal-content">
      <div className="presente-x-modal-header">
        <div>
          <p className="presente-x-heading text-2xl">
            Dia 03 - Domingou com Criatividade! ✍️
          </p>
          <p className="presente-x-text text-sm">
            Um desafio de história em equipe.
          </p>
        </div>
        <button className="presente-x-btn" onClick={onClose}>
          Fechar
        </button>
      </div>

      <div className="presente-x-modal-section">
        <div className="presente-x-card p-6 space-y-4">
          <p className="presente-x-text leading-relaxed">
            Domingou! Hoje eu tive uma ideia um pouco diferente... <br />
            Vamos criar nossa história juntos! Mas calma, não é (exatamente) o
            que você está pensando haha. A dinâmica vai ser a seguinte: logo
            abaixo do vídeo, eu deixei o primeiro parágrafo de uma história
            inédita. A sua missão é continuar escrevendo a segunda parte. Depois
            disso, a nossa amiga Inteligência Artificial vai participar para
            criar uma terceira parte.
          </p>
          <p className="presente-x-text leading-relaxed">
            A partir daí, volta pra mim, depois pra você, e no final a IA vai
            decidir o final feliz (ou não haha). Não precisa ter pressa! Deixe
            sua criatividade fluir e escreva do seu jeitinho. Escolha um tema
            abaixo e vamos ver onde essa história vai parar. <br />
            Aproveite o seu domingo, gatinha! ❤️
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
                title="Video do Dia 03"
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
            <p className="presente-x-heading text-xl">História colaborativa</p>
          </div>

          {storyOwnerName && (
            <p className="text-sm text-[#7E6A5A]">
              História iniciada por <strong>{storyOwnerName}</strong>.
              {storyOwnerId === currentUser?.id ? " (você é o dono)" : ""}
            </p>
          )}

          <div className="presente-x-story-grid">
            {/* fullscreen preview container (hidden element used for Fullscreen API) */}
            <div
              ref={(el) => {
                if (el) setFullscreenRef(el as HTMLDivElement);
              }}
              style={{ display: "none" }}
              id="dia03-fullscreen"
            >
              <div
                style={{
                  padding: 40,
                  background: "#FAF7F2",
                  height: "100vh",
                  overflowY: "auto",
                }}
              >
                <h2 style={{ textAlign: "center", color: "#6B5D52" }}>
                  História completa
                </h2>
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    marginTop: 20,
                    color: "#7E6A5A",
                    textAlign: "left",
                  }}
                >
                  {storySoFar}
                </div>
                <div style={{ marginTop: 30, textAlign: "center" }}>
                  <button
                    className="presente-x-btn"
                    onClick={() => exitFullscreen()}
                  >
                    Fechar tela cheia
                  </button>
                </div>
              </div>
            </div>
            <div className="presente-x-story-card">
              <h4 className="presente-x-heading text-lg">
                Parte 1 — Minha parte
              </h4>
              {(part1Author || storyOwnerName) && (
                <p className="text-xs text-[#7E6A5A]">
                  Escrita por: <strong>{part1Author || storyOwnerName}</strong>
                </p>
              )}
              <textarea
                className="presente-x-textarea"
                placeholder="Escreva o primeiro parágrafo..."
                value={part1}
                onChange={(e) => setPart1(e.target.value)}
                disabled={!isCreator || completed}
              />
              <button
                className="presente-x-btn w-fit"
                onClick={handleSavePart1}
                disabled={!isCreator || completed}
              >
                Salvar parte 1
              </button>
            </div>

            <div className="presente-x-story-card">
              <h4 className="presente-x-heading text-lg">
                Parte 2 — Sua parte
              </h4>
              {part2Author && (
                <p className="text-xs text-[#7E6A5A]">
                  Escrita por: <strong>{part2Author}</strong>
                </p>
              )}
              <textarea
                className="presente-x-textarea"
                placeholder="Escreva a continuação..."
                value={part2}
                onChange={(e) => setPart2(e.target.value)}
                disabled={isCreator || !part1 || completed}
              />
              <p className="text-xs text-[#9B8968]">
                Ao enviar, não será possível editar.
              </p>
              <button
                className="presente-x-btn w-fit"
                onClick={handleSavePart2}
                disabled={isCreator || !part1 || completed}
              >
                Revisar e enviar
              </button>
              {part2 && (
                <button
                  className="presente-x-btn w-fit"
                  onClick={() =>
                    shareStory(
                      "Parte 2 da nossa história",
                      storySoFar || part2,
                      setShareUrl,
                      setShareMime,
                    )
                  }
                >
                  <Share2 className="w-4 h-4" />
                  Compartilhar parte 2
                </button>
              )}
            </div>

            <div className="presente-x-story-card">
              <h4 className="presente-x-heading text-lg">Parte 3 — IA</h4>
              {part3Author && (
                <p className="text-xs text-[#7E6A5A]">
                  Escrita por: <strong>{part3Author}</strong>
                </p>
              )}
              <div className="presente-x-theme-list">
                {THEME_SUGGESTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`presente-x-theme-chip ${theme === opt ? "active" : ""}`}
                    onClick={() => setTheme(opt)}
                    disabled={!part2 || completed}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <textarea
                className="presente-x-textarea"
                placeholder="A IA vai escrever aqui..."
                value={part3}
                onChange={(e) => setPart3(e.target.value)}
                disabled
              />
              <button
                className="presente-x-btn w-fit"
                onClick={handleGeneratePart3}
                disabled={!part2 || completed || loading}
              >
                Gerar parte 3
              </button>
            </div>

            <div className="presente-x-story-card">
              <h4 className="presente-x-heading text-lg">
                Parte 4 — Minha parte
              </h4>
              {part4Author && (
                <p className="text-xs text-[#7E6A5A]">
                  Escrita por: <strong>{part4Author}</strong>
                </p>
              )}
              <textarea
                className="presente-x-textarea"
                placeholder="Escreva a continuação..."
                value={part4}
                onChange={(e) => setPart4(e.target.value)}
                disabled={!isCreator || !part3 || completed}
              />
              <button
                className="presente-x-btn w-fit"
                onClick={handleSavePart4}
                disabled={!isCreator || !part3 || completed}
              >
                Salvar parte 4
              </button>
              {part4 && (
                <button
                  className="presente-x-btn w-fit"
                  onClick={() =>
                    shareStory(
                      "Parte 4 da nossa história",
                      storySoFar,
                      setShareUrl,
                      setShareMime,
                    )
                  }
                >
                  <Share2 className="w-4 h-4" />
                  Compartilhar parte 4
                </button>
              )}
            </div>

            <div className="presente-x-story-card">
              <h4 className="presente-x-heading text-lg">
                Parte 5 — Sua parte
              </h4>
              {part5Author && (
                <p className="text-xs text-[#7E6A5A]">
                  Escrita por: <strong>{part5Author}</strong>
                </p>
              )}
              <textarea
                className="presente-x-textarea"
                placeholder="Escreva o penúltimo trecho..."
                value={part5}
                onChange={(e) => setPart5(e.target.value)}
                disabled={isCreator || !part4 || completed}
              />
              <button
                className="presente-x-btn w-fit"
                onClick={handleSavePart5}
                disabled={isCreator || !part4 || completed}
              >
                Salvar parte 5
              </button>
            </div>

            <div className="presente-x-story-card">
              <h4 className="presente-x-heading text-lg">
                Parte 6 — Final da IA
              </h4>
              {part6Author && (
                <p className="text-xs text-[#7E6A5A]">
                  Escrita por: <strong>{part6Author}</strong>
                </p>
              )}
              <textarea
                className="presente-x-textarea"
                placeholder="Final da história..."
                value={part6}
                onChange={(e) => setPart6(e.target.value)}
                disabled
              />
              <button
                className="presente-x-btn w-fit"
                onClick={handleGenerateFinal}
                disabled={!part5 || completed || loading}
              >
                Gerar final
              </button>
            </div>
          </div>

          {completed && (
            <div className="presente-x-quiz-result">
              <p className="presente-x-heading text-lg">
                História finalizada! Você ganhou {coinsEarned} moedas.
              </p>
              <div className="flex gap-2 items-center">
                <button
                  className="presente-x-btn flex items-center gap-2 w-fit"
                  onClick={() =>
                    shareStory(
                      "História completa - Dia 03",
                      storySoFar,
                      setShareUrl,
                      setShareMime,
                    )
                  }
                >
                  <Share2 className="w-4 h-4" />
                  Compartilhar história
                </button>
                <button
                  className="presente-x-btn"
                  onClick={() => {
                    // export as PNG (first page or single)
                    (async () => {
                      try {
                        const asset = await buildShareAsset(
                          "História completa - Dia 03",
                          storySoFar,
                        );
                        if (!asset) return;
                        if (asset.mime === "image/png") {
                          const url = URL.createObjectURL(asset.blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = asset.fileName;
                          a.click();
                        } else {
                          const firstPageAsset = await buildFirstPagePNG(
                            "História - Página 1",
                            storySoFar,
                          );
                          if (firstPageAsset) {
                            const url = URL.createObjectURL(
                              firstPageAsset.blob,
                            );
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = firstPageAsset.fileName;
                            a.click();
                          }
                        }
                      } catch (e) {
                        console.error("Erro exportando PNG:", e);
                      }
                    })();
                  }}
                >
                  Exportar PNG
                </button>
                <button
                  className="presente-x-btn"
                  onClick={() => {
                    // export as PDF
                    (async () => {
                      try {
                        const asset = await buildShareAsset(
                          "História completa - Dia 03",
                          storySoFar,
                        );
                        if (!asset) return;
                        const url = URL.createObjectURL(asset.blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = asset.fileName;
                        a.click();
                      } catch (e) {
                        console.error("Erro exportando PDF:", e);
                      }
                    })();
                  }}
                >
                  Baixar PDF
                </button>
                <button
                  className="presente-x-btn"
                  onClick={() => {
                    // open fullscreen preview
                    openFullscreen();
                  }}
                >
                  Abrir em tela cheia
                </button>
              </div>
              {shareUrl && (
                <div className="presente-x-share-preview">
                  {shareMime === "application/pdf" ? (
                    <div>
                      <iframe
                        src={shareUrl}
                        title="História em PDF"
                        style={{
                          width: 320,
                          height: 420,
                          border: "1px solid #e6d9c8",
                        }}
                      />
                      <div style={{ marginTop: 8 }}>
                        <a
                          href={shareUrl}
                          download="historia-dia03.pdf"
                          className="presente-x-btn"
                        >
                          Baixar PDF
                        </a>
                      </div>
                    </div>
                  ) : (
                    <img src={shareUrl} alt="História do Dia 03" />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
