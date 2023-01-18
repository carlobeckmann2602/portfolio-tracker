import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = getAuthToken();
    if (token) setUser(decodeJWToken(token));
  }, []);

  useEffect(() => {
    // handle messages from the service worker
    function handleMessage(event: MessageEvent) {
      if (event.data.type === "getAuthToken") {
        navigator.serviceWorker.ready.then((registration) => {
          registration.active?.postMessage({
            type: "setAuthToken",
            authToken: getAuthToken(),
          });
        });
      }
    }

    // listen for messages from the service worker
    navigator.serviceWorker.addEventListener("message", handleMessage);

    // send the auth token to the service worker
    navigator.serviceWorker.ready.then((registration) => {
      registration.active?.postMessage({
        type: "setAuthToken",
        authToken: getAuthToken(),
      });
    });

    return () => {
      // remove the listener
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, [user]);

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
        setUser(null);
        unsetAuthToken();
        queryClient.setQueryData(["stock-portfolio"], null);
        router.push("/login");
      },
    }),
    [user, router, queryClient]
  );

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useUser = () => useAuth().user;
