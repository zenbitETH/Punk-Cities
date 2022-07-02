import React, { useState } from "react";
import NG from "../assets/NewGame.svg"


export default function HomeScreen() {
  return (
    <div class="HomeCon">
      <div >
        <div class="NewBT">
          <img class="NewIMG" src={NG}/>
          <div class="NewDialog">
            Bienvenido extraño<br/>
            ¿Quién eres y de que ciudad vienes?
          </div>
          <div class="center">
            <a href="./NewGame"><div class="NewDialog2">Responder</div></a>
          </div>
        </div>
      </div>
    </div>
  );
}
