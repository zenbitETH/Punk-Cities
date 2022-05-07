import { gql, useMutation, useQuery } from "@apollo/client";
import { Formik, Form } from "formik";
import { useMoralis } from "react-moralis";
import { useContext, useState } from "react";
import Layout from "../../../../components/Layout";
import LensContext from "../../../../components/LensContext";
import ConnectWalletMessage from "../../../../components/ConnectWalletMessage";
import { useSendTransWithSig } from "../../../../hooks/useSendTransWithSig";
import { useRouter } from "next/router";
import { SEARCH } from "../../../../graphql/search";
import Link from "next/link";
import NewPost from "../../../../components/NewPost";
import { FaExternalLinkAlt } from "react-icons/fa";
import { shortenTx } from "../../../../lib/shortenAddress";
import { getExplorer } from "../../../../lib/networks";
import GridLoader from "react-spinners/GridLoader";

const CreatePostPage = ({ dev }) => {
  const FUNC = "createPostTypedData";
  const CONTRACT_FUNC_NAME = "postWithSig";
  const { account, isAuthenticated, chainId } = useMoralis();
  const { isLensReady } = useContext(LensContext);
  const router = useRouter();
  const { handle } = router.query;
  const explorerURL = chainId && getExplorer(chainId);

  // for obtaining contentURL from child NewPage component
  const [contentUrl, setContentUrl] = useState();

  // Step 0. Search profile based on pathname
  const {
    loading: searchProfileLoading,
    data: searchResult,
    error: searchProfileError,
  } = useQuery(SEARCH, {
    variables: { request: { query: handle, type: "PROFILE" } },
    skip: !handle,
  });
  searchProfileError && console.error("searchProfileError: ", searchProfileError);
  const profileId = searchResult?.search?.items?.[0]?.profileId;

  // Step 1. createPostTypedData at LensAPI
  const [_create, { data, error, loading }] = useMutation(CREATE_POST_TYPED_DATA);

  // txHash is used for querying Indexer
  const typedDataTxHash = data?.[FUNC]?.txHash;
  const typedData = data?.[FUNC]?.typedData;

  // Step 2. Wait TxHash, and send signed TypedData to LensHub
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
      profileId: typedData?.value?.profileId,
      contentURI: typedData?.value?.contentURI,
      collectModule: typedData?.value?.collectModule,
      collectModuleData: typedData?.value?.collectModuleData,
      referenceModule: typedData?.value?.referenceModule,
      referenceModuleData: typedData?.value?.referenceModuleData,
    },
  });

  const create = async ({ contentURI, profileId }) => {
    const request = {
      profileId,
      contentURI,
      collectModule: {
        emptyCollectModule: true,
      },
      referenceModule: {
        followerOnlyReferenceModule: false,
      },
    };
    // when profileId is not found, may throw strange ApolloError.
    // This is strange, but ignore it first.
    try {
      _create({ variables: { request } });
    } catch (e) {
      console.error("unexpected error [creatPost]: ", e);
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

  contentUrl && console.log("contenturl: ", contentUrl);

  return (
    <Layout>
      <div className="MainCon -mt-16">
        {!(account && isAuthenticated) && <ConnectWalletMessage />}
        {!(account && isAuthenticated && isLensReady) && (
          <div className="LensCon">
            <div className="LensIcon">🌿</div>Lens is not active
          </div>
        )}
      </div>
      {account && isAuthenticated && isLensReady && (
        <div className="justify-center flex text-center">
          <div className="ProUpdate">
            <div className="ProReturn">
              <Link href={`/profiles/${handle}/publications`}>
                <button>
                  <a>
                    <FaExternalLinkAlt className="-rotate-90 mx-3 text-4xl" />
                  </a>
                </button>
              </Link>
            </div>

            <div>
              <div className="ProTitle my-10">💡 Create a proposal</div>
              <NewPost setParentContentURL={setContentUrl} />
            </div>
            <Formik
              initialValues={{}}
              onSubmit={async ({}, { setSubmitting }) => {
                setSubmitting(true);
                create({ profileId, contentURI: contentUrl });
                setSubmitting(false);
              }}
            >
              {({ errors, values, isSubmitting }) => (
                <Form className="mb-20">
                  {/* <div className="ProTitle">Create</div> */}
                  {contentUrl ? (
                    <div className="ProLabel text-sm text-center">{contentUrl}</div>
                  ) : (
                    <div></div>
                  )}
                  <div className={`text-center ${!contentUrl && "scale-75"}`}>
                    <button
                      disabled={
                        !contentUrl ||
                        !profileId ||
                        isSubmitting ||
                        isIndexedLoading ||
                        loading ||
                        isSignTypedDataLoading ||
                        isSendTransLoading ||
                        !!errors?.contentURI ||
                        !!transaction
                      }
                      className={`ProButton ${transaction && "scale-75"}`}
                      type="submit"
                    >
                      {!data && !loading && "Create"}
                      {loading && "Preparing"}
                      {isSignTypedDataLoading && "Signing"}
                      {isSendTransLoading && "Submitting"}
                      {transaction && "Done"}
                    </button>
                  </div>
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
                      <p>🌿Lens post created!</p>
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
        </div>
      )}
    </Layout>
  );
};

export default CreatePostPage;

const CREATE_POST_TYPED_DATA = gql`
  mutation ($request: CreatePublicPostRequest!) {
    createPostTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          contentURI
          collectModule
          collectModuleData
          referenceModule
          referenceModuleData
        }
      }
    }
  }
`;
