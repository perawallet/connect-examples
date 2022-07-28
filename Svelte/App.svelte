<script>
  import { onMount } from "svelte";
  import { PeraWalletConnect } from "@perawallet/connect";

  const peraWallet = new PeraWalletConnect();

  let accountAddress = "";

  onMount(() => {
    // Reconnect to the session when the component is mounted
    peraWallet
      .reconnectSession()
      .then(accounts => {
        // Setup the disconnect event listener
        peraWallet.connector.on("disconnect", handleDisconnectWalletClick);

        if (accounts.length) {
          setAccountAddress(accounts[0]);
        }
      })
      .catch(e => console.log(e));
  });

  function handleConnectWalletClick() {
    peraWallet
      .connect()
      .then(newAccounts => {
        // Setup the disconnect event listener
        peraWallet.connector.on("disconnect", handleDisconnectWalletClick);
        setAccountAddress(newAccounts[0]);
      })
      .catch(error => {
        if (error.data && error.data.type !== "CONNECT_MODAL_CLOSED") {
          console.log(error);
        }
      });
  }

  function handleDisconnectWalletClick() {
    peraWallet
      .disconnect()
      .then(() => {
        setAccountAddress(null);
      })
      .catch(error => {
        console.log(error);
      });
  }

  function setAccountAddress(address) {
    accountAddress = address;
  }
</script>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>

<main>
	Pera Connect with Svelte

	<button on:click={!!accountAddress ? handleDisconnectWalletClick : handleConnectWalletClick}>
    {!!accountAddress ? "Disconnect" : 'Connect to Pera Wallet'}
  </button>
</main>