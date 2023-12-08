import { defineChain } from 'viem';

export const victionTestnet = defineChain({
  id: 89,
  name: 'Viction Testnet',
  network: 'victionTestnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Viction',
    symbol: 'VIC',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-testnet.viction.xyz'],
      webSocket: ['wss://ws-testnet.viction.xyz'],
    },
    public: {
      http: ['https://rpc-testnet.viction.xyz'],
      webSocket: ['wss://ws-testnet.viction.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'VicScan', url: 'https://testnet.vicscan.xyz' },
  },
});
