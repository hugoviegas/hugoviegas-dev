import { Github, Linkedin, Mail, Heart } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const socialLinks = [
    {
      icon: Github,
      url: "https://github.com/hugoviegas/",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      url: "https://www.linkedin.com/in/hviegas/",
      label: "LinkedIn",
    },
    {
      icon: Mail,
      url: "mailto:hugoviegas3.1@gmail.com",
      label: "Email",
    },
  ];

  return (
    <footer className="w-full border-t border-border bg-muted/20">
      <div className="section-wrapper py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="heading-card text-gradient mb-2">Hugo Viegas</h3>
            <p className="body-text">{t("footerTagline")}</p>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-pill group"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
              </a>
            ))}
            {/* Link to the Formula D assistant game page */}
            <a
              href="/formula-d"
              className="icon-pill"
              aria-label={t("footerGameLabel")}
            >
              <img
                src="/gold-coin-top.png"
                alt=""
                aria-hidden="true"
                className="w-5 h-5"
              />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="caption-text">
            © {currentYear} Hugo Viegas. {t("footerRights")}
          </p>

          <p className="caption-text flex items-center gap-2">
            <span>{t("footerMadeWith")}</span>
            <Heart className="w-4 h-4 text-destructive animate-pulse" />
            <span>{t("footerLocation")}</span>
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="caption-text text-xs">{t("footerAvailability")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
