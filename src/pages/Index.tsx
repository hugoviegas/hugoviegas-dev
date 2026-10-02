import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SkillsSection from "@/components/SkillsSection";
import { SectionDivider } from "@/components/sections/Section";

const ChatBot = lazy(() => import("@/components/ChatBot"));
const WidgetsSection = lazy(() => import("@/components/WidgetsSection"));

const Index = () => {
  const location = useLocation();

  // Land on the section named by the hash when arriving via a cross-route nav fallback
  useEffect(() => {
    if (!location.hash) return;
    const element = document.getElementById(location.hash.slice(1));
    element?.scrollIntoView({ behavior: "smooth" });
  }, [location.hash]);

  return (
    <div className="relative min-h-screen text-foreground">
      {/* The star field and optional spaceship are mounted in App. */}
      {/* AI Chatbot */}
      <Suspense fallback={null}>
        <ChatBot />
      </Suspense>
      {/* Main content positioned above background */}
      <div className="relative z-10">
        {/* Section ids live on the section components themselves */}
        <main id="main-content" tabIndex={-1} className="focus:outline-none">
          <HeroSection />
          <SectionDivider />
          <ProjectsSection />
          <ExperienceSection />
          <SkillsSection />
          <AboutSection />
          <SectionDivider variant="b" />
          <ContactSection />
          <Suspense fallback={null}>
            <WidgetsSection />
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
