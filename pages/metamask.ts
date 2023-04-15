import { ethers } from "ethers";

export type MetamaskConnection = {
  provider: ethers.providers.Web3Provider;
  signer: ethers.Signer;
  address: string;
};

async function connectMetamask(): Promise<MetamaskConnection | undefined> {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      console.log("Connected:", address);
      return { provider, signer, address };
    } catch (error) {
      console.error("User rejected the connection request", error);
    }
  } else {
    console.error("Metamask is not installed");
  }
}



async function sendTransaction(
  signer: ethers.providers.JsonRpcSigner,
  to: string,
  amount: string
): Promise<void> {
  const tx = {
    to: to,
    value: ethers.utils.parseEther(amount),
  };

  try {
    const transaction = await signer.sendTransaction(tx);
    console.log("Transaction Hash:", transaction.hash);
    await transaction.wait();
    console.log("Transaction Completed");
  } catch (error) {
    console.error("Transaction Failed", error);
  }
}
 
export { connectMetamask, sendTransaction };
