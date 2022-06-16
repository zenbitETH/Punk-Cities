import React, { useState } from "react";
import PC from "../assets/punkcities.png"

export default function HomeScreen() {


  return (
    <div className="HomeCon">
      <main className="HomeCon2">
        <div className="hero">
          <div className="center"><img src={PC} class="logo" alt="Punk Cities"/></div>
          
            <div className="HomeBT">Conectar</div>

        </div>
      </main>
    </div>
  );
}
