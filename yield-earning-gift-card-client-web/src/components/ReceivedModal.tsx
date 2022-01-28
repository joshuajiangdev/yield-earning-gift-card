import { LoadingButton } from "@mui/lab";
import { Box, Typography } from "@mui/material";
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
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
};

const counterStyle = {
  display: "block",
  width: "50px",
  margin: "20px auto",
  // text-align: "center",
  // padding: "15px",
  // border: "1px solid black",
  // font-size: "1.5em",
  // font-weight: "bold"
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
      <Typography textAlign="center" variant="subtitle1">
        Sender: {currentGiftDetail?.sender ?? ""}
      </Typography>
      <Typography textAlign="center" variant="subtitle1">
        <b>Original Gift Amount:</b>{" "}
        {Number.parseInt(currentGiftDetail?.amount ?? "0") / 1000000.0} UST
      </Typography>

      <Typography textAlign="center" variant="subtitle1">
        <b>Current Balance (Earning 18% APY):</b>{" "}
        <Box sx={counterStyle}>{value}</Box>
        {/* {Number.parseInt(currentGiftDetail?.amount ?? "0") / 1000000.0}{" "} */}
      </Typography>

      <Spacer space={SpaceUnit.one} vertical />

      <Typography textAlign="center" variant="subtitle1">
        Message: {currentGiftDetail?.msg}
      </Typography>

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
