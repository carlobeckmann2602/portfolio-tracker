import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";

const AUTH_TOKEN_KEY = "authToken";
export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);
const setAuthToken = (token: string) =>
  localStorage.setItem(AUTH_TOKEN_KEY, token);
const unsetAuthToken = () => localStorage.removeItem(AUTH_TOKEN_KEY);

function decodeJWToken(token: string): AuthUser {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(window.atob(base64));
}

type AuthUser = {
  email: string;
  exp: number;
  iat: number;
  sub: number;
};

type Auth = {
  user: AuthUser | null;
  login(jwtToken: string): void;
  logout(): void;
};

const AuthContext = createContext<Auth | null>(null);

export const useAuth = () => useContext(AuthContext)!;

export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (token) setUser(decodeJWToken(token));
  }, []);

  const auth = useMemo<Auth>(
    () => ({
      user,
      login(token) {
        if (user) return;
        setAuthToken(token);
        setUser(decodeJWToken(token));
        router.push("/");
      },
      logout() {
        if (!user) return;
        setUser(null);
        unsetAuthToken();
        router.push("/login");
      },
    }),
    [user, router]
  );

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useUser = () => useAuth().user;
