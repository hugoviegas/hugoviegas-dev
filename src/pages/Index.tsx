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
      // Mostrar sidebar após passar da primeira seção (hero)
      const heroSection = document.getElementById("hero");
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        setShowSidebar(window.scrollY > heroHeight * 0.3);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Ambient dots shared across the site (subtle, randomized) */}
      <AmbientDots count={36} />
      <TopControls />
      <DynamicSidebar show={showSidebar} />
      <TopBricksRow />
      <section id="hero">
        <HeroSection />
      </section>
      <section id="about" className="pt-16">
        <AboutSection />
      </section>
      <section id="projects" className="pt-16">
        <ProjectsSection />
      </section>
      <section id="experience" className="pt-16">
        <ExperienceSection />
      </section>
      <section id="contact" className="pt-16">
        <ContactSection />
      </section>
      <Footer />
    </div>
  );
};

export default Index;
