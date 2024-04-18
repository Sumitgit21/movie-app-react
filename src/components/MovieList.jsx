import React, { memo } from 'react'
import MovieCard from './MovieCard';

function MovieList({ movies }) {
    return (
        movies.map(([year, yearData]) => (
            <div className="movie-list__year">
                {year?.length > 0 && <h2 className="movie-list__year-heading">{year}</h2>}
                <div className="movie-list__movies">
                    {yearData.map(movie => (
                        <MovieCard key={`${movie.id}_${year}`} id={movie.id} movie={movie} image={movie.poster_path} overview={movie.overview} title={movie.title} />
                    ))}
                </div>
            </div>
        )))
}

export default memo(MovieList);