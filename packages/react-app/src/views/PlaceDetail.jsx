import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PunkCityABI } from "../contracts/PunkCity";
require("dotenv").config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractAddressLocal = "0x6eADdF3D52c51d4bd032f9e6986721f173495E76"; // to find a better way to retrieve this address
const contractInstance = new web3.eth.Contract(PunkCityABI, contractAddressLocal);

export default function MyPlaces() {
  let { id } = useParams();

  // setting-up all the dynamic variables
  const [registerAddress, setRegisterAddress] = useState("");
  const formatAddress = address => {
    const stringAddress = `${address}`;
    const newAddress = stringAddress.substring(0, 5) + "..." + stringAddress.substring(38, 42);
    return newAddress;
  };
  let displayAddress = registerAddress?.substr(0, 5) + "..." + registerAddress?.substr(-4);
  const [placeId, setPlaceId] = useState(0);
  const [changeId, setChangeId] = useState(false);
  const [placeLevel, setPlaceLevel] = useState(0);
  const [placeQuestType, setPlaceQuestType] = useState(0);
  const [verifications, setVerifications] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [chip, setChip] = useState(0);
  const [verifiers, setVerifiers] = useState([]);
  const [questTypePerVerifiers, setQuestTypePerVerifiers] = useState([]);
  const [ipfsResponse, setIpfsResponse] = useState(null);
  const [uri, setUri] = useState(null);

  if (!changeId) {
    setPlaceId(id);
    setChangeId(true);
  }

  const currentRegisterAddress = async id => {
    const currentRegisterAddress = await contractInstance.methods.placeIdToRegisterAddress(id).call();
    return currentRegisterAddress;
  };

  const loadPlaceLevel = async id => {
    const placeLevel = (await contractInstance.methods.placeIdLevel(id).call()).toString();
    return placeLevel;
  };

  const loadVerifications = async id => {
    const verifications = (await contractInstance.methods.placeIdToVerificationTimes(id).call()).toString();
    return verifications;
  };
  const loadEnergy = async id => {
    const energy = (await contractInstance.methods.energyPerPlace(id).call()).toString();
    return energy;
  };
  const loadChip = async id => {
    const chip = (await contractInstance.methods.chipPerPlace(id).call()).toString();
    return chip;
  };
  const loadQuestTypePerAddress = async (id, address) => {
    const questType = (await contractInstance.methods.playerQuestTypePerPlaceId(address, id).call()).toString();
    if (questType === "0") {
      return "Solarpunk";
    } else {
      return "Cryptopunk";
    }
  };
  const loadVerifiers = async id => {
    const verifiers = await contractInstance.methods.getVerifiers(id).call();
    const registerAddress = await currentRegisterAddress(placeId);
    const verifiersWithoutRegister = verifiers.filter(verifier => verifier != registerAddress);
    return verifiersWithoutRegister;
  };
  const loadURI = async id => {
    const uri = await contractInstance.methods.uri(id).call();
    return uri;
  };

  useEffect(async () => {
    const registerAddress = await currentRegisterAddress(placeId);
    setRegisterAddress(registerAddress);

    const placeLevel = await loadPlaceLevel(placeId);
    setPlaceLevel(placeLevel);

    //const placeQuestType = await loadPlaceQuestType(placeId);
    //setPlaceQuestType(placeQuestType);

    const verifications = await loadVerifications(placeId);
    setVerifications(verifications);

    const energy = await loadEnergy(placeId);
    setEnergy(energy);

    const chip = await loadChip(placeId);
    setChip(chip);

    const verifiers = await loadVerifiers(placeId);
    setVerifiers(verifiers);
    console.log(`verifiers: ${verifiers}`);

    const newList = [];
    for (let i = 0; i < verifiers.length; i++) {
      const questType = await loadQuestTypePerAddress(placeId, verifiers[i]);
      newList.push(questType);
    }
    setQuestTypePerVerifiers(newList);
    console.log(`questTypePerVerifiers: ${questTypePerVerifiers}`);

    // retrievening the uri object from the ipfs
    const uri = await loadURI(placeId);
    setUri(uri);
    const uriUpdated = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
    const file = await fetch(uriUpdated);
    const ipfsResponse = await file.json();
    setIpfsResponse(ipfsResponse);
  }, []);

  return (
    <div class="CityDiv">
      <div class="CityMenu">
        <a class="CityBT" href="../NewPlace">
          New Place
          <img
            src={"https://punkcities.mypinata.cloud/ipfs/QmYpNQUw9Pw48amwLnjjS7rDXRCB1xfo8DLZUJNnkYeQVo"}
            class="homevan"
          />
        </a>
        <a class="CityBT" href="../MyPlaces">
          My places
          <img
            src={"https://punkcities.mypinata.cloud/ipfs/QmcbcgbhvpznC8zns7zRY5KKN1WvS1QQ7t1M3BaPjfUE9E"}
            class="homevan"
          />
        </a>
        <a class="CityBT" href="../CityPlaces">
          My city places
          <img
            src={"https://punkcities.mypinata.cloud/ipfs/QmSm6Ec8xEBTEB6ATkVmPybw4VRLiapm9K9fxLLxthgvq4"}
            class="homevan"
          />
        </a>
        <a class="CityBT" type="submit" href="../debug">
          🧙🏽 Wizard Mode (Hard){" "}
          <img
            src={"https://punkcities.mypinata.cloud/ipfs/QmREGJmweJGKqWHFM1oF8WnsgMc9gTSV8t4ZkFBk3aBsPx"}
            class="homevan"
          />
        </a>
      </div>
      <div class="PlaceAsset">
        <div class="AssetTl">
          <div class="">Santa Mónica Park</div>
          <div class="AssetLv">Level {placeLevel ?? "NA"}</div>
          <div class="">Querétaro, México</div>
        </div>
        <img src={`${ipfsResponse?.Image3D}`} class="PLDetail" />
        <div class="AssetData">
          <a class="GMaps" href={`${ipfsResponse?.address}`}>
            IRL Location{" "}
          </a>
          <div class="RgAddress">
            <div class="AssetRg">Registered by</div> {displayAddress ?? "NA"}
          </div>
        </div>
      </div>

      <div class="PlaceVer">
        <div class="SolVer">
          {" "}
          ?/25 Solarpunk <div class="AssetRg">to upgrade</div>
        </div>
        <div class="CybVer">
          {" "}
          ?/25 Cyberpunk <div class="AssetRg">to upgrade</div>
        </div>
        <a class="VerBt" href={`../VerifyPlace/${placeId}`}>
          👍 Verify
        </a>
        <div class="SolVer">
          {energy ?? "0"}/2⚡Energy<div class="AssetRg">to upgrade</div>
        </div>
        <div class="CybVer">
          {chip ?? "0"}/2💽 Chips<div class="AssetRg">to upgrade</div>
        </div>
        <a class="VerBt" href={`../UpgradePlace/${placeId}`}>
          ⚡Deposit 💽
        </a>

        <div class="Verigrid">
          <div class="VeriTl">Verifiers</div>
          {verifiers.map((verifier, i) => (
            <React.Fragment>
              <div>{formatAddress(verifier)}</div>
              <div>{questTypePerVerifiers[i] ?? ""}</div>
              <div></div>
              <div></div>
              <div>0⚡</div>
            </React.Fragment>
          ))}

          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
