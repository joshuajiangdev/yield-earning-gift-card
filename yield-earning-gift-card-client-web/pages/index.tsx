import Link from "next/link";
import type { NextPage } from "next";
import { Text } from "../src/coreui-components";
import { useWallet, WalletStatus } from "@terra-money/wallet-provider";
import { Typography, Button } from "@mui/material";
import { CardGiftcard } from "@mui/icons-material";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
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
    <>
      <Typography
        style={{ textAlign: "center", marginTop: "10%" }}
        variant="h2"
      >
        Terragram
      </Typography>

      <Typography style={{ textAlign: "center", marginTop: "3%" }} variant="h5">
        UST gift cards that earn yield while not spent.{" "}
      </Typography>
      <div style={{ textAlign: "center" }}>
        <div style={{ padding: "5%" }}>
          <Button variant="contained">
            <Link href="/send">
              <a>
                <Text>
                  <CardGiftcard></CardGiftcard> Send A Gift
                </Text>
              </a>
            </Link>
          </Button>
          <Button variant="outlined">
            <Link href="/receive">
              <a>
                <Text>
                  <FileDownloadDoneIcon></FileDownloadDoneIcon> Claim
                </Text>
              </a>
            </Link>
          </Button>
        </div>

        <p>
          {" "}
          Built with ♥️ on{" "}
          <img
            src="https://www.terra.cards/wp-content/uploads/2021/07/terra-small-1.png"
            style={{ width: "60px" }}
          ></img>
        </p>
      </div>
    </>
  );
};

export default Home;
