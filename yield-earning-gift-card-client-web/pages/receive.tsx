import { useConnectedWallet } from "@terra-money/wallet-provider";
import type { NextPage } from "next";
import { useState } from "react";
import * as query from "../src/contract/query";
import * as execute from "../src/contract/execute";
import { Button, Text } from "../src/coreui-components";
import { AppWrapper } from "../src/components/AppWrapper";
import { Box, Modal, TextField, Typography } from "@mui/material";
import { Spacer } from "../src/coreui-components/Spacer";
import { SpaceUnit } from "../src/constants/design";
import { LoadingButton } from "@mui/lab";

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

const ReceivePage: NextPage = () => {
  const connectedWallet = useConnectedWallet();
  const [updating, setUpdating] = useState(false);
  const [giftId, setGiftId] = useState<string>("");
  const [currentGiftDetail, setCurrentGiftDetail] =
    useState<query.GiftDetail>();

  const loadGiftDetail = async () => {
    if (connectedWallet) {
      setUpdating(true);
      try {
        const response = await query.getGiftDetail(
          parseInt(giftId),
          connectedWallet
        );
        setCurrentGiftDetail(response);
      } finally {
        setUpdating(false);
      }
    }
  };

  const claimGift = async () => {
    if (connectedWallet) {
      setUpdating(true);
      try {
        const response = await execute.claimGift({ gift_id: parseInt(giftId) })(
          connectedWallet
        );

        if (response) {
          setCurrentGiftDetail(undefined);
        }
      } finally {
        setUpdating(false);
      }
    }
  };

  const isReceiver =
    connectedWallet?.walletAddress === currentGiftDetail?.receiver;

  const handleClose = () => setCurrentGiftDetail(undefined);

  // Use Title and Wrapper like any other React component – except they're styled!
  return (
    <>
      <Modal
        open={!!currentGiftDetail}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography textAlign="center" variant="subtitle1">
            Sender: {currentGiftDetail?.sender ?? ""}
          </Typography>
          <Typography textAlign="center" variant="subtitle1">
            Gift amount:{" "}
            {Number.parseInt(currentGiftDetail?.amount ?? "0") / 1000000.0} UST
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
      </Modal>
      <AppWrapper>
        <Spacer space={SpaceUnit.three} vertical />
        <Typography variant="h5">Gift id</Typography>
        <Spacer space={SpaceUnit.one} vertical />
        <TextField
          id="gift_id"
          placeholder="Gift id"
          variant="outlined"
          fullWidth
          type="number"
          value={giftId}
          onChange={(e) => setGiftId(e.target.value)}
        />
        <Spacer space={SpaceUnit.three} vertical />
        <LoadingButton
          variant="contained"
          disabled={!connectedWallet}
          loading={updating}
          onClick={loadGiftDetail}
          style={{ width: 200, alignSelf: "center" }}
        >
          Claim
        </LoadingButton>
      </AppWrapper>
    </>

    // <div>
    //   <input
    //     type="number"
    //     value={giftId}
    //     onChange={(e) => {
    //       setGiftId(e.target.value);
    //     }}
    //   />
    //   <Button onClick={loadGiftDetail}>Load gift</Button>
    //   <div>
    //     <Text>To: {currentGiftDetail?.receiver}</Text>
    //   </div>
    //   <div>
    //     <Text>Amount: {currentGiftDetail?.amount} uusd</Text>
    //   </div>
    //   <div>
    //     <Text>Message: {currentGiftDetail?.msg}</Text>
    //   </div>
    //   <div>
    //     <Button
    //       disabled={
    //         connectedWallet?.walletAddress !== currentGiftDetail?.receiver
    //       }
    //       onClick={claimGift}
    //     >
    //       Claim
    //     </Button>
    //   </div>
    // </div>
  );
};

export default ReceivePage;
