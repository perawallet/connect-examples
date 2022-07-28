<template>
  <div>
    <button @click="disconnectWallet" v-if="accountAddress">Disconnect</button>
    <button @click="connectWallet" v-else>Connect to Pera Wallet</button>

    <div v-if="accountAddress">Connected to {{ accountAddress }}</div>
  </div>
</template>

<script>
import { PeraWalletConnect } from "@perawallet/connect";

const peraWallet = new PeraWalletConnect();

export default {
  name: "App",
  data() {
    return {
      accountAddress: "",
    };
  },
  mounted() {
    peraWallet
      .reconnectSession()
      .then((accounts) => {
        peraWallet.connector.on("disconnect", this.disconnectWallet);

        if (accounts.length) {
          this.accountAddress = accounts[0];
        }
      })
      .catch((error) => {
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          console.log(error);
        }
      });
  },
  methods: {
    connectWallet() {
      peraWallet
        .connect()
        .then((accounts) => {
          peraWallet.connector.on("disconnect", this.disconnectWallet);

          this.accountAddress = accounts[0];
        })
        .catch((e) => console.log(e));
    },
    disconnectWallet() {
      peraWallet.disconnect().then(() => (this.accountAddress = null));
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
