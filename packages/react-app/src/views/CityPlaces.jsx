import React, { useEffect, useState } from "react";
import { PunkCityABI } from "../contracts/PunkCity";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
const APIURL = "https://api.thegraph.com/subgraphs/name/alessandromaci/punk-cities";
require("dotenv").config();

// const tokensQuery = `
// {
//   places(
//     first: 1,
//     orderBy: createdAtTimestamp,
//     orderDirection: desc,
//     where: {
//       placeId: ${i}
//     }) {
//     createdAtTimestamp
//     from
//     placeId
//     questType
//     chipPerPlace
//     energyPerPlace
//     verificationTimes
//     placeIdLevel
//   }
// }
// `;

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractAddressLocal = "0x20B991Dcf13f0854c142B4A5F217cBCD640e6409"; // to find a better way to retrieve this address
const contractInstance = new web3.eth.Contract(PunkCityABI, contractAddressLocal);

export default function CityPlaces({ address, readContracts, writeContracts, tx }) {
  const [placesIdPerPlayer, setplacesIdPerPlayer] = useState([]);
  const [registersPerPLaceId, setRegistersPerPLaceId] = useState([]);
  const [solarPunkPerPlaceId, setSolarPunkPerPlaceId] = useState([]);
  const [cyberPunkPerPlaceId, setCyberPunkPerPlaceId] = useState([]);
  const [levelPerPlaceId, setlevelPerPlaceId] = useState([]);
  const [uriIPFS, setUriIPFS] = useState([]);
  const [placeIdDetails, setPlaceIdDetails] = useState([]);
  const [updateRequired, setUpdateRequire] = useState(false);
  const [verificationPerPlaceId, setVerificationPerPlaceId] = useState([]);
  const [energyPerPlaceId, setEnergyPerPlaceId] = useState([]);
  const [chipPerPlaceId, setChipPerPlaceId] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUpdateRequire(true);
  }, []);

  if (updateRequired) {
    const loadURI = async id => {
      const uri = await contractInstance.methods.uri(id).call();
      return uri;
    };

    const loadIPFS = async id => {
      const uri = await loadURI(id);
      const uriUpdated = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
      const file = await fetch(uriUpdated);
      const ipfsResponse = await file.json();
      return ipfsResponse;
    };

    const loadPlaces = async () => {
      //setLoading(true);
      const placeNumber = await contractInstance.methods.placeId().call();

      const uriIPFS = [];
      for (let i = 0; i < placeNumber; i++) {
        const ipfsResponse = await loadIPFS(i);
        uriIPFS.push(ipfsResponse);
      }
      setUriIPFS(uriIPFS);

      //const instancePlaceIdDetails = [];
      // there are some errors in the querying of the places because values are messed up. Maybe it's cache ??
      for (let i = 0; i < placeNumber; i++) {
        client
          .query({
            query: gql(`
            {
              places(
                first: 1, 
                orderBy: createdAtTimestamp,
                orderDirection: desc, 
                where: {
                  placeId: ${i}
                }) {
                createdAtTimestamp
                from
                placeId
                questType
                chipPerPlace
                energyPerPlace
                verificationTimes
                placeIdLevel
              }
            }
            `),
          })
          .then(data => {
            const [places] = data.data.places;
            console.log(i);
            console.log(places);
            //instancePlaceIdDetails.push(places);
            setPlaceIdDetails(prevPlaceIdDetails => {
              const updatedPlaces = [...prevPlaceIdDetails];
              updatedPlaces.push(places);
              return updatedPlaces;
            });
          })
          .catch(err => {
            console.log("Error fetching data: ", err);
          });

        //const placeIdDetail = await contractInstance.methods.placeIdToPlaceDetail(i).call();
        //instancePlaceIdDetails.push(placeIdDetail);
      }

      //   const registersList = [];
      //   const levelList = [];
      //   const verificationList = [];
      //   const energyList = [];
      //   const chipList = [];
      //   for (let i = 0; i < placeNumber; i++) {
      //     const placeDetail = instancePlaceIdDetails[i];
      //     const register = placeDetail.registerAddress;
      //     const level = placeDetail.placeIdLevel;
      //     const verification = placeDetail.verificationTimes;
      //     const energy = placeDetail.energyPerPlace;
      //     const chip = placeDetail.chipPerPlace;
      //     registersList.push(register);
      //     levelList.push(level);
      //     verificationList.push(verification);
      //     energyList.push(energy);
      //     chipList.push(chip);
      //   }
      //   setRegistersPerPLaceId(registersList);
      //   setlevelPerPlaceId(levelList);
      //   setVerificationPerPlaceId(verificationList);
      //   setEnergyPerPlaceId(energyList);
      //   setChipPerPlaceId(chipList);
    };

    loadPlaces();
    //setLoading(false);
    setUpdateRequire(false);
  }

  return (
    <div class="CityDivAll">
      <div class="CityMenu">
        <a class="CityBT" href="./NewPlace">
          New Place
          <img
            src={"https://punkcities.mypinata.cloud/ipfs/QmYpNQUw9Pw48amwLnjjS7rDXRCB1xfo8DLZUJNnkYeQVo"}
            class="homevan"
          />
        </a>
        <a class="CityBT" href="./MyPlaces">
          My places
          <img
            src={"https://punkcities.mypinata.cloud/ipfs/QmcbcgbhvpznC8zns7zRY5KKN1WvS1QQ7t1M3BaPjfUE9E"}
            class="homevan"
          />
        </a>
        <a class="CityBT" href="https://solarpunks.vercel.app/">
          New Friends{" "}
          <img
            src={"https://punkcities.mypinata.cloud/ipfs/QmPoSnaj68Lcbs8TiAT1Lg9aodWcXE27t94kjhAw8xYZwn"}
            class="homevan2"
          />
        </a>
        <a class="CityBT" type="submit" href="./debug">
          🧙🏽 Wizard Mode (Hard){" "}
          <img
            src={"https://punkcities.mypinata.cloud/ipfs/QmREGJmweJGKqWHFM1oF8WnsgMc9gTSV8t4ZkFBk3aBsPx"}
            class="homevan"
          />
        </a>
      </div>
      <div class="CityPlaces3">
        <div class="PlaceQuest">
          <div class="QuestIc">🏙️</div>All places
        </div>
        {placeIdDetails.map((place, index) => (
          <a class="CityPL" href={`./PlaceDetail/${index}`}>
            <div class="PLheader">
              <div class="PLtitle">{uriIPFS[index].name}</div>
              <div class="PLlevel">{`Lv${place.placeIdLevel}`}</div>
            </div>
            <img src={uriIPFS[index].image3D} class="PLimage" />
            <div class="PLfooter">
              <div class="PLtitle">{`${place.verificationTimes}/2👍`}</div>
              <div class="PLlevel">{`${place.energyPerPlace}/2⚡`}</div>
              <div class="PLlevel">{`${place.chipPerPlace}/2💽`}</div>
            </div>
          </a>
        ))}
        {/* <div class="CityPL">
          <div class="PLheader">
            <div class="PLtitle">Unverified Park</div>
            <div class="PLlevel"> Lv0</div>
          </div>
          <img
            src="https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/1-Basketball-Court.png"
            class="PLimage"
          />
          <div class="PLfooterUn">
            <div class="PLtitle">10/20👍 to upgrade</div>
          </div>
        </div>
        <div class="CityPL">
          <div class="PLheader">
            <div class="PLtitle">Verified Park</div>
            <div class="PLlevel"> Lv0</div>
          </div>
          <img
            src="https://punkcities.mypinata.cloud/ipfs/bafybeidcq7q3yszzijqqmyepakavk26dxgbh3kvurmrmmg3ttsoq4zykve?filename=22-Skate-Park.png"
            class="PLimage"
          />
          <div class="PLfooter">
            <div class="PLtitle">23/20👍</div>
            <div class="PLlevel">4/10⚡</div>
            <div class="PLlevel">5/10💽</div>
          </div>
        </div>
        <div class="CityPL">
          <div class="PLheader">
            <div class="PLtitle">Ready2Lv1 Park</div>
            <div class="PLlevel"> Lv0</div>
          </div>
          <img src={asset} class="PLimage" />
          <div class="PLfooterUp">
            <div class="PLtitle">Upgrade to Lv1!</div>
          </div>
        </div>
        <div class="CityPL">
          <div class="PLheaderLv1">
            <div class="PLtitle">Level1 Park</div>
            <div class="PLlevel"> Lv1</div>
            <div class="PLlevel"> 💽</div>
          </div>
          <img src={asset} class="PLimage" />
          <div class="PLfooterCP">
            <div class="PLtitle">25/100👍</div>
            <div class="PLlevel">15/50⚡</div>
            <div class="PLlevel">35/50💽</div>
          </div>
        </div>
        <div class="CityPL">
          <div class="PLheaderLv1">
            <div class="PLtitle">Level1 Park</div>
            <div class="PLlevel"> Lv1</div>
            <div class="PLlevel"> ⚡</div>
          </div>
          <img src={asset} class="PLimage" />
          <div class="PLfooterSP">
            <div class="PLtitle">25/100👍</div>
            <div class="PLlevel">15/50⚡</div>
            <div class="PLlevel">35/50💽</div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
