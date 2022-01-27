import { useConnectedWallet } from "@terra-money/wallet-provider";
import type { NextPage } from "next";
import { useState } from "react";
import * as query from "../src/contract/query";
import * as execute from "../src/contract/execute";
import { Button, Text } from "../src/coreui-components";

const ReceivePage: NextPage = () => {
  const connectedWallet = useConnectedWallet();
  const [updating, setUpdating] = useState(false);
  const [giftId, setGiftId] = useState<string>("");
  const [currentGiftDetail, setCurrentGiftDetail] =
    useState<query.GiftDetail>();

  const loadGiftDetail = async () => {
    if (connectedWallet) {
      setUpdating(true);
      const response = await query.getGiftDetail(
        parseInt(giftId),
        connectedWallet
      );
      setCurrentGiftDetail(response);
      setUpdating(false);
    }
  };

  const claimGift = async () => {
    if (connectedWallet) {
      console.log("Claiming");
      setUpdating(true);
      const response = await execute.claimGift({ gift_id: parseInt(giftId) })(
        connectedWallet
      );
      setUpdating(false);
    }
  };

  // Use Title and Wrapper like any other React component – except they're styled!
  return (
    <div>
      <input
        type="number"
        value={giftId}
        onChange={(e) => {
          setGiftId(e.target.value);
        }}
      />
      <Button onClick={loadGiftDetail}>Load gift</Button>
      <div>
        <Text>To: {currentGiftDetail?.receiver}</Text>
      </div>
      <div>
        <Text>Amount: {currentGiftDetail?.amount} uusd</Text>
      </div>
      <div>
        <Text>Message: {currentGiftDetail?.msg}</Text>
      </div>
      <div>
        <Button
          disabled={
            connectedWallet?.walletAddress !== currentGiftDetail?.receiver
          }
          onClick={claimGift}
        >
          Claim
        </Button>
      </div>
    </div>
  );
};

export default ReceivePage;
