import ConnectWalletMessage from "../../../components/ConnectWalletMessage";
import Layout from "../../../components/Layout";
import LensContext from "../../../components/LensContext";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
import { useContext } from "react";
import { SEARCH } from "../../../graphql/search";
import Timeline from "../../../components/Timeline";
import NoRecord from "../../../components/NoRecord";
import Link from "next/link";

const TimelinePage = () => {
  const { account, isAuthenticated } = useMoralis();
  const { isLensReady } = useContext(LensContext);
  const router = useRouter();
  const user = router.query.user;
  const [handle, profileId] = user.split("#");

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
          {/* Below is reason link, but ugly, not time to fix */}
          {/* <div>
            <Link href={`/explore/${handle}%23${profileId}`}>
              <a>
                <button className="bg-blue-300">Back to My Public Profile Page</button>
              </a>
            </Link>
          </div> */}
          {profileId ? (
            <>
              <Timeline
                handle={handle}
                profileId={profileId}
                showComment={true}
                canComment={true}
                canCollect={true}
              />
            </>
          ) : (
            <NoRecord />
          )}
        </>
      )}
    </Layout>
  );
};

export default TimelinePage;
