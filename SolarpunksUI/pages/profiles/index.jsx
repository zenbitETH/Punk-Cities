import Profiles from "../../components/Profiles";
import Layout from "../../components/Layout";
import ConnectWalletMessage from "../../components/ConnectWalletMessage";
import { useMoralis } from "react-moralis";

const ProfilesPage = () => {
  const { account, isAuthenticated } = useMoralis();

  return (
    <Layout className="mt-10">
      <div className="MainCon2">
        {account && isAuthenticated ? <Profiles dev={true} /> : <ConnectWalletMessage />}
      </div>
    </Layout>
  );
};

export default ProfilesPage;
