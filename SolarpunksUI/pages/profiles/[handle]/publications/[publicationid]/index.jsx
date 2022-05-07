import { useRouter } from "next/router";
import Layout from "../../../../../components/Layout";
import Publication from "../../../../../components/Publication";
import ConnectWalletMessage from "../../../../../components/ConnectWalletMessage";
import LensContext from "../../../../../components/LensContext";
import { useMoralis } from "react-moralis";
import { useContext } from "react";

const PublicationPage = () => {
  const { account, isAuthenticated } = useMoralis();
  const router = useRouter();
  const { handle, publicationid } = router.query;
  const { isLensReady } = useContext(LensContext);
  const isValidUser = !!handle && !!publicationid;

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
              <Publication handle={handle} publicationId={publicationid} />
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default PublicationPage;
