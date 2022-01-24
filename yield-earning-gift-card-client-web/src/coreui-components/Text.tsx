import { FC } from "react";
import { TextSize } from "../constants/design";

interface TextProps {
  size?: TextSize;
}

const Text: FC<TextProps> = ({ children, size = TextSize.medium }) => {
  return <span>{children}</span>;
};

export { Text };
