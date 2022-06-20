import React, { useState } from "react";
import NG from "../assets/NewGame.svg"

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
        <img class="NewIMG" src={NG}/>
        <div class="NewDialog">
          Welcome stranger<br/>
          Who are you and what city do you come from?
        </div>
        <div class="container">
          <div class="NewGame-title">Answer</div>
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
            Start new game
          </div>
        </div>
    </div>
  );
}
