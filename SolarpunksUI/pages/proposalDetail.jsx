import Layout from "../components/Layout";
import Dashboard from "./dashboard";
import { useMoralis } from "react-moralis";
import Link from "next/link";

const proposalDetail = () => {
  const { account, isAuthenticated } = useMoralis();

  return (
    <Layout>
      <div className="flex min-h-screen flex-col items-center justify-center text-white font-exo">
        <div className="bg-glass-100 rounded-lg grid grid-cols-6 grid-rows-9 text-center gap-5 p-5 mx-96">
          <div className="col-span-4 text-left text-2xl" > 💡Proposal title
          <div className="text-xl pl-2 text-solar-100"> Author: 0x000000</div></div>
          <div className="col-span-2 grid grid-cols-3 gap-5">
            <div className="text-xl">20 ⚡/💽</div>
            <div>Active/Inactive </div>
            <div>2 days, 00:00 to vote </div>
          </div>



          <div className="col-span-6 pt-5 bg-glass-100 rounded-lg row-span-5 pb-64 text-2xl">Proposal description
            <div className="pt-5 pb-10 text-xl">text text text text text text text text text text text text text text text text </div>
          </div>

        
          <div className="grid grid-cols-2 col-span-6 row-span-3 pb-10 gap-5">
            <div className="grid grid-cols-6">
              <div className="col-span-3 text-2xl pt-20"># Votes for</div>
              <div className="bg-green-700 rounded-lg py-20 text-4xl hover:bg-green-500 hover:text-night-100 cursor-pointer col-span-3">Vote for</div>
            </div>
            <div className="grid grid-cols-6">
              <div className="bg-red-700 rounded-lg py-20 text-4xl hover:bg-red-500 hover:text-night-100 cursor-pointer col-span-3">Vote against</div>
              <div className="col-span-3 text-2xl pt-20"># Votes against</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default proposalDetail;
