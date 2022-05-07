import Link from "next/link";
import Image from "next/image";

const CommentCard = ({ comment, showLinkToPublicProfile, hideTraits, hideImage, hideStats }) => {
  const { stats, metadata, profile, mainPost, commentOn } = comment;
  const totalAmountOfMirrors = stats?.totalAmountOfMirrors;
  const totalAmountOfCollects = stats?.totalAmountOfCollects;
  const totalAmountOfComments = stats?.totalAmountOfComments;
  const firstComment = comment?.firstComment;
  const collectedBy = comment?.collectedBy;
  let imgSrc = metadata?.media?.[0]?.original?.url || metadata?.cover?.original?.url;
  if (imgSrc?.startsWith("ipfs://")) imgSrc = imgSrc.replace("ipfs://", "https://ipfs.io/ipfs/");

  return (
    <div class="PostGrid font-exo">
      
      <div className="ProfileData bg-glass-100 rounded-lg p-5 text-white relative">
      <div className="absolute bottom-5 text-lg">Owned by: {profile.ownedBy}</div> 
      
      
      <div className="relative">
          
      <div className="text-lg text-solar-100">{comment.__typename} {comment.id} <span className="absolute right-0 text-white">{comment.createdAt}</span></div>
      <div className="text-solar-900">on post {mainPost?.id} <span> from {mainPost?.profile?.id}</span></div>
          <span className="text-3xl">
            by {profile?.handle}#{profile?.id}
          </span>
          {showLinkToPublicProfile && (
            <span>
              <button className="bg-blue-200 m-2 p-2">
                <Link href={`/explore/${profile?.handle}%23${profile.id}`}>
                  <a>Go to Public Profile</a>
                </Link>
              </button>
            </span>
          )}
        </div>
      {/*!hideStats && (
        <>
          <div className="my-2 font-bold">PublicationStats</div>
          <div>Total Mirrors: {stats?.totalAmountOfMirrors}</div>
          <div>Total Collects: {stats?.totalAmountOfCollects}</div>
          <div>Total Comments: {stats?.totalAmountOfComments}</div>
          <div>{metadata?.content}</div>
        </>
      )*/}
      <div class="text-center my-10">
          <div className="text-solar-100">{metadata?.name}</div>
          <div><a className="4xl">"</a> {metadata?.description}<a className="4xl"> "</a></div>
        </div>

      {!hideTraits &&
        metadata?.attributes?.map((attribute, index) => (
          <div key={index}>
            {attribute.displayType && <div>displayType: {attribute.displayType}</div>}
            <div>traitType: {attribute.traitType}</div>
            <div>value: {attribute.value}</div>
          </div>
        ))}
  
      {collectedBy && <div>collectedBy: {collectedBy}</div>}
    
      
      
      {/*
        <div>onChainContentURI: {comment.onChainContentURI}</div>
        <div>commentOn-profile: {commentOn?.id}</div>
      */}
      {firstComment && <div>firstComment: {firstComment}</div>}
      </div>
      <div >
        {!hideImage && (
          <>
            {imgSrc ? <img className="ProfilePic2" src={imgSrc} /> : <div>No image found</div>}
          </>
        )}
      </div>
    </div>
    
  );
};

export default CommentCard;

//  {
//         "__typename": "Comment",
//         "id": "0x21-0x0a",
//         "profile": {
//           "__typename": "Profile",
//           "id": "0x21",
//           "name": null,
//           "bio": null,
//           "location": null,
//           "website": null,
//           "twitterUrl": null,
//           "handle": "rtang3",
//           "picture": null,
//           "coverPicture": null,
//           "ownedBy": "0xc93b8F86c949962f3B6D01C4cdB5fC4663b1af0A",
//           "stats": {
//             "__typename": "ProfileStats",
//             "totalFollowers": 2,
//             "totalFollowing": 0,
//             "totalPosts": 3,
//             "totalComments": 1,
//             "totalMirrors": 0,
//             "totalPublications": 4,
//             "totalCollects": 2
//           }
//         },
//         "metadata": {
//           "__typename": "MetadataOutput",
//           "name": "PUG",
//           "description": "### dog",
//           "content": "content",
//           "cover": null,
//           "media": [
//             {
//               "__typename": "MediaSet",
//               "original": {
//                 "__typename": "Media",
//                 "url": "https://ipfs.io/ipfs/QmSsYRx3LpDAb1GZQm7zZ1AuHZjfbPkD6J7s9r41xu1mf8?filename=pug.png"
//               }
//             }
//           ],
//           "attributes": []
//         },
//         "createdAt": "2022-03-20T14:55:18.000Z",
//         "collectedBy": null,
//         "appId": "testing123",
//         "collectModule": {
//           "__typename": "EmptyCollectModuleSettings",
//           "type": "EmptyCollectModule",
//           "contractAddress": "0xb96e42b5579e76197B4d2EA710fF50e037881253"
//         },
//         "referenceModule": null,
//         "onChainContentURI": "https://ipfs.io/ipfs/QmWPNB9D765bXgZVDYcrq4LnXgJwuY6ohr2NrDsMhA9vZN",
//         "mainPost": {
//           "__typename": "Post",
//           "id": "0x21-0x08",
//           "profile": {
//             "__typename": "Profile",
//             "id": "0x21"
//           }
//         },
//         "commentOn": {
//           "__typename": "Post",
//           "id": "0x21-0x08"
//         },
//         "firstComment": null
//       },
