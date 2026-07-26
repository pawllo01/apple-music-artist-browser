import type { Song } from "./song";

export type SongWithChildren = Song & {
  children?: Song[];
};
