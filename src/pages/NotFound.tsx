import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <h1 className="heading-section mb-4 text-primary">
          {t("notFound.title")}
        </h1>
        <p className="body-text mb-8">{t("notFound.description")}</p>
        <a href="/" className="btn-hero inline-flex items-center">
          {t("notFound.cta")}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
