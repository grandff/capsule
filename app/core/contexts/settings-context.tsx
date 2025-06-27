import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Theme, useTheme } from "remix-themes";

type FontSize = "default" | "large" | "larger";
type ColorBlindMode = boolean;

interface SettingsContextType {
  fontSize: FontSize;
  colorBlindMode: ColorBlindMode;
  isLoading: boolean;
  updateFontSize: (size: FontSize) => Promise<void>;
  updateColorBlindMode: (enabled: boolean) => Promise<void>;
  loadSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useTheme();
  const [fontSize, setFontSize] = useState<FontSize>("default");
  const [colorBlindMode, setColorBlindMode] = useState<ColorBlindMode>(false);
  const [isLoading, setIsLoading] = useState(false);

  // 설정 적용 함수
  const applySettings = (newFontSize: FontSize, newColorBlindMode: boolean) => {
    // 글꼴 크기 적용
    const root = document.documentElement;
    root.style.fontSize =
      newFontSize === "default"
        ? "16px"
        : newFontSize === "large"
          ? "18px"
          : "20px";

    // 색약 모드 적용
    if (newColorBlindMode) {
      document.documentElement.classList.add("color-blind-mode");

      // 색약 모드 CSS 스타일 적용
      const style = document.createElement("style");
      style.id = "color-blind-mode-style";
      style.textContent = `
        .color-blind-mode * {
          color: #000 !important;
          background-color: #fff !important;
          border-color: #000 !important;
          box-shadow: none !important;
        }
        .color-blind-mode *:hover {
          background-color: #f0f0f0 !important;
        }
        .color-blind-mode .dark * {
          color: #fff !important;
          background-color: #000 !important;
          border-color: #fff !important;
        }
        .color-blind-mode .dark *:hover {
          background-color: #333 !important;
        }
      `;
      document.head.appendChild(style);
    } else {
      document.documentElement.classList.remove("color-blind-mode");
      const existingStyle = document.getElementById("color-blind-mode-style");
      if (existingStyle) {
        existingStyle.remove();
      }
    }
  };

  // 설정 저장 함수
  const saveSettingsToDatabase = async (
    newFontSize: FontSize,
    newColorBlindMode: boolean,
  ) => {
    setIsLoading(true);
    try {
      const currentTheme = theme || "system";
      const response = await fetch(
        `/api/settings/setting?action=save&theme=${currentTheme}&fontSize=${newFontSize}&blindMode=${newColorBlindMode}`,
      );
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "설정 저장에 실패했습니다.");
      }

      // 로컬 스토리지에도 백업 저장
      localStorage.setItem("fontSize", newFontSize);
      localStorage.setItem("colorBlindMode", newColorBlindMode.toString());
    } catch (error) {
      console.error("설정 저장 중 오류:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 설정 불러오기 함수
  const loadSettings = async () => {
    try {
      const response = await fetch(`/api/settings/setting?action=get`);
      const result = await response.json();

      if (result.success && result.data) {
        const newFontSize = result.data.font_size as FontSize;
        const newColorBlindMode = result.data.color_blind_mode;

        setFontSize(newFontSize);
        setColorBlindMode(newColorBlindMode);

        // 테마 설정 적용
        if (result.data.theme === "system") {
          setTheme(null);
        } else if (result.data.theme === "light") {
          setTheme(Theme.LIGHT);
        } else if (result.data.theme === "dark") {
          setTheme(Theme.DARK);
        }

        // 설정 적용
        applySettings(newFontSize, newColorBlindMode);
      }
    } catch (error) {
      console.error("설정을 불러오는 중 오류:", error);
      // 기본값으로 로컬 스토리지에서 불러오기
      const savedFontSize = localStorage.getItem("fontSize") as FontSize;
      const savedColorBlindMode =
        localStorage.getItem("colorBlindMode") === "true";

      if (savedFontSize) {
        setFontSize(savedFontSize);
        applySettings(savedFontSize, colorBlindMode);
      }
      if (savedColorBlindMode) {
        setColorBlindMode(savedColorBlindMode);
        applySettings(fontSize, savedColorBlindMode);
      }
    }
  };

  // 글꼴 크기 업데이트
  const updateFontSize = async (newFontSize: FontSize) => {
    setFontSize(newFontSize);
    applySettings(newFontSize, colorBlindMode);
    await saveSettingsToDatabase(newFontSize, colorBlindMode);
  };

  // 색약 모드 업데이트
  const updateColorBlindMode = async (enabled: boolean) => {
    setColorBlindMode(enabled);
    applySettings(fontSize, enabled);
    await saveSettingsToDatabase(fontSize, enabled);
  };

  // 초기 설정 불러오기
  useEffect(() => {
    loadSettings();
  }, []);

  const value: SettingsContextType = {
    fontSize,
    colorBlindMode,
    isLoading,
    updateFontSize,
    updateColorBlindMode,
    loadSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
