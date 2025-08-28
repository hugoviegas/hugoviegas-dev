import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleClick = () => {
    const targetTheme = theme === "light" ? "dark" : "light";
    setTheme(targetTheme);
  };

  return (
    // use icon size to keep circular shape and visual parity with TopControls
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      aria-label="Toggle theme"
      className="rounded-full hover:bg-accent/10 transition-colors"
    >
      <span className="sr-only">Toggle theme</span>
      {theme === "light" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </Button>
  );
}
