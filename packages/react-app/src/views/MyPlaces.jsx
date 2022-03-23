import React, { useEffect, useState } from "react";
import { PunkCityABI } from "../contracts/PunkCity";
require("dotenv").config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractAddressLocal = "0xC51a7909CEbfDa51019feca6D6E14128A8204458"; // to find a better way to retrieve this address
const contractInstance = new web3.eth.Contract(PunkCityABI, contractAddressLocal);

export default function MyPlaces({ address }) {
  const [placesIdPerPlayer, setplacesIdPerPlayer] = useState([]);
  const [registersPerPLaceId, setRegistersPerPLaceId] = useState([]);
  const [solarPunkPerPlaceId, setSolarPunkPerPlaceId] = useState([]);
  const [cyberPunkPerPlaceId, setCyberPunkPerPlaceId] = useState([]);
  const [levelPerPlaceId, setlevelPerPlaceId] = useState([]);
  const [uriIPFS, setUriIPFS] = useState([]);
  const [placeIdDetails, setPlaceIdDetails] = useState([]);
  const [updateRequired, setUpdateRequire] = useState(false);
  // const [verificationPerPlaceId, setVerificationPerPlaceId] = useState([]);
  // const [energyPerPlaceId, setEnergyPerPlaceId] = useState([]);
  // const [chipPerPlaceId, setChipPerPlaceId] = useState([]);

  const [placeNumber, setPlaceNumber] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setUpdateRequire(true);
    }, 1500);
  }, []);

  if (updateRequired) {
    const loadURI = async id => {
      const uri = await contractInstance.methods.uri(id).call();
      console.log(uri);
      return uri;
    };

    const loadIPFS = async id => {
      const uri = await loadURI(id);
      const uriUpdated = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
      const file = await fetch(uriUpdated);
      const ipfsResponse = await file.json();
      return ipfsResponse;
    };

    // const loadPlaceNumber = async () => {
    //   const placeNumber = await contractInstance.methods.placeId().call();
    //   return placeNumber;
    // };

    const loadPlaces = async () => {
      const placeNumber = await contractInstance.methods.placeId().call();
      setPlaceNumber(placeNumber);

      if (placeNumber) {
        const uriIPFS = [];
        for (let i = 0; i < placeNumber; i++) {
          const ipfsResponse = await loadIPFS(i);
          uriIPFS.push(ipfsResponse);
        }
        setUriIPFS(uriIPFS);

        const instancePlaceIdDetails = [];
        for (let i = 0; i < placeNumber; i++) {
          const placeIdDetail = await contractInstance.methods.placeIdToPlaceDetail(i).call(); //change
          instancePlaceIdDetails.push(placeIdDetail);
        }
        setPlaceIdDetails(instancePlaceIdDetails);
        console.log(`placeIdDetails: ${placeIdDetails}`);

        const registersList = [];
        for (let i = 0; i < placeNumber; i++) {
          const placeDetail = placeIdDetails[i];
          const register = placeDetail.registerAddress;
          registersList.push(register);
        }
        setRegistersPerPLaceId(registersList);

        const placeIdPerRegisterList = [];
        for (let i = 0; i < registersPerPLaceId.length; i++) {
          if (registersPerPLaceId[i] == `${address}`) {
            placeIdPerRegisterList.push(i);
          }
        }
        setplacesIdPerPlayer(placeIdPerRegisterList);

        const solarPunkCity = [];
        const cyberPunkCity = [];
        for (let i = 0; i < placeIdPerRegisterList.length; i++) {
          const questLevel = await contractInstance.methods
            .playerQuestTypePerPlaceId(address, placeIdPerRegisterList[i])
            .call();
          if (questLevel == 0) {
            solarPunkCity.push(placeIdPerRegisterList[i]);
          } else if (questLevel == 1) {
            cyberPunkCity.push(placeIdPerRegisterList[i]);
          }
        }
        setSolarPunkPerPlaceId(solarPunkCity);
        setCyberPunkPerPlaceId(cyberPunkCity);
      }
    };

    loadPlaces();
    setUpdateRequire(false);
  }

  // finding the total number of places

  //   // const verificationsList = [];
  //   // for (let i = 0; i < placeNumber; i++) {
  //   //   const verification = await contractInstance.methods.placeIdToVerificationTimes(i).call();
  //   //   verificationsList.push(verification);
  //   // }
  //   // setVerificationPerPlaceId(verificationsList);

  //   // const energyList = [];
  //   // for (let i = 0; i < placeNumber; i++) {
  //   //   const energy = await contractInstance.methods.energyPerPlace(i).call();
  //   //   energyList.push(energy);
  //   // }
  //   // setEnergyPerPlaceId(energyList);

  //   // const chipList = [];
  //   // for (let i = 0; i < placeNumber; i++) {
  //   //   const chip = await contractInstance.methods.chipPerPlace(i).call();
  //   //   chipList.push(chip);
  //   // }
  //   // setChipPerPlaceId(chipList);

  // useEffect(() => {
  //   setTimeout(() => {
  //     loadPlaces();
  //   }, 1500);
  // }, [address]);

  return (
    <div class="CityDiv">
      <div class="CityMenu">
        <a class="CityBT" href="./NewPlace">
          New Place
          <img
            src={"https://punkcities.mypinata.cloud/ipfs/QmYpNQUw9Pw48amwLnjjS7rDXRCB1xfo8DLZUJNnkYeQVo"}
            class="homevan"
          />
        </a>
        <a class="CityBT" href="./PlaceDetail">
          Place Detail{" "}
          <img
            src={"https://punkcities.mypinata.cloud/ipfs/QmVqUZf959wuJ8dBMfcLAUfmRn5pLk8PSWQ1eDfqH2mK2V"}
            class="homevan"
          />
        </a>
        <a class="CityBT" href="./CityPlaces">
          My city places
          <img
            src={"https://punkcities.mypinata.cloud/ipfs/QmSm6Ec8xEBTEB6ATkVmPybw4VRLiapm9K9fxLLxthgvq4"}
            class="homevan"
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
      <div class="CityPlaces">
        <div class="PlaceQuest">
          <div class="QuestIc">⚡</div>My Solarpunk places
        </div>
        {solarPunkPerPlaceId.map(place => (
          <a class="CityPL" href={`./PlaceDetail/${place}`}>
            <div class="PLheader">
              <div class="PLtitle">{uriIPFS[place].name}</div>
              <div class="PLlevel">Lv {levelPerPlaceId[place]}</div>
            </div>
            <img src={uriIPFS[place].image3D} class="PLimage" />
            <div class="PLfooter">
              <div class="PLtitle">{`?/2👍`}</div>
              <div class="PLlevel">{`?/2⚡`}</div>
              <div class="PLlevel">{`?/2💽`}</div>
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
      <div class="CityPlaces2">
        <div class="PlaceQuest">
          <div class="QuestIc">💽</div>My Cyberpunk places
        </div>
        {cyberPunkPerPlaceId.map(place => (
          <a class="CityPL" href={`./PlaceDetail/${place}`}>
            <div class="PLheader">
              <div class="PLtitle">{uriIPFS[place].name}</div>
              <div class="PLlevel">Lv {levelPerPlaceId[place]}</div>
            </div>
            <img src={uriIPFS[place].image3D} class="PLimage" />
            <div class="PLfooter">
              <div class="PLtitle">{`?/20👍`}</div>
              <div class="PLlevel">{`?/10⚡`}</div>
              <div class="PLlevel">{`?/10💽`}</div>
            </div>
          </a>
        ))}
        {/* <div class="CityPL">
          <div class="PLheader">
            <div class="PLtitle">Unverified Park</div>
            <div class="PLlevel"> Lv0</div>
          </div>
          <img
            src="https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/27-Tech-Company.png"
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
          <img src={asset} class="PLimage" />
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
        </div>*/}
      </div>
    </div>
  );
}
