export type PeraWalletType = "pera-wallet" | "pera-wallet-web";

export interface PeraWalletDetails {
  type: PeraWalletType;
  accounts: string[];
  selectedAccount: string;
}

const PERA_WALLET_LOCAL_STORAGE_KEYS = {
  WALLET: "PeraWallet.Wallet"
};

export {PERA_WALLET_LOCAL_STORAGE_KEYS};
