import { gql, useQuery } from "@apollo/client";
import NoRecord from "./NoRecord";
import Error from "./Error";
import { JSONTree } from "react-json-tree";
import { useMoralis } from "react-moralis";
import { useContext } from "react";
import LensContext from "./LensContext";
import Link from "next/link";

const PAGESIZE = 20;

const ProfilesComponent = ({ cursor, dev }) => {
  const FUNC = "profiles";
  const { account } = useMoralis();
  const { isLensReady, defaultProfile, defaultHandle, setDefaultProfile, setDefaultHandle } =
    useContext(LensContext);
  const defaultUser = defaultProfile && defaultHandle && `${defaultHandle}#${defaultProfile}`;

  const { loading, data, error } = useQuery(GET_PROFILES, {
    variables: {
      request: {
        limit: PAGESIZE,
        ownedBy: account,
      },
    },
    skip: !account,
  });

  const isActiveRecord = data?.[FUNC]?.items?.length > 0;
  const items = isActiveRecord ? data?.[FUNC]?.items : null;

  return (
    <div className="xl:-mt-16 mb-20">
      {!isLensReady ? (
        <div className="LensCon">
          <div className="LensIcon">🌿</div>Connect to Lens
        </div>
      ) : (
        <>
          <div className="text-5xl font-exo mb-5 text-night-100">Profiles</div>
          <div>{!isLensReady && <div className="LensIcon">Lens is not active</div>}</div>
          {loading && <div>...loading</div>}
          {isActiveRecord && !error && !loading ? (
            <div className="grid xl:grid-cols-3 xl:px-0 px-10 gap-2">
              {items?.map(({ name, id, handle }, key) => (
                <div className="bg-glass-100 rounded-lg h-auto" key={key}>
                  {/* Profile Summary */}

                  <div className="text-2xl text-white m-3 pr-16 text-left">
                    <div className="mb-2">☀️ {name && `${name}`}</div>
                    <span className="text-xl">{`🌿${handle}#${id}`}</span>
                  </div>
                  <div></div>
                  {/* TODO: REVISIT */}
                  <div className="grid grid-cols-3">
                    {defaultUser === `${handle}#${id}` ? (
                      <span className="font-exo text-night-100 bg-solar-100 rounded-bl-lg p-5 h-auto w-25 animate-pulse">
                      Current
                      </span>
                    ) : (
                      <span
                        className="font-exo text-white bg-cyber-100 rounded-bl-lg p-5 h-15 w-25 hover:bg-solar-100 hover:text-night-100 hover:animate-pulse cursor-pointer"
                        onClick={() => {
                          setDefaultProfile(id);
                          setDefaultHandle(handle);
                        }}
                      >
                       Switch
                      </span>
                    )}
                    <Link href={`/profiles/${handle}`}>
                      <a className="font-exo text-white bg-cyber-100 p-5 h-15 w-25 hover:bg-solar-100 hover:text-night-100 hover:animate-pulse cursor-pointer">
                       Update
                      </a>
                    </Link>
                    <Link href={`/profiles/${handle}/publications`}>
                      <a className="font-exo text-white bg-cyber-100 rounded-br-lg p-5 h-15 w-25 hover:bg-solar-100 hover:text-night-100 hover:animate-pulse cursor-pointer">
                       Post
                      </a>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <NoRecord />
          )}
          {error && (
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
        </>
      )}
    </div>
  );
};

export default ProfilesComponent;

const GET_PROFILES = gql`
  query ($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        id
        name
        bio
        location
        website
        twitterUrl
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
          __typename
        }
        handle
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
          __typename
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
                symbol
                name
                decimals
                address
              }
              value
            }
            recipient
          }
          __typename
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`;

// Example:
// should returns, something like:
// {
//   "search": {
//     "__typename": "ProfileSearchResult",
//     "items": [
//       {
//         "__typename": "Profile",
//         "profileId": "0x21",
//         "name": null,
//         "bio": null,
//         "location": null,
//         "website": null,
//         "twitterUrl": null,
//         "handle": "rtang3",
//         "picture": null,
//         "coverPicture": null,
//         "ownedBy": "0xc93b8F86c949962f3B6D01C4cdB5fC4663b1af0A",
//         "depatcher": null,
//         "stats": {
//           "__typename": "ProfileStats",
//           "totalFollowers": 0,
//           "totalFollowing": 0,
//           "totalPosts": 0,
//           "totalComments": 0,
//           "totalMirrors": 0,
//           "totalPublications": 0,
//           "totalCollects": 0
//         },
//         "followModule": null
//       }
//     ],
//     "pageInfo": {
//       "__typename": "PaginatedResultInfo",
//       "prev": "{\"offset\":0}",
//       "totalCount": 1,
//       "next": "{\"offset\":1}"
//     }
//   }
// }
