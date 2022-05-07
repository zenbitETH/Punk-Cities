import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Profile from "../../components/Profile";
import { useMoralis } from "react-moralis";
import ConnectWalletMessage from "../../components/ConnectWalletMessage";
import Link from "next/link";
const ProfilePage = () => {
  const { account, isAuthenticated } = useMoralis();
  const router = useRouter();
  const handle = router.query.handle;

  return (
    <Layout >
      <div className="MainCon2">
      {account && isAuthenticated ? (
        <>
          <Profile handle={handle} dev={true} />
        </>
      ) : (
        <ConnectWalletMessage />
      )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
