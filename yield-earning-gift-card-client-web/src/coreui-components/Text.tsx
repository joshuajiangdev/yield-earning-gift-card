import { FC } from "react";
import { GeneralSize } from "../constants/design";

interface TextProps {
  size?: GeneralSize;
}

const Text: FC<TextProps> = ({ children, size = GeneralSize.medium }) => {
  return <span>{children}</span>;
};

export { Text };
