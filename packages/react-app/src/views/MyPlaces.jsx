import React from "react";

import asset from '../assets/parktest.png'

export default function MyPlaces(){
    return (  
        <div class="CityDiv">
            <div class="CityMenu">
                <div class="CityBT">New Place</div>
                <div class="CityBT">My places</div>
                <div class="CityBT">My city places</div>
                <div class="CityBT">Visit other cities TBR</div>
            </div>
            <div class="CityPlaces">
                <div class="PlaceQuest"><div class="QuestIc">⚡</div>My Solarpunk places</div>
                <div class="CityPL">
                    <div class="PLheader">
                        <div class="PLtitle">Unverified Park</div>
                        <div class="PLlevel"> Lv0</div>
                    </div>
                    <img src="https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/1-Basketball-Court.png" class="PLimage"/>
                    <div class="PLfooterUn">
                        <div class="PLtitle">10/20👍 to upgrade</div>
                    </div>
                </div>
                <div class="CityPL">
                    <div class="PLheader">
                        <div class="PLtitle">Verified Park</div>
                        <div class="PLlevel"> Lv0</div>
                    </div>
                    <img src="https://punkcities.mypinata.cloud/ipfs/bafybeidcq7q3yszzijqqmyepakavk26dxgbh3kvurmrmmg3ttsoq4zykve?filename=22-Skate-Park.png" class="PLimage"/>
                    <div class="PLfooter">
                        <div class="PLtitle">23/20👍</div>
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
                        <div class="PLtitle">25/100👍</div>
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
                        <div class="PLtitle">25/100👍</div>
                        <div class="PLlevel">15/50⚡</div>
                        <div class="PLlevel">35/50💽</div>
                    </div>
                </div>
            </div>
            <div class="CityPlaces2">
            <div class="PlaceQuest"><div class="QuestIc">💽</div>My Cyberpunk places</div>
            <div class="CityPL">
                    <div class="PLheader">
                        <div class="PLtitle">Unverified Park</div>
                        <div class="PLlevel"> Lv0</div>
                    </div>
                    <img src="https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/27-Tech-Company.png" class="PLimage"/>
                    <div class="PLfooterUn">
                        <div class="PLtitle">10/20👍 to upgrade</div>
                    </div>
                </div>
                <div class="CityPL">
                    <div class="PLheader">
                        <div class="PLtitle">Verified Park</div>
                        <div class="PLlevel"> Lv0</div>
                    </div>
                    <img src={asset} class="PLimage"/>
                    <div class="PLfooter">
                        <div class="PLtitle">23/20👍</div>
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
                        <div class="PLtitle">25/100👍</div>
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
                        <div class="PLtitle">25/100👍</div>
                        <div class="PLlevel">15/50⚡</div>
                        <div class="PLlevel">35/50💽</div>
                    </div>
                </div>
            </div>
        </div>
    );
}