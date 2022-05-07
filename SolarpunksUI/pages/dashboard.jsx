import Layout from "../components/Layout";
import ConnectWalletMessage from "../components/ConnectWalletMessage";
import LensContext from "../components/LensContext";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useMoralis } from "react-moralis";
import { useQueryPuckCitiesMetadata } from "../hooks/useQueryPuckCitiesMetadata";
import { FaMapMarkerAlt } from "react-icons/fa";
import Image from "next/image";
import SlimFollowerCard from "../components/SlimFollowerCard";
import Pagination from "../components/Pagination";
import Publications from "../components/Publications";
import { gql, useQuery } from "@apollo/client";

const PUNKCITIES_ADDRESS = "0x092BBe9022D421940B6D74799179267e5c822895";

const Dashboard = () => {
  const { friendList, setFriendList, /*isLensReady*/ defaultHandle, defaultProfile } =
    useContext(LensContext);
  const { account, isAuthenticated, user } = useMoralis();

  const saveMoralisUserDataToContext = friends => {
    if (!friends) {
      setFriendList([]);
    } else {
      setFriendList(friends.split(","));
    }
  };

  useEffect(() => {
    if (isAuthenticated) saveMoralisUserDataToContext(user?.attributes?.friends);
    // if (isAuthenticated) setUserData({ friends: null });
  }, [user]);
 
  // PART 1: PunkCities
  const [city0, setCity0] = useState();
  const [city1, setCity1] = useState();
  const [city2, setCity2] = useState();
  const [city3, setCity3] = useState();
  const [city4, setCity4] = useState();
  const [city5, setCity5] = useState();
  const [cities, setCities] = useState({});
  const [citiesArray, setCitiesArray] = useState();
  const [currentCity, setCurrentCity] = useState(0);

  const numberOfCities = citiesArray?.length;

  useEffect(() => {
    city0 && setCities({ ...cities, [city0.tokenID]: city0 });
    city1 && setCities({ ...cities, [city1.tokenID]: city1 });
    city2 && setCities({ ...cities, [city2.tokenID]: city2 });
    city3 && setCities({ ...cities, [city3.tokenID]: city3 });
    city4 && setCities({ ...cities, [city4.tokenID]: city4 });
    city5 && setCities({ ...cities, [city5.tokenID]: city5 });
    cities && setCitiesArray(Object.values(cities));
  }, [city0, city1, city2, city3, city4, city5]);

  useEffect(() => {
    city0 && setCities({ ...cities, [city0.tokenID]: city0 });
    cities && setCitiesArray(Object.values(cities));
  }, [city0]);

  useEffect(() => {
    city1 && setCities({ ...cities, [city1.tokenID]: city1 });
    cities && setCitiesArray(Object.values(cities));
  }, [city1]);

  useEffect(() => {
    city2 && setCities({ ...cities, [city2.tokenID]: city2 });
    cities && setCitiesArray(Object.values(cities));
  }, [city2]);

  useEffect(() => {
    city3 && setCities({ ...cities, [city3.tokenID]: city3 });
    cities && setCitiesArray(Object.values(cities));
  }, [city3]);

  useEffect(() => {
    city4 && setCities({ ...cities, [city4.tokenID]: city4 });
    cities && setCitiesArray(Object.values(cities));
  }, [city4]);

  useEffect(() => {
    city5 && setCities({ ...cities, [city5.tokenID]: city5 });
    cities && setCitiesArray(Object.values(cities));
  }, [city5]);

  // query cities
  const { citiesMetadataloading: loading0, citiesMetadataError: error0 } =
    useQueryPuckCitiesMetadata(setCity0, PUNKCITIES_ADDRESS, 0);
  const { citiesMetadataloading: loading1, citiesMetadataError: error1 } =
    useQueryPuckCitiesMetadata(setCity1, PUNKCITIES_ADDRESS, 1);
  const { citiesMetadataloading: loading2, citiesMetadataError: error2 } =
    useQueryPuckCitiesMetadata(setCity2, PUNKCITIES_ADDRESS, 2);
  const { citiesMetadataloading: loading3, citiesMetadataError: error3 } =
    useQueryPuckCitiesMetadata(setCity3, PUNKCITIES_ADDRESS, 3);
  const { citiesMetadataloading: loading4, citiesMetadataError: error4 } =
    useQueryPuckCitiesMetadata(setCity4, PUNKCITIES_ADDRESS, 4);
  const { citiesMetadataloading: loading5, citiesMetadataError: error5 } =
    useQueryPuckCitiesMetadata(setCity5, PUNKCITIES_ADDRESS, 5);

  error0 && console.error("fail to fetch city0", error0);
  error1 && console.error("fail to fetch city1", error1);
  error2 && console.error("fail to fetch city2", error2);
  error3 && console.error("fail to fetch city3", error3);
  error4 && console.error("fail to fetch city4", error4);
  error5 && console.error("fail to fetch city5", error5);

  const next = () => setCurrentCity((currentCity + 1) % numberOfCities);
  const prev = () => setCurrentCity((currentCity + numberOfCities - 1) % numberOfCities);
  // End of Part 1

  // Part 2: My Followers
  // fetch followers
  const {
    data: followersData,
    loading: followersLoading,
    error: followersError,
    refetch: refetchFollowers,
  } = useQuery(GET_FOLLOWERS, {
    variables: {
      request: {
        profileId: defaultProfile,
        limit: 1,
      },
    },
  });
  const followers = followersData?.followers?.items;
  const followersNext = followersData?.followers?.pageInfo?.next;
  const followersPrev = followersData?.followers?.pageInfo?.prev;
  const followersTotalCount = followersData?.followers?.pageInfo?.totalCount;
  // End of Part 2

  return (
    <Layout >
      <div className="MainCon">
        {!(account && isAuthenticated) && <ConnectWalletMessage />}
        {/*!(account && isAuthenticated && isLensReady) && (
          <div className="LensCon">
            <div className="LensIcon">🌿</div>Lens is not active
          </div>
        )*/}
      </div>

      {account && isAuthenticated /*&& isLensReady*/ && (
        <div className="MainScreen -mt-10">
          <div className="MainBoard">
          <div className="Board3">
              <div className="my-5 ">🌇 Punk Cities Places</div>
              <grid className="grid grid-cols-2 m-3 gap-3">
                <place className="PlaceBG">
                  <div className="row-span-4">
                    <img className="w-4/5 mx-auto" src="https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/7-Hospital.png"/>
                  </div>
                  <div className="bg-night-100 rounded-b-lg grid grid-cols-3 text-center text-base">
                    <div>1 👍</div>
                    <div>0 ⚡</div>
                    <div>1 💽 </div>
                  </div>
                </place>
                <place className="PlaceBG">
                  <div className="row-span-4">
                    <img className="w-4/5 mx-auto" src="https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/12.Public-Park.png"/>
                  </div>
                  <div className="bg-night-100 rounded-b-lg grid grid-cols-3 text-center text-base">
                    <div>2 👍</div>
                    <div>2 ⚡</div>
                    <div>0 💽 </div>
                  </div>
                </place>
                <place className="PlaceBG">
                  <div className="row-span-4">
                    <img className="w-4/5 mx-auto" src="https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/3%20City%20Hall.png"/>
                  </div>
                  <div className="bg-night-100 rounded-b-lg grid grid-cols-3 text-center text-base">
                    <div>1 👍</div>
                    <div>0 ⚡</div>
                    <div>0 💽 </div>
                  </div>
                </place>
                <place className="PlaceBG">
                  <div className="row-span-4">
                    <img className="w-4/5 mx-auto" src="https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/11.Police-Station.png"/>
                  </div>
                  <div className="bg-night-100 rounded-b-lg grid grid-cols-3 text-center text-base">
                    <div>1 👍</div>
                    <div>1 ⚡</div>
                    <div>1 💽 </div>
                  </div>
                </place>
              </grid>
              
          </div>
          <div className="Board1">
              {" "}
              <div className="my-5 ">🏢 Place detail</div>
              <div className="text-md py-2 ">
                <div className="relative">
                  {citiesArray?.[currentCity]?.image && (
                    <Image
                      width={550}
                      height={550}
                      src={citiesArray?.[currentCity]?.image.replace(
                        "ipfs://",
                        "https://ipfs.io/ipfs/",
                      )}
                    />
                  )}
                  <div className="absolute top-0">
                    <Pagination next={next} prev={prev} totalCount={numberOfCities || 0} />
                  </div>
                  {citiesArray?.[currentCity]?.attributes?.map((attribute, index) => (
                    <div className="text-right ml-10 mr-10" key={index}>
                      <div className="text-solar-100 bottom-6 ml-10 text-lg">
                        {attribute.trait_type}
                      </div>
                      <div className="text-right">{attribute.value}</div>
                    </div>
                  ))}

                  {numberOfCities >= 0 && (
                    <div className=" text-center mt-10">
                      <div className="DasTitle">☀️ {citiesArray?.[currentCity]?.name}</div>
                      {/* TODO Add field on Punk Cities form}
                    <div>{citiesArray?.[currentCity]?.description}</div>
                    <div>City: {citiesArray?.[currentCity]?.content}</div>*/}
                      <div className="absolute text-solar-100 xl:bottom-0 left-10 text-2xl">
                        #{citiesArray?.[currentCity]?.tag}
                      </div>
                      <div className="absolute text-white bottom-32 right-10 text-2xl">
                        NFT ID: {citiesArray?.[currentCity]?.tokenID}
                      </div>
                      <div className="flex absolute bottom-28 text-white left-10 text-2xl">
                        {" "}
                        <span>
                          <FaMapMarkerAlt />
                        </span>
                        <span>
                          <a
                            className="text-white hover:text-solar-100 ml-3"
                            target="_blank"
                            rel="noreferrer"
                            href={citiesArray?.[currentCity]?.address}
                          >
                            Map
                          </a>
                        </span>
                      </div>
                      <div className="absolute text-solar-100 bottom-40 right-10 text-2xl">
                        Attributes
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="Board2">
              <div className="my-5 ">💡Proposals on this place</div>
              <div className="grid grid-cols-1 gap-5 mx-2 ">

                <a href="./proposalDetail">
                  <div className="grid grid-cols-8 bg-glass-100 rounded-lg hover:bg-solar-900 cursor-pointer text-solar-100 hover:text-night-100">
                    <div class="col-span-8  text-lg my-2 hover:text-night-100 ">Proposal 1 title test</div>
                    <div class="col-span-4 my-2 text-white">20⚡ </div>
                    <div class="col-span-2 my-2 bg-gradient-to-r from-glass-900 via-green-900 to-glass-900 text-white rounded-lg">0</div>
                    <div class="col-span-2 my-2 bg-gradient-to-r from-glass-900 via-red-900 to-glass-900 text-white rounded-lg">2</div>
                  </div>
                </a>
                <a href="./proposalDetail">
                  <div className="grid grid-cols-8 bg-glass-100 rounded-lg hover:bg-solar-900 cursor-pointer text-solar-100 hover:text-night-100">
                    <div class="col-span-8  text-lg my-2 hover:text-night-100 ">Proposal 1 title test</div>
                    <div class="col-span-4 my-2 text-white">20⚡ </div>
                    <div class="col-span-2 my-2 bg-gradient-to-r from-glass-900 via-green-900 to-glass-900 text-white rounded-lg">0</div>
                    <div class="col-span-2 my-2 bg-gradient-to-r from-glass-900 via-red-900 to-glass-900 text-white rounded-lg">2</div>
                  </div>
                </a>
                <a href="./proposalDetail">
                  <div className="grid grid-cols-8 bg-glass-100 rounded-lg hover:bg-solar-900 cursor-pointer text-solar-100 hover:text-night-100">
                    <div class="col-span-8  text-lg my-2 hover:text-night-100 ">Proposal 1 title test</div>
                    <div class="col-span-4 my-2 text-white">20⚡ </div>
                    <div class="col-span-2 my-2 bg-gradient-to-r from-glass-900 via-green-900 to-glass-900 text-white rounded-lg">0</div>
                    <div class="col-span-2 my-2 bg-gradient-to-r from-glass-900 via-red-900 to-glass-900 text-white rounded-lg">2</div>
                  </div>
                </a>

              </div>
            </div>
            {/*<div className="Board1 divide-y-2">
              <div className="my-5">
                <a className="hover:text-solar-100 animate-pulse">
                  <Link href="/explore">🌿My Friends</Link>
                </a>
              </div>
              <div className="text-sm py-2">
                {friendList?.map((friend, index) => (
                  <div className="text-xl hover:text-solar-100 hover:animate-ping" key={index}>
                    <Link href={`/explore/${friend.replace("#", "%23")}`}>
                      <a>{friend}</a>
                    </Link>
                  </div>
                ))}
              </div>
              </div>*/}
            {/*}
            <div className="Board2">
              <div className="my-5">🌱 My Post</div>
              <div className="text-sm text-left grid gap-2">
                <Publications
                  profileId={defaultProfile}
                  handle={defaultHandle}
                  publicationTypes={["POST"]}
                  isPublicPublications={true}
                  hideTitle={true}
                  pageSize={1}
                  showCoverPic={true}
                />
              </div>
            </div>
            */}
            {/*}
            <div className="Board1 divide-y-2">
              <div className="my-5">🪴 My Followers</div>
              <div className="text-md py-2">
                {followers?.[0] && (
                  <>
                    <SlimFollowerCard follower={followers[0]} />
                    <Pagination
                      next={() =>
                        refetchFollowers({
                          request: {
                            profileId: defaultProfile,
                            limit: 1,
                            cursor: followersNext,
                          },
                        })
                      }
                      prev={() =>
                        refetchFollowers({
                          request: {
                            profileId: defaultProfile,
                            limit: 1,
                            cursor: followersPrev,
                          },
                        })
                      }
                      totalCount={followersTotalCount}
                    />
                  </>
                )}
              </div>
            </div>
            */}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;

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
