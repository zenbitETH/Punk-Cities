import Link from "next/link";
import Account from "./Account/Account";
import { useMoralis } from "react-moralis";
//import Authenticate from "../components/Lens/Authenicate";
import { useContext, useEffect, Fragment, useRef, useState } from "react";
import LensContext from "./LensContext";
import { useQuery } from "@apollo/client";
import { GET_PROFILES } from "../graphql/getProfiles";
import { Menu, Transition } from "@headlessui/react";
import { useQueryPunkCities } from "../hooks/useQueryPunkCities";
import SwitchNetwork from "./SwitchNetwork";

const PUNKCITIES_ADDRESS = "0x092BBe9022D421940B6D74799179267e5c822895";

const MyLink = props => {
  const { href, children, ...rest } = props;

  return (
    <div className="text-center m-2 p-2">
      <Link href={href}>
        <a {...rest}>{children}</a>
      </Link>
    </div>
  );
};

const Layout = ({ children, home }) => {
  const { account, isAuthenticated } = useMoralis();

  const {
    //isLensReady,
    defaultProfile,
    defaultHandle,
    setDefaultProfile,
    setDefaultHandle,
    fetchDefaultProfileCount,
    setFetchDefaultPofileCount,
  } = useContext(LensContext);

  /**
   * Fetch default profile once
   */
  const FUNC = "profiles";
  const { data, error, refetch } = useQuery(GET_PROFILES, {
    variables: { request: { limit: 1, ownedBy: account } },
    skip: fetchDefaultProfileCount !== 0 || !account || defaultProfile,
  });
  const profileId = data?.[FUNC]?.items?.[0]?.id;
  const handle = data?.[FUNC]?.items?.[0]?.handle;

  useEffect(() => {
    if (profileId) {
      setDefaultProfile(profileId);
      setDefaultHandle(handle);
      setFetchDefaultPofileCount(fetchDefaultProfileCount + 1);
    }
  }, [data]);

  // handling when switching metamask accounts
  useEffect(() => {
    if (account) {
      setFetchDefaultPofileCount(0);
      refetch();
    }
  }, [account]);

  error && console.error("fail fetch default profile", error);

  // query energy
  const {
    data: energy,
    error: energyError,
    loading: energyLoading,
  } = useQueryPunkCities(
    PUNKCITIES_ADDRESS,
    "energyPerAddress",
    account,
    // testing with "0xecb4c1245665e8a1f43826355aab0dd6bf336e05",
  );

  // query energy
  const {
    data: chip,
    error: chipError,
    loading: chipLoading,
  } = useQueryPunkCities(
    PUNKCITIES_ADDRESS,
    "chipPerAddress",
    account,
    // testing with "0xc6AEadbb68a277cDB5137700650755669F1cC475",
  );

  energyError && console.error("fail to fetch energy ", energyError);
  chipError && console.error("fail to fetch chip ", chipError);

  return (
    <div>
      <nav className="top-hud">
        <Account />
        {/*account && isAuthenticated && <Authenticate />*/}
        
        {account && isAuthenticated /*&& isLensReady*/ && (
          <Menu>
            <Menu.Button className="hud3">Profiles</Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-48 top-10 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-cyber-100 shadow-lg focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <MyLink className={`${active && "text-solar-100"}`} href="/profiles">
                      My Profiles
                    </MyLink>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <MyLink
                      className={`${active && "text-solar-100"}`}
                      href="/explore"
                    >
                      Friends
                    </MyLink>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <MyLink
                      className={`${active && "text-solar-100"}`}
                      href="/profiles/create-profile"
                    >
                      Create Profile
                    </MyLink>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        )}

        {account && isAuthenticated /*&& isLensReady*/ && (
          <Link href="/dashboard">
            <a className="hud4">Solarpunk DAO</a>
          </Link>
        )}
        {/*account && isAuthenticated && isLensReady && (
          <Link href={`/profiles/${defaultHandle}/timeline`}>
            <a className="hud4">Timeline</a>
          </Link>
        )*/}
        
        {!account && (
          <span className="hud0">
            <SwitchNetwork />
          </span>
        )}
      </nav>
      <main>{children}</main>
      <nav className="bottom-hud">
        {/* This needs an before state to not show until the user is joined to the DAO*/}      
      {account && isAuthenticated /*&& isLensReady*/ && (
          <Link href={`/profiles/${defaultHandle}/publications/create-post`}>
            <a className="huda">💡 New proposal</a>
          </Link>
        )}

        {/* This needs an after state to show that user is already joined to DAO*/}      
        {account && isAuthenticated /*&& isLensReady*/ && (
          <Link href={`/profiles/${defaultHandle}/publications/create-post`}>
            <a className="hudb">🌞Join to the DAO</a>
          </Link>
        )}
        
        {account && (
          <div className="hudc">
            <span> ⚡ </span>
            <span className="mx-2">{energy?.toString() ?? "N/A"}</span>
          </div>
        )}
        {account && (
          <div className="hudd">
            <span> 💽 </span>
            <span className="mx-2">{chip?.toString() ?? "N/A"}</span>
          </div>
        )}
        
      </nav>
    </div>
  );
};

export default Layout;
