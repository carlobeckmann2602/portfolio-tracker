import type { NextPage } from "next";
import { Helmet } from "../components/helmet";
import { CenterSection } from "../components/center-section";
import { PageHeading } from "../components/page-heading";
import Portfolio from "../components/portfolio";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "../lib/backend";

const Home: NextPage = () => {
  const router = useRouter();
  const [userID] = useAuthContext();

  useEffect(() => {
    if (!localStorage.getItem("userID")) {
      router.push("/login");
    }
  });

  if (!userID) {
    return null;
  }

  return (
    <>
      <Helmet title="My portfolio" />
      <div className="mb-16">
        <CenterSection>
          <PageHeading>My portfolio</PageHeading>
          <div className="-mx-6">
            <Portfolio />
          </div>
        </CenterSection>
      </div>
    </>
  );
};

export default Home;
