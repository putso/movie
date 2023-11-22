import { Rate, Space, Tag } from 'antd';
import React from 'react';
import style from './MovieCard.module.scss';
import { Movie } from '../../type';
import { format, parseISO } from 'date-fns';
import GenresContext from '../GernesContext';
import { addMovietoLS } from '@/api/localStorage';
function shortenText(str: string, limit = 70) {
  let len = 0;
  let shortText;
  const shortWorlds = [];
  const worlds = str.split(' ');
  for (let i = 0; i < worlds.length; i++) {
    if (len + worlds[i].length >= limit) break;
    shortWorlds.push(worlds[i]);
    len += worlds[i].length;
  }
  shortText = shortWorlds.join(' ');
  if (shortWorlds.length < worlds.length) shortText += '...';
  return shortText;
}
function formatData(str: string) {
  let result;
  try {
    const date = parseISO(str);
    result = format(date, 'd MMM, yyyy');
  } catch (e) {
    result = '';
  }
  return result;
}
function getColor(rate: number) {
  if (rate < 3) return style.color3;
  if (rate < 5) return style.color5;
  if (rate < 7) return style.color7;
  return style.color10;
}
const MovieCard = ({
  movie,
  setUserRating,
  ratedMovie,
}: {
  movie: Movie;
  setUserRating: (n: number, id: number) => void;
  ratedMovie: { [n: number]: number };
  userRate?: number;
}) => {
  const title = shortenText(movie.original_title, 15);
  const date = formatData(movie.release_date);
  const rate = Number(movie.vote_average.toFixed(1));
  const description = shortenText(movie.overview);
  const userRate = Number(ratedMovie[movie.id]);
  return (
    <GenresContext.Consumer>
      {(GenresContext) => (
        <article className={style.card}>
          <img src="" alt="" className={style.image} />
          <header className={style.header}>
            <div className={style.flex}>
              <h2 className={style.title}>{title}</h2>
              <div className={style.rate + ' ' + getColor(rate)}>{rate}</div>
            </div>
            <div className={style.date}>{date}</div>
            <div>
              <Space size={[0, 8]} wrap>
                {movie.genre_ids.map((id, i) => (
                  <Tag key={i}>{GenresContext[id]}</Tag>
                ))}
              </Space>
            </div>
          </header>
          <div className={style.description}>
            <p>{description}</p>
            <div className={style.star}>
              <Rate
                onChange={(value) => {
                  addMovietoLS({ ...movie, userRate: value });
                  setUserRating(value, movie.id);
                }}
                allowHalf
                value={(userRate || 0) / 2}
              />
            </div>
          </div>
        </article>
      )}
    </GenresContext.Consumer>
  );
};

export default MovieCard;
