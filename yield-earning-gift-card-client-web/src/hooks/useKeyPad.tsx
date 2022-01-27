import { useState } from "react";
import { InputKeyPad, KeyPadSelections } from "../components/InputKeyPad";

export const useKeyPad = (): [string, JSX.Element] => {
  const [value, setValue] = useState("0");

  const handleClick = (val: KeyPadSelections) => {
    switch (val) {
      case KeyPadSelections.del: {
        const newVal = value.slice(0, -1);
        setValue(newVal.length === 0 ? "0" : newVal);

        break;
      }
      default: {
        if (value === "0") {
          setValue(val);
        } else if (value.length > 3) {
          break;
        } else {
          const newVal = value + val;
          setValue(newVal);
        }
      }
    }
  };

  const component = <InputKeyPad onClick={handleClick} />;

  return [value, component];
};
