"use client";
import { BotStatusEnum, IProject } from "@/interface/project.interface";
import { UserInterface } from "@/interface/user.interface";
import api from "@/util/api";
import { deleteCookie, hasCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const BYPASS_ONBOARDING = [
  "/onboarding/init",
  "/onboarding/select",
  "/onboarding/connect",
];

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInterface | null;
  project: IProject | null;
  setUser: (data: UserInterface | null) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  project: null,
  setUser: async () => {},
  loading: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserInterface | null>(null);
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = hasCookie("token");

    if (token) {
      try {
        const { metadata: user }: { metadata: UserInterface } =
          await api.get("/user/me");

        setUser(user);
        setProject(user.project);

        if (!BYPASS_ONBOARDING.includes(pathname)) {
          if (
            !user.project ||
            !user.project.guild_id ||
            user.project.bot_status !== BotStatusEnum.SUCCESS
          ) {
            router.push(BYPASS_ONBOARDING[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
        deleteCookie("token");
        window.location.href = "/login";
      }
    }

    setLoading(false);
  }, []);

  const handleSetUser = async (data: UserInterface | null) => {
    setUser(data);
  };

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        project,
        setUser: handleSetUser,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
