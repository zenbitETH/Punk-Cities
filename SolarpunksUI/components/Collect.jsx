import { gql, useMutation } from "@apollo/client";
import { Formik, Form } from "formik";
import { useMoralis } from "react-moralis";
import { useContext } from "react";
import { useSendTransWithSig } from "../hooks/useSendTransWithSig";
import { shortenTx } from "../lib/shortenAddress";
import { getExplorer } from "../lib/networks";
import LensContext from "./LensContext";
import GridLoader from "react-spinners/GridLoader";

const Collect = ({ user, publicationid, dev }) => {
  const FUNC = "createCollectTypedData";
  const CONTRACT_FUNC_NAME = "collectWithSig";
  const { account, isAuthenticated, chainId } = useMoralis();
  const { isLensReady } = useContext(LensContext);
  const [handle, profileId] = user.split("#");
  const explorerURL = chainId && getExplorer(chainId);

  // Step 1. createCollectTypedData at LensAPI
  const [_collect, { data, error, loading }] = useMutation(CREATE_COLLECT_TYPED_DATA);

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
      collector: account,
      profileId: typedData?.value?.profileId,
      pubId: typedData?.value?.pubId,
      data: typedData?.value?.data,
    },
  });

  const collect = ({ publicationId }) => {
    const request = { publicationId };
    try {
      _collect({ variables: { request } });
    } catch (e) {
      console.error("unexpected error [collect]: ", e);
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

  return (
    <>
      {!(account && isAuthenticated && isLensReady) && <div>Lens is not active</div>}
      {account && isAuthenticated && isLensReady && (
        <Formik
          initialValues={{}}
          onSubmit={async ({}, { setSubmitting }) => {
            setSubmitting(true);
            collect({ publicationId: publicationid });
            setSubmitting(false);
          }}
        >
          {({ errors, values, isSubmitting }) => (
            <Form>
              <button
                disabled={
                  !profileId ||
                  isSubmitting ||
                  isIndexedLoading ||
                  loading ||
                  isSignTypedDataLoading ||
                  isSendTransLoading ||
                  !!errors?.contentURI ||
                  !!transaction
                }
                className="ProButton"
                type="submit"
              >
                {!data && !loading && "Collect"}
                {loading && "Preparing"}
                {isSignTypedDataLoading && "Signing"}
                {isSendTransLoading && "Submitting"}
                {transaction && "Done"}
              </button>
              {/* PROGRESS */}
              <div className="text-center my-2">
                {(loading || isIndexedLoading || isSignTypedDataLoading || isSendTransLoading) && (
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
                  <p>🌿Lens post collected!</p>
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
              {dev && data && <pre className="text-left w-64">{JSON.stringify(data, null, 2)}</pre>}
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
      )}
    </>
  );
};

export default Collect;

const CREATE_COLLECT_TYPED_DATA = gql`
  mutation ($request: CreateCollectRequest!) {
    createCollectTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CollectWithSig {
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
          pubId
          data
        }
      }
    }
  }
`;
