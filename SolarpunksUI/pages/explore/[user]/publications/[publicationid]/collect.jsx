import { gql, useQuery } from "@apollo/client";
import { useMoralis } from "react-moralis";
import { useContext } from "react";
import { useRouter } from "next/router";
import ConnectWalletMessage from "../../../../../components/ConnectWalletMessage";
import Layout from "../../../../../components/Layout";
import LensContext from "../../../../../components/LensContext";
import Collect from "../../../../../components/Collect";
import Link from "next/link";

const CollectPage = () => {
  const { account, isAuthenticated } = useMoralis();
  const { isLensReady } = useContext(LensContext);
  const router = useRouter();
  const { user, publicationid } = router.query;
  const [handle, profileId] = user.split("#");

  // Step 1: Check if I am a follower of this profileId
  // It must be a follower, before you can collect
  const {
    data: doesFollowData,
    loading: doesFollowLoading,
    error: doesFollowError,
  } = useQuery(DOES_FOLLOW, {
    variables: {
      request: { followInfos: [{ followerAddress: account, profileId }] },
    },
    skip: !account || !profileId,
    pollInterval: 1000,
  });

  doesFollowError && console.error("fail to query doesFollowData: ", doesFollowError);

  // process doesFollow result
  const doesFollowResult = doesFollowData?.doesFollow?.[0]?.follows;
  const doesFollowResultProfileId = doesFollowData?.doesFollow?.[0]?.profileId;
  const doesFollowResultAddress = doesFollowData?.doesFollow?.[0]?.followerAddress;

  // below code should be unnecessary, to verify the returning info is correct. Can remove later.
  doesFollowResult &&
    doesFollowResultProfileId !== profileId &&
    console.error("unknown error, profileId should be the same");

  // End of Step 1

  // Step 2: Check if this is already collected
  const {
    data: hasCollectedData,
    loading: hasCollectedLoading,
    error: hasCollectedError,
  } = useQuery(HAS_COLLECTED, {
    variables: {
      request: { collectRequests: { walletAddress: account, publicationIds: [publicationid] } },
    },
    skip: !account,
    pollInterval: 1000,
  });
  // process hasCollect result
  const hasCollectedResult = hasCollectedData?.hasCollected?.[0].results?.[0];
  const walletAddress = hasCollectedData?.hasCollected?.[0].walletAddress;
  const collected = hasCollectedResult?.collected;
  const collectedTimes = hasCollectedResult?.collectedTimes;

  hasCollectedError && console.error("fail to query HasCollected: ", hasCollectedError);
  // End of Step 2

  const isLoading = doesFollowLoading || hasCollectedLoading;
  const canCollect =
    publicationid === hasCollectedResult?.publicationId &&
    !collected &&
    collectedTimes === 0 &&
    doesFollowResult;

  return (
    <Layout>
      {account && isAuthenticated ? (
        <>
          {isLensReady && (
            <div className="MainCon2">
              {isLoading && <div>...loading</div>}
              {/* <div>
                <Link href={`/explore/${handle}%23${profileId}/timeline`}>
                  <button className="border-2 p-2 bg-blue-300">
                    <a>Back to timeline</a>
                  </button>
                </Link>
              </div> */}
              <div className="text-left my-10">
                <Link href={`/explore/${handle}%23${profileId}/publications/${publicationid}`}>
                  <button className="ProButton">
                    <a>Back</a>
                  </button>
                </Link>
              </div>
              {hasCollectedResult && (
                <div className="ProTitle mb-10">
                  {collected
                    ? `You have collected it for ${collectedTimes} times `
                    : `You have not collected this post ${publicationid}`}
                </div>
              )}
              {!doesFollowResult && (
                <>
                  <div className="ProTitle mb-10">
                    You are not follower. Cannot Collect. Please follow below publication owner.
                  </div>
                  <div>
                    <Link href={`/explore/${handle}%23${profileId}`}>
                      <button className="ProButton">
                        <a>Follow</a>
                      </button>
                    </Link>
                  </div>
                </>
              )}
              {canCollect && <Collect user={user} publicationid={publicationid} />}
            </div>
          )}
        </>
      ) : (
        <ConnectWalletMessage />
      )}
    </Layout>
  );
};

export default CollectPage;

const HAS_COLLECTED = gql`
  query ($request: HasCollectedRequest!) {
    hasCollected(request: $request) {
      walletAddress
      results {
        collected
        publicationId
        collectedTimes
      }
    }
  }
`;

const DOES_FOLLOW = gql`
  query ($request: DoesFollowRequest!) {
    doesFollow(request: $request) {
      followerAddress
      profileId
      follows
    }
  }
`;
