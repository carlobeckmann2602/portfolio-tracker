import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { BACKEND_REST_URL } from ".";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
} from "react";
import { useRouter } from "next/router";

const AuthContext = createContext<
  [string | null, Dispatch<SetStateAction<string | null>>]
>([null, () => {}]);

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

export const AuthContextProvider = AuthContext.Provider;

export function useAuthContext() {
  return useContext(AuthContext);
}

export function useRegistration() {
  const router = useRouter();
  const [, setAuthToken] = useAuthContext();

  return useMutation(register, {
    onSuccess: async (data) => {
      if (data.ok) {
        const authToken = (await data.json()).access_token;
        setAuthToken(authToken);
        router.push("/");
      }
    },
  });
}

export function useLogin() {
  const router = useRouter();
  const [, setAuthToken] = useAuthContext();

  return useMutation(login, {
    onSuccess: async (data) => {
      if (data.ok) {
        const authToken = (await data.json()).access_token;
        setAuthToken(authToken);
        router.push("/");
      }
    },
  });
}

export function decodeJWToken(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(window.atob(base64));
}

export type BackendError = { statusCode: number; message: string };

export async function authFetch(...[input, options]: Parameters<typeof fetch>) {
  const token = localStorage.getItem("authToken");
  if (!token) throw Error("Auth token missing");

  const res = await fetch(input, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });

  if (Math.floor(res.status / 100) != 2) throw await res.json();

  return res;
}

function useAuthErrorHandler() {
  const router = useRouter();

  return useCallback(
    (error: BackendError) => {
      if (Math.floor(error.statusCode / 100) != 4) return;
      localStorage.removeItem("authToken");
      router.push("/login");
    },
    [router]
  );
}

export function useAuthQuery<
  TData = unknown,
  TError extends BackendError = BackendError,
  TQueryKey extends QueryKey = QueryKey
>(options: UseQueryOptions<TData, TError, TData, TQueryKey>) {
  const handleAuthError = useAuthErrorHandler();

  return useQuery({
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
