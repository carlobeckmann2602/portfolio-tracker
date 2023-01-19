import type { NextPage } from "next";
import { Helmet } from "../components/helmet";
import { CenterSection } from "../components/center-section";
import Portfolio from "../components/portfolio";
import { usePortfolioData } from "../lib/backend";
import BounceLoader from "react-spinners/BounceLoader";

const LoadingScreen = () => (
  <div className="flex justify-center items-center fixed inset-0 bg-back z-20">
    <div className="flex flex-col gap-8">
      <div className="flex justify-center opacity-25">
        <BounceLoader color="white" size="5rem" />
      </div>
      <p className="text-center text-2xl font-light">Loading...</p>
    </div>
  </div>
);

const Home: NextPage = () => {
  const { isLoading } = usePortfolioData();

  return (
    <>
      <Helmet title="My portfolio" />
      {isLoading && <LoadingScreen />}
      <CenterSection>
        <Portfolio />
      </CenterSection>
    </>
  );
};

export default Home;
