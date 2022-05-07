import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState, useContext } from "react";
import Layout from "../../components/Layout";
import ConnectWalletMessage from "../../components/ConnectWalletMessage";
import LensContext from "../../components/LensContext";
import { useMoralis } from "react-moralis";
import includes from "lodash/includes";
import ExplorePublication from "../../components/ExplorePublication";

const ExplorePage = () => {
  const {
    friendList,
    setFriendList,
    isLensReady,
    defaultHandle,
    defaultProfile,
    last5VisitProfiles,
  } = useContext(LensContext);
  const { account, isAuthenticated } = useMoralis();
  const [isValidUser, setIsValidUser] = useState();

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
          {/* PART 1: ADD FRIEND AND MY GROUP */}
          <div className="border-2 m-2 p-10">
            <Formik
              initialValues={{ newfriend: "" }}
              validationSchema={Yup.object().shape({
                newfriend: Yup.string().lowercase("only lowercase").required("required field"),
              })}
              onSubmit={({ newfriend }) => {
                const [handle, profileId] = newfriend.split("#");
                if (
                  !handle ||
                  !profileId ||
                  includes(friendList, newfriend) ||
                  (handle === defaultHandle && profileId === defaultProfile)
                ) {
                  setIsValidUser(false);
                  return;
                }
                setIsValidUser(true);
                setFriendList([...friendList, newfriend]);
              }}
            >
              {({ errors, values }) => (
                <Form>
                  {/* ADD FRIEND */}
                  <div className="my-5">
                    <span className="p-2 m-2">
                      <label htmlFor="newfriend">Add Friend</label>
                    </span>
                    <span className="p-2 m-2 border-2">
                      <Field id="newfriend" name="newfriend" placeholder="tangr1#0x" />
                    </span>
                    {/* Input Error */}
                    {errors?.newfriend && (
                      <div>
                        <ErrorMessage name="newfriend" />
                      </div>
                    )}
                    <button className="bg-blue-300 border-2" type="submit">
                      Add
                    </button>
                    {/* does not work, ignore it */}
                    {/* {!isValidUser && values?.newfriend && <div>Invalid user name</div>} */}
                  </div>
                </Form>
              )}
            </Formik>
            {/* MY GROUP  */}
            <div className="font-bold">My Group</div>
            {friendList.map((friend, index) => (
              <div key={index}>
                <span className="mx-2">{friend}</span>
                <span>
                  <Link href={`/explore/${friend.replace("#", "%23")}`}>
                    <a>
                      <span className="mx-2 underlined bg-blue-300">Profile Details</span>
                    </a>
                  </Link>
                </span>
                <span>
                  <Link href={`/explore/${friend.replace("#", "%23")}/timeline`}>
                    <a>
                      <span className="mx-2 underlined bg-blue-300">Timeline</span>
                    </a>
                  </Link>
                </span>
                {friend?.split("#")[0] !== defaultHandle &&
                  friend?.split("#")[1] !== defaultProfile && (
                    <span>
                      <Link href={`/explore/${friend.replace("#", "%23")}/follow`}>
                        <a>
                          <span className="mx-2 underlined bg-blue-300">Follow</span>
                        </a>
                      </Link>
                    </span>
                  )}
              </div>
            ))}
            {/* LAST 5 VISIT PROFILES */}
            {/* Seem not useful */}
            {/* <div>
              {last5VisitProfiles?.length > 0 && (
                <>
                  <div className="font-bold my-5">Last 5 visited profiles</div>
                  {last5VisitProfiles.map((visitedProfile, index) => (
                    <div key={index}>{visitedProfile}</div>
                  ))}
                </>
              )}
            </div> */}
          </div>
          {/* END OF PART 1 */}
          {/* PART 2 EXPLORE WORLD PUBLICATION - TOP COMMENTED */}
          <div className="flex flex-row">
            <div className="border-2 p-2">
              <ExplorePublication sortCriteria={"TOP_COMMENTED"} pageSize={1} />
            </div>
            <div className="border-2 p-2">
              <ExplorePublication sortCriteria={"TOP_COLLECTED"} pageSize={1} />
            </div>
          </div>
          {/* END OF PART 2 */}
        </>
      )}
    </Layout>
  );
};

export default ExplorePage;
