import Layout from "../../../components/Layout";
import ConnectWalletMessage from "../../../components/ConnectWalletMessage";
import LensContext from "../../../components/LensContext";
import { useMoralis } from "react-moralis";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Profile from "../../../components/Profile";
import includes from "lodash/includes";
import slice from "lodash/slice";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";

const PublicUserPage = () => {
  const { isLensReady, last5VisitProfiles, setLast5VisitProfiles, defaultHandle, defaultProfile } =
    useContext(LensContext);
  const { account, isAuthenticated } = useMoralis();
  const router = useRouter();

  // user in pathname may be incorrectly typed
  const { user } = router.query;
  const [handle, profileId] = user.split("#");
  const isValidUser = !!handle && !!profileId;

  // guest is a valdiated user name
  const guest = isValidUser ? user : null;

  // when guest is not in last5VisitProfiles
  useEffect(() => {
    if (guest && !includes(last5VisitProfiles, guest)) {
      if (last5VisitProfiles.length >= 5) {
        setLast5VisitProfiles([guest, ...slice(last5VisitProfiles, 0, 4)]);
      } else {
        setLast5VisitProfiles([guest, ...last5VisitProfiles]);
      }
    }
  }, [setLast5VisitProfiles, last5VisitProfiles, guest]);

  // Check if I am a follower of this profileId
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

  // not following yourself
  const youAreVisitingYourself = user === `${defaultHandle}#${defaultProfile}`;

  return (
    <Layout>
      <div>
        {!(account && isAuthenticated) && <ConnectWalletMessage />}
        {!(account && isAuthenticated && isLensReady) && (
          <div className="LensCon">
            <div className="LensIcon">🌿</div>Lens is not active
          </div>
        )}
      </div>
      {account && isAuthenticated && isLensReady && (
        <div className="MainCon2">
          {!isValidUser ? (
            <div>Malformed username; (e.g. john#0x01)</div>
          ) : (
            <div>
              <Profile
                handle={handle}
                isPublicProfile={true}
                canFollow={!doesFollowResult && !youAreVisitingYourself}
              />
              {doesFollowResult && <div className="font-bold m-5">You Followed</div>}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default PublicUserPage;

const DOES_FOLLOW = gql`
  query ($request: DoesFollowRequest!) {
    doesFollow(request: $request) {
      followerAddress
      profileId
      follows
    }
  }
`;
