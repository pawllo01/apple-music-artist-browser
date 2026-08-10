import { useContext, useEffect } from "react";

import { Alert, Button, ButtonGroup } from "flowbite-react";
import { FaPlay } from "react-icons/fa";
import { HiInformationCircle } from "react-icons/hi";
import { IoMdAlbums } from "react-icons/io";
import { MdAudiotrack, MdPersonalVideo } from "react-icons/md";
import { Link, Outlet, useLocation, useParams } from "react-router";

import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "../../@other/fuctions";
import { Artist } from "../../@types/artist";
import Avatar from "../../components/Avatar";
import LabeledValue from "../../components/LabeledValue";
import { MarketContext } from "../../context/MarketContext";
import { RecentArtistsContext } from "../../context/RecentArtistsContext";
import ArtistBioModal from "./ArtistBioModal";

export default function ArtistPage() {
  const { market } = useContext(MarketContext)!;
  const { addRecentArtist } = useContext(RecentArtistsContext)!;

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

  const artistType = artist.attributes.isGroup ? "Group" : "Artist";

  const sections = [
    {
      name: "Songs",
      pathname: "/songs",
      Icon: MdAudiotrack,
    },
    {
      name: "Videos",
      pathname: "/videos",
      Icon: MdPersonalVideo,
    },
    {
      name: "Albums",
      pathname: "/albums",
      Icon: IoMdAlbums,
    },
  ];

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
              label={artistType === "Artist" ? "Born" : "Formed"}
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
              className="gradient rounded-full sm:w-fit"
            >
              <FaPlay className="me-2" />
              Listen on Apple Music
            </Button>
          </div>
        </div>
      </div>

      {/* Sections */}
      <ButtonGroup className="mt-4 mb-0.5 w-full rounded-full">
        {sections.map((section, index) => (
          <Button
            key={index}
            as={Link}
            to={`/artist/${artistId}${section.pathname}`}
            replace
            color="alternative"
            className={`section-btn ${pathname.includes(section.pathname) ? "bg-gray-600! text-white! dark:bg-gray-900!" : ""}`}
            disabled={section.name !== "Songs"} // temp
          >
            <section.Icon size={16} />
            {section.name}
          </Button>
        ))}
      </ButtonGroup>

      <Outlet />
    </section>
  );
}
