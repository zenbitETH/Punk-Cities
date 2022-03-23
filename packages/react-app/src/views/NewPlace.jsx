import React, { useState } from "react";
import mime from "mime/lite";
require("dotenv").config();
const IPFS = require("ipfs-mini");
const ipfs = new IPFS({ host: "ipfs.infura.io", port: 5001, protocol: "https" });

//list to update
const convertPlaceType = placeInput => {
  if (placeInput === "1 Basketball court") {
    return 0;
  } else if (placeInput === "2 Bus Stop") {
    return 1;
  } else if (placeInput === "3 City Hall") {
    return 2;
  } else if (placeInput === "4 Cityzen Theater") {
    return 3;
  } else if (placeInput === "5 Community center") {
    return 4;
  } else if (placeInput === "6 Fireman Station") {
    return 5;
  } else if (placeInput === "7 Hospital") {
    return 6;
  } else if (placeInput === "8 Kid´s playground") {
    return 7;
  } else if (placeInput === "9 Landmark") {
    return 8;
  } else if (placeInput === "10 Open-air gym") {
    return 9;
  } else if (placeInput === "11 Police Station") {
    return 10;
  } else if (placeInput === "12 Public Park") {
    return 11;
  } else if (placeInput === "13 Soccer court") {
    return 12;
  } else if (placeInput === "14 Stadium") {
    return 13;
  } else if (placeInput === "15 Temple") {
    return 14;
  } else if (placeInput === "16 Art Gallery") {
    return 15;
  } else if (placeInput === "17 Beach") {
    return 16;
  } else if (placeInput === "18 Bike Road") {
    return 17;
  } else if (placeInput === "19 Camping site") {
    return 18;
  } else if (placeInput === "20 Museum") {
    return 19;
  } else if (placeInput === "21 Recycling can") {
    return 20;
  } else if (placeInput === "22 Skate Park") {
    return 21;
  } else if (placeInput === "23 Library") {
    return 22;
  } else if (placeInput === "24 University") {
    return 23;
  } else if (placeInput === "25 Co-working space") {
    return 24;
  } else if (placeInput === "26 Industrial Park") {
    return 25;
  } else if (placeInput === "27 Tech company") {
    return 26;
  } else if (placeInput === "28 Technology Cluster") {
    return 27;
  } else {
    return 0;
  }
};

const formatPlaceType = placeInput => {
  if (placeInput === "1 Basketball court") {
    return "Basketball court";
  } else if (placeInput === "2 Bus Stop") {
    return "Bus Stop";
  } else if (placeInput === "3 City Hall") {
    return "City Hall";
  } else if (placeInput === "4 Cityzen Theater") {
    return "Cityzen Theater";
  } else if (placeInput === "5 Community center") {
    return "Community center";
  } else if (placeInput === "6 Fireman Station") {
    return "Fireman Station";
  } else if (placeInput === "7 Hospital") {
    return "Hospital";
  } else if (placeInput === "8 Kid´s playground") {
    return "Kid´s playground";
  } else if (placeInput === "9 Landmark") {
    return "Landmark";
  } else if (placeInput === "10 Open-air gym") {
    return "Open-air gym";
  } else if (placeInput === "11 Police Station") {
    return "Police Station";
  } else if (placeInput === "12 Public Park") {
    return "Public Park";
  } else if (placeInput === "13 Soccer court") {
    return "Soccer court";
  } else if (placeInput === "14 Stadium") {
    return "Stadium";
  } else if (placeInput === "15 Temple") {
    return "Temple";
  } else if (placeInput === "16 Art Gallery") {
    return 15;
  } else if (placeInput === "17 Beach") {
    return "Art Gallery";
  } else if (placeInput === "18 Bike Road") {
    return "Bike Road";
  } else if (placeInput === "19 Camping site") {
    return "Camping site";
  } else if (placeInput === "20 Museum") {
    return "Museum";
  } else if (placeInput === "21 Recycling can") {
    return "Recycling can";
  } else if (placeInput === "22 Skate Park") {
    return "Skate Park";
  } else if (placeInput === "23 Library") {
    return "Library";
  } else if (placeInput === "24 University") {
    return "University";
  } else if (placeInput === "25 Co-working space") {
    return "Co-working space";
  } else if (placeInput === "26 Industrial Park") {
    return "Industrial Park";
  } else if (placeInput === "27 Tech company") {
    return "Tech company";
  } else if (placeInput === "28 Technology Cluster") {
    return "Technology Cluster";
  } else {
    return "NA";
  }
};

const returnImagePerPlace = placeInput => {
  if (placeInput === "1 Basketball court") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/1-Basketball-Court.png";
  } else if (placeInput === "2 Bus Stop") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/2-Bus-Stop.png";
  } else if (placeInput === "3 City Hall") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/3%20City%20Hall.png";
  } else if (placeInput === "4 Cityzen Theater") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/4-Citizen-Theatre.png";
  } else if (placeInput === "5 Community center") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/5-Community-Center.png";
  } else if (placeInput === "6 Fireman Station") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/6-Fireman-station.png";
  } else if (placeInput === "7 Hospital") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/7-Hospital.png";
  } else if (placeInput === "8 Kid´s playground") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/8-Kids-Playground.png";
  } else if (placeInput === "9 Landmark") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/9-Landmark.png";
  } else if (placeInput === "10 Open-air gym") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/10-Open-air-Gym.png";
  } else if (placeInput === "11 Police Station") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/11.Police-Station.png";
  } else if (placeInput === "12 Public Park") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/12.Public-Park.png";
  } else if (placeInput === "13 Soccer court") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/12.Public-Park.png";
  } else if (placeInput === "14 Stadium") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/14-Stadium.png";
  } else if (placeInput === "15 Temple") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/15-Temple.png";
  } else if (placeInput === "16 Art Gallery") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/16-Art-Gallery.png";
  } else if (placeInput === "17 Beach") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/17-Bech.png";
  } else if (placeInput === "18 Bike Road") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/18-Bike-Road.png";
  } else if (placeInput === "19 Camping site") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/19-camping-site.png";
  } else if (placeInput === "20 Museum") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/20-Museum.png";
  } else if (placeInput === "21 Recycling can") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/21-Recycling-center.png";
  } else if (placeInput === "22 Skate Park") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/22-Skate-Park.png";
  } else if (placeInput === "23 Library") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/23-Library.png";
  } else if (placeInput === "24 University") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/24-University.png";
  } else if (placeInput === "25 Co-working space") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/25-CoWorking-Space.png";
  } else if (placeInput === "26 Industrial Park") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/26-Industrial-Park.png";
  } else if (placeInput === "27 Tech company") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/27-Tech-Company.png";
  } else if (placeInput === "28 Technology Cluster") {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/28-Tech-Cluster.png";
  } else {
    return "https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/28-Tech-Cluster.png";
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

export default function NewPlace({ tx, writeContracts, readContracts }) {
  const [name, setName] = useState("");
  const [placeType, setPlaceType] = useState("");
  const [address, setAddress] = useState("");
  const [tag, setTag] = useState("");
  const [questType, setQuestType] = useState("");
  const [buffer, setBuffer] = useState(null);
  const [image, setImage] = useState(null);
  const [Image3D, setImage3D] = useState(null);

  const handleNameChange = e => setName(e.target.value);
  const handlePlaceTypeChange = e => {
    setPlaceType(e.target.value);
    const image3D = returnImagePerPlace(e.target.value);
    const image3DWithourUrl = image3D.replace("https://punkcities.mypinata.cloud/ipfs/", "ipfs://");
    setImage3D(image3DWithourUrl);
  };
  const handleAddressChange = e => setAddress(e.target.value);
  const handleTagChange = e => setTag(e.target.value);
  const handleQuestTypeChange = e => setQuestType(e.target.value);

  const registerPlace = async () => {
    const placeId = (await tx(readContracts.YourContract.placeId())).toString();

    const metadata = {
      tokenID: placeId,
      name: name,
      description: "This is a place description",
      image: Image3D,
      address: address,
      tag: tag,
      attributes: [
        {
          trait_type: "place_type",
          value: formatPlaceType(placeType),
        },
        {
          trait_type: "quest_type",
          value: formatQuestType(questType),
        },
      ],
    };

    const metadataString = JSON.stringify(metadata);
    const cid = await ipfs.add(metadataString);
    const url = `ipfs://${cid}`;

    let placeInput = convertPlaceType(placeType);
    let questInput = convertQuestType(questType);

    tx(writeContracts.YourContract.registerPlace(placeInput, questInput, url));
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
          <div class="NewPlace"></div>
          <div class="NewGame-title">New Place</div>
          <div class="inputs2">
            <label for="TypeOfPlace">
              Type of place: <br />
              <select id="TypeOfPlace" type="text" placeholder="Park" onChange={handlePlaceTypeChange}>
                <option disabled selected>
                  The place I want to register is...
                </option>
                <option>1 Basketball court</option>
                <option>2 Bus Stop</option>
                <option>3 City Hall</option>
                <option>4 Cityzen Theater</option>
                <option>5 Community center</option>
                <option>6 Fireman Station</option>
                <option>7 Hospital</option>
                <option>8 Kid´s playground</option>
                <option>9 Landmark</option>
                <option>10 Open-air gym</option>
                <option>11 Police Station</option>
                <option>12 Public Park</option>
                <option>13 Soccer court</option>
                <option>14 Stadium</option>
                <option>15 Temple</option>
                <option>16 Art Gallery</option>
                <option>17 Beach</option>
                <option>18 Bike Road</option>
                <option>19 Camping site</option>
                <option>20 Museum</option>
                <option>21 Recycling can</option>
                <option>22 Skate Park</option>
                <option>23 Library</option>
                <option>24 University</option>
                <option>25 Co-working space</option>
                <option>26 Industrial Park</option>
                <option>27 Tech company</option>
                <option>28 Technology Cluster</option>
              </select>
            </label>

            <label>
              Name:
              <input type="text" placeholder="How this place is named in your city?" onChange={handleNameChange} />
            </label>

            <label>
              Address
              <input type="text" placeholder="Paste the Address from google maps" onChange={handleAddressChange} />
            </label>

            <label>
              Tags
              <input type="text" placeholder="Camping, Climbing, Nature" onChange={handleTagChange} />
            </label>

            <label>
              Choose your quest in this place:
              <select id="TypeOfPlace" type="text" placeholder="Park" onChange={handleQuestTypeChange}>
                <option disabled selected>
                  The quest defines the reward!
                </option>
                <option>1 Solarpunk (+1⚡)</option>
                <option>2 Cyberpunk (+1💽)</option>
              </select>
            </label>
          </div>
          <div class="CreatePL" type="submit" onClick={registerPlace}>
            Register New Place
          </div>
        </div>
      </div>
    </div>
  );
}
