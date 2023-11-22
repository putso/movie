import React from 'react';
import style from './App.module.scss';
import Header from '../Header';
import Search from '../Search';
import CardList from '../CardList';
import { addRatedMovie, getFilms, getGenres, getRatedMovie } from '@/api/film';
import { Movie, tab } from '@/type';
import { debounce } from 'lodash';
import GenresContext from '../GernesContext';
import { getMoviesfromLS, getRatedMoviefromLS } from '@/api/localStorage';
type state = {
  movies: Movie[];
  isLoading: boolean;
  isError: boolean;
  isOnline: boolean;
  query?: string;
  totalPage: number;
  page: number;
  session: string;
  ratedMovie: {
    [n: number]: number;
  };
  genresMap: { [n: number]: string };
  tab: tab;
};
class App extends React.Component<object, state> {
  constructor(props: object) {
    super(props);
    this.state = {
      movies: [],
      isLoading: true,
      isError: false,
      isOnline: true,
      query: undefined,
      page: 1,
      totalPage: 1,
      session: '',
      ratedMovie: getRatedMoviefromLS(),
      genresMap: {},
      tab: 'Search',
    };
    this.componentDidCatch = this.componentDidMount.bind(this);
    this.loadMovie = this.loadMovie.bind(this);
    this.updatePage = this.updatePage.bind(this);
    this.setOffline = this.setOffline.bind(this);
    this.setOnline = this.setOnline.bind(this);
    this.updateQuery = this.updateQuery.bind(this);
    this.debounceRequest = this.debounceRequest.bind(this);
    this.debounceRequest = debounce(this.debounceRequest, 500);
    this.forceUpdate = this.forceUpdate.bind(this);
  }
  updatePage(page: number) {
    this.setState(() => ({ page }));
  }
  async loadMovie() {
    if (!this.state.isOnline) {
      this.setState(() => ({ movies: [] }));
      return;
    }
    const { query = 'return', page = 1 } = { query: this.state.query, page: this.state.page };
    this.setState(() => ({ isLoading: true, isError: false }));
    try {
      const movieResponse = await getFilms(query, page);
      const movieList = movieResponse.results;
      this.setState(() => ({ movies: movieList, isLoading: false, totalPage: movieResponse.total_results }));
    } catch (e) {
      this.setState(() => ({ isError: true }));
    }
  }
  setOnline() {
    this.setState(() => {
      return { isOnline: true };
    });
  }
  componentDidUpdate(_: object, prevState: Readonly<state>): void {
    if (!this.state.isOnline) return;
    if ((prevState.isOnline != this.state.isOnline, prevState.page != this.state.page)) {
      this.loadMovie();
      return;
    }
    if (prevState.query != this.state.query) this.debounceRequest();
    if (prevState.tab == this.state.tab) return;
    if (this.state.tab == 'Search') this.loadMovie();
    if (this.state.tab == 'Rated') this.loadRatedMovie();
  }
  loadRatedMovie = async () => {
    this.setState(() => ({ isLoading: true, isError: false }));
    try {
      const movieResponse = await getRatedMovie();
      let movieList: Movie[] = movieResponse.results;
      if (!movieList.length) movieList = getMoviesfromLS();
      this.setState(() => ({ movies: movieList, isLoading: false, totalPage: movieResponse.total_results }));
    } catch (e) {
      this.setState(() => ({ isError: true, isLoading: false }));
    }
  };
  setOffline() {
    this.setState(() => ({ isOnline: false }));
  }
  loadGenres = async () => {
    const genres = await getGenres();
    this.setState(() => ({ genresMap: genres }));
  };
  async componentDidMount() {
    await this.loadGenres();
    this.loadMovie();

    window.addEventListener('offline', () => {
      this.setOffline();
    });
    window.addEventListener('online', () => {
      this.setOnline();
    });
  }
  forceUpdate(): void {}
  componentDidCatch() {
    this.setState(() => ({ isError: true }));
  }
  debounceRequest() {
    this.loadMovie();
  }
  updateQuery(query: string) {
    this.setState(() => ({ query }));
  }
  setUserRating = async (rate: number, id: number) => {
    rate *= 2;
    this.setState(({ ratedMovie }) => ({ ratedMovie: { ...ratedMovie, [id]: rate } }));
    await addRatedMovie(rate, id);
  };
  setTab = (tab: tab) => {
    this.setState(() => ({ tab }));
  };

  render() {
    const isLoading = this.state.isLoading;
    const tab = this.state.tab;

    return (
      <div className={style.container}>
        <Header setTab={this.setTab}></Header>
        {tab == 'Search' && <Search onChange={this.updateQuery} query={this.state.query || ''}></Search>}
        <GenresContext.Provider value={this.state.genresMap}>
          <CardList
            ratedMovie={this.state.ratedMovie}
            totalPage={this.state.totalPage}
            page={this.state.page}
            updatePage={this.updatePage}
            isOnline={this.state.isOnline}
            isError={this.state.isError}
            movies={this.state.movies || []}
            isLoading={isLoading}
            setUserRating={this.setUserRating}
            forceUpdate={() => this.forceUpdate()}
          ></CardList>
        </GenresContext.Provider>
      </div>
    );
  }
}

export default App;
