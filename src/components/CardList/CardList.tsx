import React from 'react';
import MovieCard from '../MovieCard';
import style from './CardList.module.scss';
import { Movie } from '../../type';
import { Alert, Button, Pagination, Result, Spin } from 'antd';
const CardList = ({
  movies,
  isLoading,
  isError,
  isOnline,
  loadMovie,
  updatePage,
  totalPage,
  page,
  setUserRating,
  ratedMovie,
}: {
  page: number;
  movies: Movie[];
  isLoading: boolean;
  isError: boolean;
  loadMovie: () => void;
  isOnline: boolean;
  updatePage: (page: number) => void;
  totalPage: number;
  setUserRating: (n: number, id: number) => void;
  ratedMovie: { [n: number]: number };
}) => {
  if (!isOnline) {
    return (
      <div className={style.container}>
        <Alert className={style.middle} message="Нет подключения к интернету" type="warning" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className={style.container}>
        <Alert
          className={style.middle}
          message="Что-то пошло не так"
          type="error"
          action={
            <Button size="small" type="primary" onClick={loadMovie}>
              Обновить страницу
            </Button>
          }
        />
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className={style.container}>
        <Spin className={style.middle} size="large" />
      </div>
    );
  }
  if (movies.length == 0) {
    return (
      <div className={style.container}>
        <Result className={style.middle} title="Ничего не найдено" />
      </div>
    );
  }
  return (
    <>
      <div className={style.container}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} ratedMovie={ratedMovie} movie={movie} setUserRating={setUserRating} />
        ))}
      </div>
      <Pagination
        className={style.pagination}
        current={page}
        pageSize={20}
        onChange={(value) => {
          updatePage(value);
        }}
        defaultCurrent={1}
        total={totalPage}
        hideOnSinglePage
      />
    </>
  );
};

export default CardList;
