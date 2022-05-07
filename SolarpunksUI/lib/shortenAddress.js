import { getAddress } from "@ethersproject/address";

export const isAddress = value => {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
};

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export const shortenAddress = (address, chars = 4) => {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `🔑 ${parsed.substring(0, chars )}...${parsed.substring(42 - chars)}`;
};
export const shortenTx = (txHash, chars = 4) => {
  return `${txHash.substring(0, chars)}...${txHash.substring(42 - chars)}`;
};