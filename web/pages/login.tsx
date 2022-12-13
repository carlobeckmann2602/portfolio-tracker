import type { NextPage } from "next";
import Link from "next/link";
import { Button } from "../components/button";
import { CenterSection } from "../components/center-section";
import { Input } from "../components/form/input";
import { Helmet } from "../components/helmet";
import { PageHeading } from "../components/page-heading";
import { useLogin } from "../lib/backend";

const Login: NextPage = () => {
  const login = useLogin();

  return (
    <>
      <Helmet title="Log-In" />
      <PageHeading description="Please log in to your GoFundYourself Account.">
        Welcome back!
      </PageHeading>
      <CenterSection>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            login.mutate({
              email,
              password,
            });
          }}
        >
          <Input type="email" name="email" label="Email" />
          <Input type="password" name="password" label="Password" />
          <Button type="submit" look={3}>
            Log-In
          </Button>
        </form>
        <Link href="/register">No account yet? Register here.</Link>
      </CenterSection>
    </>
  );
};

export default Login;
