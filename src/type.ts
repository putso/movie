export type MovieResponse = {
  total_pages: number;
  total_results: number;
  results: Movie[];
};
export type Movie = {
  id: number;
  adult: boolean;
  original_title: string;
  overview: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
};
// type params = {query:string,page:string};
export type session = {
  success: boolean;
  guest_session_id: string;
  expires_at: string;
};
export type getFilmsType = (query: string, page: number) => Promise<MovieResponse>;
export type tab = 'Search' | 'Rated';
