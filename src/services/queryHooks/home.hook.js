import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { GENRE_LIST, MOVIE_CREDIT, MOVIE_DETAILS, MOVIE_LIST } from '../queryKeys/home.key';
import { genre } from '../../data/genre';


const API_KEY = import.meta.env.VITE_MOVIE_DB_API_KEY;
const API_URL = import.meta.env.VITE_API_BASE_URL;

const cacheTime = 600000;


export const useGetGenreFilter = (
  onSuccess,
  onError,
  enabled
) => {
  return useQuery(
    [GENRE_LIST], (data) => axios.get(`${API_URL}/3/genre/movie/list?api_key=${API_KEY}`),
    {
      initialData: genre,
      select: (response) => response.data,
      onSuccess,
      onError,
      enabled: enabled,
      cacheTime: cacheTime,
      refetchOnWindowFocus: false
    }
  );
};

export const useGetMovieList = (
  year,
  page,
  genre,
  onSuccess,
  enabled
) => {
  return useQuery(
    [MOVIE_LIST, year, page, genre], (data) => axios.get(`${API_URL}/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&primary_release_year=${year}&page=${page}&vot
e_count.gte=100&with_genres=${genre}`),
    {
      select: (response) => response.data,
      onSuccess,
      enabled: enabled,
      cacheTime: cacheTime,
      refetchOnWindowFocus: false
    }
  );
};


export const useGetMovieDetails = (
  id,
  enabled,
  onSuccess,
) => {
  return useQuery(
    [MOVIE_DETAILS, id], (data) => axios.get(`${API_URL}/3/movie/${id}?api_key=${API_KEY}`),
    {
      select: (response) => response.data,
      onSuccess,
      enabled: enabled,
      cacheTime: cacheTime,
      refetchOnWindowFocus: false
    }
  );
};

export const useGetMovieCredits = (
  id,
  enabled,
  onSuccess,
) => {
  return useQuery(
    [MOVIE_CREDIT, id], (data) => axios.get(`${API_URL}/3/movie/${id}/credits?api_key=${API_KEY}`),
    {
      select: (response) => response.data,
      onSuccess,
      enabled: enabled,
      cacheTime: cacheTime,
      refetchOnWindowFocus: false
    }
  );
};

