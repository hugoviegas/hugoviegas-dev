import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface NavbarProps {
  show: boolean;
}

const Navbar = ({ show }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // close mobile menu on route change or when hide
    if (!show) setIsMobileMenuOpen(false);
  }, [show]);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

    const { t } = useLanguage();

    const navItems = [
      { id: 'about', label: t('about') },
      { id: 'projects', label: t('projects') },
      { id: 'experience', label: t('experience') },
      { id: 'contact', label: t('contact') },
    ];

  if (!show) return null;

  return (
    <>
      {/* Mobile hamburger fixed to the left with the same pill style as TopControls */}
      <div className="fixed top-3 left-4 z-50 md:hidden">
        <div className="pointer-events-auto flex items-center gap-3 bg-card/50 glass p-2 rounded-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-full"
            aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown panel (left-aligned under the hamburger) */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-4 z-40 md:hidden">
          <div className="w-[90vw] max-w-xs glass rounded-xl p-3 shadow-lg border border-white/10">
            <div className="flex flex-col gap-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full text-left px-4 py-3 text-muted-foreground hover:text-primary hover:bg-accent/10 rounded-full transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Centered rounded rectangle similar to TopControls (desktop only) */}
      <div className="hidden md:flex fixed top-4 left-0 right-0 z-40 justify-center pointer-events-none">
        <div className="pointer-events-auto glass rounded-2xl px-4 py-2 flex items-center gap-6 shadow-lg border border-white/10">
          {/* Desktop nav */}
          <div className="flex items-center gap-6">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-muted-foreground hover:text-primary transition-colors px-2 py-1"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
