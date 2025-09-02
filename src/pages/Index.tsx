import { useState, useEffect } from "react";
import TopControls from "@/components/TopControls";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AmbientDots from "@/components/AmbientDots";

const Index = () => {
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar navbar após passar da primeira seção (hero)
      const heroSection = document.getElementById("hero");
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        setShowNavbar(window.scrollY > heroHeight * 0.8);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Ambient dots shared across the site (subtle, randomized) */}
      <AmbientDots count={12} />
      <TopControls />
      <Navbar show={showNavbar} />
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
