import ResetButton from "../../../components/ResetButton";
import DrawerSettings from "../DrawerSettings";
import { clearSettingsByType, createToggleSwitch } from "../settings-utils";
import { VideosSettingsType } from "./useVideosSettings";

type VideosSettingsProps = {
  settings: VideosSettingsType;
};

export default function VideosSettings({ settings }: VideosSettingsProps) {
  return (
    <DrawerSettings>
      {createToggleSwitch(
        "Crop thumbnails (remove black bars)",
        settings.cropThumbnails,
        settings.setCropThumbnails,
      )}

      {createToggleSwitch(
        "Show video numbers",
        settings.showVideoNumbers,
        settings.setShowVideoNumbers,
      )}

      {createToggleSwitch(
        'Show "From: Album"',
        settings.showFromAlbum,
        settings.setShowFromAlbum,
      )}

      {createToggleSwitch(
        "Show artists",
        settings.showArtists,
        settings.setShowArtists,
      )}

      {createToggleSwitch(
        "Show genre",
        settings.showGenre,
        settings.setShowGenre,
      )}

      {createToggleSwitch(
        "Show full release date",
        settings.showFullReleaseDate,
        settings.setShowFullReleaseDate,
      )}

      {createToggleSwitch("Show ISRC", settings.showIsrc, settings.setShowIsrc)}

      {createToggleSwitch(
        "Show video ID",
        settings.showVideoId,
        settings.setShowVideoId,
      )}

      <ResetButton onClick={() => clearSettingsByType("videos")}>
        Reset
      </ResetButton>
    </DrawerSettings>
  );
}
