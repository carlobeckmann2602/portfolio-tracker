import type { NextPage } from "next";
import { CenterSection } from "../components/center-section";
import { PageHeading } from "../components/page-heading";
import Portfolio from "../components/portfolio";

const Home: NextPage = () => {
  return (
    <CenterSection>
      <PageHeading>My portfolio</PageHeading>
      <Portfolio />
    </CenterSection>
  );
};

export default Home;
