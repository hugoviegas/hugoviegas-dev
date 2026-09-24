import { lazy, Suspense } from "react";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import TopBricksRow from "@/components/TopBricksRow";

const AmbientDots = lazy(() => import("@/components/AmbientDots"));
const BackgroundXWing = lazy(
  () => import("@/components/background/BackgroundXWing"),
);
const ChatBot = lazy(() => import("@/components/ChatBot"));
const WidgetsSection = lazy(() => import("@/components/WidgetsSection"));

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Ambient dots shared across the site (subtle, randomized) */}
      <Suspense fallback={null}>
        <AmbientDots count={18} />
        <BackgroundXWing />
      </Suspense>
      <TopBricksRow />
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
    </div>
  );
};

export default Index;
