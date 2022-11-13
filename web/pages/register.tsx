import type { NextPage } from "next";

const Register: NextPage = () => {
  return (
    <>
      <h1>Register</h1>
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
    </>
  );
};

export default Register;
