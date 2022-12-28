import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "../lib/backend";

export const LoggedInRedirection = () => {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/");
  }, [user, router]);

  return null;
};
