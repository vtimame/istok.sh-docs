import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

interface ColorModeButtonProps {
  toLight: string;
  toDark: string;
}

export function ColorModeButton({ toLight, toDark }: ColorModeButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  const toggleColorMode = () => {
    const next = !isDark;

    document.documentElement.classList.toggle("dark", next);

    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // The choice still applies to this page when storage is unavailable.
    }

    setIsDark(next);
  };

  const label = isDark ? toLight : toDark;

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleColorMode}
      aria-label={label}
      title={label}
    >
      {mounted ? isDark ? <Sun /> : <Moon /> : <span className="size-4" />}
    </Button>
  );
}
