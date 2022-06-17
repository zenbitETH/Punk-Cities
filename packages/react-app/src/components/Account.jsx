import React, { useState, useEffect } from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";

import Address from "./Address";
import Balance from "./Balance";
import PC from "../assets/punkcities.png"
import NetworkDisplay from "./NetworkDisplay";
import Wallet from "./Wallet";
import { PunkCityABI } from "../contracts/PunkCity";
require("dotenv").config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractAddressLocal = "0x20B991Dcf13f0854c142B4A5F217cBCD640e6409"; // to find a better way to retrieve this address
const contractInstance = new web3.eth.Contract(PunkCityABI, contractAddressLocal);

/** 
  ~ What it does? ~

  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

  ~ How can I use? ~

  <Account
    useBurner={boolean}
    address={address}
    localProvider={localProvider}
    userProvider={userProvider}
    mainnetProvider={mainnetProvider}
    price={price}
    web3Modal={web3Modal}
    loadWeb3Modal={loadWeb3Modal}
    logoutOfWeb3Modal={logoutOfWeb3Modal}
    blockExplorer={blockExplorer}
    isContract={boolean}
  />

  ~ Features ~

  - Provide address={address} and get balance corresponding to the given address
  - Provide localProvider={localProvider} to access balance on local network
  - Provide userProvider={userProvider} to display a wallet
  - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide price={price} of ether and get your balance converted to dollars
  - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
              to be able to log in/log out to/from existing accounts
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
**/

export default function Account({
  useBurner,
  address,
  userSigner,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
  isContract,
}) {
  const { currentTheme } = useThemeSwitcher();

  const [energy, setEnergy] = useState(0);
  const [chip, setChip] = useState(0);

  const loadInputs = async () => {
    if (address) {
      const energyBalance = await contractInstance.methods.energyPerAddress(address).call();
      const chipBalance = await contractInstance.methods.chipPerAddress(address).call();
      setEnergy(energyBalance);
      setChip(chipBalance);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      loadInputs();
    }, 800);
  }, [address]);

  useEffect(() => {
    setTimeout(() => {
      loadInputs();
    }, 800);
  }, []);


  const display = minimized ? (
    ""
  ) : (
    <span>
      {web3Modal && web3Modal.cachedProvider ? (
        <>{address && <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />}</>
      ) : useBurner ? (
        ""
      ) : isContract ? (
        <>{address && <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />}</>
      ) : (
        ""
      )}
      {useBurner && web3Modal && !web3Modal.cachedProvider ? (
        <>
          <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />
        </>
      ) : (
        <></>
      )}
    </span>
  )
  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(

        <div class="player">
          <div class="disconnect">
            <div> {display}</div>
            {/*<Balance address={address} provider={localProvider} price={price} />*/}
          </div>
          <div class="disconnect2" key="logoutbutton" onClick={logoutOfWeb3Modal}>
            <div>Desconectar</div>
          </div>
        </div>,
      );
    } else {
      modalButtons.push(
        <div>
          <img src={PC} class="logo" alt="Punk Cities"/>
          <div class="connect" key="loginbutton" onClick={loadWeb3Modal}>Conectar</div>
        </div>
        ,
      );
    }
  };

  return (
    <div class="center">
      <nav class="topHud">
          <div class="hud1"> ⛲ {energy ?? "..."}</div>
          <div class="hud2"> ⚡ {energy ?? "..."}</div>
          <div class="hud3"> 💽 {chip ?? "..."}</div>
          {/*<Wallet
            address={address}
            provider={localProvider}
            signer={userSigner}
            ensProvider={mainnetProvider}
            price={price}
            color={currentTheme === "light" ? "#1890ff" : "#2caad9"}
        />*/}
      </nav>
      {modalButtons}      
      <nav className="leftHud">
        <div className="huda">
          <div className='bigIcon'>⛲</div>
          <div> Nuevo Lugar</div>
        </div>
        <div className="hudb">
          <div className='bigIcon'>🌇 </div>
          <div>Mi ciudad</div>
        </div>
        <div className="hudc">
          <div className='bigIcon'>🌎 </div>
          <div>Explorar</div>
        </div>
      </nav>
      <nav className='rightHud'>
        <div className="hudd">
          <div className='bigIcon'>🌞</div>
          <div>Ciudad DAO</div>
        </div>
        <div className="hude">
          <div className='bigIcon'>💬</div>
          <div> Discord</div>
        </div>
        <div className="hudf">
          <div className='bigIcon'>📖 </div>
          <div>¿Cómo Jugar?</div>
        </div>
      </nav>
    </div>
  );
}
