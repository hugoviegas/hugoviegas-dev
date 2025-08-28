import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

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

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' }
  ];

  if (!show) return null;

  return (
    // Centered rounded rectangle similar to TopControls
    <div className="fixed top-4 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div className="pointer-events-auto glass rounded-2xl px-4 py-2 flex items-center gap-6 shadow-lg border border-white/10">
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
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

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="rounded-full">
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown under the pill */}
      {isMobileMenuOpen && (
        <div className="absolute top-full mt-2 w-full left-0 flex justify-center">
          <div className="w-[95%] md:w-auto glass rounded-xl p-3 shadow-lg border border-white/10">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
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
    </div>
  );
};

export default Navbar;
