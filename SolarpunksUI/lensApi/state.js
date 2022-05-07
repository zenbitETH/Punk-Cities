let authenticationToken = null;

export let setAuthenticationToken = token => {
  authenticationToken = token;
  console.log(token);
};

export let getAuthenticationToken = () => {
  return authenticationToken;
};
