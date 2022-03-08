import React from "react";

import asset from "../assets/parktest.png"

export default function MyPlaces(){
    return (  
        <div class="CityDiv">
            <div></div>
            <div class="Solarpunk">As Solarpunk ⚡</div>
            <div class="Cyberpunk">As Cyberpunk 💽</div>
            <div class="CityMenu">
                <div class="CityBT"type="submit">New Place</div>
                <div class="CityBT"type="submit">My places</div>
                <div class="CityBT"type="submit">My city places</div>
                <div class="CityBT"type="submit">Visit other cities TBR</div>
            </div>
            <div class="CityPlaces">
                <div class="CityPL">
                    <div class="PLheader">
                        <div class="PLtitle">Unferified Park</div>
                        <div class="PLlevel"> Lv0</div>
                    </div>
                    <img src={asset} class="PLimage"/>
                    <div class="PLfooterUn">
                        <div class="PLtitle">10/20✔️ to upgrade</div>
                    </div>
                </div>
                <div class="CityPL">
                    <div class="PLheader">
                        <div class="PLtitle">Verified Park</div>
                        <div class="PLlevel"> Lv0</div>
                    </div>
                    <img src={asset} class="PLimage"/>
                    <div class="PLfooter">
                        <div class="PLtitle">23/20✔️</div>
                        <div class="PLlevel">4/10⚡</div>
                        <div class="PLlevel">5/10💽</div>
                    </div>
                </div>
                
                <div class="CityPL">
                    <div class="PLheader">
                        <div class="PLtitle">Ready2Lv1 Park</div>
                        <div class="PLlevel"> Lv0</div>
                    </div>
                    <img src={asset} class="PLimage"/>
                    <div class="PLfooterUp">
                        <div class="PLtitle">Upgrade to Lv1!</div>
                    </div>
                </div>
                <div class="CityPL">
                    <div class="PLheaderLv1">
                        <div class="PLtitle">Level1 Park</div>
                        <div class="PLlevel"> Lv1</div>
                        <div class="PLlevel"> 💽</div>
                    </div>
                    <img src={asset} class="PLimage"/>
                    <div class="PLfooterCP">
                        <div class="PLtitle">25/100✔️</div>
                        <div class="PLlevel">15/50⚡</div>
                        <div class="PLlevel">35/50💽</div>
                    </div>
                </div>
                <div class="CityPL">
                    <div class="PLheaderLv1">
                        <div class="PLtitle">Level1 Park</div>
                        <div class="PLlevel"> Lv1</div>
                        <div class="PLlevel"> ⚡</div>
                    </div>
                    <img src={asset} class="PLimage"/>
                    <div class="PLfooterSP">
                        <div class="PLtitle">25/100✔️</div>
                        <div class="PLlevel">15/50⚡</div>
                        <div class="PLlevel">35/50💽</div>
                    </div>
                </div>
            </div>
            <div class="CityPlaces2">
            <div class="CityPL">
                    <div class="PLheader">
                        <div class="PLtitle">Unferified Park</div>
                        <div class="PLlevel"> Lv0</div>
                    </div>
                    <img src={asset} class="PLimage"/>
                    <div class="PLfooterUn">
                        <div class="PLtitle">10/20✔️ to upgrade</div>
                    </div>
                </div>
                <div class="CityPL">
                    <div class="PLheader">
                        <div class="PLtitle">Verified Park</div>
                        <div class="PLlevel"> Lv0</div>
                    </div>
                    <img src={asset} class="PLimage"/>
                    <div class="PLfooter">
                        <div class="PLtitle">23/20✔️</div>
                        <div class="PLlevel">4/10⚡</div>
                        <div class="PLlevel">5/10💽</div>
                    </div>
                </div>
                
                <div class="CityPL">
                    <div class="PLheader">
                        <div class="PLtitle">Ready2Lv1 Park</div>
                        <div class="PLlevel"> Lv0</div>
                    </div>
                    <img src={asset} class="PLimage"/>
                    <div class="PLfooterUp">
                        <div class="PLtitle">Upgrade to Lv1!</div>
                    </div>
                </div>
                <div class="CityPL">
                    <div class="PLheaderLv1">
                        <div class="PLtitle">Level1 Park</div>
                        <div class="PLlevel"> Lv1</div>
                        <div class="PLlevel"> 💽</div>
                    </div>
                    <img src={asset} class="PLimage"/>
                    <div class="PLfooterCP">
                        <div class="PLtitle">25/100✔️</div>
                        <div class="PLlevel">15/50⚡</div>
                        <div class="PLlevel">35/50💽</div>
                    </div>
                </div>
                <div class="CityPL">
                    <div class="PLheaderLv1">
                        <div class="PLtitle">Level1 Park</div>
                        <div class="PLlevel"> Lv1</div>
                        <div class="PLlevel"> ⚡</div>
                    </div>
                    <img src={asset} class="PLimage"/>
                    <div class="PLfooterSP">
                        <div class="PLtitle">25/100✔️</div>
                        <div class="PLlevel">15/50⚡</div>
                        <div class="PLlevel">35/50💽</div>
                    </div>
                </div>
            </div>
        </div>
    );
}