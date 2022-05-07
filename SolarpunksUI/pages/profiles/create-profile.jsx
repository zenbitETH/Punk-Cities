import { gql, useMutation } from "@apollo/client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useQueryTxIndexed } from "../../hooks/useQueryTxIndexed";
import { useMoralis } from "react-moralis";
import { useContext, useState, useEffect } from "react";
import LensContext from "../../components/LensContext";
import ConnectWalletMessage from "../../components/ConnectWalletMessage";
import Layout from "../../components/Layout";
import RingLoader from "react-spinners/RingLoader";
import GridLoader from "react-spinners/GridLoader";
import NewProfilePic from "../../components/NewProfilePic";
import { getExplorer } from "../../lib/networks";
import fetch from "cross-fetch";
import { shortenTx } from "../../lib/shortenAddress";

const CreateProfilePage = ({ dev }) => {
  const FUNC = "createProfile";
  const { account, isAuthenticated, chainId } = useMoralis();
  const { isLensReady } = useContext(LensContext);
  const explorerURL = chainId && getExplorer(chainId);

  // Part 1: for obtaining contentURL from child NewPage component
  const [contentUrl, setContentUrl] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [isIpfsLoading, setIpfsLoading] = useState(false);
  const [isIpfsError, setIpfsError] = useState();

  // Part 2: Obtain imageUrl
  useEffect(() => {
    if (contentUrl) {
      setIpfsLoading(true);
      fetch(contentUrl)
        .then(response => response.text())
        .then(metadata => {
          try {
            const json = JSON.parse(metadata);
            if (json?.image) {
              setImageUrl(json.image.replace("ipfs://", "https://ipfs.io/ipfs/"));
            } else setIpfsError(new Error("unknown ipfs errro"));
          } catch {
            setIpfsError(new Error("fail to parse contentUrl"));
          }
          setIpfsLoading(false);
        })
        .catch(error => {
          setIpfsError(error);
          console.error("fail to fetch contentUrl", error);
          setIpfsLoading(false);
        });
    }
  }, [contentUrl]);
  isIpfsError && console.error("isIpfsError: ", isIpfsError);
  // Part 3: create profile
  const [create, { data, loading, error }] = useMutation(CREATE_PROFILE);

  const txHash = data?.[FUNC]?.txHash;
  const reason = data?.[FUNC]?.reason;

  // LensAPI Error
  reason && console.error(`fail to send tx: ${reason}`);

  // Apollo Error
  error && console.error(`fail to send tx: ${error}`);

  // polling Indexing status
  const { isIndexedError, transactionReceipt } = useQueryTxIndexed(data, txHash);
  isIndexedError && console.error("isIndexedError: ", isIndexedError);

  return (
    <Layout>
      <div className="MainCon">
        {!(account && isAuthenticated) && <ConnectWalletMessage className="bg-white" />}
        {!(account && isAuthenticated && isLensReady) && (
          <div className="LensCon">
            <div className="LensIcon">🌿</div>Lens is not active
          </div>
        )}
      </div>

      {account && isAuthenticated && isLensReady && (
        <div className="text-center">
          <div className="bg-glass-100 inline-block px-20 py-6 rounded-lg font-exo text-lg text-white text-center">
            {loading && (
              <div className="text-center">
                <div className="inline-block pb-16 pr-10">
                  <RingLoader color="white" />
                </div>
                <div className="text-center">...Creating profile</div>
              </div>
            )}
            <div className="text-right m-10">
              <h1 className="text-5xl text-center pb-14">New 🌿Lens Profile</h1>
            </div>
            {/* Part 1: Upload Photo to ipfs */}
            <div>
              <div> Upload Your Favorite Image to IPFS</div>
              <NewProfilePic setParentContentURL={setContentUrl} />
            </div>
            {/* End of Part 1 */}
            <Formik
              initialValues={{ handle: "", profilePictureUri: "", followNFTURI: "" }}
              validationSchema={Yup.object().shape({
                handle: Yup.string()
                  .min(3, "Too Short! Min 3 chars")
                  .max(8, "Too Long! Max 8 chars")
                  .lowercase("lower-case required")
                  .strict()
                  .required("Required"),
                // profilePictureUri: Yup.string().url(),
                // followNFTURI: Yup.string().url(),
              })}
              onSubmit={async ({ handle }, { setSubmitting }) => {
                setSubmitting(true);
                const request = {
                  handle,
                  followModule: { emptyFollowModule: true },
                  profilePictureUri: imageUrl,
                  followNFTURI: contentUrl,
                };
                console.log(request);
                create({ variables: { request } });
                setSubmitting(false);
              }}
            >
              {({ values, errors, isSubmitting }) => (
                <Form>
                  {/* Part 2: Create Profile */}
                  {/* Field1: Handle */}
                  <div className="text-right mt-10 mb-2">
                    {/* <h1 className="text-5xl text-center pb-14">New 🌿Lens Profile</h1> */}
                    <span className="p-2 m-2">
                      <label className="text-2xl" htmlFor="handle">
                        *Choose your 🌿 Lens' handle:
                      </label>
                    </span>
                    <span className="p-2 m-2">
                      <Field
                        className="rounded p-2 text-night-100 w-96"
                        id="handle"
                        name="handle"
                        disabled={isSubmitting || !imageUrl}
                        placeholder="Your (max 8-chars / lowercase) name"
                      />
                      {/* Input Error */}
                      {errors?.handle && (
                        <div className="pl-5 text-solar-100">
                          <ErrorMessage name="handle" />
                        </div>
                      )}
                    </span>
                  </div>
                  {/* Field2: profilePictureUri */}
                  {/* <div className="text-right m-10">
                  <span className="p-2 m-2">
                    <label className="text-2xl" htmlFor="profilePictureUri">
                      Paste your 🖼️ pic URL:
                    </label>
                  </span>
                  <span className="p-2 m-2">
                    <Field
                      className="rounded p-2 text-night-100 w-88"
                      id="handle"
                      name="profilePictureUri"
                      placeholder="🖼️profilePictureUri"
                    />
                  </span>
                  {errors?.profilePictureUri && (
                    <div>
                      <ErrorMessage name="profilePictureUri" />
                    </div>
                  )}
                </div> */}
                  {/* Field3: followNFTURI 
              <div className="text left m-10">
                <label className=" text-2xl text-solar-500" htmlFor="followNFTURI">
                  Paste your 🖼️ followNFTURI:
                </label>
                <span className="p-2 m-2">
                  <Field
                    className="rounded p-2 text-night-100"
                    id="followNFTURI"
                    name="followNFTURI"
                    placeholder="followNFTURI"
                  />
                </span>
                */}
                  <button
                    disabled={
                      isSubmitting ||
                      loading ||
                      !!txHash ||
                      !values?.handle ||
                      !!errors?.handle ||
                      !imageUrl
                    }
                    className="ProButton"
                    type="submit"
                  >
                    {txHash ? "OK" : "Create 🌿 Lens Profile"}
                  </button>
                  {/* Successful call */}
                  {txHash && (
                    <div className="mt-2 text-xl">
                      <p>🌿Lens profile created!</p>{" "}
                      <div className="mt-2 mb-5">
                        <span>txHash: {shortenTx(txHash)}</span>
                        <span>
                          {explorerURL && (
                            <a
                              className="m-2 p-2 underline text-lg text-night-100 hover:text-solar-100"
                              target="_blank"
                              rel="noreferrer"
                              href={`${explorerURL}/tx/${txHash}`}
                            >
                              View on Explorer
                            </a>
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                  {/* error like HANDLE_TAKEN */}
                  {reason && <pre className="">error: {reason}</pre>}
                  {/* Apollo Error  */}
                  {error && !loading && (
                    <>
                      <Error error={error} />
                      {dev && (
                        <>
                          <div>Dev Mode</div>
                          <JSONTree data={error} />
                        </>
                      )}
                    </>
                  )}
                  {/* after receiving transactionReceipt */}
                  {transactionReceipt && (
                    <div className="text-solar-100">
                      Profile status:
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
                  {dev && transactionReceipt && (
                    <>
                      <div>Dev Mode</div>
                      <JSONTree data={transactionReceipt} />
                    </>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CreateProfilePage;

const CREATE_PROFILE = gql`
  mutation ($request: CreateProfileRequest!) {
    createProfile(request: $request) {
      ... on RelayerResult {
        txHash
      }
      ... on RelayError {
        reason
      }
      __typename
    }
  }
`;
