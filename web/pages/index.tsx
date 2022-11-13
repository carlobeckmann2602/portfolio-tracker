import type { NextPage } from "next";
import Portfolio from "../components/portfolio";
import Search from "../components/search";

const Home: NextPage = () => {
  return (
    <>
      <Portfolio />
      <Search />
    </>
  );
};

export default Home;
