import {useState} from "react";
import {Button, List, ListItem} from "@hipo/react-ui-toolkit";
import {PeraWalletConnect} from "@perawallet/connect";
import {SignerTransaction} from "@perawallet/connect/dist/util/model/peraWalletModels";

import {Scenario, scenarios} from "./util/signTxnUtils";
import {ChainType} from "../../utils/algod/algod";

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
  );

  async function signTransaction(scenario: Scenario, name: string) {
    setIsRequestPending(true);

    try {
      const txnsToSign = await scenario(chain, accountAddress);

      const transactions: SignerTransaction[] = txnsToSign.reduce(
        (acc, val) => acc.concat(val),
        []
      );

      const signedTransactions = await peraWallet.signTransaction([transactions]);

      handleSetLog(`Transaction signed successfully: ${name}`);
      console.log(signedTransactions);

      refecthAccountDetail();
    } catch (error) {
      handleSetLog(`${error}`);
    } finally {
      setIsRequestPending(false);
    }
  }
}

export default SignTxn;
