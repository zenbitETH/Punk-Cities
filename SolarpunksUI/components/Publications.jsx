import { gql, useQuery } from "@apollo/client";
import NoRecord from "./NoRecord";
import Error from "./Error";
import { JSONTree } from "react-json-tree";
import Link from "next/link";
import { useContext } from "react";
import LensContext from "./LensContext";
import Pagination from "./Pagination";

const PAGESIZE = 5;

const Publications = ({
  profileId,
  handle,
  publicationTypes,
  dev,
  isPublicPublications,
  hideTitle,
  pageSize,
  showCoverPic,
}) => {
  const FUNC = "publications";
  const { isLensReady } = useContext(LensContext);

  const { data, error, loading, refetch } = useQuery(GET_PUBLICATIONS, {
    variables: {
      request: {
        limit: pageSize || PAGESIZE,
        profileId,
        publicationTypes, // ["POST", "COMMENT", "MIRROR"]
        // future use
        // collectedBy: '0x434783647389'
        // sources: string[]
        // commentsOf: string internalPublicationId
      },
    },
    pollInterval: 1000,
  });

  const isActiveRecord = data?.[FUNC]?.items?.length > 0;
  const items = isActiveRecord ? data?.[FUNC]?.items : null;
  const nextCursor = data?.[FUNC]?.pageInfo?.next;
  const prevCursor = data?.[FUNC]?.pageInfo?.prev;
  const totalCount = data?.[FUNC]?.pageInfo?.totalCount;

  return (
    <>
      {!isLensReady ? (
        <div className="LensCon">
          <div className="LensIcon">🌿</div>Connect to Lens
        </div>
      ) : (
        <>
          {/* {!hideTitle && <h1>Publications</h1>} */}
          {loading && <div>...loading</div>}
          {isActiveRecord && !error && !loading ? (
            <>
              {items?.map((item, key) => (
                <div className="rounded-lg text-center text-lg  gap-5" key={key}>
                  <div className="py-3 justify-center">
                  {/* Fixed image, not linked to post /
                  <div className="text-center">
                    {showCoverPic && item?.profile?.coverPicture?.original?.url ? (
                      <img className="ProfilePic3" src={item.profile.coverPicture.original.url} />
                    ) : (
                      <span>no image</span>
                    )}
                  </div>
                    */}
                    <div>
                      {publicationTypes}: {item.id}
                    </div>
                    <div className="text-solar-100">Name: {item?.metadata?.name}</div>
                    <div>Description: {item?.metadata?.description}</div>

                    {/*screen overload 
                    
                   
                    <span>
                    {item?.metadata?.attributes?.map((attribute, index) => (
                      <div key={index}>
                        {attribute.displayType && <div>displayType: {attribute.displayType}</div>}
                        <div>traitType: {attribute.traitType}</div>
                        <div>value: {attribute.value}</div>
                      </div>
                    ))}
                  </span>

                    */}
                  </div>
                  

                  <span className="">
                    <button className="ProButton">
                      <Link
                        href={
                          isPublicPublications
                            ? `/explore/${handle}%23${profileId}/publications/${item.id}`
                            : `/profiles/${handle}/publications/${item.id}`
                        }
                      >
                        <a>Details</a>
                      </Link>
                    </button>
                  </span>
                </div>
              ))}
              <Pagination
                pageSize={pageSize}
                next={() =>
                  refetch({
                    request: {
                      limit: pageSize || PAGESIZE,
                      profileId,
                      publicationTypes,
                      cursor: nextCursor,
                    },
                  })
                }
                prev={() =>
                  refetch({
                    request: {
                      limit: pageSize || PAGESIZE,
                      profileId,
                      publicationTypes,
                      cursor: prevCursor,
                    },
                  })
                }
                totalCount={totalCount}
              />
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
        </>
      )}
    </>
  );
};

export default Publications;

const GET_PUBLICATIONS = gql`
  query ($request: PublicationsQueryRequest!) {
    publications(request: $request) {
      items {
        __typename
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Mirror {
          ...MirrorFields
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }

  fragment MediaFields on Media {
    url
    mimeType
  }

  fragment ProfileFields on Profile {
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
          ...MediaFields
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
          ...MediaFields
        }
      }
    }
    ownedBy
    depatcher {
      address
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

  fragment PublicationStatsFields on PublicationStats {
    totalAmountOfMirrors
    totalAmountOfCollects
    totalAmountOfComments
  }

  fragment MetadataOutputFields on MetadataOutput {
    name
    description
    content
    media {
      original {
        ...MediaFields
      }
    }
    attributes {
      displayType
      traitType
      value
    }
  }

  fragment Erc20Fields on Erc20 {
    name
    symbol
    decimals
    address
  }

  fragment CollectModuleFields on CollectModule {
    __typename
    ... on EmptyCollectModuleSettings {
      type
    }
    ... on FeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedTimedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
    ... on RevertCollectModuleSettings {
      type
    }
    ... on TimedFeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
  }

  fragment PostFields on Post {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
  }

  fragment MirrorBaseFields on Mirror {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
  }

  fragment MirrorFields on Mirror {
    ...MirrorBaseFields
    mirrorOf {
      ... on Post {
        ...PostFields
      }
      ... on Comment {
        ...CommentFields
      }
    }
  }

  fragment CommentBaseFields on Comment {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
  }

  fragment CommentFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
        ...MirrorBaseFields
        mirrorOf {
          ... on Post {
            ...PostFields
          }
          ... on Comment {
            ...CommentMirrorOfFields
          }
        }
      }
    }
  }

  fragment CommentMirrorOfFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
        ...MirrorBaseFields
      }
    }
  }
`;
