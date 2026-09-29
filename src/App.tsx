import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense, useEffect } from "react";
import DynamicSidebar from "@/components/DynamicSidebar";
import TopControls from "@/components/TopControls";
import { UserProvider } from "@/features/presente-x/contexts/UserContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FormulaD from "./pages/FormulaD";
import DarcyProject from "./pages/DarcyProject";
import BigBangDuelProject from "./pages/BigBangDuelProject";
import BigBangDuelStoryPage from "./pages/BigBangDuelStoryPage";
import LightsaberViewerMV from "./pages/LightsaberViewerMV";
import LightsaberDemo from "./pages/LightsaberDemo";
import StarshipDemo from "./pages/StarshipDemo";
import MicroFalcon from "./pages/MicroFalcon";

// Private, non-portfolio routes: lazy-loaded so their code stays out of the
// main bundle. Not a security boundary; responses also carry X-Robots-Tag
// noindex (see vercel.json).
const PropostaEtal = lazy(() => import("./pages/PropostaEtal"));
const PresenteX = lazy(() => import("./pages/PresenteX"));
const PresenteXAdmin = lazy(() => import("./pages/PresenteXAdmin"));
const PresenteXRecompensas = lazy(
  () => import("./pages/PresenteXRecompensas"),
);

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Disable browser scroll restoration to prevent page jumping on refresh
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Ensure page starts at top on initial load
    window.scrollTo(0, 0);
  }, []);

  // Render FormulaD normally as a React element so hooks work correctly.

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <UserProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <DynamicSidebar />
              <TopControls />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/lightsaber" element={<LightsaberViewerMV />} />
                <Route path="/starship-demo" element={<StarshipDemo />} />
                <Route path="/micro-falcon" element={<MicroFalcon />} />
                <Route
                  path="/proposta-etal"
                  element={
                    <Suspense fallback={null}>
                      <PropostaEtal />
                    </Suspense>
                  }
                />
                {/* Game page - put the Formula D game files into public/games/formula-d/ */}
                <Route path="/formula-d" element={<FormulaD />} />
                <Route path="/projects/darcy-mcgees" element={<DarcyProject />} />
                <Route path="/projects/big-bang-duel" element={<BigBangDuelProject />} />
                <Route path="/projects/big-bang-duel/story" element={<BigBangDuelStoryPage />} />

                {/* Presente X Routes */}
                <Route
                  path="/presente-x"
                  element={
                    <Suspense fallback={null}>
                      <PresenteX />
                    </Suspense>
                  }
                />
                <Route
                  path="/presente-x/admin"
                  element={
                    <Suspense fallback={null}>
                      <PresenteXAdmin />
                    </Suspense>
                  }
                />
                <Route
                  path="/presente-x/recompensas"
                  element={
                    <Suspense fallback={null}>
                      <PresenteXRecompensas />
                    </Suspense>
                  }
                />

                {/* ADD ALL OTHER CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
