import React, { useState } from "react";


export default function Upgrade() {


  return (
    <div class="HomeDiv">
      <div class="CityMenu">
        <a class="CityBT" href="./PlaceDetail">Place Detail <img src={"https://punkcities.mypinata.cloud/ipfs/QmVqUZf959wuJ8dBMfcLAUfmRn5pLk8PSWQ1eDfqH2mK2V"} class="homevan"/></a>
        <a class="CityBT" href="./MyPlaces">My places<img src={"https://punkcities.mypinata.cloud/ipfs/QmcbcgbhvpznC8zns7zRY5KKN1WvS1QQ7t1M3BaPjfUE9E"} class="homevan"/></a>
        <a class="CityBT" href="./CityPlaces">My city places<img src={"https://punkcities.mypinata.cloud/ipfs/QmSm6Ec8xEBTEB6ATkVmPybw4VRLiapm9K9fxLLxthgvq4"} class="homevan"/></a>
        <a class="CityBT" type="submit" href="./debug">🧙🏽 Wizard Mode (Hard) <img src={"https://punkcities.mypinata.cloud/ipfs/QmREGJmweJGKqWHFM1oF8WnsgMc9gTSV8t4ZkFBk3aBsPx"} class="homevan"/></a>
      </div>
    <div class="NewGame">
      <div class="container3">
        <div class="UpgradePlace">🌟</div>
        <div class="NewGame-title">Upgrade this place</div>
        <div class="Deposit2Up">
          <div class="Energy2Up">Energy to update <div>1/10⚡</div>
          <div class="EnergyUnit">
              <input type="number" placeholder="0"></input>
            </div>
            <div className="EnergyBt">
                Deposit Energy
            </div>
          </div>
          <div class="Chips2Up">Chips to Update <div>0/10💽</div>
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
