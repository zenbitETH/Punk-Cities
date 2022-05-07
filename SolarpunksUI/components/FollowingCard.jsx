import { shortenAddress } from "../lib/shortenAddress";
import { FaTwitterSquare, FaGlobe, FaGlobeAmericas, FaRegUserCircle } from "react-icons/fa";

const FollowingCard = ({ following }) => {
  const { profile, totalAmountOfTimesFollowing } = following;
  const { stats } = profile;
  const user = `${profile?.handle}#${profile?.id}`;
  const name = profile?.name;
  const bio = profile?.bio;
  const location = profile?.location;
  const website = profile?.website;
  const twitterUrl = profile?.twitterUrl;
  const ownedBy = profile?.ownedBy;
  const totalFollowers = stats?.totalFollowers;
  const totalFollowing = stats?.totalFollowing;
  const totalPosts = stats?.totalPosts;
  const totalComments = stats?.totalComments;
  const totalMirrors = stats?.totalMirrors;
  const totalPublications = stats?.totalPublications;
  const totalCollects = stats?.totalCollects;

  return (
    <div className="m-10 py-10 text-left">
      <div className="my-5 font-bold">{user}</div>
      {name && <div>Name: {name}</div>}
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
      {ownedBy && <div>{shortenAddress(ownedBy)}</div>}
      {totalFollowers > 0 && <div>Followers: {totalFollowers}</div>}
      {totalFollowing > 0 && <div>Following: {totalFollowing}</div>}
      {totalPosts > 0 && <div>Posts: {totalPosts}</div>}
      {totalComments > 0 && <div>Comments: {totalComments}</div>}
      {totalMirrors > 0 && <div>Mirrors: {totalMirrors}</div>}
      {totalPublications > 0 && <div>Publications: {totalPublications}</div>}
      {totalCollects > 0 && <div>Collects: {totalCollects}</div>}
      {totalAmountOfTimesFollowing > 0 && (
        <div>Times of Following: {totalAmountOfTimesFollowing}</div>
      )}
    </div>
  );
};

export default FollowingCard;

// {
//   "following": {
//     "__typename": "PaginatedFollowingResult",
//     "items": [
//       {
//         "__typename": "Following",
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
//           "depatcher": null,
//           "stats": {
//             "__typename": "ProfileStats",
//             "totalFollowers": 1,
//             "totalFollowing": 0,
//             "totalPosts": 2,
//             "totalComments": 0,
//             "totalMirrors": 0,
//             "totalPublications": 2,
//             "totalCollects": 0
//           },
//           "followModule": null
//         },
//         "totalAmountOfTimesFollowing": 6
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
