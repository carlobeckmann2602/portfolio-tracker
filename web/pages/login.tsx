import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";
import { Button } from "../components/button";
import { CenterSection } from "../components/center-section";
import { Input } from "../components/form/input";
import { Helmet } from "../components/helmet";
import { PageHeading } from "../components/page-heading";
import { AuthContext, useLogin } from "../lib/backend";

const Login: NextPage = () => {
  const login = useLogin()
  const router = useRouter()
  const [, setUserID] = useContext(AuthContext);

  return (
    <>
      <Helmet title="Login" />
      <CenterSection>
        <PageHeading>Login</PageHeading>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            login.mutate({
              email,
              password,
            }, {
              onSuccess: (data) => {
                if (data.ok) {
                  setUserID("1")
                  router.push("/")
                }
              }
            })
          }}
        >
          <Input type="email" name="email" label="Email" />
          <Input type="password" name="password" label="Password" />
          <Button type="submit">Login</Button>
        </form>
      </CenterSection>
    </>
  );
};

export default Login;
