import React from "react";

export default function NewPlace(){
    return (  
    <div class="NewGame">
        <div class="container2">
          <div class="NewPlace"></div>
          <div class="NewGame-title">New Place</div>
          <div class="inputs2">
            <label>Type of place
                <input type="text" placeholder="Park" />
            </label>
            
            <label>Name
                <input type="text" placeholder="Yellowstone" />
            </label>
            
            <label>Address
                <input type="text" placeholder="Type google maps address" />
            </label>
            
            <label>Tags
                <input type="text" placeholder="Camping, Climbing, Nature" />
            </label>
            
            <label>Choose your quest
                <input type="text" placeholder="Solarpunk or Cyberpunk" />
            </label>
            
            <div class="CreatePL"type="submit">Take and upload a photo</div>

          </div>  
          <div class="CreatePL"type="submit">Register New Place</div>
        </div>
    </div>
    );
}