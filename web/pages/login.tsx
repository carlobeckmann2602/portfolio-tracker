import type { NextPage } from "next";
import { CenterSection } from "../components/center-section";
import { PageHeading } from "../components/page-heading";

const Login: NextPage = () => {
  return (
    <CenterSection>
      <PageHeading>Login</PageHeading>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          console.log("login form submitted");
        }}
      >
        <label htmlFor="email">Email</label>
        <input type="email" id="email" />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" />
        <button type="submit">Login</button>
      </form>
    </CenterSection>
  );
};

export default Login;
