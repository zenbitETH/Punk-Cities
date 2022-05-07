import { gql, useMutation, useQuery } from "@apollo/client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import ConnectWalletMessage from "../../../components/ConnectWalletMessage";
import LensContext from "../../../components/LensContext";
import Layout from "../../../components/Layout";
import { useMoralis } from "react-moralis";
import { useContext } from "react";
import { SEARCH } from "../../../graphql/search";
import Link from "next/link";
import {
  FaTwitterSquare,
  FaGlobe,
  FaGlobeAmericas,
  FaRegUserCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";

/**
 *
 * Important Note:
 * 1. There is no transaction hash, after update
 * 2. twitterUrl, website, and coverPicture MUST BE in url format
 * 3. DON'T use Apollo Playground to update URL type field, with blank "". That will break the record, and Apollo will refuse to serve you.
 * 4. ALL UI input of URL field MUST be VALIDATED
 */
const UpdateProfilePage = ({ dev }) => {
  const FUNC = "updateProfile";
  const { account, isAuthenticated } = useMoralis();
  const { isLensReady } = useContext(LensContext);
  const router = useRouter();
  const handle = router.query.handle;
  const [updateProfile, { data, error, loading }] = useMutation(UPDATE_PROFILE);

  // search profile based on pathname
  const {
    loading: searchProfileLoading,
    data: searchResult,
    error: searchProfileError,
  } = useQuery(SEARCH, {
    variables: { request: { query: handle, type: "PROFILE" } },
    skip: !handle,
  });
  searchProfileError && console.error("searchProfileError: ", searchProfileError);
  const profileToUpdate = searchResult?.search?.items?.[0];
  const isValidProfile = profileToUpdate?.profileId && profileToUpdate?.handle === handle;

  // I guess handle : profile is 1:1 mapping, not quite sure!! Below code alerts me, when it it not
  searchResult?.search &&
    searchResult?.search?.pageInfo?.totalCount !== 1 &&
    console.error("searchResult abnormal: ", searchResult);

  const result = data?.[FUNC];

  // Apollo Error for mutation
  error && console.error(`fail to send tx: ${error}`);

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
      {account && isAuthenticated && isLensReady && searchResult && (
        <Formik
          initialValues={{
            name: profileToUpdate?.name || "",
            bio: profileToUpdate?.bio || "",
            location: profileToUpdate?.location || "",
            website: profileToUpdate?.website || "",
            twitterUrl: profileToUpdate?.twitterUrl || "",
            coverPicture: profileToUpdate?.coverPicture?.original?.url || "",
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("Required"),
            bio: Yup.string(),
            location: Yup.string().max(50, "Too Long!"),
            website: Yup.string().url("url format required"),
            twitterUrl: Yup.string().url("url format required"),
            coverPicture: Yup.string().url("url format required"),
          })}
          onSubmit={async (
            { name, bio, location, website, twitterUrl, coverPicture },
            { setSubmitting },
          ) => {
            setSubmitting(true);
            const request = {
              profileId: profileToUpdate?.profileId,
              name,
              bio,
              location,
              website,
              twitterUrl,
              coverPicture,
            };
            website === "" && delete request["website"];
            twitterUrl === "" && delete request["twitterUrl"];
            coverPicture === "" && delete request["coverPicture"];

            updateProfile({ variables: { request } });
            setSubmitting(false);
          }}
        >
          {({ values, errors, touched, isSubmitting }) => (
            <div className="justify-center flex">
              <Form className="ProUpdate">
                <div className="ProReturn">
                  <Link href={`/profiles/${handle}`}>
                    <a >
                      <FaExternalLinkAlt className="-rotate-90 mx-3 text-md" />
                    </a>
                  </Link>
                </div>
                {loading && <div>...loading</div>}
                {!searchResult && !loading && <div>No search result error</div>}
                <div className="ProTitle">
                  ♻️ Update {profileToUpdate?.handle}#{profileToUpdate?.profileId}
                </div>
                {/* Field1: name */}
                <div className="m-10">
                  <label className="ProLabel" htmlFor="name">
                    ☀️ Account name*
                  </label>
                  <Field id="name" name="name" placeholder="name" className="ProField" />
                  {/* Input Error */}
                  {errors?.name && (
                    <div>
                      <ErrorMessage name="name" />
                    </div>
                  )}
                </div>
                {/* Field2: bio */}
                <div className="m-10">
                  <label className="ProLabel" htmlFor="bio">
                    🛣️ Bio
                  </label>
                  <Field id="bio" name="bio" placeholder="bio" className="ProField" />
                  {/* Input Error */}
                  {errors?.bio && (
                    <div>
                      <ErrorMessage name="bio" />
                    </div>
                  )}
                </div>
                {/* Field3: location */}
                <div className="m-10">
                  <label className="ProLabel" htmlFor="location">
                    🗺️ Location
                  </label>
                  <Field
                    id="location"
                    name="location"
                    placeholder="location"
                    className="ProField"
                  />
                  {/* Input Error */}
                  {errors?.location && (
                    <div>
                      <ErrorMessage name="location" />
                    </div>
                  )}
                </div>
                {/* Field4: website */}
                <div className="m-10">
                  <label className="ProLabel" htmlFor="website">
                    🌐 Website
                  </label>
                  <Field id="website" name="website" className="ProField" />
                  {/* Input Error */}
                  {errors?.website && (
                    <div>
                      <ErrorMessage name="website" />
                    </div>
                  )}
                </div>
                {/* Field5: twitterUrl */}
                <div className="m-10">
                  <label className="ProLabel" htmlFor="twitterUrl">
                    🐋 Twitter URL
                  </label>
                  <Field id="twitterUrl" name="twitterUrl" className="ProField" />
                  {/* Input Error */}
                  {errors?.twitterUrl && (
                    <div>
                      <ErrorMessage name="twitterUrl" />
                    </div>
                  )}
                </div>
                {/* Field6: coverPicture */}
                <div className="m-10">
                  <label className="ProLabel" htmlFor="coverPicture">
                    🖼️ Pic URL
                  </label>
                  <Field id="coverPicture" name="coverPicture" className="ProField" />
                  {/* Input Error */}
                  {errors?.coverPicture && (
                    <div>
                      <ErrorMessage name="coverPicture" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <button
                    disabled={
                      !searchResult ||
                      isSubmitting ||
                      loading ||
                      !!result ||
                      !!errors?.name ||
                      !!errors?.bio ||
                      !!errors?.location
                    }
                    className="ProButton"
                    type="submit"
                  >
                    {result ? "OK" : "Update"}
                  </button>
                </div>
                {/* Successful call */}
                {result?.handle === handle && (
                  <div className="text-white animate-pulse">✅ Profile updated</div>
                )}
                {/* Apollo Error  */}
                {error && (
                  <div>
                    <Error error={error} />
                  </div>
                )}
              </Form>
            </div>
          )}
        </Formik>
      )}
    </Layout>
  );
};

export default UpdateProfilePage;

const UPDATE_PROFILE = gql`
  mutation ($request: UpdateProfileRequest!) {
    updateProfile(request: $request) {
      id
      name
      bio
      location
      website
      twitterUrl
      handle
    }
  }
`;
