import { Github, Linkedin, Mail, Heart } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const SOCIAL_LINKS = [
  { icon: Github, url: "https://github.com/hugoviegas/", label: "GitHub" },
  {
    icon: Linkedin,
    url: "https://www.linkedin.com/in/hviegas/",
    label: "LinkedIn",
  },
  { icon: Mail, url: "mailto:hugoviegas3.1@gmail.com", label: "Email" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="section-wrapper py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="heading-card text-gradient mb-2">Hugo Viegas</h3>
            <p className="caption-text">{t("role")}</p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-button group"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5 text-primary transition-colors group-hover:text-secondary" />
              </a>
            ))}
            {/* Formula D assistant game page */}
            <a
              href="/formula-d"
              className="icon-button flex items-center"
              aria-label={t("formulaDAssistant")}
            >
              <img
                src="/gold-coin-top.png"
                alt=""
                aria-hidden="true"
                className="h-5 w-5"
              />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div
          className="my-8 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          aria-hidden="true"
        />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <span>{t("footer.copyright").replace("{year}", String(currentYear))}</span>

          <div className="flex items-center gap-2">
            <span>{t("footer.madeWith")}</span>
            <Heart
              className="h-4 w-4 animate-pulse text-destructive"
              aria-hidden="true"
            />
            <span>{t("footer.inLocation")}</span>
          </div>
        </div>

        <p className="caption-text mt-6 text-center text-xs">
          {t("footer.additionalInfo")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
