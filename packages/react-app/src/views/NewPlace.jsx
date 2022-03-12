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
          <label>
            Type of place
            <input type="text" placeholder="Park" onChange={handlePlaceTypeChange} />
          </label>

          <label>
            Name
            <input type="text" placeholder="Yellowstone" onChange={handleNameChange} />
          </label>

          <label>
            Address
            <input type="text" placeholder="Type google maps address" onChange={handleAddressChange} />
          </label>

          <label>
            Tags
            <input type="text" placeholder="Camping, Climbing, Nature" onChange={handleTagChange} />
          </label>

          <label>
            Choose your quest
            <input type="text" placeholder="Solarpunk or Cyberpunk" onChange={handleQuestTypeChange} />
          </label>

          <div class="CreatePL" type="submit">
            <input type="file" onChange={captureFile} />
            Take and upload a photo
          </div>
        </div>
        <div class="CreatePL" type="submit" onClick={registerPlace}>
          Register New Place
        </div>
      </div>
    </div>
  );
}
