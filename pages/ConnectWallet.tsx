import { Button } from "@chakra-ui/react";

async function handleConnect() {
  try {
    const { ethereum } = window;
    if (!ethereum) {
      console.log('No MetaMask found.');
      return;
    }
    await ethereum.request({ method: 'eth_requestAccounts' });
    console.log('Connected to MetaMask!');
  } catch (error) {
    console.log(error);
  }
}

export const ConnectWallet = () => (
  <Button colorScheme="blue" onClick={handleConnect}>
    Connect to MetaMask
  </Button>
);
