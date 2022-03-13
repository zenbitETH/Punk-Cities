import React from "react";

import asset from "../assets/parktest.png"

export default function MyPlaces(){
    return (  
        <div class="CityDiv">
            <div class="CityMenu">
                <a class="CityBT" type="submit" href="./NewPlace">New Place</a>
                <a class="CityBT" type="submit" href="./MyPlaces">My places</a>
                <a class="CityBT" type="submit" href="./CityPlaces">My city places</a>
                <a class="CityBT" type="submit" href="./debug">🧙🏽 Wizard Mode (Hard)</a>
            </div>
            <div class="PlaceAsset">
                <div class="AssetTl">
                    <div class="">Name of the place</div>
                    <div class="AssetLv">Level 1</div>
                    <div class="">City</div>
                </div>
                <img src="https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/28-Tech-Cluster.png" class="PLDetail"/>
                <div class="AssetData">
                    <div class="GMaps">Address from Google Maps</div>
                    <div class="RgAddress"><div class="AssetRg">Registered by</div> 0x1234abcd</div>
                </div>
            </div>

            <div class="PlaceVer">
                <div class="SolVer">15/100 Solarpunk <div class="AssetRg">to upgrade</div></div>
                <div class="CybVer">25/100 Cyberpunk <div class="AssetRg">to upgrade</div></div>
                <a class="VerBt" href="./VerifyPlace">👍 Verify</a>
                <div class="SolVer">10/50⚡Energy<div class="AssetRg">to upgrade</div></div>
                <div class="CybVer">15/50💽 Chips<div class="AssetRg">to upgrade</div></div>
                <a class="VerBt" href="./UpgradePlace">⚡Deposit 💽</a>
                
                <div class="Verigrid">
                    <div class="VeriTl">Verifiers</div>
                    <div>Address</div>
                    <div>Solarpunk</div>
                    <div>📜</div>
                    <div>📸</div>
                    <div>2⚡</div>
                    <div>Address</div>
                    <div>Cyberpunk</div>
                    <div>📜</div>
                    <div>📸</div>
                    <div>1💽</div>
                    <div>Address</div>
                    <div>Cyberpunk</div>
                    <div>📜</div>
                    <div>📸</div>
                    <div>1💽</div>
                    <div>Address</div>
                    <div>Solarpunk</div>
                    <div>📜</div>
                    <div>📸</div>
                    <div>1⚡</div>
                    <div>Address</div>
                    <div>Solarpunk</div>
                    <div>📜</div>
                    <div>📸</div>
                    <div>1⚡</div>
                    <div>Address</div>
                    <div>Cyberpunk</div>
                    <div>📜</div>
                    <div>📸</div>
                    <div>1💽</div>
                </div>
               
            </div>
        </div>
    );
}