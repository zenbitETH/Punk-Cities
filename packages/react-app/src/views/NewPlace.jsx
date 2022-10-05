import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { PunkCityABI } from "../contracts/PunkCity";
import mime from "mime/lite";
import { NFTStorage, File } from "nft.storage";
require("dotenv").config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractAddressLocal = "0x7Afc190ea94f920563d057B868376fA7705D0f4C"; // to find a better way to retrieve this address
const contractInstance = new web3.eth.Contract(PunkCityABI, contractAddressLocal);

const IPFS = require("ipfs-mini");
const ipfs = new IPFS({ host: "ipfs.infura.io", port: 5001, protocol: "https" });

//list to update
const convertPlaceType = placeInput => {
  if (placeInput === "⛲ Public Park") {
    return 0;
  } else if (placeInput === "🛹 Skate Park") {
    return 1;
  } else if (placeInput === "⚽ Soccer Field") {
    return 2;
  } else if (placeInput === "🏀 Basketball Court") {
    return 3;
  } else if (placeInput === "😄 Playground") {
    return 4;
  } else if (placeInput === "🏋️‍♀️ Outdoor Gym") {
    return 5;
  } else if (placeInput === "🎭 Art Gallery / Museum") {
    return 6;
  } else if (placeInput === "🏟️ Stadium") {
    return 7;
  } else if (placeInput === "🏖️ Beach") {
    return 8;
  } else if (placeInput === "♻️ Recycling Deposit") {
    return 9;
  } else if (placeInput === "🚏 Bus stop") {
    return 10;
  } else if (placeInput === "📚 Library") {
    return 11;
  } else if (placeInput === "🎓 University") {
    return 12;
  } else if (placeInput === "⛪ Church or Temple") {
    return 13;
  } else if (placeInput === "🗳️ Government Office") {
    return 14;
  } else if (placeInput === "🌳 Tree") {
    return 15;
  } else {
    return 0;
  }
};

const formatPlaceType = placeInput => {
  if (placeInput === "⛲ Public Park") {
    return "Public Park";
  } else if (placeInput === "🛹 Skate Park") {
    return "Skate Park";
  } else if (placeInput === "⚽ Soccer Field") {
    return "Soccer Field";
  } else if (placeInput === "🏀 Basketball Court") {
    return "Basketball court";
  } else if (placeInput === "😄 Playground") {
    return "Playground";
  } else if (placeInput === "🏋️‍♀️ Outdoor Gym") {
    return "Outdoor gym";
  } else if (placeInput === "🎭 Art Gallery / Museum") {
    return "Art Gallery / Museum";
  } else if (placeInput === "🏟️ Stadium") {
    return "Stadium";
  } else if (placeInput === "🏖️ Beach") {
    return "Beach";
  } else if (placeInput === "♻️ Recycling Deposit") {
    return "Recycling Deposit";
  } else if (placeInput === "🚏 Bus stop") {
    return "Bus Stop";
  } else if (placeInput === "📚 Library") {
    return "Library";
  } else if (placeInput === "🎓 University") {
    return "University";
  } else if (placeInput === "⛪ Church or Temple") {
    return "Church or Temple";
  } else if (placeInput === "🗳️ Government Office") {
    return "Government Office";
  } else if (placeInput === "🌳 Tree") {
    return "Tree";
  } else {
    return "NA";
  }
};

const returnImagePerPlace = placeInput => {
  if (placeInput === "⛲ Public Park") {
    return "https://bafybeids5w4e7ybnw5mfpvvsevhllutfkjkbfhhfjft6ff36qwh3ldbj5q.ipfs.nftstorage.link/0-Public-Park.png";
  } else if (placeInput === "🛹 Skate Park") {
    return "https://bafybeids5w4e7ybnw5mfpvvsevhllutfkjkbfhhfjft6ff36qwh3ldbj5q.ipfs.nftstorage.link/1-Skate-Park.png";
  } else if (placeInput === "⚽ Soccer Field") {
    return "https://bafybeids5w4e7ybnw5mfpvvsevhllutfkjkbfhhfjft6ff36qwh3ldbj5q.ipfs.nftstorage.link/2-Soccer-Court.png";
  } else if (placeInput === "🏀 Basketball Court") {
    return "https://bafybeids5w4e7ybnw5mfpvvsevhllutfkjkbfhhfjft6ff36qwh3ldbj5q.ipfs.nftstorage.link/3-Basketball-Court.png";
  } else if (placeInput === "😄 Playground") {
    return "https://bafybeids5w4e7ybnw5mfpvvsevhllutfkjkbfhhfjft6ff36qwh3ldbj5q.ipfs.nftstorage.link/4-Kids-Playground.png";
  } else if (placeInput === "🏋️‍♀️ Outdoor Gym") {
    return "https://bafybeids5w4e7ybnw5mfpvvsevhllutfkjkbfhhfjft6ff36qwh3ldbj5q.ipfs.nftstorage.link/5-Open-air-Gym.png";
  } else if (placeInput === "🎭 Art Gallery / Museum") {
    return "https://bafybeids5w4e7ybnw5mfpvvsevhllutfkjkbfhhfjft6ff36qwh3ldbj5q.ipfs.nftstorage.link/6-Art-Gallery.png";
  } else if (placeInput === "🏟️ Stadium") {
    return "https://bafybeids5w4e7ybnw5mfpvvsevhllutfkjkbfhhfjft6ff36qwh3ldbj5q.ipfs.nftstorage.link/7-Stadium.png";
  } else if (placeInput === "🏖️ Beach") {
    return "https://bafybeids5w4e7ybnw5mfpvvsevhllutfkjkbfhhfjft6ff36qwh3ldbj5q.ipfs.nftstorage.link/8-Bech.png";
  } else if (placeInput === "♻️ Recycling Deposit") {
    return "https://bafybeids5w4e7ybnw5mfpvvsevhllutfkjkbfhhfjft6ff36qwh3ldbj5q.ipfs.nftstorage.link/9-Recycling-center.png";
  } else if (placeInput === "🚏 Bus stop") {
    return "https://bafybeids5w4e7ybnw5mfpvvsevhllutfkjkbfhhfjft6ff36qwh3ldbj5q.ipfs.nftstorage.link/10-Bus-Stop.png";
  } else if (placeInput === "📚 Library") {
    return "https://bafybeids5w4e7ybnw5mfpvvsevhllutfkjkbfhhfjft6ff36qwh3ldbj5q.ipfs.nftstorage.link/11-Library.png";
  } else if (placeInput === "🎓 University") {
    return "https://bafybeids5w4e7ybnw5mfpvvsevhllutfkjkbfhhfjft6ff36qwh3ldbj5q.ipfs.nftstorage.link/12-University.png";
  } else if (placeInput === "⛪ Church or Temple") {
    return "https://bafybeids5w4e7ybnw5mfpvvsevhllutfkjkbfhhfjft6ff36qwh3ldbj5q.ipfs.nftstorage.link/13-Temple.png";
  } else if (placeInput === "🗳️ Government Office") {
    return "https://bafybeids5w4e7ybnw5mfpvvsevhllutfkjkbfhhfjft6ff36qwh3ldbj5q.ipfs.nftstorage.link/14-Goverment%20office.png";
  } else if (placeInput === "🌳 Tree") {
    return "https://bafybeids5w4e7ybnw5mfpvvsevhllutfkjkbfhhfjft6ff36qwh3ldbj5q.ipfs.nftstorage.link/15-Tree.png";
  } else {
    return "https://bafybeids5w4e7ybnw5mfpvvsevhllutfkjkbfhhfjft6ff36qwh3ldbj5q.ipfs.nftstorage.link/0-Public-Park.png";
  }
};

const convertQuestType = questInput => {
  if (questInput === "1 Solarpunk (+1⚡)") {
    return 0;
  } else {
    return 1;
  }
};

const formatQuestType = questInput => {
  if (questInput === "1 Solarpunk (+1⚡)") {
    return "Solarpunk";
  } else {
    return "Cyberpunk";
  }
};

export default function NewPlace({ address }) {
  const [name, setName] = useState("");
  const [placeType, setPlaceType] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [tag, setTag] = useState("");
  const [city, setCity] = useState("");
  const [questType, setQuestType] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [buffer, setBuffer] = useState(null);
  const [image, setImage] = useState(null);
  const [Image3D, setImage3D] = useState(null);

  const handleNameChange = e => setName(e.target.value);
  const handlePlaceTypeChange = e => {
    setPlaceType(e.target.value);
    const image3D = returnImagePerPlace(e.target.value);
    setImage3D(image3D);
    //Is this the correct way to set the 3d asset url? //
    const image3DWithourUrl = image3D.replace(
      "https://bafybeids5w4e7ybnw5mfpvvsevhllutfkjkbfhhfjft6ff36qwh3ldbj5q.ipfs.nftstorage.link/",
      "ipfs://",
    );
    setImage(image3DWithourUrl);
  };
  const handleAddressChange = e => setStreetAddress(e.target.value);
  const handleTagChange = e => setTag(e.target.value);
  const handleQuestTypeChange = e => setQuestType(e.target.value);
  const handleCityChange = e => setCity(e.target.value);

  const captureFile = event => {
    console.log("capturing file...");
    const file = event.target.files[0]; // access to the file
    const reader = new FileReader();
    reader.readAsArrayBuffer(file); // read the file as an ArrayBuffer so that it can be uplaode to ipfs
    reader.onloadend = async () => {
      const buffer = Buffer(reader.result);
      setBuffer(buffer);
      const image = new File([buffer], file.name, {
        contentType: mime.getType(file.name),
      });
      setUploadedImage(image);
      console.log(image);
    };
  };

  const registerPlace = async () => {
    const client = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE_TOKEN });
    const placeId = await contractInstance.methods.placeId().call();

    const imageURL = await client.store({
      name: "image",
      description: "image uploaded on punk cities",
      image: uploadedImage,
    });

    const metadata = {
      version: "1.0.0",
      tokenID: placeId,
      metadata_id: uuidv4(),
      content: "Content",
      name: name,
      description: "This is a place description",
      uploadedImage: imageURL.url,
      image: image,
      imageMimeType: "image/png",
      image3D: Image3D,
      address: streetAddress,
      tag: tag,
      attributes: [
        {
          trait_type: "city",
          value:(city),
        },
        {
          trait_type: "place_type",
          value: formatPlaceType(placeType),
        },
        {
          trait_type: "quest_type",
          value: formatQuestType(questType),
        },
      ],
      appId: "punkcities",
    };

    const metadataString = JSON.stringify(metadata);
    const cid = await ipfs.add(metadataString);
    const url = `ipfs://${cid}`;

    let placeInput = convertPlaceType(placeType);
    let questInput = convertQuestType(questType);

    try {
      const transactionParams = {
        from: address,
        to: contractAddressLocal,
        data: contractInstance.methods.registerPlace(placeInput, questInput, url).encodeABI(),
      };
      await web3.eth.sendTransaction(transactionParams);
    } catch (err) {
      console.log(err);
    }

    //tx(writeContracts.PunkCity.registerPlace(placeInput, questInput, url));
  };

  return (
    <div class="HomeDiv">
      <div class="container">
        <div class="NewGame-title">New Place</div>
        <div class="inputs">
          <div class="split">
            <label for="TypeOfPlace">Type of place:
            <select id="TypeOfPlace" type="text" placeholder="Park" onChange={handlePlaceTypeChange}>
              <option disabled selected>
                The place is a...
              </option>
              <option>⛲ Public Park</option>
              <option>🛹 Skate Park</option>
              <option>⚽ Soccer Field</option>
              <option>🏀 Basket Court</option>
              <option>😄 Playground</option>
              <option>🏋️‍♀️ Outdoor Gym</option>
              <option>🎭 Art Gallery / Museum</option>
              <option>🏟️ Stadium</option>
              <option>🏖️ Beach</option>
              <option>♻️ Recycling Deposit</option>
              <option>🚏 Bus stop</option>
              <option>📚 Library</option>
              <option>🎓 University</option>
              <option>⛪ Church or Temple</option>
              <option>🗳️ Government Office</option>
              <option>🌳 Tree</option>
            </select>
            </label>
            <label>Name:
              <input type="text" placeholder="its name is..." onChange={handleNameChange} />
            </label>
          </div>
          <label>Address</label>
          <input type="text" placeholder="Paste the Address from google maps" onChange={handleAddressChange} />
          
          <select id="city" type="text" placeholder="Choose your city" onChange={handleCityChange}>
            <option disabled selected>
              Choose your city
            </option>
            <option>Querétaro, México</option>
            <option>CDMX, México</option>
            <option>Bogotá, Colombia</option>
          </select>

          <label>Tags</label>
          <input type="text" placeholder="Camping, Climbing, Nature" onChange={handleTagChange} />
          <label class="file">
            Take and upload a photo to IPFS
            <input type="file" onChange={captureFile} />
          </label>
          <label>Choose your quest in this place:</label>
          
          <select id="TypeOfPlace" type="text" placeholder="Park" onChange={handleQuestTypeChange}>
            <option disabled selected>
              The quest defines the reward!
            </option>
            <option>1 Solarpunk (+1⚡)</option>
            <option>2 Cyberpunk (+1💽)</option>
          </select>
        </div>

        <div class="CreatePL" type="submit" onClick={registerPlace}>
          Register New Place
        </div>
      </div>
    </div>
  );
}
