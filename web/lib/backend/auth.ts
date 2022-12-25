import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { BACKEND_REST_URL } from ".";
import { useCallback } from "react";
import { useRouter } from "next/router";

const AUTH_TOKEN_KEY = "authToken";

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

function decodeJWToken(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(window.atob(base64));
}

function useTokenHandler() {
  const router = useRouter();

  return useCallback(
    async (resp: Response) => {
      if (!resp.ok) return;
      const token = (await resp.json()).access_token;
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      console.log("authToken", decodeJWToken(token));
      router.push("/");
    },
    [router]
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
  const router = useRouter();

  return useCallback(
    (error: BackendError) => {
      if (error.statusCode != 401) return;
      localStorage.removeItem(AUTH_TOKEN_KEY);
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
