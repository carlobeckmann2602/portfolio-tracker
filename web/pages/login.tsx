import type { NextPage } from "next";
import { Helmet } from "../components/helmet";
import { CenterSection } from "../components/center-section";
import { PageHeading } from "../components/page-heading";
import { Input } from "../components/form/input";
import { Button } from "../components/button";

const Login: NextPage = () => {
  return (
    <>
      <Helmet title="Login" />
      <CenterSection>
        <PageHeading>Login</PageHeading>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            console.log("login form submitted");
          }}
        >
          <Input type="email" name="email" label="Email" />
          <Input type="password" name="password" label="Password" />
          <Button type="submit">Login</Button>
        </form>
      </CenterSection>
    </>
  );
};

export default Login;
