import { useEffect, useState } from "react";
import { ethers, utils } from "ethers";
import omit from "omit-deep";
import { getLensHub } from "../lensApi/lensHub";
import { useQueryTxIndexed } from "./useQueryTxIndexed";
import { useMoralis } from "react-moralis";

// input: TypedData from LensAPI
// 1. use Metamask to sign TypeData
// 2. send tx to Lens Hub
export const useSendTransWithSig = ({
  typedData,
  typedDataTxHash,
  contractFuncName, // string
  contractPayload,
  gasLimit,
}) => {
  const { provider } = useMoralis();
  const [transaction, setTransaction] = useState();
  const [signTypedDataError, setSignTypedDataError] = useState();
  const [transError, setTransError] = useState();
  const [signatureParts, setSignatureParts] = useState();
  const [isSignTypedDataLoading, setIsSignTypedDataLoading] = useState(false);
  const [isSendTransLoading, setIsSendTransLoading] = useState(false);

  const ethersProvider = new ethers.providers.Web3Provider(provider);
  const signer = ethersProvider.getSigner();

  transactionReceipt && console.log("transactionReceipt", transactionReceipt);

  isIndexedError && console.error("isIndexedError", isIndexedError);

  /**
   * Step 1: Signing EIP-712 Typed Data, retrieved from LensAPI endpoint
   */
  useEffect(() => {
    if (typedData && !transaction && !signatureParts) {
      setIsSignTypedDataLoading(true);
      signer
        ._signTypedData(
          omit(typedData.domain, "__typename"),
          omit(typedData.types, "__typename"),
          omit(typedData.value, "__typename"),
        )
        .then(signature => {
          const signatureParts = utils.splitSignature(signature);
          setSignatureParts(signatureParts);
          setIsSignTypedDataLoading(false);
        })
        .catch(error => {
          setIsSignTypedDataLoading(false);
          setSignTypedDataError(error);
          console.error("Err in signing Typedata: ", error);
        });
    }
  }, [typedData]);

  /**
   * Step 2: Submit signed tx, to Lens-Hub
   */
  useEffect(() => {
    const v = signatureParts?.v;
    const r = signatureParts?.r;
    const s = signatureParts?.s;

    if (v && r && s && !transaction) {
      setIsSendTransLoading(true);
      const lensHub = getLensHub(signer);
      lensHub[contractFuncName](
        {
          ...contractPayload,
          sig: {
            v,
            r,
            s,
            deadline: typedData?.value?.deadline,
          },
        },
        { gasLimit },
      )
        .then(tx => {
          setTransaction(tx);
          setIsSendTransLoading(false);
        })
        .catch(error => {
          setTransError(error);
          setIsSendTransLoading(false);
          console.error("Err in sending tx: ", error);
        });
    }
  }, [signatureParts]);

  const { isIndexedLoading, isIndexedError, transactionReceipt } = useQueryTxIndexed(
    transaction,
    transaction?.hash,
  );

  return {
    transaction,
    signTypedDataError,
    isIndexedLoading,
    isIndexedError,
    transactionReceipt,
    transError,
    isSendTransLoading,
    isSignTypedDataLoading,
  };
};
