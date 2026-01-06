import { env } from "./env.js";

export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p",
  DEFAULT_LANGUAGE: "en-US",
};

export const tmdbAxiosConfig = {
  headers: {
    Authorization: `Bearer ${env.tmdbToken}`,
    "Content-Type": "application/json;charset=utf-8",
  },
  timeout: 8000,
};
