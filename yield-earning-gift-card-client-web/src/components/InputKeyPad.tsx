import styled from "@emotion/styled";
import { Button, Typography } from "@mui/material";
import { SpaceUnit } from "../constants/design";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
`;

const BaseKeyPadButton = styled(Button)`
  width: ${SpaceUnit.eleven}px;
  height: ${SpaceUnit.eleven}px;
`;

export enum KeyPadSelections {
  one = "1",
  two = "2",
  three = "3",
  four = "4",
  five = "5",
  six = "6",
  seven = "7",
  eight = "8",
  nine = "9",
  empty = "",
  zero = "0",
  del = "<",
}

const KeyPadButton = ({
  value,
  onClick,
}: {
  value: KeyPadSelections;
  onClick: (val: KeyPadSelections) => void;
}) => {
  if (value === KeyPadSelections.empty) {
    return <div></div>;
  }

  return (
    <BaseKeyPadButton onClick={() => onClick(value)} variant="text">
      <Typography variant="h2">{value}</Typography>
    </BaseKeyPadButton>
  );
};

export const InputKeyPad = ({
  onClick,
}: {
  onClick: (val: KeyPadSelections) => void;
}) => {
  return (
    <Wrapper>
      {Object.values(KeyPadSelections).map((value) => (
        <KeyPadButton key={value} value={value} onClick={onClick} />
      ))}
    </Wrapper>
  );
};
