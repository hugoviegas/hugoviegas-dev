// Hidden admin route. This is obscurity only: the path ships in the JS bundle
// and in vercel.json. Firestore Security Rules are the real access control.
// vercel.json repeats this path (rewrite + X-Robots-Tag); a test keeps them in sync.
export const ADMIN_PATH = "/admin-1af7c92887b0dc73";
