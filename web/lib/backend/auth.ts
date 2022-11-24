import { useMutation } from "@tanstack/react-query";
import { BACKEND_REST_URL } from ".";

type CreateUserDTO = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type LoginDTO = {
  email: string;
  password: string;
};

function register(
  createUserDTO: CreateUserDTO,
) {
  return fetch(`${BACKEND_REST_URL}/users`, {
    method: "POST",
    body: JSON.stringify(createUserDTO),
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
  });
}

function login(loginDTO: LoginDTO) {
  return fetch(`${BACKEND_REST_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(loginDTO),
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
  });
}

export function useRegistration() {
  return useMutation(register);
}

export function useLogin() {
  return useMutation(login);
}
