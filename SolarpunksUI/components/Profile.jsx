import { gql, useQuery } from "@apollo/client";
import { SEARCH } from "../graphql/search";
import NoRecord from "./NoRecord";
import Error from "./Error";
import { JSONTree } from "react-json-tree";
import Link from "next/link";
import { useContext, useState } from "react";
import LensContext from "./LensContext";
import ProfileCard from "./ProfileCard";
import FollowerCard from "./FollowerCard";
import FollowingCard from "./FollowingCard";
import { useMoralis } from "react-moralis";
import Pagination from "./Pagination";
import DialogModal from "./DialogModal";

const PAGESIZE = 1;

/**
 * TODO: Following and Followers are long, should be later moved into separate page, with pagination
 */

const ProfileComponent = ({ handle, dev, isPublicProfile, canFollow }) => {
  const FUNC = "search";
  const { account } = useMoralis();
  const { isLensReady } = useContext(LensContext);

  // fetch profile
  const { data, error, loading } = useQuery(SEARCH, {
    variables: { request: { limit: 1, query: handle, type: "PROFILE" } },
    skip: !handle || !isLensReady,
    pollInterval: 1000,
  });
  const result = data?.[FUNC]?.items?.[0];

  // fetch followers
  const {
    data: followersData,
    loading: followersLoading,
    error: followersError,
    refetch: refetchFollowers,
  } = useQuery(GET_FOLLOWERS, {
    variables: {
      request: {
        profileId: result?.profileId,
        limit: PAGESIZE,
      },
    },
    skip: !data,
    pollInterval: 1000,
  });
  const followers = followersData?.followers?.items;
  const followersNext = followersData?.followers?.pageInfo?.next;
  const followersPrev = followersData?.followers?.pageInfo?.prev;
  const followersTotalCount = followersData?.followers?.pageInfo?.totalCount;

  // Toggle Dialog for Followers
  const [isFollowersDialogOpen, setIsFollowersDialogOpen] = useState(false);
  const closeFollowersDialogModal = () => setIsFollowersDialogOpen(false);
  const openFollowersDialogModal = () => setIsFollowersDialogOpen(true);

  // fetch following
  const {
    data: followingsData,
    loading: followingsLoading,
    error: followingsError,
    refetch: refetchFollowing,
  } = useQuery(GET_FOLLOWING, {
    variables: {
      request: {
        address: account,
        limit: PAGESIZE,
      },
    },
    skip: !account,
    pollInterval: 1000,
  });
  const followings = followingsData?.following?.items;
  const followingsNext = followingsData?.following?.pageInfo?.next;
  const followingsPrev = followingsData?.following?.pageInfo?.prev;
  const followingsTotalCount = followingsData?.following?.pageInfo?.totalCount;

  // Toggle Dialog for Followers
  const [isFollowingsDialogOpen, setIsFollowingsDialogOpen] = useState(false);
  const closeFollowingsDialogModal = () => setIsFollowingsDialogOpen(false);
  const openFollowingsDialogModal = () => setIsFollowingsDialogOpen(true);

  // Console Error
  error && console.error("fetch profile error: ", error);
  followersError && console.error("fetch followers error: ", followersError);
  followingsError && console.error("fetch followings error: ", followingsError);

  return (
    <div className="">
      {!isLensReady ? (
        <div className="LensCon">
          <div className="LensIcon">🌿</div>Connect to Lens
        </div>
      ) : (
        <div className="p-2">
          {loading && <div>...loading</div>}
          {result && !loading && (
            <div className="relative">
              {/* Profile Detail */}
              <ProfileCard
                profile={result}
                handle={handle}
                isPublicProfile={isPublicProfile}
                openFollowersDialogModal={openFollowersDialogModal}
                openFollowingsDialogModal={openFollowingsDialogModal}
              />
              {!isPublicProfile && (
                <Link href={`/profiles/${handle}/update-profile`}>
                  <a className="absolute text-white -top-5 left-16 font-exo w-20 h-20 hover:bg-solar-100 rounded-full align-middle bg-cyber-100 hover:text-night-100 pt-3">
                    <div>♻️</div> Update
                  </a>
                </Link>
              )}
              {isPublicProfile && canFollow && (
                <Link href={`/explore/${handle}%23${result.profileId}/follow`}>
                  <a className="absolute text-white -top-5 left-16 font-exo w-20 h-20 hover:bg-solar-100 rounded-full align-middle bg-cyber-100 hover:text-night-100 pt-3">
                    <div>🏃‍♀️</div> Follow
                  </a>
                </Link>
              )}
            </div>
          )}
          {!result && !loading && <NoRecord />}
          {error && !loading && (
            <>
              <Error error={error} />
              {dev && (
                <>
                  <div>Dev Mode</div>
                  <JSONTree data={error} hideRoot={true} />
                </>
              )}
            </>
          )}
          {/* Followers Dialogue Modal */}
          <DialogModal
            isOpen={isFollowersDialogOpen}
            handleClose={closeFollowersDialogModal}
            title="Followers"
          >
            <>
              {followersLoading && <div>...loading followers</div>}
              {followers?.length === 0 && <div>No more followers</div>}
              {followers?.length > 0 && (
                <>
                  {followers.map((follower, index) => (
                    <FollowerCard key={index} follower={follower} />
                  ))}
                  <Pagination
                    next={() =>
                      refetchFollowers({
                        request: {
                          profileId: result?.profileId,
                          limit: PAGESIZE,
                          cursor: followersNext,
                        },
                      })
                    }
                    prev={() =>
                      refetchFollowers({
                        request: {
                          profileId: result?.profileId,
                          limit: PAGESIZE,
                          cursor: followersPrev,
                        },
                      })
                    }
                    totalCount={followersTotalCount}
                  />
                </>
              )}
            </>
          </DialogModal>
          {/* Fetch Followings */}
          <DialogModal
            isOpen={isFollowingsDialogOpen}
            handleClose={closeFollowingsDialogModal}
            title="Followings"
          >
            <>
              {followingsLoading && <div>...loading followings</div>}
              {followings?.length === 0 && <div>No more followings</div>}
              {followings?.length > 0 && (
                <>
                  {followings.map((following, index) => (
                    <FollowingCard key={index} following={following} />
                  ))}
                  <Pagination
                    next={() =>
                      refetchFollowing({
                        request: { address: account, limit: PAGESIZE, cursor: followingsNext },
                      })
                    }
                    prev={() =>
                      refetchFollowing({
                        request: { address: account, limit: PAGESIZE, cursor: followingsPrev },
                      })
                    }
                    totalCount={followingsTotalCount}
                  />
                </>
              )}
            </>
          </DialogModal>
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;

const GET_FOLLOWERS = gql`
  query ($request: FollowersRequest!) {
    followers(request: $request) {
      items {
        wallet {
          address
          defaultProfile {
            id
            name
            bio
            location
            website
            twitterUrl
            handle
            picture {
              ... on NftImage {
                contractAddress
                tokenId
                uri
                verified
              }
              ... on MediaSet {
                original {
                  url
                  mimeType
                }
              }
            }
            coverPicture {
              ... on NftImage {
                contractAddress
                tokenId
                uri
                verified
              }
              ... on MediaSet {
                original {
                  url
                  mimeType
                }
              }
            }
            ownedBy
            depatcher {
              address
              canUseRelay
            }
            stats {
              totalFollowers
              totalFollowing
              totalPosts
              totalComments
              totalMirrors
              totalPublications
              totalCollects
            }
          }
        }
        totalAmountOfTimesFollowed
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`;

const GET_FOLLOWING = gql`
  query ($request: FollowingRequest!) {
    following(request: $request) {
      items {
        profile {
          id
          name
          bio
          location
          website
          twitterUrl
          handle
          picture {
            ... on NftImage {
              contractAddress
              tokenId
              uri
              verified
            }
            ... on MediaSet {
              original {
                url
                width
                height
                mimeType
              }
              medium {
                url
                width
                height
                mimeType
              }
              small {
                url
                width
                height
                mimeType
              }
            }
          }
          coverPicture {
            ... on NftImage {
              contractAddress
              tokenId
              uri
              verified
            }
            ... on MediaSet {
              original {
                url
                width
                height
                mimeType
              }
              small {
                width
                url
                height
                mimeType
              }
              medium {
                url
                width
                height
                mimeType
              }
            }
          }
          ownedBy
          depatcher {
            address
            canUseRelay
          }
          stats {
            totalFollowers
            totalFollowing
            totalPosts
            totalComments
            totalMirrors
            totalPublications
            totalCollects
          }
          followModule {
            ... on FeeFollowModuleSettings {
              type
              amount {
                asset {
                  name
                  symbol
                  decimals
                  address
                }
                value
              }
              recipient
            }
          }
        }
        totalAmountOfTimesFollowing
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`;
