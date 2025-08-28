import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { languages } from '@/config/languages';
import { useLanguage } from '@/hooks/useLanguage';

export default function TopControls() {
  const { language, toggleLanguage, currentLanguage } = useLanguage();

  return (
    // make outer container non-interactive so it doesn't block underlying centered nav
    <div className="fixed top-3 left-0 right-0 z-50 flex justify-end items-center px-6 lg:px-8 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3 bg-card/50 glass p-2 rounded-full">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="flex items-center gap-2 rounded-full hover:bg-accent/10 transition-colors"
        >
          <span className="text-sm">{currentLanguage.flag}</span>
          <span className="text-sm font-medium">{language}</span>
        </Button>
      </div>
    </div>
  );
}
