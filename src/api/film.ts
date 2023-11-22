import { MovieResponse, getFilmsType, session } from '@/type';
let sessionKey: string;
const headers = {
  accept: 'application/json',
  Authorization:
    'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMzJlZjI2YTIyZDYyNTkxOTRlNzlhODhiZjgyODllOSIsInN1YiI6IjY1NWJkNTExMDgxNmM3MDEzN2ViYjY1YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bF1RB0skzbHPAqkZxZWo8NYfdWRZBdwPfZWaJAXNCGI',
};
const baseUrl = `https://api.themoviedb.org/3`;
export const getFilms: getFilmsType = async (query = 'return', page = 1) => {
  if (!sessionKey) sessionKey = (await getSessionKey()).guest_session_id;

  const url = `${baseUrl}/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`;
  const options = {
    method: 'GET',
    headers,
  };
  const response = await fetch(url, options);
  const data = await response.json();
  return data as MovieResponse;
};
export async function getSessionKey() {
  const url = `${baseUrl}/authentication/guest_session/new`;
  const options = {
    method: 'GET',
    headers,
  };

  const response = await fetch(url, options);
  const data: session = await response.json();
  return data;
}
export async function getRatedMovie() {
  if (!sessionKey) sessionKey = (await getSessionKey()).guest_session_id;
  const url = `${baseUrl}/guest_session/${sessionKey}/rated/movies?language=en-US&page=1&sort_by=created_at.asc`;
  const options = {
    method: 'GET',
    headers,
  };
  const response = await fetch(url, options);
  const data = await response.json();

  return data;
}
export async function addRatedMovie(value: number, id: number) {
  if (!sessionKey) sessionKey = (await getSessionKey()).guest_session_id;
  const url = `${baseUrl}/movie/${id}/rating?guest_session_id=${sessionKey}`;
  // const url = `${baseUrl}/movie/82520/rating?guest_session_id=0c3bf442494f8fff63e84d4571e37e63`;

  const options = {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({
      value,
    }),
  };
  const response = await fetch(url, options);
  const succses = await response.json();
  return succses;
}
export async function getGenres() {
  const url = `${baseUrl}/genre/movie/list?language=en`;
  const options = {
    method: 'GET',
    headers,
  };
  const response = await fetch(url, options);
  const genres: {
    id: number;
    name: string;
  }[] = (await response.json()).genres;
  const map: {
    [n: number]: string;
  } = {};
  genres.forEach((item) => {
    map[item.id] = item.name;
  });
  return map;
}
