import type { NextPage } from "next";
import { useState } from "react";
import * as execute from "../src/contract/execute";
import { useConnectedWallet } from "@terra-money/wallet-provider";
import { useKeyPad } from "../src/hooks/useKeyPad";
import { Dialog, DialogTitle, TextField, Typography } from "@mui/material";
import { Spacer } from "../src/coreui-components/Spacer";
import { SpaceUnit } from "../src/constants/design";
import { AppWrapper } from "../src/components/AppWrapper";
import { LoadingButton } from "@mui/lab";

const SendPage: NextPage = () => {
  const connectedWallet = useConnectedWallet();
  const [updating, setUpdating] = useState(false);
  const [receiver, setReceiver] = useState("");
  const [giftMessage, setGiftMessage] = useState("");

  const [giftId, setGiftId] = useState<string | undefined>(undefined);
  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [amount, keyPadComponent] = useKeyPad();

  const handleCloseDialog = () => {
    setGiftId(undefined);
  };

  const onClickSendGift = async () => {
    setUpdating(true);
    try {
      const response = await execute.sendGift({
        amount,
        receiver,
        gift_msg: giftMessage,
      })(connectedWallet);

      if (response.logs) {
        const giftId = response.logs[0].events
          .find((event) => event.type === "from_contract")
          ?.attributes.find((attribute) => attribute.key === "gift_id")?.value;

        if (giftId) {
          setGiftId(giftId);
        }

        const txHash = response.txhash;
        if (txHash) {
          setTxHash(txHash);
        }

        if (txHash) {
          setTxHash(txHash);
        }
      }
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <Dialog onClose={handleCloseDialog} open={!!giftId}>
        <DialogTitle>Your gift card ID: {giftId}</DialogTitle>
        <DialogTitle>Tx Hash: {txHash}</DialogTitle>
      </Dialog>
      <AppWrapper>
        <Typography style={{ textAlign: "center" }} variant="h1">
          {amount}
        </Typography>
        <Typography style={{ textAlign: "center" }} variant="h6">
          UST
        </Typography>
        <Spacer space={SpaceUnit.four} vertical />
        {keyPadComponent}

        <Typography variant="h5">Receiver address</Typography>
        <Spacer space={SpaceUnit.one} vertical />
        <TextField
          id="addr"
          placeholder="terraXXXXX"
          variant="outlined"
          fullWidth
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        />
        <Spacer space={SpaceUnit.three} vertical />

        <Typography variant="h5">Gift message</Typography>
        <Spacer space={SpaceUnit.one} vertical />
        <TextField
          id="msg"
          placeholder="This is a gift for you."
          variant="outlined"
          fullWidth
          value={giftMessage}
          onChange={(e) => setGiftMessage(e.target.value)}
        />
        <Spacer space={SpaceUnit.three} vertical />
        <LoadingButton
          variant="contained"
          disabled={!connectedWallet}
          loading={updating}
          onClick={onClickSendGift}
          style={{ width: 200, alignSelf: "center" }}
        >
          Send
        </LoadingButton>
      </AppWrapper>
    </>
  );
};

export default SendPage;
