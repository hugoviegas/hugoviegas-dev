import { useState, useEffect } from "react";
import TopControls from "@/components/TopControls";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import DynamicSidebar from "@/components/DynamicSidebar";
import AmbientDots from "@/components/AmbientDots";
import TopBricksRow from "@/components/TopBricksRow";

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
      <AmbientDots count={36} />
      <TopControls />
      <DynamicSidebar show={showSidebar} />
      <TopBricksRow />

      {/* Each section owns its own id + vertical rhythm (see .section-shell) */}
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
