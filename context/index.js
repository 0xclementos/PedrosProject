import { ethers } from "ethers";
import { isMobile } from "react-device-detect";
import { createContext, useEffect, useState } from "react";
import { convertToETH, convertToBigNumber, weiToNumber } from "../lib/contract";
import { CONTRACT_ADDRESS, CONTRACT_ABI, GAS_LIMIT } from "../config";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [contractPaused, setContractPaused] = useState(false);
  const [maxNftPerWallet, setMaxNftPerWallet] = useState(5);
  const [walletAddress, setWalletAddress] = useState("");
  const [btnClicked, setBtnClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mintPrice, setMintPrice] = useState(-1);
  const [numOfNft, setNumOfNft] = useState(1);
  const [supply, setSupply] = useState(0);
  const mainnetStr = "1" // 1
  const mainnetId = "0x1" // 0x1

  useEffect(() => {
    detectDeviceType();
  }, []);

  const increaseNumOfNft = () => {
    if (numOfNft <= maxNftPerWallet - 1) setNumOfNft(numOfNft + 1);
  };

  const decreaseNumOfNft = () => {
    if (numOfNft > 1) setNumOfNft(numOfNft - 1);
  };

  const detectDeviceType = () => {
    if (typeof window.ethereum === "undefined") {
      window.open("https://metamask.app.link/dapp/thefinaljourney.xyz/");
      return;
    }
  };

  const toggleBtnClick = () => {
    setBtnClicked(true);
    mint();
    setTimeout(() => {
      setBtnClicked(false);
    }, 290);
  };

  const checkCurrentNetwork = () => {
    const currentNetwork = window.ethereum.networkVersion;
    // console.log("currentNetwork", currentNetwork);
    if (currentNetwork === mainnetStr) {
      // setLoading(true);
      getContractData();
      setWalletConnected(true);
      // setLoading(false);
    } else {
      alert("Please switch to the Mainnet and connect your wallet");
      setWalletConnected(false);
      // setLoading(false);
    }
  };

  const listenForWalletEvents = async () => {
    try {
      checkCurrentNetwork();
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts[0])
          setWalletAddress(getTruncatedWalletAddress(accounts[0]));
        else setWalletConnected(false);
      });

      window.ethereum.on("chainChanged", async (networkId) => {
        // console.log("networkId", networkId);
        if (networkId !== mainnetId) {
          setWalletConnected(false);
          alert("Please switch to the Mainnet and connect your wallet");
        } else {
          setWalletConnected(true);
        }
      });

      window.ethereum.on("error", (err) => {
        console.log(err.message);
      });
    } catch (e) {
      console.warn(e.message);
    }
  };

  const connectWallet = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();
      setWalletAddress(getTruncatedWalletAddress(walletAddress));
      listenForWalletEvents();
    } catch (e) {
      setLoading(false);
      console.log(e);
      alert("An error occured. Please try again");
    }
  };

  const contractProvider = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
    return contract;
  };

  const getContractData = async () => {
    try {
      const _contractProvider = contractProvider();
      const _mintPrice = convertToETH(await _contractProvider.mintPrice());
      const _supply = weiToNumber(await _contractProvider.supply());
      const _paused = await _contractProvider.paused();
      const _maxNftPerWallet = weiToNumber(
        await _contractProvider.maxNFTSale()
      );

      console.log("_mintPrice -<", _mintPrice);
      console.log("_maxNftPerWallet -<", _maxNftPerWallet);
      console.log("_supply -<", _supply);
      console.log("paused -<", _paused);

      setContractPaused(_paused);
      setMintPrice(_mintPrice);
      setMaxNftPerWallet(_maxNftPerWallet);
      setSupply(_supply);
    } catch (e) {
      console.log(e.message);
    }
  };

  const getTruncatedWalletAddress = (str) => {
    const a = str.substring(0, 4);
    const b = str.substring(str.length - 4, str.length);
    return `${a}...${b}`;
  };

  const mint = async () => {
    try {
      const currentNetwork = window.ethereum.networkVersion;

      if (currentNetwork !== mainnetStr) {
        alert("Please switch to the Mainnet and connect your wallet");
        return;
      }

      if (contractPaused) {
        alert("contract paused!");
        return;
      }

      setLoading(true);
      // getContractData();

      const _contractProvider = contractProvider();

      console.log(mintPrice, 'mint-price')
       
      const newMintPrice = Number(numOfNft) * Number(mintPrice);
      const _parsedMintPrice = convertToBigNumber(newMintPrice);

      console.log("numOfNft -< ", Number(numOfNft));
      console.log("mintPrice -< ", Number(mintPrice));
      console.log("newMintPrice -< ", newMintPrice);

      console.log(_parsedMintPrice)

      await _contractProvider.mint(numOfNft, {
        value: _parsedMintPrice,
        gasLimit: GAS_LIMIT
      });

      // console.log(tx);
      // alert("Minted successfully!");
      setLoading(false);
    } catch (e) {
      console.log(e.message);
      setLoading(false);
      alert("Please try again later");
    }
  };

  return (
    <AppContext.Provider
      value={{
        numOfNft,
        increaseNumOfNft,
        decreaseNumOfNft,
        toggleBtnClick,
        btnClicked,
        connectWallet,
        walletConnected,
        walletAddress,
        mintPrice,
        supply,
        maxNftPerWallet,
        contractPaused,
        mint,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
