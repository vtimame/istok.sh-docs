import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ColorModeButton() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  const toggleColorMode = () => {
    const next = !isDark;

    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");

    setIsDark(next);
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleColorMode}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {mounted ? isDark ? <Sun /> : <Moon /> : <span className="size-4" />}
    </Button>
  );
}
