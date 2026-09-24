import { useState, useEffect, lazy, Suspense } from "react";
import TopControls from "@/components/TopControls";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import DynamicSidebar from "@/components/DynamicSidebar";
import TopBricksRow from "@/components/TopBricksRow";

const AmbientDots = lazy(() => import("@/components/AmbientDots"));
const BackgroundXWing = lazy(
  () => import("@/components/background/BackgroundXWing"),
);
const ChatBot = lazy(() => import("@/components/ChatBot"));
const WidgetsSection = lazy(() => import("@/components/WidgetsSection"));

const Index = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Reveal the sidebar once the hero is mostly scrolled past
      const heroSection = document.getElementById("hero");
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        setShowSidebar(window.scrollY > heroHeight * 0.3);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Ambient dots shared across the site (subtle, randomized) */}
      <Suspense fallback={null}>
        <AmbientDots count={18} />
        <BackgroundXWing />
      </Suspense>
      <TopControls />
      <DynamicSidebar show={showSidebar} />
      <TopBricksRow />
<<<<<<< HEAD

      {/* Each section owns its own id + vertical rhythm (see .section-shell) */}
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      <Footer />
=======
      {/* AI Chatbot */}
      <Suspense fallback={null}>
        <ChatBot />
      </Suspense>
      {/* Main content positioned above background */}
      <div className="relative z-10">
        <section id="hero">
          <HeroSection />
        </section>
        <section id="experience" className="pt-16">
          <ExperienceSection />
        </section>
        <section id="about" className="pt-16">
          <AboutSection />
        </section>
        <section id="projects" className="pt-16">
          <ProjectsSection />
        </section>
        <section id="contact" className="pt-16">
          <ContactSection />
        </section>
        <Suspense fallback={null}>
          <WidgetsSection />
        </Suspense>
        <Footer />
      </div>
>>>>>>> 57341ddefe7f3b416527f9e2d2bc41d6daab08c4
    </div>
  );
};

export default Index;
