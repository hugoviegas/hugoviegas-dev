import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import TopControls from "@/components/TopControls";
import { useLanguage } from "@/hooks/useLanguage";

const DEMO_URL =
  import.meta.env.VITE_DEMO_BIG_BANG_DUEL_URL || "https://duel.hugoviegas.dev";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderInlineMarkdown = (value: string) => {
  let html = escapeHtml(value);
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  return html;
};

const renderMarkdown = (raw: string) => {
  const lines = raw.split(/\r?\n/);
  const html: string[] = [];
  let paragraphLines: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushParagraph = () => {
    if (!paragraphLines.length) return;
    html.push(`<p>${renderInlineMarkdown(paragraphLines.join(" ").trim())}</p>`);
    paragraphLines = [];
  };

  const flushList = () => {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch = /^(#{1,3})\s+(.*)$/.exec(trimmed);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      html.push(`<h${level}>${renderInlineMarkdown(headingMatch[2])}</h${level}>`);
      continue;
    }

    const unorderedMatch = /^[-*]\s+(.*)$/.exec(trimmed);
    const orderedMatch = /^\d+\.\s+(.*)$/.exec(trimmed);
    if (unorderedMatch || orderedMatch) {
      flushParagraph();
      const nextListType = unorderedMatch ? "ul" : "ol";
      if (!listType) {
        listType = nextListType;
        html.push(`<${listType}>`);
      } else if (listType !== nextListType) {
        flushList();
        listType = nextListType;
        html.push(`<${listType}>`);
      }

      const item = unorderedMatch ? unorderedMatch[1] : orderedMatch[1];
      html.push(`<li>${renderInlineMarkdown(item)}</li>`);
      continue;
    }

    const blockquoteMatch = /^>\s?(.*)$/.exec(trimmed);
    if (blockquoteMatch) {
      flushParagraph();
      flushList();
      html.push(`<blockquote>${renderInlineMarkdown(blockquoteMatch[1])}</blockquote>`);
      continue;
    }

    flushList();
    paragraphLines.push(trimmed);
  }

  flushParagraph();
  flushList();

  return html.join("");
};

const BigBangDuelStoryPage = () => {
  const { language, t } = useLanguage();
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const storyFile =
      language === "PT" ? "/projects/big-bang-duel/story.pt.md" : "/projects/big-bang-duel/story.en.md";

    let cancelled = false;

    const loadStory = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        const response = await fetch(storyFile);
        if (!response.ok) {
          throw new Error("Failed to fetch story file");
        }

        const text = await response.text();
        if (!cancelled) {
          setStory(text);
        }
      } catch {
        if (!cancelled) {
          setHasError(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadStory();

    return () => {
      cancelled = true;
    };
  }, [language]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopControls />

      <div className="fixed left-4 top-16 z-[60] md:left-6 md:top-5">
        <Link
          to="/projects/big-bang-duel"
          className="pill-glass inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
          aria-label={t("bigBangBackToProject")}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>{t("bigBangBackToProject")}</span>
        </Link>
      </div>

      <main className="section-wrapper py-24">
        <div className="mx-auto max-w-4xl">
          <header className="mb-10 text-center">
            <p className="caption-text mb-3 uppercase tracking-[0.2em]">{t("bigBangTitle")}</p>
            <h1 className="heading-section mb-4">{t("bigBangStoryTitle")}</h1>
            <p className="body-text mx-auto max-w-2xl">{t("bigBangStoryIntro")}</p>
          </header>

          <div className="mb-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <a href={DEMO_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink aria-hidden="true" className="mr-2 h-4 w-4" />
                {t("bigBangOpenFull")}
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link to="/projects/big-bang-duel">
                <ArrowLeft aria-hidden="true" className="mr-2 h-4 w-4" />
                {t("bigBangBackToProject")}
              </Link>
            </Button>
          </div>

          <article className="rounded-3xl border border-border bg-card p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] md:p-8">
            {isLoading ? (
              <p className="body-text text-center text-muted-foreground">{t("bigBangStoryLoading")}</p>
            ) : hasError ? (
              <div className="space-y-4 text-center">
                <p className="body-text text-muted-foreground">{t("bigBangStoryError")}</p>
                <Button asChild>
                  <Link to="/projects/big-bang-duel">{t("bigBangBackToProject")}</Link>
                </Button>
              </div>
            ) : (
              <div
                className="prose prose-invert max-w-none space-y-5 text-foreground prose-headings:mt-0 prose-headings:font-semibold prose-headings:text-foreground prose-p:leading-8 prose-p:text-muted-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:leading-7 prose-strong:text-foreground prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(story) }}
              />
            )}
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BigBangDuelStoryPage;
