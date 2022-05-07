import { useMoralis } from "react-moralis";
import Layout from "../../../../components/Layout";
import Error from "../../../../components/Error";
import LensContext from "../../../../components/LensContext";
import Publications from "../../../../components/Publications";
import ConnectWalletMessage from "../../../../components/ConnectWalletMessage";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { SEARCH } from "../../../../graphql/search";
import { useContext } from "react";

const PublicationsPage = () => {
  const FUNC = "search";
  const { account, isAuthenticated } = useMoralis();
  const router = useRouter();
  const { handle } = router.query;
  const { isLensReady } = useContext(LensContext);

  const { data, error, loading } = useQuery(SEARCH, {
    variables: { request: { limit: 1, query: handle, type: "PROFILE" } },
    skip: !handle || !isLensReady,
  });
  const result = data?.[FUNC]?.items?.[0];

  error && console.error("Error in fetching profile", error);

  return (
    <Layout>
      {account && isAuthenticated && error && <Error error={error} />}
      {account && isAuthenticated && loading && <>...loading</>}
      {account && isAuthenticated && result ? (
        <Publications
          profileId={result.profileId}
          handle={result.handle}
          publicationTypes={["POST"]}
        />
      ) : (
        <ConnectWalletMessage />
      )}
    </Layout>
  );
};

export default PublicationsPage;
