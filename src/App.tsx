import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense, useEffect } from "react";
import DynamicSidebar from "@/components/DynamicSidebar";
import TopControls from "@/components/TopControls";
import RouteSeo from "@/components/RouteSeo";
import SkipLink from "@/components/SkipLink";
import StarField from "@/components/background/StarField";
import SpaceshipLayer from "@/components/background/SpaceshipLayer";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ADMIN_PATH } from "@/config/admin";
import AdminLoading from "@/components/AdminLoading";
import { scheduleContentRefresh } from "@/content/store";

// Secondary routes load on demand so the homepage critical path stays small
// (the archived 3D pages would otherwise pull three.js into the entry).
const FormulaD = lazy(() => import("./pages/FormulaD"));
const DarcyProject = lazy(() => import("./pages/DarcyProject"));
const BigBangDuelProject = lazy(() => import("./pages/BigBangDuelProject"));
const BigBangDuelStoryPage = lazy(
  () => import("./pages/BigBangDuelStoryPage"),
);
const LightsaberViewerMV = lazy(() => import("./pages/LightsaberViewerMV"));
const StarshipDemo = lazy(() => import("./pages/StarshipDemo"));
const MicroFalcon = lazy(() => import("./pages/MicroFalcon"));
// Hidden admin: its own chunk, so the Firebase SDK never loads on public pages.
const AdminPage = lazy(() => import("./pages/admin/AdminPage"));

const queryClient = new QueryClient();

// The public navigation, controls and background layers. The admin has its
// own shell, so none of them render on the admin route.
const PublicChrome = () => {
  const { pathname } = useLocation();
  if (pathname === ADMIN_PATH || pathname.startsWith(`${ADMIN_PATH}/`)) return null;
  return (
    <>
      <StarField />
      <SpaceshipLayer />
      <DynamicSidebar />
      <TopControls />
    </>
  );
};

const App = () => {
  useEffect(() => {
    // Disable browser scroll restoration to prevent page jumping on refresh
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Ensure page starts at top on initial load
    window.scrollTo(0, 0);

    // Swap in newer Firestore content once the page is idle.
    scheduleContentRefresh();
  }, []);

  // Render FormulaD normally as a React element so hooks work correctly.

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <RouteSeo />
            <SkipLink />
            <PublicChrome />
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/lightsaber" element={<LightsaberViewerMV />} />
                <Route path="/starship-demo" element={<StarshipDemo />} />
                <Route path="/micro-falcon" element={<MicroFalcon />} />
                {/* Game page - put the Formula D game files into public/games/formula-d/ */}
                <Route path="/formula-d" element={<FormulaD />} />
                <Route path="/projects/darcy-mcgees" element={<DarcyProject />} />
                <Route path="/projects/big-bang-duel" element={<BigBangDuelProject />} />
                <Route path="/projects/big-bang-duel/story" element={<BigBangDuelStoryPage />} />
                <Route
                  path={`${ADMIN_PATH}/*`}
                  element={
                    <Suspense fallback={<AdminLoading />}>
                      <AdminPage />
                    </Suspense>
                  }
                />

                {/* ADD ALL OTHER CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
