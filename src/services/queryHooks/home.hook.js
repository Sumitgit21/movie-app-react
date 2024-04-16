import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { GENRE_LIST, MOVIE_LIST } from '../queryKeys/home.key';
import { genre } from '../../data/genre';


const API_KEY = import.meta.env.VITE_MOVIE_DB_API_KEY;
const API_URL = import.meta.env.VITE_API_BASE_URL;

const cacheTime = 600000;
// export const useGetTopicList = (onSuccess, enabled) => {
//   return useInfiniteQuery(
//     ASK_CLIR_TOPICS,
//     ({ pageParam = 0 }) => axios.get(`bot/historyQNAlist?from=${pageParam}&to=10`),
//     {
//       refetchOnWindowFocus: false,
//       cacheTime: cacheTime,
//       onSuccess,
//       enabled,
//       getNextPageParam: (lastPage, allPages) => {
//         if (lastPage?.data?.data?.length > 0) {
//           return allPages.length * 10;
//         } else {
//           return undefined;
//         }
//       }
//       // onSuccess,
//       // select: res => res.data.data
//     }
//   );
// };



// export const useGetDiagnosisTopicList = (onSuccess, enabled) => {
//   return useInfiniteQuery(
//     DIAGNOISIS_TOPIC_LIST,
//     ({ pageParam = 0 }) => axiosInstance.get(`bot/historyDiagnosislist?from=${pageParam}&to=10`),
//     {
//       refetchOnWindowFocus: false,
//       cacheTime: cacheTime,
//       onSuccess,
//       enabled,
//       getNextPageParam: (lastPage, allPages) => {
//         if (lastPage?.data?.data?.length > 0) {
//           return allPages.length * 10;
//         } else {
//           return undefined;
//         }
//       },
//     }
//   );
// };

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
    [MOVIE_LIST, year, page], (data) => axios.get(`${API_URL}/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&primary_release_year=${year}&page=${page}&vot
e_count.gte=100&with_genres=${genre}`),
    {
      initialData: genre,
      select: (response) => response.data,
      onSuccess,

      enabled: enabled,
      cacheTime: cacheTime,
      refetchOnWindowFocus: false
    }
  );
};

