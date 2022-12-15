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

  return useMutation(register, {
    onSuccess: (data) => {
      if (data.ok) {
        router.push("/login");
      }
    },
  });
}

export function useLogin() {
  const router = useRouter();
  const [, setUserID] = useAuthContext();

  return useMutation(login, {
    onSuccess: (data) => {
      if (data.ok) {
        setUserID("1");
        router.push("/");
      }
    },
    onSettled: () => {
      setUserID("1");
      router.push("/");
    },
  });
}
