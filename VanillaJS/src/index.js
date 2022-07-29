import "./styles.css";
import { PeraWalletConnect } from "@perawallet/connect";

const peraWallet = new PeraWalletConnect();

const connectButton = document.createElement("button");
let accountAddress = "";

document.body.appendChild(connectButton);
connectButton.innerHTML = "Connect to Pera Wallet";

document.addEventListener("DOMContentLoaded", reconnectSession());

connectButton.addEventListener("click", (event) => {
  if (accountAddress) {
    handleDisconnectWalletClick(event);
  } else {
    handleConnectWalletClick(event);
  }
});

function reconnectSession() {
  // Reconnect to the session when the component is mounted
  peraWallet
    .reconnectSession()
    .then((accounts) => {
      peraWallet.connector.on("disconnect", handleDisconnectWalletClick);

      if (accounts.length) {
        accountAddress = accounts[0];
      }

      connectButton.innerHTML = "Disconnect";
    })
    .catch((e) => console.log(e));
}

function handleConnectWalletClick(event) {
  event.preventDefault();

  peraWallet
    .connect()
    .then((newAccounts) => {
      peraWallet.connector.on("disconnect", handleDisconnectWalletClick);

      accountAddress = newAccounts[0];

      connectButton.innerHTML = "Disconnect";
    })
    .catch((error) => {
      if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
        console.log(error);
      }
    });
}

function handleDisconnectWalletClick(event) {
  event.preventDefault();

  peraWallet.disconnect().catch((error) => {
    console.log(error);
  });

  accountAddress = "";
  connectButton.innerHTML = "Connect to Pera Wallet";
}
