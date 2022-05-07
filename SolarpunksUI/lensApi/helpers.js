import omitDeep from "omit-deep";
import { ethers, utils } from "ethers";

export const prettyJSON = (message, obj) => {
  console.log(message, JSON.stringify(obj, null, 2));
};

export const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

export const omit = (object, name) => {
  return omitDeep(object, name);
};

// below 3 call, no use; can remove later

export const getSigner = provider => {
  const ethersProvider = new ethers.providers.Web3Provider(provider);
  return ethersProvider.getSigner();
};

export const signedTypeData = (signer, domain, types, value) => {
  // remove the __typedname from the signature!
  return signer._signTypedData(
    omit(domain, "__typename"),
    omit(types, "__typename"),
    omit(value, "__typename"),
  );
};

export const splitSignature = async (signer, domain, types, value) => {
  const signature = await signedTypeData(signer, domain, types, value);
  return utils.splitSignature(signature);
};
