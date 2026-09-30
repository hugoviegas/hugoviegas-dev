import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import DynamicSidebar from "@/components/DynamicSidebar";
import TopControls from "@/components/TopControls";
import RouteSeo from "@/components/RouteSeo";
import SkipLink from "@/components/SkipLink";
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
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <RouteSeo />
            <SkipLink />
            <DynamicSidebar />
            <TopControls />
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

              {/* ADD ALL OTHER CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
