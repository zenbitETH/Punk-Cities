import React, { useState } from "react";

export default function NewGame({ tx, writeContracts }) {
  const [name, setName] = useState("");
  const [hometown, setHometown] = useState("");
  const [country, setCountry] = useState("");

  const handleNameChange = e => setName(e.target.value);
  const handleHometownChange = e => setHometown(e.target.value);
  const handleCountryChange = e => setCountry(e.target.value);

  return (
    <div class="HomeDiv">
      <div class="CityMenu">
        <a class="CityBT" href="./NewPlace">New Place</a>
        <a class="CityBT" href="./MyPlaces">My places</a>
        <a class="CityBT" href="./CityPlaces">My city places</a>
        <div class="CityBTBl" >
          Visit other cities TBR
        </div>
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
