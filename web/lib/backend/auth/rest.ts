import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useCallback } from "react";
import { getAuthToken, useAuth } from "./context";
import { BACKEND_REST_URL } from "..";

type BackendError = { statusCode: number; message: string };

export async function authFetch(...[input, options]: Parameters<typeof fetch>) {
  const token = getAuthToken();
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
      if (
        error.statusCode == 401 ||
        (error.statusCode == 404 && error.message == "User not found")
      ) {
        logout();
      }
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
    onError(err, ...args) {
      handleAuthError(err);
      if (options.onError) options.onError(err, ...args);
    },
  });
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

async function fetchFormPost(href: string, body: string) {
  const res = await fetch(href, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body,
  });

  if (res.ok) return res;

  const { message }: { message: string | string[] } = await res.json();
  throw Array.isArray(message) ? message[0] : message;
}

async function extractToken(res: Response) {
  const token = (await res.json()).access_token as string | undefined;
  if (!token) throw "Something went wrong";
  return token;
}

async function fetchRegister(createUserDTO: CreateUserDTO) {
  return extractToken(
    await fetchFormPost(
      `${BACKEND_REST_URL}/users`,
      JSON.stringify(createUserDTO)
    )
  );
}

async function fetchLogin(loginDTO: LoginDTO) {
  return extractToken(
    await fetchFormPost(
      `${BACKEND_REST_URL}/auth/login`,
      JSON.stringify(loginDTO)
    )
  );
}

async function fetchLogout() {
  await authFetch(`${BACKEND_REST_URL}/auth/logout`);
}

export function useRegistration() {
  const { login } = useAuth();
  return useMutation<string, string, CreateUserDTO>({
    mutationFn: fetchRegister,
    onSuccess: login,
  });
}

export type LoginError = { messages: string[] };

export function useLogin() {
  const { login } = useAuth();
  return useMutation<string, string, LoginDTO>({
    mutationFn: fetchLogin,
    onSuccess: login,
  });
}

export function useLogout() {
  const { logout } = useAuth();
  return useAuthMutation({ mutationFn: fetchLogout, onSuccess: logout });
}
