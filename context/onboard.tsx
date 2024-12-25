import { createContext, ReactNode, useContext, useState, useCallback } from "react";

interface OnboardContextType {
  guildId: string;
  projectId: string;
  setForm: (data: Partial<{ guildId: string; projectId: string }>) => void;
}

const OnboardContext = createContext<OnboardContextType | undefined>(undefined);

export const OnboardProvider = ({ children }: { children: ReactNode }) => {
  const [guildId, setGuildId] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");

  const setForm = useCallback((data: Partial<{ guildId: string; projectId: string }>) => {
    if (data.guildId !== undefined) setGuildId(data.guildId);
    if (data.projectId !== undefined) setProjectId(data.projectId);
  }, []);

  return (
    <OnboardContext.Provider value={{ guildId, projectId, setForm }}>
      {children}
    </OnboardContext.Provider>
  );
};

export const useOnboard = (): OnboardContextType => {
  const context = useContext(OnboardContext);
  if (!context) {
    throw new Error("useOnboard must be used within an OnboardProvider");
  }
  return context;
};
