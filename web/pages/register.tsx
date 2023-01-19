import type { NextPage } from "next";
import Link from "next/link";
import { Button } from "../components/button";
import { CenterSection } from "../components/center-section";
import { Input } from "../components/form/input";
import { Helmet } from "../components/helmet";
import { PageHeading } from "../components/page-heading";
import { useRegistration } from "../lib/backend";
import { FiMail, FiLock } from "react-icons/fi";
import { LoggedInRedirection } from "../components/logged-in-redirection";

const Register: NextPage = () => {
  const { mutate: register, error } = useRegistration();

  return (
    <>
      <Helmet title="Registration" />
      <LoggedInRedirection />
      <PageHeading description="Please create an Account to join GoFundYourself.">
        Welcome!
      </PageHeading>
      <CenterSection>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            const password2 = formData.get("password2") as string;

            register({
              email,
              password,
              password2,
            });
          }}
        >
          <div className="flex flex-col gap-16">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              icon={<FiMail />}
            />
            <div className="relative">
              <div className="flex flex-col gap-5">
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  icon={<FiLock />}
                />
                <Input
                  type="password"
                  name="password2"
                  placeholder="Repeat Password"
                  icon={<FiLock />}
                />
              </div>
              {error && (
                <div className="absolute inset-x-0 text-red-500 text-center pt-5">
                  {error}
                </div>
              )}
            </div>
            <Button type="submit" look={3}>
              Register
            </Button>
          </div>
          <p className="text-lg font-light mt-5 text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-lg text-highlight1 font-light hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </CenterSection>
    </>
  );
};

export default Register;
