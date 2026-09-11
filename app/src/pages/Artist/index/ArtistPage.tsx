import { useContext, useEffect } from "react";

import { Alert, Button } from "flowbite-react";
import { FaPlay } from "react-icons/fa";
import { HiInformationCircle } from "react-icons/hi";
import { IoMdAlbums } from "react-icons/io";
import { MdAudiotrack, MdPersonalVideo } from "react-icons/md";
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router";

import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "../../../@other/fuctions";
import { Artist } from "../../../@types/artist";
import Avatar from "../../../components/Avatar";
import LabeledValue from "../../../components/LabeledValue";
import TabSelector from "../../../components/TabSelector";
import { MarketContext } from "../../../context/MarketContext";
import { RecentArtistsContext } from "../../../context/RecentArtistsContext";
import { FooterHeightContextType } from "../../../layouts/BaseLayout";
import ArtistBioModal from "./ArtistBioModal";

const sections = [
  { value: "songs", Icon: MdAudiotrack },
  { value: "videos", Icon: MdPersonalVideo },
  { value: "albums", Icon: IoMdAlbums },
];

export default function ArtistPage() {
  const { market } = useContext(MarketContext)!;
  const { addRecentArtist } = useContext(RecentArtistsContext)!;
  const { height: footerHeight } = useOutletContext<FooterHeightContextType>();

  const navigate = useNavigate();
  const { artistId } = useParams();
  const { state, pathname } = useLocation();
  const stateArtist = state?.artist as Artist | undefined;

  const {
    data: artist,
    error,
    isPending,
  } = useQuery({
    queryKey: ["artist", artistId, market],
    retry: false,

    // prevent fetching when artist is passed from state
    // refetch on market change
    initialData:
      stateArtist && stateArtist.href.includes(`/${market}/`)
        ? stateArtist
        : undefined,
    staleTime: Infinity,

    queryFn: async ({ signal }) => {
      const data = await apiFetch<Artist>(
        `${import.meta.env.VITE_API_URL}/artists/${artistId}?market=${market}`,
        "Failed to fetch artist. The service is temporarily unavailable.",
        signal,
      );
      return data;
    },
  });

  useEffect(() => {
    if (artist) addRecentArtist(artist);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artist]);

  if (isPending) return;

  if (error)
    return (
      <section className="flex-1 p-4 pt-6">
        <Alert color="failure" icon={HiInformationCircle}>
          {error.message}
        </Alert>
      </section>
    );

  return (
    <section className="flex-1 px-4 pt-6">
      {/* Artist info */}
      <div className="flex flex-col items-center gap-4 lg:flex-row">
        {/* Avatar */}
        <Avatar
          url={artist.attributes.artwork?.url}
          className="size-50 shadow-xl"
        />

        {/* Details */}
        <div className="flex w-full flex-1 flex-col gap-3 lg:grid lg:grid-cols-4">
          {/* Name */}
          <h1 className="text-center text-3xl font-bold lg:text-start">
            {artist.attributes.name}
          </h1>

          {/* From */}
          {artist.attributes.origin && (
            <LabeledValue label="From" value={artist.attributes.origin} />
          )}

          {/* Born or Formed */}
          {artist.attributes.bornOrFormed && (
            <LabeledValue
              label={artist.attributes.isGroup ? "Formed" : "Born"}
              value={artist.attributes.bornOrFormed}
            />
          )}

          {/* Genre */}
          {artist.attributes.genreNames.length > 0 && (
            <LabeledValue
              label="Genre"
              value={artist.attributes.genreNames.join(", ")}
            />
          )}

          {/* Bio */}
          {artist.attributes.artistBio && (
            <div className="col-span-full cursor-pointer rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              <ArtistBioModal text={artist.attributes.artistBio} />
            </div>
          )}

          {/* Listen on Apple Music */}
          <div className="col-span-full">
            <Button
              as="a"
              href={`https://music.apple.com/${market}/artist/${artistId}`}
              target="_blank"
              color="red"
              className="gradient rounded-full max-sm:h-11 sm:w-fit"
            >
              <FaPlay className="me-2" />
              Listen on Apple Music
            </Button>
          </div>
        </div>
      </div>

      <div style={{ minHeight: `calc(100dvh - ${footerHeight}px)` }}>
        {/* Sections */}
        <TabSelector
          options={sections.map(({ value, Icon }) => ({
            value,
            label: (
              <span className="flex items-center gap-1 capitalize">
                <Icon size={16} />
                {value}
              </span>
            ),
          }))}
          value={
            sections.find((section) => pathname.includes(section.value))
              ?.value ?? "songs"
          }
          onChange={(value) => {
            navigate(`/artist/${artistId}/${value}`, { replace: true });
          }}
        />

        {/* Section */}
        <Outlet />
      </div>
    </section>
  );
}
