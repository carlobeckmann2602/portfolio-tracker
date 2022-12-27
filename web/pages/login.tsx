import type { NextPage } from "next";
import Link from "next/link";
import { Button } from "../components/button";
import { CenterSection } from "../components/center-section";
import { Input } from "../components/form/input";
import { Helmet } from "../components/helmet";
import { PageHeading } from "../components/page-heading";
import { useLogin } from "../lib/backend";
import { FiMail, FiLock } from "react-icons/fi";

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
          <div className="mt-[102px]">
            <Input type="email" name="email" placeholder="Email" icon={<FiMail />} />
            <Input type="password" name="password" placeholder="Password" icon={<FiLock />} />
          </div>
          <Button type="submit" look={3} className="mt-12">
            Log-In
          </Button>
        </form>
        <p className="text-lg font-light mt-5 text-center">Are you new here? <Link href="/register" className="text-lg text-highlight1 font-thin">Register</Link></p>
      </CenterSection>
    </>
  );
};

export default Login;
