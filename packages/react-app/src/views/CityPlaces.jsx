import React, { useState } from "react";
import asset from "../assets/parktest.png";
import { useContractReader } from "eth-hooks";

/** need to know who is the address [x]
 * find the number of places registered per address -> I can only show one of them
 * see the quest type per address -> the function works but it has a fixed value
 * create as many div as the number of places
 * fill the places with the required details
 * changing the address should change the places as well
 * @returns
 */

export default function CityPlaces ({ address, readContracts, writeContracts, tx }) {
  const [placesIdArray, setPlacesIdArray] = useState([0, 1]);
  const [level, setLevel] = useState(1);
  const [placeList, setPlaceList] = useState([]);

  //const placeList = [{ id: 0, level: 0, questType: "SP" }, { id: 1, level: 0, questType: "SP" }];
  const UpdatePlaceList = async () => {
    const placeList = [];
    for (let i = 0; i < placesIdArray.length; i++) {
      const placeId = placesIdArray[i];
      const placeLevel = (await tx(readContracts.YourContract.placeIdLevel(placeId))).toString();
      const placeQuestType = (
        await tx(readContracts.YourContract.playerQuestTypePerPlaceId(address, placeId))
      ).toString();
      const verifications = (await tx(readContracts.YourContract.placeIdToVerificationTimes(placeId))).toString();
      const energy = (await tx(readContracts.YourContract.energyPerPlace(placeId))).toString();
      const chip = (await tx(readContracts.YourContract.chipPerPlace(placeId))).toString();

      placeList.push({
        id: placeId,
        level: placeLevel,
        questType: placeQuestType,
        verifications: verifications,
        energy: energy,
        chip: chip,
      });
    }
    setPlaceList(placeList);
    console.log(placeList);
  };

  const getPlaceId = async () => {
    let placeIds = (await tx(readContracts.YourContract.getPlaceIdPerAddress())).toString();
    setPlacesIdArray(placeIds);
    //console.log(places);
  };

  const questTypePlace = async () => {
    let questType = (await tx(readContracts.YourContract.playerQuestTypePerPlaceId(address, 0))).toString();
    console.log("questType: ", questType);
  };

  const readLevelValue = async placeId => {
    const level = await tx(readContracts.YourContract.placeIdLevel(placeId));
    setLevel(level);
  };

  return (
    <div class="CityDivAll">
      <div class="CityMenu">
        <div class="CityBT">New Place</div>
        <div class="CityBT">My places</div>
        <div class="CityBT" onClick={questTypePlace}>
          My city places
        </div>
        <div class="CityBT" onClick={UpdatePlaceList}>
          Visit other cities TBR
        </div>
      </div>
      <div class="CityPlaces3">
        <div class="PlaceQuest">
          <div class="QuestIc">🏙️</div>My City places
        </div>      
        {placeList.map(place => (
          <div class="CityPL">
            <div class="PLheader">
              <div class="PLtitle">Unverified Park</div>
              <div class="PLlevel">{`Lv${place.level}`}</div>
            </div>
            <img
              src="https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/1-Basketball-Court.png"
              class="PLimage"
            />
            <div class="PLfooter">
              <div class="PLtitle">{`${place.verifications}/20👍`}</div>
              <div class="PLlevel">{`${place.energy ?? ""}/10⚡`}</div>
              <div class="PLlevel">{`${place.chip ?? ""}/10💽`}</div>
            </div>
          </div>
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
