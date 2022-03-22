import React, { useEffect, useState } from "react";
import { PunkCityABI } from "../contracts/PunkCity";
require("dotenv").config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractAddressLocal = "0x6eADdF3D52c51d4bd032f9e6986721f173495E76"; // to find a better way to retrieve this address
const contractInstance = new web3.eth.Contract(PunkCityABI, contractAddressLocal);

const convertQuestType = questInput => {
  if (questInput === "1 Solarpunk (+1⚡)") {
    return 0;
  } else {
    return 1;
  }
};

export default function VerifyPlace({ address }) {
  const [name, setName] = useState("");
  const [placeType, setPlaceType] = useState("");
  //const [address, setAddress] = useState("");
  const [tag, setTag] = useState("");
  const [questType, setQuestType] = useState("");
  const [placeId, setPlaceId] = useState(1);
  // const [buffer, setBuffer] = useState(null);
  // const [image, setImage] = useState(null);

  const handlePlaceTypeChange = e => setPlaceType(e.target.value);
  const handleTagChange = e => setTag(e.target.value);
  const handleQuestTypeChange = e => setQuestType(e.target.value);

  // const captureFile = event => {
  //   console.log("capturing file...");
  //   const file = event.target.files[0]; // access to the file
  //   const reader = new FileReader();
  //   reader.readAsArrayBuffer(file); // read the file as an ArrayBuffer so that it can be uplaode to ipfs
  //   reader.onloadend = async () => {
  //     const buffer = Buffer(reader.result);
  //     setBuffer(buffer);
  //     const image = new File(buffer, file.name, {
  //       contentType: mime.getType(file.name),
  //     });
  //     setImage(image);
  //   };
  // };

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
      <div class="CityMenu">
        <a class="CityBT" href="./PlaceDetail">
          Place Detail{" "}
          <img
            src={"https://punkcities.mypinata.cloud/ipfs/QmVqUZf959wuJ8dBMfcLAUfmRn5pLk8PSWQ1eDfqH2mK2V"}
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
      <div class="NewGame">
        <div class="container2">
          <div class="VerifyPlace">👍</div>
          <div class="NewGame-title">Verify this place</div>
          <div class="PlaceData">
            <div>Type of Place:</div>
            <div>Name:</div>
            <div>City:</div>
            <div>Address:</div>
            <div>Registered by:</div>
            <div>Current tags:</div>
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
