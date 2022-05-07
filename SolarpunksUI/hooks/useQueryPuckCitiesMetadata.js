import punkcities from "../abis/punkcities.json";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import fetch from "cross-fetch";

export const useQueryPuckCitiesMetadata = (setCity, contractAddress, tokenId) => {
  const { provider } = useMoralis();
  const { abi } = punkcities;
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [ipfsError, setIpfsError] = useState();
  const [ipfsLoading, setIpfsLoading] = useState(false);
  const [citiesMetadata, setCitiesMetadata] = useState();

  useEffect(() => {
    if (provider && tokenId >= 0) {
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const signer = ethersProvider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      setLoading(true);

      contract
        .uri(tokenId)
        .then(result => {
          setData(result);
          setLoading(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
        });
    }
  }, [provider]);

  useEffect(() => {
    if (data && !citiesMetadata) {
      const url = data.replace("ipfs://", "https://ipfs.io/ipfs/");
      setIpfsLoading(true);
      fetch(url)
        .then(response => response.text())
        .then(metadata => {
          try {
            const json = JSON.parse(metadata);
            setCity(json);
          } catch {
            setIpfsError(new Error("fail to parse returning cities metadata"));
          }
          setIpfsLoading(false);
        })
        .catch(error => {
          setIpfsError(error);
          console.error("fail to fetch cities", error);
          setIpfsLoading(false);
        });
    }
  }, [data, citiesMetadata, setCitiesMetadata]);

  return {
    citiesMetadataError: error || ipfsError,
    citiesMetadataloading: loading || ipfsLoading,
  };
};
