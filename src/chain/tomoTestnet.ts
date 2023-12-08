import { defineChain } from 'viem';

export const tomoTestnet = defineChain({
  id: 89,
  name: 'Tomo Testnet',
  network: 'tomoTestnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Tomo',
    symbol: 'TOMO',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.tomochain.com'],
      webSocket: ['wss://ws.testnet.tomochain.com'],
    },
    public: {
      http: ['https://rpc.testnet.tomochain.com'],
      webSocket: ['wss://ws.testnet.tomochain.com'],
    },
  },
  blockExplorers: {
    default: { name: 'TomoScan', url: 'https://testnet.tomoscan.io' },
  },
});
