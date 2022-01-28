import { LoadingButton } from "@mui/lab";
import { Box, Divider, Typography } from "@mui/material";
import { useState } from "react";
import { SpaceUnit } from "../constants/design";
import { Spacer } from "../coreui-components/Spacer";
import useCounter from "../hooks/useCounter";
import * as query from "../../src/contract/query";
import * as execute from "../../src/contract/execute";
import { ConnectedWallet } from "@terra-money/wallet-provider";

interface ReceivedModalProps {
  currentGiftDetail: query.GiftDetail;
  connectedWallet: ConnectedWallet;
  dismissModal: () => void;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
};

export const ReceivedModal: React.FC<ReceivedModalProps> = ({
  currentGiftDetail,
  connectedWallet,
  dismissModal,
}) => {
  const currAmount = currentGiftDetail.amount;
  const onReset = () => alert("Counter about to reset");
  const onAfterReset = () => alert("Counter reset!");
  const [updating, setUpdating] = useState(false);

  const claimGift = async () => {
    if (connectedWallet) {
      setUpdating(true);
      try {
        const response = await execute.claimGift({
          gift_id: currentGiftDetail.gift_id,
        })(connectedWallet);

        if (response) {
          dismissModal();
        }
      } finally {
        setUpdating(false);
      }
    }
  };

  const [value, { inc, dec, get, set, reset }] = useCounter({
    initialCount: Number.parseInt(currAmount),
    onReset,
    onAfterReset,
  });

  const isReceiver =
    connectedWallet.walletAddress === currentGiftDetail.receiver;
  return (
    <Box sx={style}>
      <Typography variant="h6">
        From: {currentGiftDetail.sender ?? ""}
      </Typography>

      <Spacer vertical space={SpaceUnit.four} />

      <Typography variant="subtitle1">
        Original Gift Amount:{" "}
        {Number.parseInt(currentGiftDetail?.amount ?? "0") / 1000000.0} UST
      </Typography>

      <Typography variant="subtitle1">
        Current Balance (Earning 18% APY): {value / 1000000.0} UST
      </Typography>

      <Spacer space={SpaceUnit.one} vertical />

      <Divider />
      <Typography variant="subtitle1">Message:</Typography>

      <Typography variant="body1">{currentGiftDetail?.msg}</Typography>

      <Spacer space={SpaceUnit.three} vertical />

      {!isReceiver && (
        <Typography textAlign="center" variant="subtitle2" color="coral">
          This gift is not for you.
        </Typography>
      )}

      <LoadingButton
        variant="contained"
        disabled={!isReceiver}
        loading={updating}
        onClick={claimGift}
        style={{ width: 200, alignSelf: "center" }}
      >
        Withdraw
      </LoadingButton>
    </Box>
  );
};
