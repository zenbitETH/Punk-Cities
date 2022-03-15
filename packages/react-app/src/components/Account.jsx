import React from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";

import Address from "./Address";
import Balance from "./Balance";
import NetworkDisplay from "./NetworkDisplay";
import Wallet from "./Wallet";

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

  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <div
          key="logoutbutton"
      
          shape="round"
          size="large"
          onClick={logoutOfWeb3Modal}
        >
        🔌 Logout
        </div>,
      );
    } else {
      modalButtons.push(
        <div
          key="loginbutton"
          
          shape="round"
          size="large"
          /* type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time */
          onClick={loadWeb3Modal}
        >
        🎮 Connect
        </div>,
      );
    }
  }
  const display = minimized ? (
    ""
  ) : (
    <span>
      {web3Modal && web3Modal.cachedProvider ? (
        <>
          {address && <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />}

        </>
      ) : useBurner ? (
        ""
      ) : isContract ? (
        <>
          {address && <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />}
          
        </>
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
  );

  return (

    <div class="center">
    <nav class="topHud">
      <div class="topGrid">
        <div class="hud0"><a href='/Home' class="hudBalance">@zenbitMX</a></div>
        <div class="hud2">Querétaro</div>
        <div class="hud1"> {display}</div>
        <div class="hud2"><Balance address={address} provider={localProvider} price={price} /></div>
        <div class="hud2"> ⚡ 1</div>
        <div class="hud3"> 💽 0</div>
        {/*<Wallet
            address={address}
            provider={localProvider}
            signer={userSigner}
            ensProvider={mainnetProvider}
            price={price}
            color={currentTheme === "light" ? "#1890ff" : "#2caad9"}
        />*/}
      </div>       
    </nav>
    <nav class="bottomHud">
      <div class="hud4" ><a href="https://github.com/zenbitETH/Punk-Cities" class="hudBalance">Docs</a></div>
      <div class="hud5">{modalButtons}</div>
      <div class="hud6" ><a href="" class="hudBalance">Discord</a></div>
    </nav>
  </div>
 
  );
}
