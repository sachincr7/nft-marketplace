// import { setupHooks } from "@/components/hooks/web3/setupHooks";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { loadContract } from "@_types/nft";
import { NftMarketContract } from "@_types/nftMarketContract";
import { ethers } from "ethers";
import {
  createContext,
  // FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import { createDefaultState, createWeb3State, Web3State } from "./utils";

const pageReload = () => {
  window.location.reload();
};

const Web3Context = createContext<Web3State>(createDefaultState());

const Web3Provider = ({ children }: any) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        console.log("window.ethereum", window.ethereum);
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as any
        );

        const contract = await loadContract("NftMarket", provider);
        console.log("contract", contract);

        const signer = provider.getSigner();
        const signedContract = contract.connect(signer);

        setTimeout(() => setGlobalListeners(window.ethereum), 500);
        setWeb3Api(
          createWeb3State({
            ethereum: window.ethereum,
            provider,
            contract: signedContract as unknown as NftMarketContract,
            isLoading: false,
          })
        );
      } catch (error: any) {
        console.log("error", error);
        console.error("Please install Web3 wallet");
        setWeb3Api((api) =>
          createWeb3State({
            ...(api as any),
            isLoading: false,
          })
        );
      }
    };

    initWeb3();

    return () => removeGlobalListeners(window.ethereum);
  }, []);

  const handleAccount = (ethereum: MetaMaskInpageProvider) => async () => {
    const isLocked = !(await ethereum._metamask.isUnlocked());
    if (isLocked) {
      pageReload();
    }
  };

  const setGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
    ethereum.on("chainChanged", pageReload);
    ethereum.on("accountsChanged", handleAccount(ethereum));
  };

  const removeGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
    ethereum?.removeListener("chainChanged", pageReload);
    ethereum?.removeListener("accountsChanged", handleAccount);
  };

  return (
    <Web3Context.Provider value={web3Api}>{children}</Web3Context.Provider>
  );
};

export function useWeb3() {
  return useContext(Web3Context);
}

export function useHooks() {
  const { hooks } = useWeb3();
  return hooks;
}

export default Web3Provider;
