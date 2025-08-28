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
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      aria-label="Toggle theme"
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
