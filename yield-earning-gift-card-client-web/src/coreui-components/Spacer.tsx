import styled from "@emotion/styled";
import { SpaceUnit } from "../constants/design";

interface SpacerProps {
  space: SpaceUnit;
  vertical?: boolean;
}

export const Spacer = styled.div<SpacerProps>`
  width: ${(p) => (p.vertical ? 0 : p.space)}px;
  height: ${(p) => (p.vertical ? p.space : 0)}px;
`;
