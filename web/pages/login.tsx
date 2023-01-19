import type { NextPage } from "next";
import Link from "next/link";
import { Button } from "../components/button";
import { CenterSection } from "../components/center-section";
import { Input } from "../components/form/input";
import { Helmet } from "../components/helmet";
import { PageHeading } from "../components/page-heading";
import { useLogin } from "../lib/backend";
import { FiMail, FiLock } from "react-icons/fi";
import { LoggedInRedirection } from "../components/logged-in-redirection";

const Login: NextPage = () => {
  const { mutate: login, error } = useLogin();

  return (
    <>
      <Helmet title="Log-In" />
      <LoggedInRedirection />
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

            login({
              email,
              password,
            });
          }}
        >
          <div className="relative mt-20 mb-16">
            <div className="flex flex-col gap-5">
              <Input
                type="email"
                name="email"
                placeholder="Email"
                icon={<FiMail />}
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                icon={<FiLock />}
              />
            </div>
            {error && (
              <div className="text-red-500 text-center absolute inset-x-0 mt-5">
                {error}
              </div>
            )}
          </div>
          <Button type="submit" look={3}>
            Log-In
          </Button>
        </form>
        <p className="text-lg font-light mt-5 text-center">
          Are you new here?{" "}
          <Link
            href="/register"
            className="text-lg text-highlight1 font-thin hover:underline"
          >
            Register
          </Link>
        </p>
      </CenterSection>
    </>
  );
};

export default Login;
