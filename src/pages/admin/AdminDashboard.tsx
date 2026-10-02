import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import CollectionPanel from "./CollectionPanel";
import FilesPanel from "./FilesPanel";
import SettingsPanel from "./SettingsPanel";
import { AdminLink, useAdminNav } from "./AdminNavigation";
import { useAdminSummary } from "./AdminSummary";
import { ABOUT_DOC_ID, type AdminLocation } from "./adminRoutes";
import { ADMIN_COLLECTIONS, collectionDefs } from "./collectionConfig";
import { useAdminT } from "./adminStrings";
import { formatAdminDate } from "./format";
import { cardClass, Chip, focusRing, Notice, PageHeading, StatusBadge, Stud } from "./ui";

const OpenLink = ({ to, label }: { to: AdminLocation; label: string }) => (
  <AdminLink
    to={to}
    className={cn("mt-auto inline-flex min-h-11 items-center gap-1.5 border-t border-border pt-2.5 font-semibold text-primary hover:underline", focusRing)}
  >
    {label}
    <ArrowRight className="h-4 w-4" aria-hidden="true" />
  </AdminLink>
);

// Counts per collection plus the state of settings and files. No wide table,
// so it works the same on a phone.
const Overview = () => {
  const t = useAdminT();
  const { language } = useLanguage();
  const { counts, settings, error, reload } = useAdminSummary();

  const fileRow = (label: string, value: string) => (
    <div className="flex min-h-[52px] items-center justify-between gap-3 border-t border-border py-2 first:border-t-0">
      <dt className="text-sm text-ink-2">{label}</dt>
      <dd className="text-right text-sm font-semibold">{value}</dd>
    </div>
  );

  return (
    <>
      <PageHeading title={t("tab.overview")} sub={t("overview.sub")} />
      <Notice tone="info" className="mb-5">
        {t("overviewIntro")}
      </Notice>
      {error && (
        <Notice
          tone="bad"
          role="alert"
          className="mb-5"
          title={t("loadError")}
          actions={
            <Button type="button" variant="neutral" size="touch" onClick={() => void reload()}>
              {t("reload")}
            </Button>
          }
        >
          {error}
        </Notice>
      )}
      <h2 className="mb-3 text-xl font-extrabold tracking-[-0.01em]">{t("shell.content")}</h2>
      {!counts && !error && (
        <p role="status" className="text-ink-2">
          {t("loadingContent")}
        </p>
      )}
      {counts && (
        <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {ADMIN_COLLECTIONS.map((name) => {
            const label = t(collectionDefs[name].label);
            const { published, drafts } = counts[name];
            const to: AdminLocation =
              name === "about" ? { section: "about", view: "edit", id: ABOUT_DOC_ID } : { section: name, view: "list" };
            return (
              <li key={name} className={cn(cardClass, "flex flex-col gap-3.5 px-[18px] pb-3.5 pt-[18px]")}>
                <div className="flex items-center gap-2.5">
                  <Stud active />
                  <h3 className="flex-1 text-base font-bold">{label}</h3>
                  {drafts > 0 && <StatusBadge published={false} label={`${drafts} ${t("draftsLabel").toLowerCase()}`} />}
                </div>
                <dl className="flex gap-6">
                  <div className="flex flex-col-reverse">
                    <dt className="text-[13px] text-ink-2">{t("publishedLabel")}</dt>
                    <dd className="text-[28px] font-extrabold leading-tight tracking-[-0.02em]">{published}</dd>
                  </div>
                  <div className="flex flex-col-reverse">
                    <dt className="text-[13px] text-ink-2">{t("draftsLabel")}</dt>
                    <dd className="text-[28px] font-extrabold leading-tight tracking-[-0.02em]">{drafts}</dd>
                  </div>
                </dl>
                <OpenLink to={to} label={`${t("overview.open")} ${label.toLowerCase()}`} />
              </li>
            );
          })}
        </ul>
      )}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section aria-labelledby="ov-settings" className={cn(cardClass, "flex flex-col p-5")}>
          <h2 id="ov-settings" className="mb-2 text-base font-bold">
            {t("overview.siteSettings")}
          </h2>
          <dl>
            <div className="flex min-h-[52px] items-center justify-between gap-3 py-2">
              <dt className="text-sm text-ink-2">{t("overview.remote")}</dt>
              <dd>
                {settings && !settings.useRemote ? (
                  <Chip tone="warn">{t("overview.off")}</Chip>
                ) : (
                  <StatusBadge published label={t("overview.on")} />
                )}
              </dd>
            </div>
            {fileRow(t("overview.lastChange"), formatAdminDate(settings?.updatedAt, language))}
          </dl>
          <OpenLink to={{ section: "settings" }} label={t("overview.openSettings")} />
        </section>
        <section aria-labelledby="ov-files" className={cn(cardClass, "flex flex-col p-5")}>
          <h2 id="ov-files" className="mb-2 text-base font-bold">
            {t("tab.files")}
          </h2>
          <dl>
            {fileRow(
              t("overview.cv"),
              settings?.cv ? `${t("historyVersion")} ${settings.cv.version} · PDF` : t("overview.bundled"),
            )}
            {fileRow(
              t("overview.photo"),
              settings?.profilePhoto ? `${t("overview.uploaded")} · v${settings.profilePhoto.version}` : t("overview.bundled"),
            )}
          </dl>
          <OpenLink to={{ section: "files" }} label={t("overview.openFiles")} />
        </section>
      </div>
    </>
  );
};

const NotFoundView = () => {
  const t = useAdminT();
  const { go } = useAdminNav();
  return (
    <>
      <PageHeading title={t("notFound")} sub={t("notFoundBody")} />
      <Button type="button" variant="primary" size="lg" onClick={() => go({ section: "overview" })}>
        {t("overview.goOverview")}
      </Button>
    </>
  );
};

// Picks the view for the current address. Each collection keeps its own
// panel instance, so moving between its list, editor and history does not
// reload it.
const AdminDashboard = () => {
  const { location } = useAdminNav();
  switch (location.section) {
    case "overview":
      return <Overview />;
    case "files":
      return <FilesPanel />;
    case "settings":
      return <SettingsPanel />;
    case "notFound":
      return <NotFoundView />;
    default:
      return <CollectionPanel key={location.section} collection={location.section} route={location} />;
  }
};

export default AdminDashboard;
