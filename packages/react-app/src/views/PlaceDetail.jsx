import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PunkCityABI } from "../contracts/PunkCity";
require("dotenv").config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractAddressLocal = "0x7Afc190ea94f920563d057B868376fA7705D0f4C"; // to find a better way to retrieve this address
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
  const [verifications, setVerifications] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [chip, setChip] = useState(0);
  const [verifiers, setVerifiers] = useState([]);
  const [questTypePerVerifiers, setQuestTypePerVerifiers] = useState([]);
  const [ipfsResponse, setIpfsResponse] = useState(null);
  const [uri, setUri] = useState(null);
  const [updateRequired, setUpdateRequire] = useState(false);
  const [solarpunkVerificationsPerPlaceId, setSolarpunkVerificationsPerPlaceId] = useState(0);
  const [cyberpunkVerificationsPerPlaceId, setCyberpunkVerificationsPerPlaceId] = useState(0);

  if (!changeId) {
    setPlaceId(id);
    setChangeId(true);
  }

  useEffect(async () => {
    setUpdateRequire(true);
  }, []);

  const currentRegisterAddress = async id => {
    const currentRegisterAddress = await contractInstance.methods.placeIdToRegisterAddress(id).call();
    return currentRegisterAddress;
  };

  const loadPlaceIdDetail = async () => {
    const placeDetail = await contractInstance.methods.placeIdToPlaceDetail(placeId).call();
    return placeDetail;
  };

  const loadQuestTypePerAddress = async (id, address) => {
    const questType = (await contractInstance.methods.playerQuestTypePerPlaceId(address, id).call()).toString();
    if (questType === "0") {
      return "Solarpunk";
    } else {
      return "Cyberpunk";
    }
  };
  const loadVerifiers = async (id, register) => {
    const verifiers = await contractInstance.methods.getVerifiers(id).call();
    // const registerAddress = await currentRegisterAddress(placeId);
    const verifiersWithoutRegister = verifiers.filter(verifier => verifier != register);
    return verifiersWithoutRegister;
  };
  const loadURI = async id => {
    const uri = await contractInstance.methods.uri(id).call();
    return uri;
  };

  if (updateRequired) {
    const loadPlaceIdDetailNew = async () => {
      const placeDetail = await loadPlaceIdDetail();
      console.log(`placeDetail: ${placeDetail}`);

      setRegisterAddress(placeDetail.registerAddress);
      setPlaceLevel(placeDetail.placeIdLevel);
      setVerifications(placeDetail.verificationTimes);
      setEnergy(placeDetail.energyPerPlace);
      setChip(placeDetail.chipPerPlace);

      const verifiers = await loadVerifiers(placeId, placeDetail.registerAddress);
      setVerifiers(verifiers);

      const newList = [];
      for (let i = 0; i < verifiers.length; i++) {
        const questType = await loadQuestTypePerAddress(placeId, verifiers[i]);
        newList.push(questType);
      }
      setQuestTypePerVerifiers(newList);

      let totalSolarPunk = 0;
      let totalCyberPunk = 0;
      for (let i = 0; i < newList.length; i++) {
        if (newList[i] === "Solarpunk") {
          totalSolarPunk++;
        } else {
          totalCyberPunk++;
        }
      }
      setSolarpunkVerificationsPerPlaceId(totalSolarPunk);
      setCyberpunkVerificationsPerPlaceId(totalCyberPunk);

      // retrievening the uri object from the ipfs
      const uri = await loadURI(placeId);
      setUri(uri);
      const uriUpdated = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
      const file = await fetch(uriUpdated);
      const ipfsResponse = await file.json();
      setIpfsResponse(ipfsResponse);
    };
    loadPlaceIdDetailNew();
    setUpdateRequire(false);
  }

  return (
    <div class="CityDiv">
      <div class="PlaceAsset">
        <div class="AssetTl">
          <div class="">{`${ipfsResponse?.name} / ${ipfsResponse?.attributes[0].value}`}</div>
          <div class="AssetLv">Level {placeLevel ?? "NA"}</div>
          <div class=""></div>
        </div>
        <img src={`${ipfsResponse?.image3D}`} class="PLDetail" />
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
          {solarpunkVerificationsPerPlaceId}/25 Solarpunk <div class="AssetRg">to upgrade</div>
        </div>
        <div class="CybVer">
          {" "}
          {cyberpunkVerificationsPerPlaceId}/25 Cyberpunk <div class="AssetRg">to upgrade</div>
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
