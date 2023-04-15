interface EthereumObject {
    request: (request: { method: string; params?: Array<any> }) => Promise<any>;
  }
  
  interface Window extends Window {
    ethereum: EthereumObject;
  }
  