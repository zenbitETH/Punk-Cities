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
    <div class="AllDiv">
      <div class="verifyGrid">
      
        <div class="container2">
          <div class="verifyTl">Verify this place in {ipfsResponse?.attributes[0].value}:</div>
          <div class="AssetTl">
            <div class="">
              {`${ipfsResponse?.name} / ${ipfsResponse?.attributes[1].value}`}
            </div>
            <img src={`${ipfsResponse?.image3D}`} class="verifyIMG" />
          </div>
            
          <div class="PlaceData">
            <div class="longData">Registered by: {register}</div>
            <div class="longData">Tags: {ipfsResponse?.tag}</div>
            <div class="addressData">
              
              <a class="verifyData" href={ipfsResponse?.address}>
                <div>Verify adress in Google Maps</div>
                <div>Is this adress correct?</div>
              </a> 
              <div class="checkAddress">
                <input type="checkbox"/>
              </div>
            </div>
            
          </div>



            {/* <label>
              Confirm or add Tags
              <input type="text" placeholder="Camping, Climbing, Nature" onChange={handleTagChange} />
            </label> */}

            
          
          {/* <label class="file">
            Take and upload a photo to IPFS
            <input type="file" />
            <div class="UploadBt"> Upload to IPFS</div>
          </label> */}
          
        </div>

        <div class="PlaceAsset">
          
          {/*<img src="https://scontent.fgdl3-1.fna.fbcdn.net/v/t31.18172-8/14188557_1117437218340183_4220340886498305644_o.jpg?_nc_cat=109&ccb=1-7&_nc_sid=e3f864&_nc_ohc=3jKwNeLqRPUAX8njSEf&_nc_ht=scontent.fgdl3-1.fna&oh=00_AT8d6_cwYCVhqVB74dCHozGIpIDTIHFHQPieWomMS1Kmew&oe=62FF13F6" class="verifyIMG2" />*/}
          <img src={ipfsResponse?.image} class="PLimage"/>
        </div>
        <div class="btContainer">
        <label>
              You will recieve this reward:
              <div id="TypeOfPlace" type="text" onChange={handlePlaceTypeChange}>
                1 Energy Unit (+1⚡)
              </div>
            </label>
            <div class="CreatePL" type="submit" onClick={verifyPlace}>
            Verify Place
            </div>
          </div>
      </div>
    </div>
  );
}
