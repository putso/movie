import { Movie } from '@/type';
// import { getRatedMovie } from "./film";

const key = 'movie';

type RatedMOvie = Movie & {
  userRate: number;
};
export function getMoviesfromLS(): RatedMOvie[] {
  return JSON.parse(localStorage.getItem(key) || '[]');
}

export function addMovietoLS(movie: RatedMOvie) {
  const movies = getMoviesfromLS();
  const map = movies.reduce((map, item) => {
    map.set(item.id, item);
    return map;
  }, new Map());
  map.set(movie.id, movie);
  localStorage.setItem(key, JSON.stringify(Array.from(map.values())));
}
export function getRatedMoviefromLS() {
  const data = getMoviesfromLS();
  const map: { [n: number]: number } = {};
  data.forEach((item) => {
    map[item.id] = item.userRate;
  });
  return map;
}
