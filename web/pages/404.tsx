import type { NextPage } from "next";
import { Helmet } from "../components/helmet";
import { CenterSection } from "../components/center-section";
import { PageHeading } from "../components/page-heading";
import { Button } from "../components/button";

const Page: NextPage = () => (
  <>
    <Helmet title="404" />
    <PageHeading description="The requested page could not be found.">
      404
    </PageHeading>
    <div className="relative mb-8">
      <CenterSection>
        <Button href="/">Back home</Button>
      </CenterSection>
    </div>
  </>
);

export default Page;
