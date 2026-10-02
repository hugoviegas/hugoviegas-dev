import { useCallback, useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { parseSiteFiles } from "@/content/siteFiles";
import { cn } from "@/lib/utils";
import { listHistory, loadSettings, restoreSettings, saveSettings, type ExistingSettings, type HistoryEntry } from "./adminContent";
import { useAdminSummary } from "./AdminSummary";
import { useToast } from "./AdminToasts";
import ConfirmDialog from "./ConfirmDialog";
import { fill, formatAdminDate } from "./format";
import { useAdminT, type AdminStringKey } from "./adminStrings";
import { BrickSwitch, cardClass, Chip, monoLabel, Notice, PageHeading } from "./ui";

type Translate = (key: AdminStringKey) => string;

// The parts of a settings version that a person cares about, as short labels.
const describe = (t: Translate, data: Record<string, unknown>) => {
  const files = parseSiteFiles(data);
  const file = (value: { version: number } | null) => (value ? `v${value.version}` : t("overview.bundled"));
  return [
    `${t("overview.remote")}: ${data.useRemote === false ? t("overview.off") : t("overview.on")}`,
    `${t("overview.cv")}: ${file(files.cv)}`,
    `${t("overview.photo")}: ${file(files.profilePhoto)}`,
    `${t("overview.minifig")}: ${file(files.avatarMinifig)}`,
    `${t("overview.shownFirst")}: ${files.avatarFirst === "minifig" ? t("overview.minifig") : t("overview.photo")}`,
  ];
};

// Labels that differ from the older version; the first version lists everything.
const changes = (t: Translate, newer: Record<string, unknown>, older?: Record<string, unknown>) => {
  const now = describe(t, newer);
  if (!older) return now;
  const before = describe(t, older);
  return now.filter((label, index) => label !== before[index]);
};

const errorText = (error: unknown) => (error instanceof Error ? error.message : String(error));

// settings/site: the remote-content switch and the settings history.
const SettingsPanel = () => {
  const t = useAdminT();
  const { language } = useLanguage();
  const toast = useToast();
  const { reportSettings } = useAdminSummary();
  const [settings, setSettings] = useState<ExistingSettings | null | undefined>(undefined);
  const [history, setHistory] = useState<HistoryEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [askRemote, setAskRemote] = useState(false);
  const [restoring, setRestoring] = useState<HistoryEntry | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [next, entries] = await Promise.all([loadSettings(), listHistory("settings", "site")]);
      setSettings(next);
      setHistory(entries);
      reportSettings(next);
    } catch (err) {
      setError(errorText(err));
    }
  }, [reportSettings]);

  useEffect(() => {
    void load();
  }, [load]);

  const remote = settings?.useRemote ?? true;

  const toggleRemote = async () => {
    setAskRemote(false);
    setBusy(true);
    try {
      await saveSettings(!remote, settings ?? null);
      await load();
      toast("ok", fill(t("settings.remoteToast"), { s: (remote ? t("overview.off") : t("overview.on")).toLowerCase() }));
    } catch (err) {
      toast("bad", `${t("saveError")} ${errorText(err)}`);
    } finally {
      setBusy(false);
    }
  };

  const restore = async () => {
    const entry = restoring;
    setRestoring(null);
    if (!entry) return;
    setBusy(true);
    try {
      await restoreSettings(entry.data, settings ?? null);
      await load();
      toast("ok", fill(t("settings.restored"), { n: entry.version }));
    } catch (err) {
      toast("bad", `${t("saveError")} ${errorText(err)}`);
    } finally {
      setBusy(false);
    }
  };

  const heading = <PageHeading id="settings-title" title={t("tab.settings")} sub={t("settings.sub")} />;

  if (error && settings === undefined) {
    return (
      <section aria-labelledby="settings-title">
        {heading}
        <Notice
          tone="bad"
          role="alert"
          title={t("loadError")}
          actions={
            <Button type="button" variant="neutral" size="touch" onClick={() => void load()}>
              {t("reload")}
            </Button>
          }
        >
          {error}
        </Notice>
      </section>
    );
  }
  if (settings === undefined) {
    return (
      <section aria-labelledby="settings-title">
        {heading}
        <p role="status">{t("loadingContent")}</p>
      </section>
    );
  }

  const currentData = settings?.data ?? null;

  return (
    <section aria-labelledby="settings-title">
      {heading}
      <section aria-labelledby="settings-remote" className={cn(cardClass, "p-5 sm:p-6")}>
        <div className="flex flex-wrap items-start gap-x-6 gap-y-4">
          <div className="min-w-0 flex-[1_1_320px]">
            <h2 id="settings-remote" className="text-xl font-extrabold tracking-[-0.01em]">
              {t("settings.remoteTitle")}
            </h2>
            <p className="mt-2 max-w-[64ch] text-ink-2">{t("settings.remoteBody")}</p>
            {settings?.updatedAt && (
              <p className={cn(monoLabel, "mt-3 normal-case tracking-normal")}>
                {fill(t("settings.lastUpdated"), { d: formatAdminDate(settings.updatedAt, language) })}
              </p>
            )}
          </div>
          <BrickSwitch
            checked={remote}
            disabled={busy}
            onClick={() => setAskRemote(true)}
            labelledBy="settings-remote"
            valueId="settings-remote-value"
            valueText={remote ? t("overview.on") : t("overview.off")}
          />
        </div>
      </section>

      <section aria-labelledby="settings-history" className="mt-8">
        <h2 id="settings-history" className="mb-3 text-xl font-extrabold tracking-[-0.01em]">
          {t("settings.history")}
        </h2>
        {error && (
          <Notice tone="bad" role="alert" className="mb-4">
            {error}
          </Notice>
        )}
        <ul className={cn(cardClass, "overflow-hidden")}>
          {settings && currentData && (
            <li className="grid gap-3 bg-primary-tint/50 p-4 sm:grid-cols-[64px_minmax(0,1fr)] sm:px-5">
              <span className="grid h-9 w-[52px] place-items-center rounded-lg bg-surface-2 font-mono text-sm font-bold">v{settings.version}</span>
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 font-semibold">
                  {formatAdminDate(settings.updatedAt, language)}
                  <Chip tone="solid">{t("history.current")}</Chip>
                </p>
                <ChangeList labels={changes(t, currentData, history?.[0]?.data)} label={t("history.changed")} />
              </div>
            </li>
          )}
          {history?.length === 0 && <li className="border-t border-border p-5 text-ink-2 first:border-t-0">{t("historyEmpty")}</li>}
          {history?.map((entry, index) => (
            <li
              key={entry.entryId}
              className="grid gap-3 border-t border-border p-4 first:border-t-0 sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:items-start sm:px-5"
            >
              <span className="grid h-9 w-[52px] place-items-center rounded-lg bg-surface-2 font-mono text-sm font-bold">v{entry.version}</span>
              <div className="min-w-0">
                <p className="font-semibold">{formatAdminDate(entry.savedAt, language)}</p>
                <ChangeList labels={changes(t, entry.data, history[index + 1]?.data)} label={t("history.changed")} />
              </div>
              <div>
                <Button
                  type="button"
                  variant="neutral"
                  size="touch"
                  disabled={busy}
                  aria-label={fill(t("history.restoreAria"), { n: entry.version })}
                  onClick={() => setRestoring(entry)}
                >
                  <RotateCcw aria-hidden="true" />
                  {t("restore")}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <ConfirmDialog
        open={askRemote}
        tone={remote ? "danger" : "calm"}
        title={remote ? t("settings.offTitle") : t("settings.onTitle")}
        body={remote ? t("settings.offBody") : t("settings.onBody")}
        confirmLabel={remote ? t("settings.turnOff") : t("settings.turnOn")}
        onConfirm={() => void toggleRemote()}
        onCancel={() => setAskRemote(false)}
      />
      <ConfirmDialog
        open={restoring !== null}
        tone="calm"
        title={restoring ? fill(t("settings.restoreTitle"), { n: restoring.version }) : ""}
        body={t("settings.restoreBody")}
        confirmLabel={t("restore")}
        onConfirm={() => void restore()}
        onCancel={() => setRestoring(null)}
      />
    </section>
  );
};

const ChangeList = ({ labels, label }: { labels: string[]; label: string }) =>
  labels.length === 0 ? null : (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-ink-3">{label}</span>
      {labels.map((item) => (
        <span key={item} className="inline-flex min-h-6 items-center rounded-md bg-surface-2 px-2 font-mono text-xs text-ink-2">
          {item}
        </span>
      ))}
    </div>
  );

export default SettingsPanel;
