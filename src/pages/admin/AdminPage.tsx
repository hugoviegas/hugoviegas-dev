import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  checkOwnerAccess,
  isDismissedPopup,
  isFirebaseConfigured,
  signInWithGoogle,
  signOutAdmin,
  watchAuth,
  type AdminUser,
} from "./adminAuth";
import { useAdminT } from "./adminStrings";
import SeedImport from "./SeedImport";

type Status =
  | "unconfigured"
  | "loading"
  | "signedOut"
  | "checking"
  | "granted"
  | "denied"
  | "error";

// Hidden, unlinked admin shell. Rendering here is never authorization: the
// Firestore rules decide, and any account they reject is signed out at once.
const AdminPage = () => {
  const t = useAdminT();
  const [status, setStatus] = useState<Status>(
    isFirebaseConfigured ? "loading" : "unconfigured",
  );
  const [user, setUser] = useState<AdminUser | null>(null);
  const [signInFailed, setSignInFailed] = useState(false);
  // Ignores access checks that finish after the user has changed.
  const checkId = useRef(0);
  // Keeps the "denied" notice visible after the forced sign-out.
  const denied = useRef(false);

  const verify = useCallback(async (current: AdminUser) => {
    const id = ++checkId.current;
    setStatus("checking");
    const result = await checkOwnerAccess();
    if (id !== checkId.current) return;
    if (result === "denied") {
      denied.current = true;
      setUser(null);
      setStatus("denied");
      await signOutAdmin();
      return;
    }
    setUser(current);
    setStatus(result);
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return watchAuth((next) => {
      if (next) {
        denied.current = false;
        void verify(next);
        return;
      }
      checkId.current++;
      setUser(null);
      setStatus(denied.current ? "denied" : "signedOut");
    });
  }, [verify]);

  const handleSignIn = async () => {
    setSignInFailed(false);
    try {
      await signInWithGoogle();
    } catch (error) {
      if (!isDismissedPopup(error)) setSignInFailed(true);
    }
  };

  const handleSignOut = () => {
    denied.current = false;
    void signOutAdmin();
  };

  const showSignIn = status === "signedOut" || status === "denied";

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-screen items-center justify-center bg-background px-6 py-24 focus:outline-none"
    >
      <div className="w-full max-w-2xl space-y-6 text-center">
        <header className="space-y-2">
          <h1 className="heading-section">{t("title")}</h1>
          <p className="body-text">{t("intro")}</p>
        </header>

        <div role="status" aria-live="polite" className="body-text">
          {status === "loading" && t("loading")}
          {status === "checking" && t("checking")}
          {status === "granted" && t("granted")}
        </div>

        {status === "unconfigured" && <p role="alert">{t("unconfigured")}</p>}
        {status === "denied" && <p role="alert">{t("denied")}</p>}
        {signInFailed && <p role="alert">{t("signInError")}</p>}

        {status === "error" && (
          <div className="space-y-3">
            <p role="alert">{t("error")}</p>
            <div className="flex justify-center gap-3">
              {user && (
                <Button type="button" onClick={() => void verify(user)}>
                  {t("retry")}
                </Button>
              )}
              <Button type="button" variant="outline" onClick={handleSignOut}>
                {t("signOut")}
              </Button>
            </div>
          </div>
        )}

        {showSignIn && (
          <Button type="button" onClick={handleSignIn}>
            {t("signIn")}
          </Button>
        )}

        {status === "granted" && user && (
          <div className="space-y-3">
            <p className="body-text">
              {t("signedInAs")} <strong>{user.email}</strong>
            </p>
            <Button type="button" variant="outline" onClick={handleSignOut}>
              {t("signOut")}
            </Button>
          </div>
        )}

        {status === "granted" && <SeedImport />}
      </div>
    </main>
  );
};

export default AdminPage;
