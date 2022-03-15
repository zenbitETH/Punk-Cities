import React, { useState } from "react";

import asset from "../assets/parktest.png";

export default function MyPlaces({ address, readContracts, writeContracts, tx }) {
  const [placeId, setPlaceId] = useState(0);
  const [placeDetail, setPlaceDetail] = useState({
    id: 0,
    level: 0,
    questType: 0,
    verifications: 0,
    energy: 0,
    chip: 0,
    register: 0,
    verifiers: [],
  });

  const UpdatePlaceDetail = async () => {
    const placeDetail = {};

    const placeLevel = (await tx(readContracts.YourContract.placeIdLevel(placeId))).toString();
    const placeQuestType = (
      await tx(readContracts.YourContract.playerQuestTypePerPlaceId(address, placeId))
    ).toString();
    const verifications = (await tx(readContracts.YourContract.placeIdToVerificationTimes(placeId))).toString();
    const energy = (await tx(readContracts.YourContract.energyPerPlace(placeId))).toString();
    const chip = (await tx(readContracts.YourContract.chipPerPlace(placeId))).toString();
    //const register = (await tx(readContracts.YourContract.placeIdToRegisterAddress(placeId))).toString();
    const verifiers = await tx(readContracts.YourContract.getVerifiers(placeId));
    const register = verifiers[0];
    const verifiersWithoutRegister = verifiers.slice(1);

    placeDetail.id = placeId;
    placeDetail.level = placeLevel;
    placeDetail.questType = placeQuestType;
    placeDetail.verifications = verifications;
    placeDetail.energy = energy;
    placeDetail.chip = chip;
    placeDetail.register = register;
    placeDetail.verifiers = verifiersWithoutRegister;

    setPlaceDetail(placeDetail);
  };
  return (
    <div class="CityDiv">
      <div class="CityMenu">
        <a class="CityBT" type="submit" href="./NewPlace">
          New Place
        </a>
        <a class="CityBT" type="submit" href="./MyPlaces">
          My places
        </a>
        <a class="CityBT" type="submit" href="./CityPlaces">
          My city places
        </a>
        <a class="CityBT" type="submit" href="./debug">
          🧙🏽 Wizard Mode (Hard)
        </a>
        <a class="CityBT" type="submit" onClick={UpdatePlaceDetail}>
          🧙🏽 Refresh (Hard)
        </a>
      </div>
      <div class="PlaceAsset">
        <div class="AssetTl">
          <div class="">Name of the place</div>
          <div class="AssetLv">{`Level ${placeDetail.level ?? ""}`}</div>
          <div class="">City</div>
        </div>
        <img
          src="https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/28-Tech-Cluster.png"
          class="PLDetail"
        />
        <div class="AssetData">
          <div class="GMaps">Address from Google Maps</div>
          <div class="RgAddress">
            <div class="AssetRg">Registered by {`${placeDetail.register ?? ""}`}</div>
          </div>
        </div>
      </div>

      <div class="PlaceVer">
        <div class="SolVer">
          15/100 Solarpunk <div class="AssetRg">to upgrade</div>
        </div>
        <div class="CybVer">
          25/100 Cyberpunk <div class="AssetRg">to upgrade</div>
        </div>
        <a class="VerBt" href="./VerifyPlace">
          👍 Verify
        </a>
        <div class="SolVer">
          {`${placeDetail.energy ?? ""}/50⚡Energy`}
          <div class="AssetRg">to upgrade</div>
        </div>
        <div class="CybVer">
          {`${placeDetail.chip ?? ""}/50💽 Chips`}
          <div class="AssetRg">to upgrade</div>
        </div>
        <a class="VerBt" href="./UpgradePlace">
          ⚡Deposit 💽
        </a>

        <div class="Verigrid">
          <div class="VeriTl">Verifiers</div>
          {placeDetail.verifiers.map(verifiers => (
            <div>
              <div>`${verifiers}`</div>
              <div>Solarpunk</div>
              <div>📜</div>
              <div>📸</div>
            </div>
          ))}
          {/* <div>Address</div>
          <div>Solarpunk</div>
          <div>📜</div>
          <div>📸</div>
          <div>2⚡</div>
          <div>Address</div>
          <div>Cyberpunk</div>
          <div>📜</div>
          <div>📸</div>
          <div>1💽</div>
          <div>Address</div>
          <div>Cyberpunk</div>
          <div>📜</div>
          <div>📸</div>
          <div>1💽</div>
          <div>Address</div>
          <div>Solarpunk</div>
          <div>📜</div>
          <div>📸</div>
          <div>1⚡</div>
          <div>Address</div>
          <div>Solarpunk</div>
          <div>📜</div>
          <div>📸</div>
          <div>1⚡</div>
          <div>Address</div>
          <div>Cyberpunk</div>
          <div>📜</div>
          <div>📸</div>
          <div>1💽</div> */}
        </div>
      </div>
    </div>
  );
}
