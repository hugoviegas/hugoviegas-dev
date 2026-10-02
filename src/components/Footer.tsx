import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";
import { ADMIN_PATH } from "@/config/admin";
import { useLanguage } from "@/hooks/useLanguage";

const socialLinks = [
  { icon: Github, url: "https://github.com/hugoviegas/", label: "GitHub", external: true },
  { icon: Linkedin, url: "https://www.linkedin.com/in/hviegas/", label: "LinkedIn", external: true },
  { icon: Mail, url: "mailto:hugoviegas3.1@gmail.com", label: "Email", external: false },
];

const TAPS = 4;
const WINDOW_MS = 2000;

// Minimal footer. Extra bottom space below lg keeps it clear of the
// floating section pill. Formula D stays archived and unlinked.
const Footer = () => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  const navigate = useNavigate();
  const taps = useRef({ n: 0, last: 0 });

  const onNameClick = () => {
    const now = Date.now();
    const s = taps.current;
    s.n = now - s.last > WINDOW_MS ? 1 : s.n + 1;
    s.last = now;
    if (s.n >= TAPS) {
      s.n = 0;
      navigate(ADMIN_PATH);
    }
  };

  return (
    <footer className="relative z-10 mt-24 border-t border-border">
      <div className="mx-auto w-full max-w-[1344px] px-5 pb-32 pt-8 sm:px-10 lg:px-12 lg:pb-12 xl:px-[72px] max-[359px]:px-4">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p
              onClick={onNameClick}
              className="select-none text-base font-bold text-foreground [touch-action:manipulation]"
            >
              Hugo Viegas
            </p>
            <p className="text-sm text-ink-3">
              {t("role")} · {t("heroLocation")}
            </p>
          </div>
          <ul className="flex gap-2">
            {socialLinks.map(({ icon: Icon, url, label, external }) => (
              <li key={label}>
                <a
                  href={url}
                  aria-label={label}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-foreground shadow-e2 transition-colors duration-fast hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 flex flex-wrap justify-between gap-4 text-[13px] text-ink-3">
          <span>© {year} Hugo Viegas</span>
          <a
            href="/#fun-stuff"
            className="rounded-sm text-ink-2 underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t("footerFun")}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
