import React, { useState } from "react";
import { useParams } from "react-router-dom";
require("dotenv").config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractAddressLocal = "0x2b6248b821a1BC2a1e992bc6535F72827f57BF43"; // to find a better way to retrieve this address
const contractInterface = require("../contracts/YourContract.json");
const contractInstance = new web3.eth.Contract(contractInterface, contractAddressLocal);

export default function Upgrade({ address }) {
  let { id } = useParams();
  const [energy, setEnergy] = useState(0);
  const [chip, setChip] = useState(0);
  const [placeId, setPlaceId] = useState(0);
  const [changeId, setChangeId] = useState(false);

  const handleEnergyChange = e => setEnergy(e.target.value);
  const handleChipChange = e => setChip(e.target.value);

  if (!changeId) {
    setPlaceId(id);
    setChangeId(true);
  }

  const depositChip = async () => {
    const transactionParams = {
      from: address,
      to: contractAddressLocal,
      data: contractInstance.methods.depositChip(placeId, chip).encodeABI(),
    };

    try {
      const tx = await web3.eth.sendTransaction(transactionParams);
      return {
        status: ` ✅{" "}

        View the status of your transaction on Etherscan!


      ℹ️ Once the transaction is verified by the network, the message will
      be updated automatically.`,
      };
    } catch (err) {
      console.log("err: ", err);
    }
  };

  const depositEnergy = async () => {
    const transactionParams = {
      from: address,
      to: contractAddressLocal,
      data: contractInstance.methods.depositEnergy(placeId, energy).encodeABI(),
    };

    try {
      const tx = await web3.eth.sendTransaction(transactionParams);
      return {
        status: ` ✅{" "}

        View the status of your transaction on Etherscan!


      ℹ️ Once the transaction is verified by the network, the message will
      be updated automatically.`,
      };
    } catch (err) {
      console.log("err: ", err);
    }
  };

  const upgradePlace = async () => {
    const transactionParams = {
      from: address,
      to: contractAddressLocal,
      data: contractInstance.methods.upgradePlace(placeId).encodeABI(),
    };

    try {
      const tx = await web3.eth.sendTransaction(transactionParams);
      return {
        status: ` ✅{" "}

        View the status of your transaction on Etherscan!


      ℹ️ Once the transaction is verified by the network, the message will
      be updated automatically.`,
      };
    } catch (err) {
      console.log("err: ", err);
    }
  };
  return (
    <div class="HomeDiv">
      <div class="CityMenu">
        <a class="CityBT" href="../PlaceDetail">
          Place Detail{" "}
          <img
            src={"https://punkcities.mypinata.cloud/ipfs/QmVqUZf959wuJ8dBMfcLAUfmRn5pLk8PSWQ1eDfqH2mK2V"}
            class="homevan"
          />
        </a>
        <a class="CityBT" href="../MyPlaces">
          My places
          <img
            src={"https://punkcities.mypinata.cloud/ipfs/QmcbcgbhvpznC8zns7zRY5KKN1WvS1QQ7t1M3BaPjfUE9E"}
            class="homevan"
          />
        </a>
        <a class="CityBT" href="../CityPlaces">
          My city places
          <img
            src={"https://punkcities.mypinata.cloud/ipfs/QmSm6Ec8xEBTEB6ATkVmPybw4VRLiapm9K9fxLLxthgvq4"}
            class="homevan"
          />
        </a>
        <a class="CityBT" type="submit" href="../debug">
          🧙🏽 Wizard Mode (Hard){" "}
          <img
            src={"https://punkcities.mypinata.cloud/ipfs/QmREGJmweJGKqWHFM1oF8WnsgMc9gTSV8t4ZkFBk3aBsPx"}
            class="homevan"
          />
        </a>
      </div>
      <div class="NewGame">
        <div class="container3">
          <div class="UpgradePlace">🌟</div>
          <div class="NewGame-title">Upgrade this place</div>
          <div class="Deposit2Up">
            <div class="Energy2Up">
              Energy to update <div>?/10⚡</div>
              <div class="EnergyUnit">
                <input type="number" placeholder="0" onChange={handleEnergyChange}></input>
              </div>
              <div className="EnergyBt" onClick={depositEnergy}>
                Deposit Energy
              </div>
            </div>
            <div class="Chips2Up">
              Chips to Update <div>?/10💽</div>
              <div class="ChipsUnit">
                <input type="number" placeholder="0" onChange={handleChipChange}></input>
              </div>
              <div className="ChipsBt" onClick={depositChip}>
                Deposit Chips
              </div>
            </div>
          </div>

          <div class="LevelUnblock" type="submit" onClick={upgradePlace}>
            Upgrade Place
          </div>
        </div>
      </div>
    </div>
  );
}
