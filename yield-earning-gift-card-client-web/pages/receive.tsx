import { useConnectedWallet } from "@terra-money/wallet-provider";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import styled from "styled-components";
import * as query from "../src/contract/query";
import { Button, Text } from "../src/coreui-components";

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

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

  // Use Title and Wrapper like any other React component – except they're styled!
  return (
    <Wrapper>
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
    </Wrapper>
  );
};

export default ReceivePage;
