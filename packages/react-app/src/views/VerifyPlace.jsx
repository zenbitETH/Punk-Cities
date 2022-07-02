import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PunkCityABI } from "../contracts/PunkCity";
require("dotenv").config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractAddressLocal = "0x7Afc190ea94f920563d057B868376fA7705D0f4C"; // to find a better way to retrieve this address
const contractInstance = new web3.eth.Contract(PunkCityABI, contractAddressLocal);

const convertQuestType = questInput => {
  if (questInput === "1 Solarpunk (+1⚡)") {
    return 0;
  } else {
    return 1;
  }
};

export default function VerifyPlace({ address }) {
  let { id } = useParams();
  const [name, setName] = useState("");
  const [addressPlace, setAddressPlace] = useState("");
  const [register, setRegister] = useState("");
  const [placeType, setPlaceType] = useState("");
  const [tag, setTag] = useState("");
  const [questType, setQuestType] = useState("");
  const [placeId, setPlaceId] = useState();
  const [ipfsResponse, setIpfsResponse] = useState();
  const [changeId, setChangeId] = useState(false);

  if (!changeId) {
    setPlaceId(id);
    const loadPlaceIdDetail = async () => {
      const placeDetail = await contractInstance.methods.placeIdToPlaceDetail(id).call();
      console.log("placeDetail: ", placeDetail);
      //setName(placeDetail[0]);
      setRegister(placeDetail.registerAddress);
    };

    const loadURI = async id => {
      const uri = await contractInstance.methods.uri(id).call();
      const uriUpdated = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
      const file = await fetch(uriUpdated);
      const ipfsResponse = await file.json();
      setIpfsResponse(ipfsResponse);
    };

    loadPlaceIdDetail();
    loadURI(id);
    setChangeId(true);
  }

  const handlePlaceTypeChange = e => setPlaceType(e.target.value);

  const verifyPlace = async () => {
    console.log("verifying place...");
    const questInput = convertQuestType(questType);
    const transactionParams = {
      from: address,
      to: contractAddressLocal,
      data: contractInstance.methods.verifyPlace(placeId, questInput).encodeABI(),
    };

    try {
      const tx = await web3.eth.sendTransaction(transactionParams);
      console.log("tx: ", tx);
      return {
        status: ` ✅{" "}

        View the status of your transaction on Etherscan!


      ℹ️ Once the transaction is verified by the network, the message will
      be updated automatically.`,
      };
    } catch (err) {
      console.log("err: ", err);
    }

    //const verifyTx = await contractInstance.methods.verifyPlace(placeId, questInput).call();
  };

  return (
    <div class="HomeDiv">
      <div class="NewGame">
        <div class="container2">
          <div class="VerifyPlace">👍</div>
          <div class="NewGame-title">Verify this place</div>
          <div class="PlaceData">
            <div>Type of Place:{ipfsResponse?.attributes[0].value}</div>
            <div>Name: {ipfsResponse?.name}</div>
            <div>City:</div>
            <div>Address: {ipfsResponse?.address}</div>
            <div>Registered by: {register}</div>
            <div>Current tags: {ipfsResponse?.tag}</div>
          </div>
          <div class="inputs2">
            {/* <label>
              Confirm or add Tags
              <input type="text" placeholder="Camping, Climbing, Nature" onChange={handleTagChange} />
            </label> */}

            <label>
              Choose your quest in this place:
              <select id="TypeOfPlace" type="text" placeholder="Park" onChange={handlePlaceTypeChange}>
                <option disabled selected>
                  The quest defines the reward!
                </option>
                <option>1 Solarpunk (+1⚡)</option>
                <option>2 Cyberpunk (+1💽)</option>
              </select>
            </label>
          </div>
          {/* <label class="file">
            Take and upload a photo to IPFS
            <input type="file" />
            <div class="UploadBt"> Upload to IPFS</div>
          </label> */}
          <div class="CreatePL" type="submit" onClick={verifyPlace}>
            Verify Place
          </div>
        </div>
      </div>
    </div>
  );
}
