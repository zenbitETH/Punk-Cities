import React from "react";

export default function NewGame(){
    return (  
    <div class="NewGame">
        <div class="container">
          <div class="NewPlayer"></div>
          <div class="NewGame-title">New Game</div>
          <div class="inputs">
            <label>Twitter profile URL</label>
            <input type="text" placeholder="https://twitter.com/YourAccount" />
            <label>Current City or Hometown</label>
            <input type="text" placeholder="Mexico City" />
            <label>Your Country</label>
            <input type="text" placeholder="Mexico" />
          </div>  
          <div class="CreateAcc"type="submit">Create Profile</div>
        </div>
    </div>
    );
}