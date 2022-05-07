import { useMoralis } from "react-moralis";
import { gql, useQuery, useMutation } from "@apollo/client";
import { signText } from "../../lensApi/ethers.service";
import { setAuthenticationToken } from "../../lensApi/state";
import { useEffect, useContext } from "react";
import LensContext from "../LensContext";
import Link from "next/link";

const GET_CHALLENGE = gql`
  query ($request: ChallengeRequest!) {
    challenge(request: $request) {
      text
    }
  }
`;

const AUTHENTICATION = gql`
  mutation ($request: SignedAuthChallenge!) {
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
  }
`;

const Auth = () => {
  const { account, isAuthenticated } = useMoralis();
  const { isLensReady, setIsLensReady, defaultHandle, defaultProfile } = useContext(LensContext);
  const user = defaultHandle && defaultProfile && `${defaultHandle}#${defaultProfile}`;
  const {
    loading: challengeLoading,
    error: challengeError,
    data: challengeResponse,
  } = useQuery(GET_CHALLENGE, {
    variables: { request: { address: account } },
  });

  const [_auth, { data: authResult, loading: authLoading, error: authError }] =
    useMutation(AUTHENTICATION);

  const authenticate = async () => {
    const signature = await signText(challengeResponse.challenge?.text);
    _auth({
      variables: { request: { address: account, signature } },
    });
  };

  // this avoids Authenticate and parent component render at the same time
  useEffect(() => {
    if (authResult) {
      setAuthenticationToken(authResult.authenticate.accessToken);
      setIsLensReady(true);
    }
  }, [authResult]);

  challengeError && console.error("challengeError", challengeError);
  authError && console.error(authError);

  return (
    <span className="">
      {account && isAuthenticated ? (
        <>
          {isLensReady ? (
            <button
              disabled={authLoading || isLensReady}
              className="lenscon"
            >
              <Link href={`/profiles/${user.split("#")[0]}`}>
                <a>🌿 {user || "Lens Ready"}</a>
              </Link>
            </button>
          ) : (
            <button
              disabled={authLoading || isLensReady}
              className="bg-glass-100 animate-pulse py-1 w-full h-full rounded-br-lg hover:bg-cyber-100 hover:animate-none"
              onClick={async () => authenticate()}
            >
              🌿 Connect to Lens
            </button>
          )}
        </>
      ) : (
        <div>2. Connect to Lens</div>
      )}
      {challengeError && <p>Oops! Fail to obtain challenge</p>}
      {authError && <p>Oops! Fail to authenicate LensAPI</p>}
    </span>
  );
};

export default Auth;
