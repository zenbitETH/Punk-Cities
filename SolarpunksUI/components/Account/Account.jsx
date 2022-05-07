import { connectors } from "./config";
import { useMoralis } from "react-moralis";
import Image from "next/image";
import { useState } from "react";
import DialogModal from "../DialogModal";
import { shortenAddress } from "../../lib/shortenAddress";
import { getExplorer } from "../../lib/networks";
import Address from "../Address";

const Account = () => {
  const { authenticate, chainId, isAuthenticated, isAuthenticating, logout, authError, account } =
    useMoralis();
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const closeWalletDialogModal = () => setIsWalletDialogOpen(false);
  const openWalletDialogModal = () => setIsWalletDialogOpen(true);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const closeAuthDialogModal = () => setIsAuthDialogOpen(false);
  const openAuthDialogModal = () => setIsAuthDialogOpen(true);

  if (!isAuthenticated || !account)
    return (
      <>
        <button type="button" onClick={openWalletDialogModal} className="hud0">
          🔑 Connect wallet
        </button>

        <DialogModal
          isOpen={isWalletDialogOpen}
          handleClose={closeWalletDialogModal}
          title="Connect Wallet"
        >
          <div>
            {/* Using MetaMask */}
            <div className="text-center">
              {connectors.map(({ title, icon, connectorId }, key) => (
                <button
                  className="WalletButton"
                  key={key}
                  disabled={isAuthenticating}
                  onClick={async () => {
                    try {
                      await authenticate({ provider: connectorId });
                      window.localStorage.setItem("connectorId", connectorId);
                      setIsWalletDialogOpen(false);
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                >
                  <Image src={icon} alt={title} height={50} width={50} />
                  <p>{title}</p>
                </button>
              ))}
            </div>

            {/* Close Button */}
            <div className="mt-12">
              <button type="button" className="WalletClose" onClick={closeWalletDialogModal}>
                <svg
                  className="h-10 w-10 "
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {authError && authError.message}
            </div>
          </div>
        </DialogModal>
      </>
    );

  const explorerURL = chainId && getExplorer(chainId);
  return (
    <>
      <button type="button" onClick={openAuthDialogModal} className="hud1con">
        {shortenAddress(account)}
      </button>
      <DialogModal
        isOpen={isAuthDialogOpen}
        handleClose={closeAuthDialogModal}
        title="This is your account"
      >
        <>
          <div className="-mt-8 inline-block text-white">
            <Address copyable={true} shortAddress={true} chars={5} />
            {explorerURL && (
              <a
                className="m-2 p-2 underline text-lg text-night-100 hover:text-solar-100"
                target="_blank"
                rel="noreferrer"
                href={`${explorerURL}/address/${account}`}
              >
                View on Explorer
              </a>
            )}
          </div>

          <button
            className="WalletDisconnect"
            onClick={async () => {
              await logout();
              window.localStorage.removeItem("connectorId");
              setIsAuthDialogOpen(false);
            }}
          >
            Disconnect Wallet
          </button>

          {/* Close Button */}
          {/* BUG: This button has no respond. Comment it out.  */}
          {/* <div className="mt-4">
          <button
                type="button"
                className="WalletClose"
                onClick={closeWalletDialogModal}
              >
                <svg class="h-10 w-10 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              </button>
          </div> */}
        </>
      </DialogModal>
    </>
  );
};

export default Account;
