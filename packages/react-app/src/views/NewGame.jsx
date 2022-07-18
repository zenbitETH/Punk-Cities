import React, { useState } from "react";
import NG from "../assets/NewGame.svg";
import { PunkCityABI } from "../contracts/PunkCity";
require("dotenv").config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractAddressLocal = "0x7Afc190ea94f920563d057B868376fA7705D0f4C"; // to find a better way to retrieve this address
const contractInstance = new web3.eth.Contract(PunkCityABI, contractAddressLocal);

export default function NewGame({ address }) {
  const [name, setName] = useState("");
  const [hometown, setHometown] = useState("");
  {
    /*const [country, setCountry] = useState("");*/
  }

  const handleNameChange = e => {
    const name = e.target.value;
    setName(name);
  };
  const handleHometownChange = e => {
    const hometown = e.target.value;
    setHometown(hometown);
  };

  const registerUser = async () => {
    try {
      const transactionParams = {
        from: address,
        to: contractAddressLocal,
        data: contractInstance.methods.registerUser(name, hometown).encodeABI(),
      };
      await web3.eth.sendTransaction(transactionParams);
    } catch (err) {
      console.log(err);
    }
  };
  {
    /*const handleCountryChange = e => {
    const country = e.target.value;
    setCountry(country);
  };*/
  }

  return (
    <div class="HomeDiv">
      <img class="NewIMG" src={NG} />
      <div class="NewDialog">
        Welcome stranger
        <br />
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
        <div class="CreateAcc" type="submit" onClick={registerUser}>
          Start new game
        </div>
      </div>
    </div>
  );
}
