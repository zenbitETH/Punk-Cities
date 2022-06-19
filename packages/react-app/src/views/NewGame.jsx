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
      <div class="">
        <img class="NewIMG" src={NG}/>
        <div class="NewDialog">
          Bienvenido extraño<br/>
          ¿Quién eres y de que ciudad vienes?
        </div>
        <div class="container">
          <div class="NewGame-title">Responder</div>
          <div class="inputs">
            <label>Soy:</label>
            <input type="text" onChange={handleNameChange} placeholder="Elige un nombre o apodo" />
            <label>De la ciudad:</label>
            <input type="text" onChange={handleHometownChange} placeholder="La ciudad en que vas a jugar" />
            <label>En el país:</label>
            <input type="text" onChange={handleCountryChange} placeholder="El país donde esta tu ciudad" />
          </div>
          <div
            class="CreateAcc"
            type="submit"
            onClick={() => tx(writeContracts.YourContract.registerUser(name, hometown, country))}
          >
            Crear perfil
          </div>
        </div>
      </div>
    </div>
  );
}
