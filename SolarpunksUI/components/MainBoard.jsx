import { useMoralis } from "react-moralis";
import { useState } from "react";
import Authenticate from "./Lens/Authenicate";




const Login = () => {
  const { account, isAuthenticated } = useMoralis();
  const [isLensAPIAuthenticated, setLensAPIAuthenticated] = useState(false);

  return <div className="MainScreen">
    <div className="MainBoard">
      <div className="Board1">Friends</div>
      <div className="Board2">Punk Cities Places</div>
      <div className="Board3">Feed</div>
      <div className="Board2">My post</div>
    </div>
  </div>;
};

export default Login;
