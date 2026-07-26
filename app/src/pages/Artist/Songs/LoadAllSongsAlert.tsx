import { useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Label,
  Progress,
  ThemeProvider,
} from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";

type LoadAllSongsAlertProps = {
  songsLength: number;
  totalSongs: number | undefined;
  isFetching: boolean;
  isFetchingAll: boolean;
  fetchAllSongs: () => Promise<void>;
};

export default function LoadAllSongsAlert({
  songsLength,
  totalSongs,
  isFetching,
  isFetchingAll,
  fetchAllSongs,
}: LoadAllSongsAlertProps) {
  const [showAlert, setShowAlert] = useState<boolean>(
    () => localStorage.getItem("songs:show-load-all-songs") !== "false",
  );
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);

  const saveShowAlert = () => {
    if (dontShowAgain)
      localStorage.setItem("songs:show-load-all-songs", JSON.stringify(false));
  };

  return (
    showAlert &&
    totalSongs &&
    songsLength !== totalSongs && (
      <Alert
        color="warning"
        className="mx-auto my-4 w-fit"
        icon={HiInformationCircle}
        onDismiss={() => setShowAlert(false)}
        additionalContent={
          <div className="mt-2">
            <p>
              Keep scrolling to load more songs automatically, or load all songs
              now.
            </p>

            <ThemeProvider
              theme={{ progress: { bar: "text-white dark:text-white" } }}
            >
              <Progress
                color="yellow"
                className="mt-2 font-sans"
                progress={Math.round((songsLength / totalSongs) * 100)}
                progressLabelPosition="inside"
                size="lg"
                labelProgress
              />
            </ThemeProvider>

            <div className="mt-3 flex items-center gap-2">
              <Checkbox
                color="yellow"
                id="dont-show-again"
                checked={dontShowAgain}
                onChange={() => setDontShowAgain((prevState) => !prevState)}
              />
              <Label htmlFor="dont-show-again" className="text-current">
                Never show this again
              </Label>
            </div>

            <div className="mt-3 flex gap-2">
              <Button
                color="light"
                disabled={isFetching && !isFetchingAll}
                onClick={() => {
                  fetchAllSongs();
                  saveShowAlert();
                }}
              >
                {isFetchingAll ? "Stop loading" : "Load all songs"}
              </Button>

              <Button
                color="yellow"
                outline
                className="border-yellow-400 text-yellow-500 dark:border-yellow-500 dark:text-yellow-600"
                onClick={() => {
                  setShowAlert(false);
                  saveShowAlert();
                }}
              >
                Dismiss
              </Button>
            </div>
          </div>
        }
      >
        <span className="font-medium">
          {songsLength} / {totalSongs} songs loaded
        </span>
      </Alert>
    )
  );
}
