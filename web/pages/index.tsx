import type { NextPage } from "next";
import { Helmet } from "../components/helmet";
import { CenterSection } from "../components/center-section";
import Portfolio from "../components/portfolio";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "../lib/backend";

const Home: NextPage = () => {
  const router = useRouter();
  const [authToken] = useAuthContext();

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      router.push("/login");
    }
  });

  if (!authToken) {
    return null;
  }

  return (
    <>
      <Helmet title="My portfolio" />
      <div className="mt-16">
        <CenterSection>
          <Portfolio />
        </CenterSection>
      </div>
    </>
  );
};

export default Home;
