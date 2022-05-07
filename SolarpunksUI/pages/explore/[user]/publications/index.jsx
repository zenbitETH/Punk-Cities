import { useMoralis } from "react-moralis";
import Layout from "../../../../components/Layout";
import LensContext from "../../../../components/LensContext";
import Publications from "../../../../components/Publications";
import ConnectWalletMessage from "../../../../components/ConnectWalletMessage";
import { useRouter } from "next/router";
import { useContext } from "react";

const PublicPublicationsPage = () => {
  const { account, isAuthenticated } = useMoralis();
  const router = useRouter();
  const { user } = router.query;
  const { isLensReady } = useContext(LensContext);
  const [handle, profileId] = user.split("#");
  const isValidUser = !!handle && !!profileId;

  return (
    <Layout>
      <div className="MainCon">
        {!(account && isAuthenticated) && <ConnectWalletMessage />}
        {!(account && isAuthenticated && isLensReady) && (
          <div className="LensCon">
            <div className="LensIcon">🌿</div>Lens is not active
          </div>
        )}
      </div>
      {account && isAuthenticated && isLensReady && (
        <>
          {!isValidUser ? (
            <div>Malformed username; (e.g. john#0x01)</div>
          ) : (
            <>
              <Publications
                profileId={profileId}
                handle={handle}
                publicationTypes={["POST"]}
                isPublicPublications={true}
              />
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default PublicPublicationsPage;
