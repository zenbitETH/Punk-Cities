import { shortenAddress } from "../lib/shortenAddress";
import { FaTwitterSquare, FaGlobe, FaGlobeAmericas, FaRegUserCircle } from "react-icons/fa";

const SlimFollowerCard = ({ follower }) => {
  const { wallet, totalAmountOfTimesFollowed } = follower;
  const defaultProfile = wallet?.defaultProfile;
  const stats = defaultProfile?.stats;
  const bio = defaultProfile?.bio;
  const name = defaultProfile?.name;
  const location = defaultProfile?.location;
  const website = defaultProfile?.website;
  const twitterUrl = defaultProfile?.twitterUrl;
  const totalFollowers = stats?.totalFollowers;
  const totalFollowing = stats?.totalFollowing;
  const totalPosts = stats?.totalPosts;
  const totalComments = stats?.totalComments;
  const totalMirrors = stats?.totalMirrors;
  const totalPublications = stats?.totalPublications;
  const totalCollects = stats?.totalCollects;
  const address = wallet?.address;
  const user = `${defaultProfile?.handle}#${defaultProfile?.id}`;

  return (
    <div className="m-2 py-2 flex flex-row">
      <span>
        <div className="font-bold">{user}</div>
        <div>{shortenAddress(address)}</div>
        {bio && (
          <div className="my-3 flex flex-row">
            <span className="mr-2">
              <FaRegUserCircle />
            </span>{" "}
            {bio}
          </div>
        )}
        {location && (
          <div className="my-3 flex flex-row">
            <span className="mr-2">
              <FaGlobeAmericas />
            </span>{" "}
            {location}
          </div>
        )}
        {website && (
          <div className="my-3 flex flex-row">
            <span className="mr-2">
              <FaGlobe />
            </span>{" "}
            {website}
          </div>
        )}
        {twitterUrl && (
          <div className="my-3 flex flex-row">
            <span className="mr-2">
              <FaTwitterSquare />
            </span>{" "}
            {twitterUrl}
          </div>
        )}
      </span>
      <span>
        {totalFollowers > 0 && <div>Followers: {totalFollowers}</div>}
        {totalFollowing > 0 && <div>Following: {totalFollowing}</div>}
        {totalPosts > 0 && <div>Posts: {totalPosts}</div>}
        {totalComments > 0 && <div>Comments: {totalComments}</div>}
      </span>
      <span>
        {totalMirrors > 0 && <div>Mirrors: {totalMirrors}</div>}
        {totalPublications > 0 && <div>Publications: {totalPublications}</div>}
        {totalCollects > 0 && <div>Collects: {totalCollects}</div>}
        {totalAmountOfTimesFollowed > 0 && (
          <div>Times of Followed: {totalAmountOfTimesFollowed}</div>
        )}
      </span>
    </div>
  );
};
export default SlimFollowerCard;

// {
//   "followers": {
//     "__typename": "PaginatedFollowersResult",
//     "items": [
//       {
//         "__typename": "Follower",
//         "wallet": {
//           "__typename": "Wallet",
//           "address": "0x1AAbF1c8006a22D67dd0d93595652d108e910a08",
//           "defaultProfile": {
//             "__typename": "Profile",
//             "id": "0x59",
//             "name": null,
//             "bio": null,
//             "location": null,
//             "website": null,
//             "twitterUrl": null,
//             "handle": "tangr1",
//             "picture": null,
//             "coverPicture": null,
//             "ownedBy": "0x1AAbF1c8006a22D67dd0d93595652d108e910a08",
//             "depatcher": null,
//             "stats": {
//               "__typename": "ProfileStats",
//               "totalFollowers": 0,
//               "totalFollowing": 1,
//               "totalPosts": 1,
//               "totalComments": 0,
//               "totalMirrors": 0,
//               "totalPublications": 1,
//               "totalCollects": 0
//             }
//           }
//         },
//         "totalAmountOfTimesFollowed": 6
//       }
//     ],
//     "pageInfo": {
//       "__typename": "PaginatedResultInfo",
//       "prev": "{\"offset\":0}",
//       "next": "{\"offset\":1}",
//       "totalCount": 1
//     }
//   }
// }
