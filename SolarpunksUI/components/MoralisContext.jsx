import { MoralisProvider } from "react-moralis";

const APP_ID = "uf9Ygw54rdzWRFuU9N4YnriWLNGABzM4FKQ0i8GU";
const SERVER_URL = "https://dbytjnrliegt.usemoralis.com:2053/server";

const MoralisContextProvider = ({ children }) => {
  if (!APP_ID || !SERVER_URL)
    throw new Error(
      "Missing Moralis Application ID or Server URL. Make sure to set your .env file.",
    );
  
  return (
    <MoralisProvider serverUrl={SERVER_URL} appId={APP_ID}>
      {children}
    </MoralisProvider>
  );
};

export default MoralisContextProvider;
