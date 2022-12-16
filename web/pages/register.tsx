import type { NextPage } from "next";
import Link from "next/link";
import { Button } from "../components/button";
import { CenterSection } from "../components/center-section";
import { Checkbox } from "../components/form/checkbox";
import { Input } from "../components/form/input";
import { RadioSet } from "../components/form/radioset";
import { Select } from "../components/form/select";
import { TextArea } from "../components/form/textarea";
import { Helmet } from "../components/helmet";
import { PageHeading } from "../components/page-heading";
import { useRegistration } from "../lib/backend";

const Register: NextPage = () => {
  const registration = useRegistration();

  return (
    <>
      <Helmet title="Registration" />
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

            registration.mutate({
              email,
              password,
              password2,
            });
          }}
        >
          <Input type="email" name="email" placeholder="Email" />
          <Input type="password" name="password" placeholder="Password" />
          <Input
            type="password"
            name="password2"
            placeholder="Repeat Password"
          />
          <Button type="submit" look={3}>
            Register
          </Button>
          <Link href="/login">Already have an account? Log in</Link>
        </form>
      </CenterSection>
    </>
  );
};

export default Register;
