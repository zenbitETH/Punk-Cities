import React, { useEffect, useState } from "react";
import asset from "../assets/parktest.png";
require("dotenv").config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractAddressLocal = "0x2b6248b821a1BC2a1e992bc6535F72827f57BF43"; // to find a better way to retrieve this address
const contractInterface = require("../contracts/YourContract.json");
const contractInstance = new web3.eth.Contract(contractInterface, contractAddressLocal);

/** need to know who is the address [x]
 * find the number of places registered per address by using the function register per place id
 * see the quest type per address -> the function works but it has a fixed value
 * create as many div as the number of places
 * fill the places with the required details
 * changing the address should change the places as well
 * @returns
 */

export default function MyPlaces({ address }) {
  const [placesIdPerPlayer, setplacesIdPerPlayer] = useState([]);
  const [registersPerPLaceId, setRegistersPerPLaceId] = useState([]);
  const [solarPunkPerPlaceId, setSolarPunkPerPlaceId] = useState([]);
  const [cyberPunkPerPlaceId, setCyberPunkPerPlaceId] = useState([]);

  const [placeNumber, setPlaceNumber] = useState(0);
  const [level, setLevel] = useState(1);

  // finding the total number of places
  const loadPlaceNumber = async () => {
    const placeNumber = await contractInstance.methods.placeId().call();
    return placeNumber;
  };

  const loadPlaces = async () => {
    const placeNumber = await loadPlaceNumber();
    setPlaceNumber(placeNumber);

    const registersList = [];
    for (let i = 0; i < placeNumber; i++) {
      const register = await contractInstance.methods.placeIdToRegisterAddress(i).call();
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
  };

  useEffect(() => {
    setTimeout(() => {
      loadPlaces();
    }, 1500);
  });

  useEffect(() => {
    setTimeout(() => {
      loadPlaces();
    }, 1500);
  }, [address]);

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
              <div class="PLtitle">{place}</div>
              <div class="PLlevel">{`Lv?`}</div>
            </div>
            <img
              src="https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/1-Basketball-Court.png"
              class="PLimage"
            />
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
              <div class="PLtitle">{place}</div>
              <div class="PLlevel">{`Lv?`}</div>
            </div>
            <img
              src="https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/1-Basketball-Court.png"
              class="PLimage"
            />
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
