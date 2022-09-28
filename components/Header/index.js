import { useContext } from "react";
import { AppContext } from "../../context";

const Header = () => {
  const { walletConnected, walletAddress, connectWallet } =
    useContext(AppContext);
  return (
    <>
      <header className="p-5 fixed top-0 w-screen flex items-center justify-between">
        <div></div>
        
      </header>
    </>
  );
};


export default Header;
