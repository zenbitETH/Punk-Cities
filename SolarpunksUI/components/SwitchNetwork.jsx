import { useState, useEffect, useRef } from "react";
import { networkConfigs } from "../lib/networks";
import DialogModal from "./DialogModal";

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="alert alert-error mt-5">
      <div className="flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="w-6 h-6 mx-2 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          ></path>
        </svg>
        <label>{message}</label>
      </div>
    </div>
  );
};

const changeNetwork = async ({ networkName, setError }) => {
  try {
    if (!window.ethereum) throw new Error("No crypto wallet found");
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          ...networkConfigs[networkName],
        },
      ],
    });
  } catch (err) {
    setError(err.message);
  }
};

const SwitchNetworkDialog = () => {
  const [error, setError] = useState();

  const handleNetworkSwitch = async networkName => {
    setError();
    await changeNetwork({ networkName, setError });
  };

  const networkChanged = chainId => {
    console.log({ chainId });
  };

  useEffect(() => {
    window.ethereum.on("chainChanged", networkChanged);

    return () => {
      window.ethereum.removeListener("chainChanged", networkChanged);
    };
  }, []);

  return (
    <div className="credit-card w-full lg:w-2/3 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
      <main className="mt-4 p-4">
        <div className="mt-4 text-md">
          <button
            onClick={() => handleNetworkSwitch("bsc")}
            className="mt-2 mb-2 bg-warning border-warning btn submit-button focus:ring focus:outline-none w-full"
          >
            Avalanche Mainnet
          </button>
          <button
            onClick={() => handleNetworkSwitch("bsc")}
            className="mt-2 mb-2 bg-warning border-warning btn submit-button focus:ring focus:outline-none w-full"
          >
            Binance Chain
          </button>
          <button
            onClick={() => handleNetworkSwitch("polygon")}
            className="mt-2 mb-2 btn btn-primary submit-button focus:ring focus:outline-none w-full"
          >
            Polygon Mainnet
          </button>
          <button
            onClick={() => handleNetworkSwitch("mumbai")}
            className="mt-2 mb-2 btn btn-primary submit-button focus:ring focus:outline-none w-full"
          >
            Polygon Mumbai
          </button>
          <ErrorMessage message={error} />
        </div>
      </main>
    </div>
  );
};

const SwitchNetwork = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const closeDialogModal = () => setIsDialogOpen(false);
  const openDialogModal = () => setIsDialogOpen(true);
  const metamaskRef = useRef()

  typeof window !== "undefined" && window.ethereum && (metamaskRef.current = true);

  return (
    <div>
      <button onClick={openDialogModal}>Switch Network</button>
      <DialogModal
        isOpen={isDialogOpen}
        handleClose={closeDialogModal}
        title="Switch Metamask Network"
      >
        {metamaskRef.current ? <SwitchNetworkDialog /> : <div>Please install Metamask</div>}
      </DialogModal>
    </div>
  );
};

export default SwitchNetwork;
