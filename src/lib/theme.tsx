import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
const Ctx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

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
