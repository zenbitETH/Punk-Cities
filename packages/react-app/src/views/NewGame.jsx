import React, { useState } from "react";
import NG from "../assets/NewGame.svg"

export default function NewGame({ tx, writeContracts }) {
  const [name, setName] = useState("");
  const [hometown, setHometown] = useState("");
  {/*const [country, setCountry] = useState("");*/}

  const handleNameChange = e => {
    const name = e.target.value;
    setName(name);
  };
  const handleHometownChange = e => {
    const hometown = e.target.value;
    setHometown(hometown);
  };
  {/*const handleCountryChange = e => {
    const country = e.target.value;
    setCountry(country);
  };*/}

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
            <label>I am:</label>
            <input type="text" onChange={handleNameChange} placeholder="Choose a name or nickname" />
            <label>From:</label>
            <select type="text" onChange={handleHometownChange} placeholder="The city where you are going to play">
              <option disabled selected>
                The city where you i going to play...
              </option>
              <option>Querétaro</option>
              <option>CDMX</option>
              <option>Bogotá</option>
              <option>Global Citizen</option>
            </select>
          </div>
          <div
            class="CreateAcc"
            type="submit"
            onClick={() => tx(writeContracts.YourContract.registerUser(name, hometown))}
          >
            Start new game
          </div>
        </div>
    </div>
  );
}
