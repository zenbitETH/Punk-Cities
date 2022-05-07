import { gql, useQuery } from "@apollo/client";
import NoRecord from "./NoRecord";
import PostCard from "./PostCard";
import CommentCard from "./CommentCard";
import { JSONTree } from "react-json-tree";
import Link from "next/link";
import Pagination2 from "./Pagination2";
import { useState, useEffect } from "react";

const PAGESIZE = 1;

// Note: pagination need improvment
const Timeline = ({
  handle,
  profileId,
  dev,
  showLinkToPublicProfile,
  showComment,
  canComment,
  canCollect,
}) => {
  const FUNC = "timeline";
  const { data, loading, error, refetch } = useQuery(GET_TIMELINE2, {
    variables: {
      request: {
        limit: PAGESIZE,
        profileId,
      },
    },
    skip: !profileId,
  });
  const isActiveRecord = data?.[FUNC]?.items?.length > 0;
  const items = isActiveRecord ? data?.[FUNC]?.items : null;
  const nextCursor = data?.[FUNC]?.pageInfo?.next;
  const prevCursor = data?.[FUNC]?.pageInfo?.prev;
  const totalCount = data?.[FUNC]?.pageInfo?.totalCount;

  return (
    <div className="text-center">
    <div className="">
      {loading && <div>...loading</div>}
      {isActiveRecord && !error && !loading ? (
        <>
          {items?.map((item, index) => (
            <div key={index}>
              {item["__typename"] === "Comment" ? (
                <>
                  {showComment && (
                    <div className="m-2 p-2">
                      <CommentCard
                        comment={item}
                        showLinkToPublicProfile={showLinkToPublicProfile}
                      />
                    </div>
                  )}
                </>
              ) : item["__typename"] === "Post" ? (
                <div className="m-2 p-2">
                  <PostCard
                    post={item}
                    showLinkToPublicProfile={showLinkToPublicProfile}
                    hideStats={true}
                  />
                  <div className="">
                    <span className="">
                      {canComment && (
                        <Link
                          href={`/explore/${handle}%23${profileId}/publications/${item.id}/create-comment`}
                        >
                          <a>
                            <button className="ProButton">Create Comment</button>
                          </a>
                        </Link>
                      )}
                    </span>
                    <span className="">
                      {canCollect && (
                        <Link
                          href={`/explore/${handle}%23${profileId}/publications/${item.id}/collect`}
                        >
                          <a>
                            <button className="ProButton">Collect Me</button>
                          </a>
                        </Link>
                      )}
                    </span>
                  </div>
                </div>
              ) : (
                <div>Unknow item</div>
              )}
            </div>
          ))}
          <div className="absolute bottom-10 left-0 right-0">
          <Pagination2
            next={() => {
              refetch({
                request: { limit: PAGESIZE, cursor: nextCursor, profileId },
              });
            }}
            prev={() => {
              refetch({
                request: { limit: PAGESIZE, cursor: prevCursor, profileId },
              });
            }}
            totalCount={totalCount}
          />
          </div>
        </>
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
      </div>
    </div>
  );
};

export default Timeline;

// edit manually. Todo: replaced by auto-generated query
const GET_TIMELINE2 = gql`
  query ($request: TimelineRequest!) {
    timeline(request: $request) {
      items {
        ... on Post {
          id
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
                  size
                }
                small {
                  url
                  width
                  height
                  mimeType
                  size
                }
                medium {
                  url
                  width
                  height
                  mimeType
                  size
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
                  size
                }
                small {
                  url
                  width
                  height
                  mimeType
                  size
                }
                medium {
                  url
                  width
                  height
                  mimeType
                  size
                }
              }
            }
            ownedBy
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
          metadata {
            name
            description
            content
            cover {
              original {
                url
              }
            }
            media {
              original {
                url
              }
            }
            attributes {
              displayType
              value
              traitType
            }
          }
          createdAt
          collectedBy {
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
                    width
                    height
                    mimeType
                    size
                  }
                  small {
                    url
                    width
                    height
                    mimeType
                    size
                  }
                  medium {
                    url
                    width
                    height
                    mimeType
                    size
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
                    size
                  }
                  small {
                    url
                    width
                    height
                    mimeType
                    size
                  }
                  medium {
                    url
                    width
                    height
                    mimeType
                    size
                  }
                }
              }
              ownedBy
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
          appId
          collectModule {
            ... on EmptyCollectModuleSettings {
              type
              contractAddress
            }
          }
          referenceModule {
            ... on FollowOnlyReferenceModuleSettings {
              type
              contractAddress
            }
          }
          onChainContentURI
        }
        ... on Comment {
          id
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
                  size
                }
                small {
                  url
                  width
                  height
                  mimeType
                  size
                }
                medium {
                  url
                  width
                  height
                  mimeType
                  size
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
                  size
                }
                small {
                  url
                  width
                  height
                  mimeType
                  size
                }
                medium {
                  url
                  width
                  height
                  mimeType
                  size
                }
              }
            }
            ownedBy
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
          metadata {
            name
            description
            content
            cover {
              original {
                url
              }
            }
            media {
              original {
                url
              }
            }
            attributes {
              displayType
              value
              traitType
            }
          }
          createdAt
          collectedBy {
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
                    width
                    height
                    mimeType
                    size
                  }
                  small {
                    url
                    width
                    height
                    mimeType
                    size
                  }
                  medium {
                    url
                    width
                    height
                    mimeType
                    size
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
                    size
                  }
                  small {
                    url
                    width
                    height
                    mimeType
                    size
                  }
                  medium {
                    url
                    width
                    height
                    mimeType
                    size
                  }
                }
              }
              ownedBy
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
          appId
          collectModule {
            ... on EmptyCollectModuleSettings {
              type
              contractAddress
            }
          }
          referenceModule {
            ... on FollowOnlyReferenceModuleSettings {
              type
              contractAddress
            }
          }
          onChainContentURI
          mainPost {
            ... on Post {
              id
              profile {
                id
              }
            }
          }
          commentOn {
            ... on Comment {
              id
            }
            ... on Post {
              id
            }
          }
          firstComment {
            id
          }
        }
        ... on Mirror {
          id
          profile {
            id
          }
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

// ORIGINAL query in the Github Lens example is broken. Need Fixing
