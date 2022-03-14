import React, { useState } from "react";
import mime from "mime/lite";
import { NFTStorage, File } from "nft.storage";

const convertPlaceType = placeInput => {
  if (placeInput === "restaurant") {
    return 0;
  } else if (placeInput === "hotel") {
    return 1;
  } else {
    return 2;
  }
};

const convertQuestType = questInput => {
  if (questInput === "Solarpunk") {
    return 0;
  } else {
    return 1;
  }
};

export default function VerifyPlace({ tx, writeContracts, readContracts }) {
  const [name, setName] = useState("");
  const [placeType, setPlaceType] = useState("");
  const [address, setAddress] = useState("");
  const [tag, setTag] = useState("");
  const [questType, setQuestType] = useState("");
  const [buffer, setBuffer] = useState(null);
  const [image, setImage] = useState(null);

  const handleNameChange = e => setName(e.target.value);
  const handlePlaceTypeChange = e => setPlaceType(e.target.value);
  const handleAddressChange = e => setAddress(e.target.value);
  const handleTagChange = e => setTag(e.target.value);
  const handleQuestTypeChange = e => setQuestType(e.target.value);

  const captureFile = event => {
    console.log("capturing file...");
    const file = event.target.files[0]; // access to the file
    const reader = new FileReader();
    reader.readAsArrayBuffer(file); // read the file as an ArrayBuffer so that it can be uplaode to ipfs
    reader.onloadend = async () => {
      const buffer = Buffer(reader.result);
      setBuffer(buffer);
      const image = new File(buffer, file.name, {
        contentType: mime.getType(file.name),
      });
      setImage(image);
    };
  };

  const registerPlace = async () => {
    console.log("registering place...");
    const NFT_STORAGE_TOKEN =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDU0OEZCN0RjMTU0NGYzZjZDMzcxNjdCQ0VmNTU5OGI4NTNCQkU5ZEIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0NjQwOTQ4MjE2NSwibmFtZSI6IndvcmtjaGFpbiJ9.rdMCzjgEIOiuQ9VvVq-yJbnDsrlDsuFaBd2qLpGDZSA";
    const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

    const placeId = (await tx(readContracts.YourContract.placeId())).toString();

    const metadata = await client.store({
      tokenID: placeId,
      name: name,
      description: "This is a place description",
      image: image,
      address: address,
      tag: tag,
      attributes: [
        {
          trait_type: "place_type",
          value: placeType,
        },
        {
          trait_type: "quest_type",
          value: questType,
        },
      ],
    });

    let placeInput = convertPlaceType(placeType);
    let questInput = convertQuestType(questType);
    console.log("placeInput: ", placeInput);
    console.log("questInput: ", questInput);
    console.log(metadata.url);

    tx(writeContracts.YourContract.registerPlace(placeInput, questInput, metadata.url));
  };

  return (
    <div class="HomeDiv">
      <div class="CityMenu">
      <a class="CityBT" href="./PlaceDetail">Place Detail <img src={"https://punkcities.mypinata.cloud/ipfs/QmVqUZf959wuJ8dBMfcLAUfmRn5pLk8PSWQ1eDfqH2mK2V"} class="homevan"/></a>
        <a class="CityBT" href="./MyPlaces">My places<img src={"https://punkcities.mypinata.cloud/ipfs/QmcbcgbhvpznC8zns7zRY5KKN1WvS1QQ7t1M3BaPjfUE9E"} class="homevan"/></a>
        <a class="CityBT" href="./CityPlaces">My city places<img src={"https://punkcities.mypinata.cloud/ipfs/QmSm6Ec8xEBTEB6ATkVmPybw4VRLiapm9K9fxLLxthgvq4"} class="homevan"/></a>
        <a class="CityBT" type="submit" href="./debug">🧙🏽 Wizard Mode (Hard) <img src={"https://punkcities.mypinata.cloud/ipfs/QmREGJmweJGKqWHFM1oF8WnsgMc9gTSV8t4ZkFBk3aBsPx"} class="homevan"/></a>
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
          

          <label>
            Confirm or add Tags
            <input type="text" placeholder="Camping, Climbing, Nature" onChange={handleTagChange} />
          </label>

          <label>
          Choose your quest in this place:
          <select id="TypeOfPlace" type="text" placeholder="Park" onChange={handlePlaceTypeChange}>
            <option disabled selected>The quest defines the reward!</option>
            <option>1 Solarpunk (+1⚡)</option>
            <option>2 Cyberpunk (+1💽)</option>
          </select>
          </label>
          
        </div>
        <label class="file">
            Take and upload a photo to IPFS
            <input type="file" onChange={captureFile}/>
            <div class="UploadBt"> Upload to IPFS</div>
          </label>
        <div class="CreatePL" type="submit" onClick={registerPlace}>
          Verify Place
        </div>
      </div>
    </div>
    </div>
  );
}
