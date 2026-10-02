import BrickLoader from "@/components/brand/BrickLoader";
import { useLanguage } from "@/hooks/useLanguage";

// Shown while the lazy admin chunk downloads, instead of a blank page.
const AdminLoading = () => {
  const { t } = useLanguage();
  return (
    <div role="status" className="flex min-h-screen flex-col items-center justify-center gap-3.5 bg-background text-sm text-ink-2">
      <BrickLoader className="scale-[1.6] text-primary" />
      {t("adminLoading")}
    </div>
  );
};

export default AdminLoading;
