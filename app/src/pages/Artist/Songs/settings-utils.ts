import type { SongsSettings } from "./useSongsSettings";

export type SettingsProps = {
  settings: SongsSettings;
  resetColumns: () => void;
};

export const clearSongsSettings = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("songs:")) localStorage.removeItem(key);
  });
  window.location.reload();
};
