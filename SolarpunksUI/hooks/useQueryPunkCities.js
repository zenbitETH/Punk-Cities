import punkcities from "../abis/punkcities.json";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export const useQueryPunkCities = (contractAddress, abiFunction, myAddress) => {
  const { provider } = useMoralis();
  const { abi } = punkcities;
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (provider && myAddress) {
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const signer = ethersProvider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      setLoading(true);

      contract[abiFunction](myAddress)
        .then(result => {
          setData(result);
          setLoading(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
        });
    }
  }, [provider, myAddress]);

  return { data, error, loading };
};
