import {useState} from "react";
import {Button, List, ListItem} from "@hipo/react-ui-toolkit";
import {PeraWalletConnect} from "@perawallet/connect";
import {SignerTransaction} from "@perawallet/connect/dist/util/model/peraWalletModels";

import {mainnetScenarios, Scenario, scenarios} from "./util/signTxnUtils";
import {ChainType, clientForChain} from "../../utils/algod/algod";

interface SignTxnProps {
  accountAddress: string;
  peraWallet: PeraWalletConnect;
  handleSetLog: (log: string) => void;
  chain: ChainType;
  refecthAccountDetail: () => void;
}

function SignTxn({
  accountAddress,
  peraWallet,
  handleSetLog,
  chain,
  refecthAccountDetail
}: SignTxnProps) {
  const [isRequestPending, setIsRequestPending] = useState(false);

  return (
    <>
      <div style={{marginTop: "45px"}}>
        <h3>Mainnet only, do not sign!</h3>
        {chain === ChainType.TestNet && <small>Switch to MainNet to see txns</small>}
        
        <List items={mainnetScenarios} customClassName={"app__actions"}>
          {(item) => (
            <ListItem>
              <Button
                customClassName={"app__button"}
                onClick={() => signTransaction(item.scenario, item.name)}
                shouldDisplaySpinner={isRequestPending}
                isDisabled={isRequestPending}>
                {isRequestPending ? "Loading..." : item.name}
              </Button>
            </ListItem>
          )}
        </List>
      </div>


      <div style={{marginTop: "45px"}}>
        <h3>Both Networks</h3>

        <List items={scenarios} customClassName={"app__actions"}>
          {(item) => (
            <ListItem>
              <Button
                customClassName={"app__button"}
                onClick={() => signTransaction(item.scenario, item.name)}
                shouldDisplaySpinner={isRequestPending}
                isDisabled={isRequestPending}>
                {isRequestPending ? "Loading..." : item.name}
              </Button>
            </ListItem>
          )}
        </List>
      </div>
    </>
  );

  async function signTransaction(scenario: Scenario, name: string) {
    setIsRequestPending(true);

    try {
      const {transaction: txnsToSign, transactionTimeout} = await scenario(
        chain,
        accountAddress
      );

      const transactions: SignerTransaction[] = txnsToSign.reduce(
        (acc, val) => acc.concat(val),
        []
      );

      const signedTransactions = await peraWallet.signTransaction([transactions]);

      handleSetLog(`Transaction signed successfully: ${name}`);

      if (transactionTimeout) {
        setTimeout(async () => {
          await clientForChain(chain).sendRawTransaction(signedTransactions).do();
          handleSetLog(`Transaction sended network: ${name}`);
        }, transactionTimeout);
      } else {
        await clientForChain(chain).sendRawTransaction(signedTransactions).do();

        handleSetLog(`Transaction sended network: ${name}`);
      }
    } catch (error) {
      handleSetLog(`${error}`);
    } finally {
      setIsRequestPending(false);
      refecthAccountDetail();
    }
  }
}

export default SignTxn;
