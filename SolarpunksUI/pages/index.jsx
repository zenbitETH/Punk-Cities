import Layout from "../components/Layout";
import Dashboard from "./dashboard";
import { useMoralis } from "react-moralis";
import Link from "next/link";

const Home = () => {
  const { account, isAuthenticated } = useMoralis();

  return (
    <Layout home={true}>
      <div className="flex min-h-screen flex-col items-center justify-center">

        {/*<div className="mt-32">
          <Link href="/new-place">
            <a>NewPost</a>
          </Link>
          </div> */}
        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <div className="grid xl:grid-cols-2 mt-36">
          <img
            src="https://punkcities.mypinata.cloud/ipfs/QmPoSnaj68Lcbs8TiAT1Lg9aodWcXE27t94kjhAw8xYZwn"
            className="xl:-mt-14 xl:p-10"
          />
          <div className="justify-items-center text-center my-auto">
            <div className=" xl:text-6xl text-4xl xl:mx-10 font-exo items-center items-center text-white">
              Web3 collaborative game to <span className="text-solar-100"> mint IRL places as NFTs</span>
            </div>                      
          </div>
          </div>
          <div className="h-screen -mt-10 mb-32">
            <div className="text-6xl mx-10 text-cyber-100 font-black hover:animate-pulse">How to play?</div>
            <div className="grid xl:grid-cols-3 gap-5 mt-20 text-white text-2xl font-exo">
              <a href={"https://punkcity.surge.sh"}>
              <div className="joinBG">1.  Start a new game
                <img src="https://punkcities.mypinata.cloud/ipfs/QmPoSnaj68Lcbs8TiAT1Lg9aodWcXE27t94kjhAw8xYZwn" className="p-5 w-3/4 mx-auto"/>
              </div>
              </a>
              <div className="joinBG cursor-default">2. Mint Places NFTs and get ⚡ and 💽
                <img src="https://punkcities.mypinata.cloud/ipfs/bafybeidufeb4xfrzwgzcx3iaabbyu7ck7p2tij3c2w2azixolxmlyouqii/8-Kids-Playground.png" className="w-3/4 mx-auto"/>
              </div>
              <div className="joinBG cursor-default">3. Deposit ⚡ and 💽
                <div className="text-[15rem] p-20 pt-44 pb-44 ">📥</div>
              </div>
              <div className="joinBG cursor-default">4. Upgrade your Places NFTs
                <div className="text-[15rem] p-20 pt-44 pb-44">🏢</div>
              </div>
              <div className="joinBG cursor-default">5. Get extra ⚡ and 💽 and mint NFTs for your community
                <div className="text-[15rem] p-20 pt-40 ">🤝</div>
              </div>
              <div className="joinBG cursor-default">6. Join to the Solarpunk DAO
                <div className="text-[15rem] p-20 pt-40">🌞</div>
              </div>
            </div>
          </div>
          
        </main>
      </div>
    </Layout>
  );
};

export default Home;
