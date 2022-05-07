import { gql, useQuery } from "@apollo/client";
import NoRecord from "./NoRecord";
import Error from "./Error";
import Link from "next/link";
import { useContext } from "react";
import LensContext from "./LensContext";
import PostCard from "./PostCard";

const PublicationComponent = ({ handle, profileId, publicationId, isPublicPublication }) => {
  const FUNC = "publication";
  const { isLensReady } = useContext(LensContext);
  const { loading, data, error } = useQuery(GET_PUBLICATION, {
    variables: { request: { publicationId } },
    skip: !publicationId || !isLensReady,
    pollInterval: 1000,
  });

  const result = data?.[FUNC];

  return (
    <>
      {!isLensReady ? (
        <div className="LensCon">
          <div className="LensIcon">🌿</div>Connect to Lens
        </div>
      ) : (
        <div className="">
          {/* Todo: This Back button is good for nagivation, but I need to place it properly */}
          {/* <button className="ProButton">
            <Link
              href={
                isPublicPublication
                  ? `/explore/${handle}%23${profileId}/publications`
                  : `/profiles/${handle}/publications`
              }
            >
              <a>Back</a>
            </Link>
          </button> */}
          <div className="text-center">
            {isPublicPublication && result && (
              <Link
                href={`/explore/${handle}%23${profileId}/publications/${result.id}/create-comment`}
              >
                <button className="ProButton">
                  <a>Create Comment</a>
                </button>
              </Link>
            )}
          </div>
          {loading && <div>...loading</div>}
          {result && !loading && (
            <div className="scale-75">
              {/* Post Detail */}
              <PostCard post={result} />
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
        </div>
      )}
    </>
  );
};

export default PublicationComponent;

const GET_PUBLICATION = gql`
  query ($request: PublicationQueryRequest!) {
    publication(request: $request) {
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
    cover {
      original {
        url
      }
    }
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
