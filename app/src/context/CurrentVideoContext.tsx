import { createContext } from "react";
import { Video } from "../@types/video";

type CurrentVideoContextType = {
  currentVideo: Video | null;
  setCurrentVideo: React.Dispatch<React.SetStateAction<Video | null>>;
};

export const CurrentVideoContext =
  createContext<CurrentVideoContextType | null>(null);
