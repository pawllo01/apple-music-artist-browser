import { ToggleSwitch } from "flowbite-react";
import { Type } from "../../@types/item-types";

export const createToggleSwitch = (
  label: string,
  checked: boolean,
  setChecked: React.Dispatch<React.SetStateAction<boolean>>,
) => (
  <ToggleSwitch
    sizing="sm"
    className="my-3"
    label={label}
    checked={checked}
    onChange={() => setChecked((prev) => !prev)}
  />
);

export const clearSettingsByType = (type: Type) => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(`${type}:`)) localStorage.removeItem(key);
  });
  window.location.reload();
};
