import Link from "next/link";
import type { NextPage } from "next";
import { Text } from "../src/coreui-components";
import { useWallet, WalletStatus } from "@terra-money/wallet-provider";
import { Typography, Button } from "@mui/material";
import { CardGiftcard } from "@mui/icons-material";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import Image from "next/image";
import Footer from "../src/components/Footer";
const Home: NextPage = () => {
  const { status, availableConnectTypes, connect, disconnect } = useWallet();

  if (status === WalletStatus.WALLET_NOT_CONNECTED) {
    return (
      <div style={{ textAlign: "center" }}>
        <Typography
          style={{ textAlign: "center", marginTop: "10%" }}
          variant="h2"
        >
          <Image
            src="/moon-dynamic-color.png"
            alt="me"
            width="100"
            height="100"
          ></Image>
          Terragram
        </Typography>
        <Typography
          style={{ textAlign: "center", marginTop: "3%" }}
          variant="h5"
        >
          UST gift cards that earn yield on idle funds{" "}
        </Typography>
        <p>
          <a
            href="https://www.youtube.com/watch?v=QeCqf0JX-sw"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#1976d2" }}
          >
            Watch demo
          </a>{" "}
        </p>
        <div className="connectButtons" style={{ marginTop: "3%" }}>
          {availableConnectTypes.map((connectType) => (
            <Button
              key={"connect-" + connectType}
              onClick={() => connect(connectType)}
            >
              Connect {connectType}
            </Button>
          ))}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Typography
        style={{ textAlign: "center", marginTop: "10%" }}
        variant="h2"
      >
        <Image
          src="/moon-dynamic-color.png"
          alt="me"
          width="100"
          height="100"
        ></Image>
        Terragram
      </Typography>

      <Typography style={{ textAlign: "center", marginTop: "3%" }} variant="h5">
        UST gift cards that earn yield on idle funds{" "}
      </Typography>

      <div style={{ textAlign: "center" }}>
        <p>
          <a
            href="https://www.youtube.com/watch?v=QeCqf0JX-sw"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#1976d2" }}
          >
            Watch demo
          </a>{" "}
        </p>
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
      </div>
      <Footer />
    </>
  );
};

export default Home;
