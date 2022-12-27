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

function fetchRegister(createUserDTO: CreateUserDTO) {
  return fetch(`${BACKEND_REST_URL}/users`, {
    method: "POST",
    body: JSON.stringify(createUserDTO),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

function fetchLogin(loginDTO: LoginDTO) {
  return fetch(`${BACKEND_REST_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(loginDTO),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

async function fetchLogout() {
  await authFetch(`${BACKEND_REST_URL}/auth/logout`);
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
  return useMutation({ mutationFn: fetchRegister, onSuccess: handleToken });
}

export function useLogin() {
  const handleToken = useTokenHandler();
  return useMutation({ mutationFn: fetchLogin, onSuccess: handleToken });
}

export function useLogout() {
  const { logout } = useAuth();
  return useAuthMutation({ mutationFn: fetchLogout, onSuccess: logout });
}
