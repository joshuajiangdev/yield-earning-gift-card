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
import { ReceivedModal } from "../src/components/ReceivedModal";

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

  const handleClose = () => setCurrentGiftDetail(undefined);

  return (
    <>
      <Modal
        open={!!currentGiftDetail}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {currentGiftDetail && connectedWallet ? (
          <ReceivedModal
            connectedWallet={connectedWallet}
            currentGiftDetail={currentGiftDetail}
            dismissModal={() => setCurrentGiftDetail(undefined)}
          />
        ) : (
          <div />
        )}
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
