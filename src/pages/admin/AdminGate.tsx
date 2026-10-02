import { AlertCircle, ArrowLeft, Check, KeyRound, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrickLoader from "@/components/brand/BrickLoader";
import IsoBrick from "@/components/brand/IsoBrick";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { cn } from "@/lib/utils";
import { useAdminT } from "./adminStrings";
import { cardClass, focusRing, Notice } from "./ui";

export type GateStatus =
  | "unconfigured"
  | "loading"
  | "signedOut"
  | "signingIn"
  | "checking"
  | "denied"
  | "error";

// Sign-in and access screens. Every state keeps the brand mark, a plain
// explanation and one clear next step. Rendering here never grants access.
const AdminGate = ({
  status,
  email,
  signInFailed,
  onSignIn,
  onRetry,
  onSignOut,
}: {
  status: GateStatus;
  email: string | null;
  signInFailed: boolean;
  onSignIn: () => void;
  onRetry: () => void;
  onSignOut: () => void;
}) => {
  const t = useAdminT();

  const icon = (tone: "brick" | "bad" | "warn" | "ok") =>
    tone === "brick" ? (
      <IsoBrick shape="2x2" color="green" className="w-[72px]" />
    ) : (
      <span
        aria-hidden="true"
        className={cn(
          "grid h-11 w-11 place-items-center rounded-xl",
          tone === "bad" && "bg-error-tint text-destructive",
          tone === "warn" && "bg-surface-2 text-foreground",
          tone === "ok" && "bg-primary-tint text-primary",
        )}
      >
        {tone === "bad" && <AlertCircle className="h-[22px] w-[22px]" />}
        {tone === "warn" && <Wrench className="h-[22px] w-[22px]" />}
        {tone === "ok" && <Check className="h-[22px] w-[22px]" />}
      </span>
    );

  const account = email && (
    <p className="flex min-w-0 items-center gap-2 font-mono text-[13px] text-ink-2">
      <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-tint font-sans text-[13px] font-bold text-primary">
        {email[0]?.toUpperCase()}
      </span>
      <span className="min-w-0 break-all">{email}</span>
    </p>
  );

  const signInButton = (label: string, variant: "primary" | "neutral" = "primary") => (
    <Button type="button" variant={variant} size="lg" className="w-full" onClick={onSignIn}>
      <KeyRound aria-hidden="true" />
      {label}
    </Button>
  );

  let body: JSX.Element;
  switch (status) {
    case "loading":
      body = (
        <div role="status" className="flex flex-col items-center gap-3.5 text-sm text-ink-2">
          <BrickLoader className="scale-[1.6] text-primary" />
          {t("loading")}
        </div>
      );
      break;
    case "unconfigured":
      body = (
        <section aria-labelledby="gate-title" className={cn(cardClass, "flex w-full max-w-[440px] flex-col items-start gap-4 p-6 sm:p-8")}>
          {icon("warn")}
          <h1 id="gate-title" className="text-[26px] font-extrabold leading-tight tracking-[-0.02em]">
            {t("gate.unconfiguredTitle")}
          </h1>
          <p role="alert" className="text-ink-2">
            {t("unconfigured")}
          </p>
          <p className="text-[13px] text-ink-3">{t("gate.unconfiguredNote")}</p>
        </section>
      );
      break;
    case "denied":
      body = (
        <section aria-labelledby="gate-title" className={cn(cardClass, "flex w-full max-w-[440px] flex-col items-start gap-4 p-6 sm:p-8")}>
          {icon("bad")}
          <h1 id="gate-title" className="text-[26px] font-extrabold leading-tight tracking-[-0.02em]">
            {t("gate.deniedTitle")}
          </h1>
          <p role="alert" className="text-ink-2">
            {t("denied")}
          </p>
          {signInButton(t("gate.otherAccount"), "neutral")}
        </section>
      );
      break;
    case "error":
      body = (
        <section aria-labelledby="gate-title" className={cn(cardClass, "flex w-full max-w-[440px] flex-col items-start gap-4 p-6 sm:p-8")}>
          {icon("bad")}
          <h1 id="gate-title" className="text-[26px] font-extrabold leading-tight tracking-[-0.02em]">
            {t("gate.errorTitle")}
          </h1>
          <p role="alert" className="text-ink-2">
            {t("error")}
          </p>
          {account}
          {email && (
            <Button type="button" variant="primary" size="lg" className="w-full" onClick={onRetry}>
              {t("retry")}
            </Button>
          )}
          <Button type="button" variant="ghost" size="lg" className="w-full" onClick={onSignOut}>
            {t("signOut")}
          </Button>
        </section>
      );
      break;
    case "checking":
      body = (
        <section aria-labelledby="gate-title" aria-busy="true" className={cn(cardClass, "flex w-full max-w-[440px] flex-col items-start gap-4 p-6 sm:p-8")}>
          {icon("brick")}
          <h1 id="gate-title" className="text-[26px] font-extrabold leading-tight tracking-[-0.02em]">
            {t("gate.signedInTitle")}
          </h1>
          <p className="text-ink-2">{t("gate.checkingBody")}</p>
          {account}
          <p role="status" className="flex items-center gap-2.5 text-sm text-ink-2">
            <BrickLoader className="text-primary" />
            {t("checking")}
          </p>
        </section>
      );
      break;
    default: {
      // signedOut, signingIn
      const busy = status === "signingIn";
      body = (
        <section aria-labelledby="gate-title" className={cn(cardClass, "flex w-full max-w-[440px] flex-col items-start gap-4 p-6 sm:p-8")}>
          {icon("brick")}
          <h1 id="gate-title" className="text-[26px] font-extrabold leading-tight tracking-[-0.02em]">
            {t("title")}
          </h1>
          <p className="text-ink-2">{busy ? t("gate.busyBody") : t("intro")}</p>
          {signInFailed && !busy && (
            <Notice tone="bad" role="alert" className="w-full">
              {t("signInError")}
            </Notice>
          )}
          {busy ? (
            <Button type="button" variant="primary" size="lg" className="w-full" disabled aria-disabled="true">
              <BrickLoader />
              {t("gate.waiting")}
            </Button>
          ) : (
            signInButton(t("signIn"))
          )}
          <p className="text-[13px] text-ink-3">{busy ? t("gate.popupHint") : t("gate.signInHint")}</p>
        </section>
      );
    }
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="absolute left-4 top-4 flex items-center gap-2.5 sm:left-6 sm:top-5">
        <IsoBrick shape="1x1" color="green" className="w-[26px]" />
        <b className="text-base font-extrabold">hugoviegas.dev</b>
        <span className="inline-flex h-[22px] items-center rounded-[5px] border border-line-strong px-1.5 font-mono text-[11px] font-bold tracking-[0.08em] text-ink-2">
          ADMIN
        </span>
      </div>
      <main
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 py-24 focus:outline-none"
      >
        {body}
        <a href="/" className={cn("inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-ink-2 hover:text-foreground", focusRing)}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t("shell.backToSite")}
        </a>
      </main>
    </div>
  );
};

export default AdminGate;
