import { Kbd } from "flowbite-react";

import { crossedShoppingBag } from "../../@other/icons";
import { GROUP_BY_ISRC, INFO_BADGES, VA } from "../Artist/constants";

const githubPage = (
  <a
    href="https://github.com/pawllo01/apple-music-artist-browser"
    className="underline underline-offset-2"
  >
    project's GitHub page
  </a>
);

type Faq = {
  question: React.ReactNode;
  answer: React.ReactNode;
};

export const FAQ_DATA: {
  general: Faq[];
  songs: Faq[];
} = {
  general: [
    {
      question: "I have a feature suggestion or feedback.",
      answer: (
        <>
          Please share it on the {githubPage}. All suggestions are welcome and
          considered.
        </>
      ),
    },
    {
      question: "I found a bug or an error.",
      answer: (
        <>
          Please report it on the {githubPage}. If possible, include steps to
          reproduce the issue.
        </>
      ),
    },
    {
      question: "I can't open the Videos or Albums tab.",
      answer:
        "These sections are not available yet. They will be added in a future update.",
    },
    {
      question: "What do the badges mean?",
      answer: (
        <div className="space-y-2">
          <p>{INFO_BADGES.explicit} — Explicit content.</p>
          <p>
            {INFO_BADGES.clean} — Clean version (edited for explicit content).
          </p>
          <p>
            {INFO_BADGES.dolby_atmos} — Dolby Atmos. Indicates that the song is
            available to play in Dolby Atmos.
          </p>
          <p>
            {INFO_BADGES.streaming_only} — Streaming only. This release is
            available on Apple Music but cannot be purchased from the iTunes
            Store in the selected country.
          </p>
          <p>
            {INFO_BADGES.purchase_only} — Purchase only. This release is
            available in the iTunes Store but cannot be streamed on Apple Music
            in the selected country.
          </p>
          <p>
            {INFO_BADGES.various_artists} — {VA}. Indicates that the album is
            credited to {VA} instead of a single primary artist.
          </p>
        </div>
      ),
    },
    {
      question: "What does changing the country do?",
      answer:
        "Changing the country changes the Apple Music catalog you're browsing. Song, album, music video, and availability may differ between countries.",
    },
    {
      question: (
        <span>
          What does the crossed shopping bag {crossedShoppingBag} mean?
        </span>
      ),
      answer:
        "The crossed shopping bag indicates that the selected country does not have an iTunes Store. Purchase-related information, such as purchase-only releases, is therefore unavailable for that storefront.",
    },
    {
      question: "Why can't I find a specific song or album?",
      answer:
        "Not all content is available in every country. Try switching to another storefront using the country selector.",
    },
    {
      question: "Why is the website slow sometimes?",
      answer:
        "Large artists may have thousands of songs. Initial loading can take longer, especially on slower connections.",
    },
    {
      question: "Is my data stored?",
      answer:
        "User preferences such as column layout, settings, and selected country are stored locally in your browser.",
    },
    {
      question: "Is this an official Apple Music website?",
      answer:
        "No. This is an independent project that uses Apple Music data. It is not affiliated with or endorsed by Apple.",
    },
  ],
  songs: [
    {
      question: "How do I play song previews?",
      answer:
        "Click the track cover or double-click the song row in the table to start playing the preview.",
    },
    {
      question: "In what order are songs loaded?",
      answer:
        "Songs are loaded in descending order by their ID. Songs with higher IDs appear first.",
    },
    {
      question: "How do I sort by multiple columns?",
      answer: (
        <>
          Click any sortable column to sort it. Then hold <Kbd>Shift</Kbd> while
          clicking another column to add it to the sorting order.
        </>
      ),
    },
    {
      question: "My sorting resets when I change artists.",
      answer: (
        <>
          Enable <b>Preserve column sorting</b> in Settings&nbsp;(⚙️) to keep
          the same sorting when switching between artists.
        </>
      ),
    },
    {
      question: "How do I customize the table columns?",
      answer: (
        <>
          Open the <b>Columns</b> menu to show or hide columns. You can also
          drag and drop column names to change their order.
        </>
      ),
    },
    {
      question: "I messed up my column layout. How do I reset it?",
      answer: (
        <>
          Open Settings&nbsp;(⚙️) and click <b>Reset columns</b>.
        </>
      ),
    },
    {
      question: "What is an ISRC?",
      answer:
        "The International Standard Recording Code (ISRC) is an international standard code for uniquely identifying sound recordings and music video recordings.",
    },
    {
      question: `What does "${GROUP_BY_ISRC}" do?`,
      answer: (
        <>
          When enabled, songs with the same ISRC are grouped together, so each
          recording appears only once. If a song is available on multiple
          releases (album, deluxe edition, compilation, soundtrack, single,
          etc.), you can expand the group to view all available releases of that
          recording.
          <br />
          <br />
          When disabled, every release is displayed separately, so the same song
          may appear multiple times.
        </>
      ),
    },
    {
      question: "How do I view every song?",
      answer: (
        <>
          First, load all songs by clicking <b>Load&nbsp;all</b> next to the
          song count, or scroll to the bottom of the page to load more songs
          automatically.
          <br />
          <br />
          To see every individual release, either expand all grouped rows or
          disable <b>{GROUP_BY_ISRC}</b> in Settings&nbsp;(⚙️). The total number
          of results will then match the number of songs loaded from Apple
          Music.
        </>
      ),
    },
  ],
};
