import Link from "next/link";
import type { NextPage } from "next";
import { Text } from "../src/coreui-components";
import { useWallet, WalletStatus } from "@terra-money/wallet-provider";
import { Button } from "../src/coreui-components/Button";

const Home: NextPage = () => {
  const { status, availableConnectTypes, connect, disconnect } = useWallet();

  if (status === WalletStatus.WALLET_NOT_CONNECTED) {
    return (
      <div>
        <div>
          <Text>Please conntect your wallet first.</Text>
        </div>
        {availableConnectTypes.map((connectType) => (
          <Button
            key={"connect-" + connectType}
            onClick={() => connect(connectType)}
          >
            Connect {connectType}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <ul>
      <li>
        <Link href="/send">
          <a>
            <Text>Send</Text>
          </a>
        </Link>
      </li>
      <li>
        <Link href="/receive">
          <a>
            <Text>Receive</Text>
          </a>
        </Link>
      </li>

      <Button
        onClick={() => {
          disconnect();
        }}
      >
        Disconnect
      </Button>
    </ul>
  );
};

export default Home;
