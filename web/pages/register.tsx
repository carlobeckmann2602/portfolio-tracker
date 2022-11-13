import type { NextPage } from "next";
import { CenterSection } from "../components/center-section";
import { PageHeading } from "../components/page-heading";

const Register: NextPage = () => {
  return (
    <CenterSection>
      <PageHeading>Register</PageHeading>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          console.log("login form submitted");
        }}
      >
        <label htmlFor="email">
          Email
          <input type="email" id="email" />
        </label>
        <label htmlFor="password">
          Password
          <input type="password" id="password" />
        </label>
        <button type="submit">Register</button>
      </form>
    </CenterSection>
  );
};

export default Register;
