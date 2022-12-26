import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";
import { BACKEND_REST_URL } from ".";

const AUTH_TOKEN_KEY = "authToken";

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

const useAuth = () => useContext(AuthContext)!;

export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setUser(decodeJWToken(token));
  }, []);

  const auth = useMemo<Auth>(
    () => ({
      user,
      login(token) {
        if (user) return;
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        setUser(decodeJWToken(token));
        router.push("/");
      },
      logout() {
        if (!user) return;
        setUser(null);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        router.push("/login");
      },
    }),
    [user, router]
  );

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

type CreateUserDTO = {
  email: string;
  password: string;
  password2: string;
};

type LoginDTO = {
  email: string;
  password: string;
};

function register(createUserDTO: CreateUserDTO) {
  return fetch(`${BACKEND_REST_URL}/users`, {
    method: "POST",
    body: JSON.stringify(createUserDTO),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

function login(loginDTO: LoginDTO) {
  return fetch(`${BACKEND_REST_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(loginDTO),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

function useTokenHandler() {
  const { login } = useAuth();

  return useCallback(
    async (resp: Response) => {
      if (!resp.ok) return;
      const token: string = (await resp.json()).access_token;
      login(token);
    },
    [login]
  );
}

export function useRegistration() {
  const handleToken = useTokenHandler();
  return useMutation(register, { onSuccess: handleToken });
}

export function useLogin() {
  const handleToken = useTokenHandler();
  return useMutation(login, { onSuccess: handleToken });
}

export type BackendError = { statusCode: number; message: string };

export async function authFetch(...[input, options]: Parameters<typeof fetch>) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    const error: BackendError = { statusCode: 401, message: "Unauthorized" };
    throw error;
  }

  const res = await fetch(input, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });

  if (!res.ok) throw await res.json();

  return res;
}

function useAuthErrorHandler() {
  const { logout } = useAuth();

  return useCallback(
    (error: BackendError) => {
      if (error.statusCode != 401) return;
      logout();
    },
    [logout]
  );
}

export function useAuthQuery<
  TData = unknown,
  TError extends BackendError = BackendError,
  TQueryKey extends QueryKey = QueryKey
>(options: UseQueryOptions<TData, TError, TData, TQueryKey>) {
  const handleAuthError = useAuthErrorHandler();

  return useQuery({
    retry: 0,
    ...options,
    onError(err) {
      handleAuthError(err);
      if (options.onError) options.onError(err);
    },
  });
}

export function useAuthMutation<
  TData = unknown,
  TError extends BackendError = BackendError,
  TVariables = unknown,
  TContext = unknown
>(options: UseMutationOptions<TData, TError, TVariables, TContext>) {
  const handleAuthError = useAuthErrorHandler();

  return useMutation({
    ...options,
    onError(err, ...rest) {
      handleAuthError(err);
      if (options.onError) options.onError(err, ...rest);
    },
  });
}
