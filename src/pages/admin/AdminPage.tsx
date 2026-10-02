import { useCallback, useEffect, useRef, useState } from "react";
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
import AdminDashboard from "./AdminDashboard";
import AdminGate, { type GateStatus } from "./AdminGate";
import { AdminNavProvider } from "./AdminNavigation";
import AdminShell from "./AdminShell";
import { AdminSummaryProvider } from "./AdminSummary";
import { AdminToastProvider } from "./AdminToasts";

type Status = Exclude<GateStatus, "signingIn"> | "granted";

// Hidden, unlinked admin. Rendering here is never authorization: the
// Firestore rules decide, and any account they reject is signed out at once.
const AdminPage = () => {
  const t = useAdminT();
  const [status, setStatus] = useState<Status>(isFirebaseConfigured ? "loading" : "unconfigured");
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checkingEmail, setCheckingEmail] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [signInFailed, setSignInFailed] = useState(false);
  // Ignores access checks that finish after the user has changed.
  const checkId = useRef(0);
  // Keeps the "denied" notice visible after the forced sign-out.
  const denied = useRef(false);

  const verify = useCallback(async (current: AdminUser) => {
    const id = ++checkId.current;
    setCheckingEmail(current.email);
    setStatus("checking");
    const result = await checkOwnerAccess();
    if (id !== checkId.current) return;
    if (result === "denied") {
      denied.current = true;
      setUser(null);
      setCheckingEmail(null);
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
      setCheckingEmail(null);
      setStatus(denied.current ? "denied" : "signedOut");
    });
  }, [verify]);

  const handleSignIn = async () => {
    setSignInFailed(false);
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      if (!isDismissedPopup(error)) setSignInFailed(true);
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = () => {
    denied.current = false;
    void signOutAdmin();
  };

  if (status === "granted" && user) {
    return (
      <AdminToastProvider>
        <AdminSummaryProvider>
          <AdminNavProvider>
            <p className="sr-only" role="status">
              {t("granted")}
            </p>
            <AdminShell email={user.email ?? ""} onSignOut={handleSignOut}>
              <AdminDashboard />
            </AdminShell>
          </AdminNavProvider>
        </AdminSummaryProvider>
      </AdminToastProvider>
    );
  }

  const gateStatus: GateStatus =
    signingIn && (status === "signedOut" || status === "denied") ? "signingIn" : status === "granted" ? "checking" : status;

  return (
    <AdminGate
      status={gateStatus}
      email={status === "error" ? user?.email ?? null : checkingEmail}
      signInFailed={signInFailed}
      onSignIn={() => void handleSignIn()}
      onRetry={() => user && void verify(user)}
      onSignOut={handleSignOut}
    />
  );
};

export default AdminPage;
