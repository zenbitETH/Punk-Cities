import { gql, useQuery } from "@apollo/client";
import NoRecord from "./NoRecord";
import Error from "./Error";
import { JSONTree } from "react-json-tree";
import Link from "next/link";
import PostCard from "./PostCard";
// import Pagination from "./Pagination";

const PAGESIZE = 5;

const ExplorePublication = ({ sortCriteria, dev, pageSize }) => {
  const FUNC = "explorePublications";

  const { data, error, loading, refetch } = useQuery(EXPLORE_PUBLICATIONS, {
    variables: {
      request: {
        limit: pageSize || PAGESIZE,
        sortCriteria,
        sources: ["solarpunks"],
      },
    },
  });

  const isActiveRecord = data?.[FUNC]?.items?.length > 0;
  const items = isActiveRecord ? data?.[FUNC]?.items : null;
  const nextCursor = data?.[FUNC]?.pageInfo?.next;
  const prevCursor = data?.[FUNC]?.pageInfo?.prev;
  const totalCount = data?.[FUNC]?.pageInfo?.totalCount;

  return (
    <>
      {" "}
      {loading && <div>...loading</div>}
      <div className="font-bold">
        {sortCriteria === "TOP_COMMENTED" && "Top commented post"}
      </div>
      <div className="font-bold">
        {sortCriteria === "TOP_COLLECTED" && "Top collected post in Solarpunks"}
      </div>
      {isActiveRecord && !error && !loading ? (
        <>
          <div className="">
            {items?.map((post, index) => (
              <div className="" key={index}>
                <PostCard
                  post={post}
                  showLinkToPublicProfile={true}
                  hideTraits={true}
                  hideImage={true}
                  hideStats={true}
                />
              </div>
            ))}
            {/* Defect: Pagination */}
            {/* <Pagination
            loading={loading}
            error={error}
            next={() =>
              refetch({
                request: {
                  limit: pageSize || PAGESIZE,
                  sortCriteria,
                  sources: ["solarpunks"],
                  cursor: nextCursor,
                },
              })
            }
            prev={() =>
              refetch({
                request: {
                  limit: pageSize || PAGESIZE,
                  sortCriteria,
                  sources: ["solarpunks"],
                  cursor: prevCursor,
                },
              })
            }
            totalCount={totalCount}
          /> */}
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
    </>
  );
};

export default ExplorePublication;

const EXPLORE_PUBLICATIONS = gql`
  query ($request: ExplorePublicationRequest!) {
    explorePublications(request: $request) {
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
    width
    height
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
        small {
          ...MediaFields
        }
        medium {
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
        small {
          ...MediaFields
        }
        medium {
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
      small {
        ...MediaFields
      }
      medium {
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
