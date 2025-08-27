import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import heroImage from '@/assets/hugo-hero.jpg';

const HeroSection = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = 'IT Support Specialist → Full-Stack Developer';

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-32 w-24 h-24 bg-secondary rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-accent rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Column */}
          <div className="space-y-8 fade-in">
            <div className="space-y-4">
              <div className="text-primary font-mono text-lg">
                Hello, I'm
              </div>
              <h1 className="heading-hero">
                Hugo Viegas
              </h1>
              <div className="h-20 flex items-center">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-muted-foreground font-mono">
                  {displayText}
                  <span className="inline-block w-1 h-8 bg-primary ml-2 animate-blink"></span>
                </h2>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Transforming 4+ years of IT Support expertise into innovative web solutions. 
                Based in Dublin, passionate about problem-solving and continuous learning.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={scrollToProjects}
                className="btn-hero text-lg px-8 py-6"
              >
                View My Projects
              </Button>
              <Button 
                onClick={scrollToContact}
                variant="outline" 
                className="btn-ghost text-lg px-8 py-6"
              >
                Get In Touch
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex space-x-6">
              <a 
                href="https://github.com/hugovjas" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 glass rounded-full hover:scale-110 hover:neon-glow transition-all duration-300"
              >
                <Github className="w-6 h-6 text-primary" />
              </a>
              <a 
                href="https://linkedin.com/in/hugovjeas" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 glass rounded-full hover:scale-110 hover:neon-glow transition-all duration-300"
              >
                <Linkedin className="w-6 h-6 text-primary" />
              </a>
              <a 
                href="mailto:hugo.viegas@example.com"
                className="p-3 glass rounded-full hover:scale-110 hover:neon-glow transition-all duration-300"
              >
                <Mail className="w-6 h-6 text-primary" />
              </a>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative lg:justify-self-end fade-in delay-300">
            <div className="relative">
              {/* Glassmorphism Frame */}
              <div className="glass-strong rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl"></div>
                <img 
                  src={heroImage} 
                  alt="Hugo Viegas - IT Support Specialist transitioning to Full-Stack Developer"
                  className="relative z-10 w-80 h-80 object-cover rounded-2xl shadow-2xl"
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 glass-strong rounded-2xl p-4 border border-primary/30">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">4+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-primary" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;