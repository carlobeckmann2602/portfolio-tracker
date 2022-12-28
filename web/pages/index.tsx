import type { NextPage } from "next";
import { Helmet } from "../components/helmet";
import { CenterSection } from "../components/center-section";
import Portfolio from "../components/portfolio";

const Home: NextPage = () => (
  <>
    <Helmet title="My portfolio" />
    <div className="mt-16">
      <CenterSection>
        <Portfolio />
      </CenterSection>
    </div>
  </>
);

export default Home;
