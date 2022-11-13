import type { NextPage } from "next";
import { CenterSection } from "../components/center-section";
import { PageHeading } from "../components/page-heading";
import Portfolio from "../components/portfolio";
import Search from "../components/search";

const Home: NextPage = () => {
  return (
    <CenterSection>
      <PageHeading>My portfolio</PageHeading>
      <Portfolio />
      <Search />
    </CenterSection>
  );
};

export default Home;
