import { Moon, Sun } from "lucide-react";

function ThemeToggle({ theme, onToggle }) {
  const isLight = theme === "light";

  return (
    <button className="theme-toggle" type="button" onClick={onToggle} aria-label={`Switch to ${isLight ? "dark" : "light"} mode`} title={`Switch to ${isLight ? "dark" : "light"} mode`}>
      {isLight ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}

export default ThemeToggle;
