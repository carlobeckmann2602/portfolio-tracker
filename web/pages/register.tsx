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
import { FiMail, FiLock } from "react-icons/fi";

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
          <div className="mb-12">
            <Input type="email" name="email" placeholder="Email" icon={<FiMail />} />
          </div>
          <Input type="password" name="password" placeholder="Password" icon={<FiLock />} />
          <Input
            type="password"
            name="password2"
            placeholder="Repeat Password"
            icon={<FiLock />}
          />
          <Button type="submit" look={3} className="mt-12">
            Register
          </Button>
          <p className="text-lg font-light mt-5 text-center">Already have an account? <Link href="/login" className="text-lg text-highlight1 font-light">Login</Link></p>
        </form>
      </CenterSection>
    </>
  );
};

export default Register;
