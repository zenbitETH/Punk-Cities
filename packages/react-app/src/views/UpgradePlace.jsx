import React, { useState } from "react";


export default function Upgrade() {


  return (
    <div class="HomeDiv">
      <div class="CityMenu">
        <a class="CityBT" href="./PlaceDetail">Place Detail</a>
        <a class="CityBT" href="./MyPlaces">My places</a>
        <a class="CityBT" href="./CityPlaces">My city places</a>
        <div class="CityBTBl" >
          Visit other cities TBR
        </div>
      </div>
    <div class="NewGame">
      <div class="container3">
        <div class="UpgradePlace">🌟</div>
        <div class="NewGame-title">Upgrade this place</div>
        <div class="Deposit2Up">
          <div class="Energy2Up">Energy to update <div>8/10⚡</div>
          <div class="EnergyUnit">
              <input type="number" placeholder="0"></input>
            </div>
            <div className="EnergyBt">
                Deposit Energy
            </div>
          </div>
          <div class="Chips2Up">Chips to Update <div>5/10💽</div>
            <div class="ChipsUnit">
              <input type="number" placeholder="0"></input>
            </div>
            <div className="ChipsBt">
                Deposit Chips
            </div>
          </div>
        </div>
        
        <div class="LevelBlock" type="submit">
          Upgrade Place
        </div>
      </div>
    </div>
    </div>
  );
}
