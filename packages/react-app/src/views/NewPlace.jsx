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

export default function NewPlace({ tx, writeContracts, readContracts }) {
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
    <div class="NewGame">
      <div class="container2">
        <div class="NewPlace"></div>
        <div class="NewGame-title">New Place</div>
        <div class="inputs2">
          <label for="TypeOfPlace">
            Type of place: <br/>
            <select id="TypeOfPlace" type="text" placeholder="Park" onChange={handlePlaceTypeChange}>
                <option disabled selected>The place I want to register is...</option>
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
                <option>19 Camping site </option>
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
          <select id="TypeOfPlace" type="text" placeholder="Park" onChange={handlePlaceTypeChange}>
            <option disabled selected>The quest defines the reward!</option>
            <option>1 Solarpunk (+1⚡)</option>
            <option>2 Cyberpunk (+1💽)</option>
          </select>
          </label>
          <label class="file">
            Take and upload a photo to IPFS
            <input type="file" onChange={captureFile}/>
            <div class="UploadBt"> Upload to IPFS</div>
          </label>
        </div>
        <div class="CreatePL" type="submit" onClick={registerPlace}>
          Register New Place
        </div>
      </div>
    </div>
  );
}
