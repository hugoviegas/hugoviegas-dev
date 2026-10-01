import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/hooks/useLanguage";
import { loadSettings, saveSettings, type ExistingSettings } from "./adminContent";
import { useAdminT } from "./adminStrings";

// settings/site: the useRemote kill switch.
const SettingsPanel = () => {
  const t = useAdminT();
  const { language } = useLanguage();
  const [settings, setSettings] = useState<ExistingSettings | null | undefined>(undefined);
  const [useRemote, setUseRemote] = useState(true);
  const [notice, setNotice] = useState<{ kind: "status" | "alert"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const next = await loadSettings();
      setSettings(next);
      setUseRemote(next?.useRemote ?? true);
    } catch (error) {
      setNotice({ kind: "alert", text: `${t("loadError")} ${String(error)}` });
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    setBusy(true);
    setNotice(null);
    try {
      await saveSettings(useRemote, settings ?? null);
      await load();
      setNotice({ kind: "status", text: t("saved") });
    } catch (error) {
      setNotice({ kind: "alert", text: `${t("saveError")} ${String(error)}` });
    } finally {
      setBusy(false);
    }
  };

  if (settings === undefined && !notice) return <p role="status">{t("loadingContent")}</p>;

  return (
    <section aria-labelledby="settings-title" className="space-y-4">
      <h3 id="settings-title" className="heading-card">
        {t("tab.settings")}
      </h3>
      <div className="flex items-start gap-3">
        <Switch
          id="settings-use-remote"
          checked={useRemote}
          onCheckedChange={setUseRemote}
          aria-describedby="settings-use-remote-hint"
        />
        <div className="space-y-1">
          <Label htmlFor="settings-use-remote">{t("useRemoteLabel")}</Label>
          <p id="settings-use-remote-hint" className="text-sm text-muted-foreground">
            {t("useRemoteHint")}
          </p>
        </div>
      </div>
      {settings?.updatedAt && (
        <p className="text-sm text-muted-foreground">
          {t("lastUpdated")}{" "}
          {new Date(settings.updatedAt).toLocaleString(language === "PT" ? "pt-BR" : "en-IE")}
        </p>
      )}
      <div aria-live="polite">
        {notice && (
          <p role={notice.kind} className={notice.kind === "alert" ? "text-sm text-destructive" : "text-sm"}>
            {notice.text}
          </p>
        )}
      </div>
      <Button type="button" onClick={() => void save()} disabled={busy}>
        {busy ? t("saving") : t("save")}
      </Button>
    </section>
  );
};

export default SettingsPanel;
