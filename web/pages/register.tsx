import type { NextPage } from "next";
import { useRouter } from "next/router";
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
  const registration = useRegistration()
  const router = useRouter()

  return (
    <>
      <Helmet title="User registration" />
      <CenterSection>
        <PageHeading>Register</PageHeading>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            const firstName = formData.get("firstname") as string;
            const lastName = formData.get("lastname") as string;

            registration.mutate({
              email,
              password,
              firstName,
              lastName,
            }, {
              onSuccess: (data) => {
                if (data.ok) {
                  router.push("/login")
                }
              }
            })
          }}
        >
          <RadioSet
            name="salutation"
            label="Salutation"
            options={["Mrs.", "Mr."]}
          />
          <Select
            name="title"
            label="Title"
            options={["Prof.", "Dr."]}
            nullable
          />
          <Input type="email" name="email" label="Email" placeholder="Email" />
          <Input type="password" name="password" label="Password" placeholder="Password" />
          <Input type="text" name="firstname" label="Firstname" placeholder="Firstname" />
          <Input type="text" name="lastname" label="Lastname" placeholder="Lastname"/>
          <TextArea name="description" label="Description" placeholder="Description" />
          <Checkbox name="agb" label="AGB" text="AGBs akzeptieren."></Checkbox>
          <Button type="submit">Register</Button>
        </form>
      </CenterSection>
    </>
  );
};

export default Register;
