import { useMutation } from "@tanstack/react-query";
import { BACKEND_REST_URL } from ".";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
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
