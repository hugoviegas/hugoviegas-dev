// Server-only check that a request carries Hugo's Firebase ID token. Used by
// the /api routes; never import it from browser code.
// Mirrors isOwner() in firestore.rules: change both together.
import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from "jose";

export const FIREBASE_PROJECT_ID = "assistente-virtual-e4322";
// Hugo's Firebase Auth UID. An identifier, not a secret.
export const OWNER_UID = "pDIVBg1M6najIUMkuW2GLuYpszx1";

// Google's public keys for Firebase ID tokens. jose caches them between calls.
const FIREBASE_JWKS = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
  ),
);

export const bearerToken = (header: string | null | undefined): string | null => {
  const match = /^Bearer ([A-Za-z0-9._-]+)$/.exec(header ?? "");
  return match ? match[1] : null;
};

// True only for a valid, unexpired ID token of the owner's verified Google
// sign-in. Any failure returns false; the caller answers 401.
export const isOwnerToken = async (
  token: string | null,
  keys: JWTVerifyGetKey = FIREBASE_JWKS,
): Promise<boolean> => {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, keys, {
      algorithms: ["RS256"],
      issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
      audience: FIREBASE_PROJECT_ID,
      requiredClaims: ["exp", "iat", "sub", "auth_time"],
      clockTolerance: 5,
    });
    const firebase = payload.firebase as { sign_in_provider?: unknown } | undefined;
    const authTime = payload.auth_time;
    return (
      payload.sub === OWNER_UID &&
      payload.email_verified === true &&
      firebase?.sign_in_provider === "google.com" &&
      typeof authTime === "number" &&
      authTime <= Date.now() / 1000 + 5
    );
  } catch {
    return false;
  }
};
