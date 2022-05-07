import { useMoralis } from "react-moralis";
import Layout from "../../../components/Layout";
import LensContext from "../../../components/LensContext";
import ProfileCard from "../../../components/ProfileCard";
import ConnectWalletMessage from "../../../components/ConnectWalletMessage";
import { useRouter } from "next/router";
import { useContext } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { SEARCH } from "../../../graphql/search";
import { useSendTransWithSig } from "../../../hooks/useSendTransWithSig";
import { shortenTx, shortenAddress } from "../../../lib/shortenAddress";
import { getExplorer } from "../../../lib/networks";
import { Formik, Form } from "formik";
import GridLoader from "react-spinners/GridLoader";

const FollowPage = ({ dev }) => {
  const FUNC = "createFollowTypedData";
  const CONTRACT_FUNC_NAME = "followWithSig";
  const { account, isAuthenticated, chainId } = useMoralis();
  const { isLensReady } = useContext(LensContext);
  const router = useRouter();
  const explorerURL = chainId && getExplorer(chainId);

  // user is being followed
  const user = router.query.user;
  const [handle, profileId] = user.split("#");

  // search profile based on pathname
  const {
    loading: searchProfileLoading,
    data: searchResult,
    error: searchProfileError,
  } = useQuery(SEARCH, {
    variables: { request: { query: handle, type: "PROFILE" } },
    pollInterval: 1000,
    skip: !handle,
  });
  searchProfileError && console.error("searchProfileError: ", searchProfileError);
  const profiletoFollow = searchResult?.search?.items?.[0];

  // Step 1. createFollowTypedData at LensAPI
  const [_follow, { data, error, loading }] = useMutation(CREATE_FOLLOW_TYPED_DATA);

  // txHash is used for querying Indexer
  const typedDataTxHash = data?.[FUNC]?.txHash;
  const typedData = data?.[FUNC]?.typedData;

  const {
    transaction,
    signTypedDataError,
    isIndexedLoading,
    isIndexedError,
    transactionReceipt,
    transError,
    isSendTransLoading,
    isSignTypedDataLoading,
  } = useSendTransWithSig({
    typedData,
    typedDataTxHash,
    contractFuncName: CONTRACT_FUNC_NAME,
    contractPayload: {
      follower: account,
      profileIds: typedData?.value?.profileIds,
      datas: typedData?.value?.datas,
    },
  });

  const follow = () => {
    try {
      _follow({ variables: { request: { follow: [{ profile: profileId }] } } });
    } catch (e) {
      console.error("unexpected error [follow]: ", e);
    }
  };

  // Apollo Error in Indexer
  signTypedDataError && console.error("signTypedDataError", signTypedDataError);
  transError && console.error("transError", transError);
  isIndexedError && console.error("isIndexedError", isIndexedError);

  // for debugging only
  data && console.log("Create TypedData: ", data);
  transaction && console.log("Submitted transaction: ", transaction);
  transactionReceipt && console.log("Transaction receipt: ", transactionReceipt);

  const nonce = data?.[FUNC]?.typedData?.value?.nonce;

  // Step 2. Wait TxHash, and send signed TypedData to LensHub
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
        <div className="MainCon2">
          {/* <div className="justify-center flex -mt-16 mb-16"> */}
          <div className="ProTitle">
            You ({shortenAddress(account)}) are about to follow {handle}#{profileId}
          </div>

          <Formik
            initialValues={{}}
            onSubmit={async ({}, { setSubmitting }) => {
              setSubmitting(true);
              follow();
              setSubmitting(false);
            }}
          >
            {({ errors, values, isSubmitting }) => (
              <Form>
                {" "}
                <button
                  disabled={
                    !profileId ||
                    isSubmitting ||
                    isIndexedLoading ||
                    loading ||
                    isSignTypedDataLoading ||
                    isSendTransLoading ||
                    !!transaction
                  }
                  className="ProButton"
                  type="submit"
                >
                  {!data && !loading && "Follow"}
                  {loading && "Preparing"}
                  {isSignTypedDataLoading && "Signing"}
                  {isSendTransLoading && "Submitting"}
                  {transaction && "Done"}
                </button>
                {/* PROGRESS */}
                <div className="text-center my-2">
                  {(loading ||
                    isIndexedLoading ||
                    isSignTypedDataLoading ||
                    isSendTransLoading) && (
                    <button className="" disabled={true}>
                      <GridLoader color="white" />
                    </button>
                  )}
                </div>
                {/* MESSAGE SECTION */}
                {/* Display Error */}
                {error && <div className="border-2">error: {error.message}</div>}
                {signTypedDataError && <div className="border-2">Oops!! signTypedDataError</div>}
                {transError && <div className="border-2">Oops!! transError</div>}
                {isIndexedError && <div className="border-2">Oops!! isIndexedError</div>}
                {/* Success */}
                {transaction && (
                  <div className="ProLabel text-center">
                    <p>🌿Lens Followed</p>
                    <div className="text-sm mt-5 mb-5">
                      <span>txHash: {shortenTx(transaction.hash)}</span>
                      <span>
                        <a
                          className="m-2 p-2 underline text-lg text-night-100 hover:text-solar-100"
                          target="_blank"
                          rel="noreferrer"
                          href={`${explorerURL}/tx/${transaction.hash}`}
                        >
                          View on Explorer
                        </a>
                      </span>
                    </div>
                  </div>
                )}
                {transactionReceipt && (
                  <div className="text-center text-solar-100">
                    Transaction status:{" "}
                    <p>
                      {transactionReceipt?.indexed ? (
                        "✅ Indexed"
                      ) : (
                        <div>
                          <GridLoader color="white" />
                        </div>
                      )}
                    </p>
                  </div>
                )}
                {/* Profile Section */}
                <div className="scale-50">
                  {profiletoFollow && (
                    <ProfileCard profile={profiletoFollow} isPublicProfile={true} />
                  )}
                </div>
                {/* when Dev-mode is ON */}
                {dev && data && (
                  <pre className="text-left w-64">{JSON.stringify(data, null, 2)}</pre>
                )}
                {dev && transaction && (
                  <>
                    <div>Submitted transaction</div>
                    <pre className="text-left w-64">{JSON.stringify(transaction, null, 2)}</pre>
                  </>
                )}
                {dev && transactionReceipt && (
                  <>
                    <div>Transaction receipt</div>
                    <pre className="text-left w-64">
                      {JSON.stringify(transactionReceipt, null, 2)}
                    </pre>
                  </>
                )}
                {/* END OF MESSAGE SECTION */}
              </Form>
            )}
          </Formik>
        </div>
      )}
    </Layout>
  );
};

export default FollowPage;

const CREATE_FOLLOW_TYPED_DATA = gql`
  mutation ($request: FollowRequest!) {
    createFollowTypedData(request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          FollowWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          profileIds
          datas
        }
      }
    }
  }
`;
