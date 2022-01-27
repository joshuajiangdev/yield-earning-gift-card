import {
  ConnectType,
  useConnectedWallet,
  useWallet,
  WalletStatus,
} from "@terra-money/wallet-provider";

import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export const ConnectWalletBar = () => {
  const { status, connect, disconnect } = useWallet();
  const connectedWallet = useConnectedWallet();

  const isConnected = status === WalletStatus.WALLET_CONNECTED;
  const button = isConnected ? (
    <Button color="inherit" onClick={disconnect}>
      Disconnect
    </Button>
  ) : (
    <Button color="inherit" onClick={() => connect(ConnectType.EXTENSION)}>
      Connect
    </Button>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
          <Button
            key="send"
            href="/send"
            sx={{ my: 2, color: "white", display: "block" }}
          >
            Send
          </Button>
          <Button
            key="claim"
            href="/receive"
            sx={{ my: 2, color: "white", display: "block" }}
          >
            Claim
          </Button>
        </Box>

        {isConnected ? (
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {connectedWallet?.walletAddress}
          </Typography>
        ) : (
          <div style={{ flexGrow: 1 }}></div>
        )}

        {button}
      </Toolbar>
    </AppBar>
  );
};
