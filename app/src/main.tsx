import "./index.css";
import "react-loading-skeleton/dist/skeleton.css";
import "react-h5-audio-player/lib/styles.css";

import { StrictMode } from "react";

import { initThemeMode } from "flowbite-react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeInit } from "../.flowbite-react/init";
import MarketProvider from "./context/MarketProvider.tsx";
import RecentArtistsProvider from "./context/RecentArtistsProvider.tsx";
import BaseLayout from "./layouts/BaseLayout.tsx";
import ErrorBoundaryLayout from "./layouts/ErrorBoundaryLayout.tsx";
import AlbumsPage from "./pages/Artist/Albums/AlbumsPage.tsx";
import ArtistPage from "./pages/Artist/index/ArtistPage.tsx";
import SongsPage from "./pages/Artist/Songs/SongsPage.tsx";
import VideosPage from "./pages/Artist/Videos/VideosPage.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import FAQ from "./pages/FAQ/FAQ.tsx";
import HomePage from "./pages/Home/HomePage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    Component: BaseLayout,
    children: [
      {
        Component: ErrorBoundaryLayout,
        ErrorBoundary: ErrorPage,
        children: [
          // Home page
          { index: true, Component: HomePage },

          // Artist page
          {
            path: "/artist/:artistId",
            Component: ArtistPage,
            children: [
              { index: true, element: <Navigate to="songs" replace /> },
              { path: "songs", Component: SongsPage },
              { path: "videos", Component: VideosPage },
              { path: "albums", Component: AlbumsPage },
            ],
          },

          // FAQ
          { path: "/faq", Component: FAQ },

          // Not found
          { path: "*", Component: NotFound },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeInit />
      <MarketProvider>
        <RecentArtistsProvider>
          <RouterProvider router={router} />
        </RecentArtistsProvider>
      </MarketProvider>
    </QueryClientProvider>
  </StrictMode>,
);

initThemeMode({ defaultMode: "light" });
