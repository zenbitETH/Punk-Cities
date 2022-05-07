import React from "react";

const LensContext = React.createContext({
  isLensReady: false,
  setIsLensReady: () => {},
  defaultProfile: "",
  setDefaultProfile: () => {},
  defaultHandle: "",
  setDefaultHandle: () => {},
  fetchDefaultProfileCount: 0,
  setFetchDefaultPofileCount: () => {},
  friendList: [],
  setFriendList: () => {},
  last5VisitProfiles: [],
  setLast5VisitProfiles: () => {},
  last5VisitPublications: [],
  setLast5VisitPublications: () => { },
});

export const LensProvider = LensContext.Provider;

export default LensContext;
