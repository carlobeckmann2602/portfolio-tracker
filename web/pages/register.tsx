import type { NextPage } from "next";
import { Helmet } from "../components/helmet";
import { CenterSection } from "../components/center-section";
import { PageHeading } from "../components/page-heading";
import { Input } from "../components/form/input";
import { TextArea } from "../components/form/textarea";
import { Select } from "../components/form/select";
import { RadioSet } from "../components/form/radioset";
import { Checkbox } from "../components/form/checkbox";
import { Button } from "../components/button";

const Register: NextPage = () => {
  return (
    <>
      <Helmet title="User registration" />
      <CenterSection>
        <PageHeading>Register</PageHeading>
        <form
          onSubmit={(event) => {
            event.preventDefault();
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
          <Input type="email" name="email" label="Email" />
          <Input type="password" name="password" label="Password" />
          <TextArea name="description" label="Description" />
          <Checkbox name="agb" label="AGB" text="AGBs akzeptieren."></Checkbox>
          <Button type="submit">Register</Button>
        </form>
      </CenterSection>
    </>
  );
};

export default Register;
