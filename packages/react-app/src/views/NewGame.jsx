import React, { useState } from "react";

export default function NewGame({ tx, writeContracts }) {
  const [name, setName] = useState("");
  const [hometown, setHometown] = useState("");
  const [country, setCountry] = useState("");

  const handleNameChange = e => {
    const name = e.target.value;
    setName(name);
  };
  const handleHometownChange = e => {
    const hometown = e.target.value;
    setHometown(hometown);
  };
  const handleCountryChange = e => {
    const country = e.target.value;
    setCountry(country);
  };

  return (
    <div class="HomeDiv">
      <div class="CityMenu">
        <a class="CityBT" href="./NewPlace">
          New Place
          <img
            src={"https://punkcities.mypinata.cloud/ipfs/QmYpNQUw9Pw48amwLnjjS7rDXRCB1xfo8DLZUJNnkYeQVo"}
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
        <div class="container">
          <div class="NewPlayer"></div>
          <div class="NewGame-title">New Game</div>
          <div class="inputs">
            <label>Twitter profile URL</label>
            <input type="text" onChange={handleNameChange} placeholder="https://twitter.com/YourAccount" />
            <label>Current City or Hometown</label>
            <input type="text" onChange={handleHometownChange} placeholder="Mexico City" />
            <label>Your Country</label>
            <input type="text" onChange={handleCountryChange} placeholder="Mexico" />
          </div>
          <div
            class="CreateAcc"
            type="submit"
            onClick={() => tx(writeContracts.YourContract.registerUser(name, hometown, country))}
          >
            Create Profile
          </div>
        </div>
      </div>
    </div>
  );
}
