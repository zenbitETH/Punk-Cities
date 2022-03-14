import React from "react";

import asset from "../assets/parktest.png"

export default function MyPlaces(){
    return (  
        <div class="CityDiv">
            <div class="CityMenu">
                <a class="CityBT" href="./NewPlace">New Place<img src={"https://punkcities.mypinata.cloud/ipfs/QmYpNQUw9Pw48amwLnjjS7rDXRCB1xfo8DLZUJNnkYeQVo"} class="homevan"/></a>
                <a class="CityBT" href="./MyPlaces">My places<img src={"https://punkcities.mypinata.cloud/ipfs/QmcbcgbhvpznC8zns7zRY5KKN1WvS1QQ7t1M3BaPjfUE9E"} class="homevan"/></a>
                <a class="CityBT" href="./CityPlaces">My city places<img src={"https://punkcities.mypinata.cloud/ipfs/QmSm6Ec8xEBTEB6ATkVmPybw4VRLiapm9K9fxLLxthgvq4"} class="homevan"/></a>
                <a class="CityBT" type="submit" href="./debug">🧙🏽 Wizard Mode (Hard) <img src={"https://punkcities.mypinata.cloud/ipfs/QmREGJmweJGKqWHFM1oF8WnsgMc9gTSV8t4ZkFBk3aBsPx"} class="homevan"/></a>
            </div>
            <div class="PlaceAsset">
                <div class="AssetTl">
                    <div class="">Santa Mónica Park</div>
                    <div class="AssetLv">Level 0</div>
                    <div class="">Querétaro, México</div>
                </div>
                <img src="https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/12.Public-Park.png" class="PLDetail"/>
                <div class="AssetData">
                    <a class="GMaps" href="https://www.google.com/maps/place/Santa+M%C3%B3nica+II+Park/@20.6013826,-100.4445954,16z/data=!4m5!3m4!1s0x85d35009af118055:0x1de32045717635c2!8m2!3d20.6013822!4d-100.4419932">IRL Location </a>
                    <div class="RgAddress"><div class="AssetRg">Registered by</div> 0xeCB455aa...6bF336e05
</div>
                </div>
            </div>

            <div class="PlaceVer">
                <div class="SolVer"> 1/25 Solarpunk <div class="AssetRg">to upgrade</div></div>
                <div class="CybVer"> 0/25 Cyberpunk <div class="AssetRg">to upgrade</div></div>
                <a class="VerBt" href="./VerifyPlace">👍 Verify</a>
                <div class="SolVer">0/50⚡Energy<div class="AssetRg">to upgrade</div></div>
                <div class="CybVer">0/50💽 Chips<div class="AssetRg">to upgrade</div></div>
                <a class="VerBt" href="./UpgradePlace">⚡Deposit 💽</a>
                
                <div class="Verigrid">
                    <div class="VeriTl">Verifiers</div>
                    <div>0xeCB455aa...6bF336e05</div>
                    <div>Solarpunk</div>
                    <a href="https://ipfs.io/ipfs/bafyreib3xcow4qj42cu2ekm7jug3vbkr3eayio4muwrlluwuszjlkgi3nq/metadata.json">📜</a>
                    <a href="https://punkcities.mypinata.cloud/ipfs/QmZFnnjRZmuqED9bZDa4L5A6wGC5WE8obGdpA5ULWe1wFs">📸</a>
                    <div>0⚡</div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    

                </div>
               
            </div>
        </div>
    );
}