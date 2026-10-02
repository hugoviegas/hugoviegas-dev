import { useCallback, useState, type ReactNode } from "react";
import { ArrowLeft, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import IsoBrick from "@/components/brand/IsoBrick";
import LanguageControl from "@/components/controls/LanguageControl";
import ThemeSwitch from "@/components/controls/ThemeSwitch";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { cn } from "@/lib/utils";
import { AdminLink, useAdminNav } from "./AdminNavigation";
import { useAdminSummary } from "./AdminSummary";
import { ABOUT_DOC_ID, type AdminLocation } from "./adminRoutes";
import { ADMIN_COLLECTIONS, collectionDefs } from "./collectionConfig";
import { useAdminT, type AdminStringKey } from "./adminStrings";
import { focusRing, IconButton, Sheet, Stud } from "./ui";

// The admin's own shell: compact header, a left rail from 1024 px and a
// section button with a bottom sheet below it. The public navigation, star
// field and spaceship are not rendered on this route (see App.tsx).

interface NavItem {
  key: string;
  label: string;
  count?: number;
  to: AdminLocation;
  active: boolean;
}

const Avatar = ({ email }: { email: string }) => (
  <span
    aria-hidden="true"
    className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-tint font-sans text-[13px] font-bold text-primary"
  >
    {(email[0] ?? "H").toUpperCase()}
  </span>
);

const useNavGroups = () => {
  const t = useAdminT();
  const { location } = useAdminNav();
  const { counts } = useAdminSummary();
  const item = (key: string, label: string, to: AdminLocation, count?: number): NavItem => ({
    key,
    label,
    to,
    count,
    active: location.section === key,
  });
  return [
    { key: "top", label: null, items: [item("overview", t("tab.overview"), { section: "overview" })] },
    {
      key: "content",
      label: t("shell.content"),
      items: ADMIN_COLLECTIONS.map((name) => {
        const count = counts ? counts[name].published + counts[name].drafts : undefined;
        const to: AdminLocation =
          name === "about" ? { section: "about", view: "edit", id: ABOUT_DOC_ID } : { section: name, view: "list" };
        return item(name, t(collectionDefs[name].label), to, name === "about" ? undefined : count);
      }),
    },
    {
      key: "site",
      label: t("shell.site"),
      items: [item("files", t("tab.files"), { section: "files" }), item("settings", t("tab.settings"), { section: "settings" })],
    },
  ];
};

const NavList = ({ onPick }: { onPick?: () => void }) => {
  const groups = useNavGroups();
  return (
    <>
      {groups.map((group) => (
        <div key={group.key} className="flex flex-col gap-0.5 [&+&]:mt-5">
          {group.label && <p className="px-3 pb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">{group.label}</p>}
          {group.items.map((entry) => (
            <AdminLink
              key={entry.key}
              to={entry.to}
              aria-current={entry.active ? "page" : undefined}
              onClick={onPick}
              className={cn(
                "flex min-h-11 w-full items-center gap-3 rounded-[10px] pl-3 pr-2.5 text-[15px] transition-colors duration-fast",
                entry.active ? "bg-primary-tint font-bold text-foreground" : "font-medium text-ink-2 hover:bg-surface-2 hover:text-foreground",
                focusRing,
              )}
            >
              <Stud active={entry.active} />
              <span className="min-w-0 flex-1 truncate">{entry.label}</span>
              {entry.count !== undefined && (
                <span className={cn("font-mono text-xs font-semibold", entry.active ? "text-ink-2" : "text-ink-3")}>{entry.count}</span>
              )}
            </AdminLink>
          ))}
        </div>
      ))}
    </>
  );
};

const sectionLabelKey = (location: AdminLocation): AdminStringKey => {
  switch (location.section) {
    case "overview":
    case "notFound":
      return "tab.overview";
    case "files":
      return "tab.files";
    case "settings":
      return "tab.settings";
    default:
      return collectionDefs[location.section].label;
  }
};

const Breadcrumb = () => {
  const t = useAdminT();
  const { location } = useAdminNav();
  const crumbs: { label: string; to?: AdminLocation; mono?: boolean }[] = [{ label: t("shell.admin"), to: { section: "overview" } }];
  if (location.section !== "overview" && location.section !== "notFound") {
    const sectionLabel = t(sectionLabelKey(location));
    if ("view" in location && location.section !== "about" && location.view !== "list") {
      crumbs.push({ label: sectionLabel, to: { section: location.section, view: "list" } });
      if (location.view === "new") crumbs.push({ label: t("newDoc") });
      else {
        crumbs.push({ label: location.id, mono: true, to: { section: location.section, view: "edit", id: location.id } });
        if (location.view === "history") crumbs.push({ label: t("history") });
      }
    } else if (location.section === "about" && "view" in location && location.view === "history") {
      crumbs.push({ label: sectionLabel, to: { section: "about", view: "edit", id: ABOUT_DOC_ID } });
      crumbs.push({ label: t("history") });
    } else {
      crumbs.push({ label: sectionLabel });
    }
  }
  const last = crumbs.length - 1;
  return (
    <nav aria-label={t("shell.breadcrumb")}>
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-ink-3">
        {crumbs.map((crumb, index) => (
          <li key={`${crumb.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
            {index > 0 && <span aria-hidden="true" className="text-line-strong">/</span>}
            {index < last && crumb.to ? (
              <AdminLink
                to={crumb.to}
                className={cn("inline-flex min-h-8 items-center font-medium text-ink-2 underline underline-offset-[3px] hover:text-foreground", crumb.mono && "font-mono text-xs", focusRing)}
              >
                {crumb.label}
              </AdminLink>
            ) : (
              <span aria-current="page" className={cn("max-w-[28ch] truncate font-semibold text-foreground", crumb.mono && "font-mono text-xs")}>
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

const AdminShell = ({ email, onSignOut, children }: { email: string; onSignOut: () => void; children: ReactNode }) => {
  const t = useAdminT();
  const { location } = useAdminNav();
  const { counts } = useAdminSummary();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [message, setMessage] = useState("");
  const announce = useCallback((next: string) => setMessage(next), []);

  const current =
    location.section !== "overview" && location.section !== "notFound" && location.section !== "files" && location.section !== "settings"
      ? location.section
      : null;
  const currentCount = current && current !== "about" && counts ? counts[current].published + counts[current].drafts : null;

  return (
    <div className="min-h-screen bg-background text-[15px] text-foreground">
      <header className="sticky top-0 z-40 flex h-16 items-center gap-1 border-b border-border bg-card pl-3 pr-2 sm:gap-3 sm:pl-5 sm:pr-4">
        <AdminLink
          to={{ section: "overview" }}
          aria-label={t("shell.brandLabel")}
          className={cn("flex min-w-0 items-center gap-2.5 rounded-lg py-1 pr-1 text-foreground", focusRing)}
        >
          <IsoBrick shape="1x1" color="green" className="w-[26px]" />
          <b className="hidden whitespace-nowrap text-base font-extrabold tracking-[-0.01em] sm:inline">hugoviegas.dev</b>
          <span className="inline-flex h-[22px] items-center rounded-[5px] border border-line-strong px-1.5 font-mono text-[11px] font-bold tracking-[0.08em] text-ink-2 max-[359px]:hidden">
            ADMIN
          </span>
        </AdminLink>
        <span className="flex-1" />
        <p className="hidden min-w-0 items-center gap-2 px-2 font-mono text-[13px] text-ink-2 xl:flex">
          <Avatar email={email} />
          <span className="truncate">
            {t("signedInAs")} {email}
          </span>
        </p>
        <a
          href="/"
          className={cn("hidden min-h-11 items-center gap-2 whitespace-nowrap rounded-[10px] px-3 text-sm font-semibold text-foreground hover:bg-surface-2 lg:inline-flex", focusRing)}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t("shell.backToSite")}
        </a>
        <div role="group" aria-label={t("shell.preferences")} className="flex items-center gap-0.5">
          <LanguageControl onAnnounce={announce} />
          <ThemeSwitch onAnnounce={announce} />
        </div>
        <Button type="button" variant="neutral" size="touch" className="hidden lg:inline-flex" onClick={onSignOut}>
          <LogOut aria-hidden="true" />
          {t("signOut")}
        </Button>
        <IconButton className="lg:hidden" label={t("shell.account")} aria-haspopup="dialog" onClick={() => setAccountOpen(true)}>
          <Avatar email={email} />
        </IconButton>
        <p className="sr-only" aria-live="polite">
          {message}
        </p>
      </header>

      <div className="sticky top-16 z-30 flex items-center gap-2 border-b border-border bg-background px-3 py-2 sm:px-4 lg:hidden">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className={cn(
            "flex min-h-12 flex-1 items-center gap-2.5 rounded-xl border border-line-strong bg-card px-3.5 text-left text-[15px] font-bold shadow-e2",
            focusRing,
          )}
        >
          <Stud active />
          <span className="min-w-0 flex-1 truncate">{t(sectionLabelKey(location))}</span>
          {currentCount !== null && <span className="font-mono text-xs font-medium text-ink-3">{currentCount}</span>}
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">{t("shell.changeSection")}</span>
        </button>
      </div>

      <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[248px_minmax(0,1fr)]">
        <nav
          aria-label={t("shell.sections")}
          className="sticky top-16 hidden h-[calc(100vh-4rem)] overflow-y-auto border-r border-border bg-card px-3 pb-6 pt-5 lg:block"
        >
          <NavList />
          <p className="mt-6 rounded-xl bg-surface-2 p-3 text-[13px] text-ink-2">{t("shell.navFoot")}</p>
        </nav>
        <main
          id={MAIN_CONTENT_ID}
          tabIndex={-1}
          className="min-w-0 max-w-[1240px] px-4 pb-32 pt-4 focus:outline-none sm:px-6 lg:px-7 lg:pt-7 xl:px-10"
        >
          <Breadcrumb />
          {children}
        </main>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen} title={t("shell.goTo")} closeLabel={t("shell.close")}>
        <nav aria-label={t("shell.sections")}>
          <NavList onPick={() => setMenuOpen(false)} />
        </nav>
      </Sheet>
      <Sheet open={accountOpen} onOpenChange={setAccountOpen} title={t("shell.account")} closeLabel={t("shell.close")}>
        <p className="flex items-center gap-2 pb-4 pt-2 font-mono text-[13px] text-ink-2">
          <Avatar email={email} />
          <span className="min-w-0 break-all">
            {t("signedInAs")} {email}
          </span>
        </p>
        <div className="flex flex-col gap-2">
          <Button asChild variant="neutral" size="lg">
            <a href="/">
              <ArrowLeft aria-hidden="true" />
              {t("shell.backToSite")}
            </a>
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={onSignOut}>
            <LogOut aria-hidden="true" />
            {t("signOut")}
          </Button>
        </div>
      </Sheet>
    </div>
  );
};

export default AdminShell;
