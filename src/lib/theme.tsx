import { createContext, useContext, useEffect, useState, type Context, type ReactNode } from "react";

type Theme = "light" | "dark";
type ThemeState = { theme: Theme; toggle: () => void };
// One shared context even when this file is re-evaluated by a live update, so the
// dark/light button never ends up talking to a stale provider.
const CTX_KEY = "__ciaThemeContext__";
const globalRef = globalThis as typeof globalThis & { [CTX_KEY]?: Context<ThemeState> };
const Ctx = (globalRef[CTX_KEY] ??= createContext<ThemeState>({
  theme: "light",
  toggle: () => {},
}));

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("cia.theme") as Theme | null;
    if (saved === "dark" || saved === "light") setTheme(saved);
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("cia.theme", theme);
  }, [theme, loaded]);
  return (
    <Ctx.Provider
      value={{ theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useTheme = () => useContext(Ctx);

/** Dijalankan sebelum render untuk mencegah kedipan tema. */
export const themeInitScript = `try{if(localStorage.getItem("cia.theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}`;
