import React, { useState, useEffect } from 'react';
import '../assets/css/MovieCard.scss'
const MovieCard = ({ movie, title, image, genre, cast, short_description, overview }) => {
    const [genres, setGenres] = useState([]);
    const [credits, setCredits] = useState([]);
    const [director, setDirector] = useState([]);
    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const genreResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=2dca580c2a14b55200e784d157207b4d`);
                const genreData = await genreResponse.json();
                setGenres(genreData.genres);

                const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=2dca580c2a14b55200e784d157207b4d`);
                const creditsData = await creditsResponse.json();
                setCredits(creditsData?.cast?.slice(0, 3));
                setDirector(creditsData?.crew.filter(x => x.known_for_department === 'Directing')[0])
            } catch (error) {
                console.error('Error fetching movie data:', error);
            }
        };

        // fetchMovieData();
    }, [movie.id]);

    const handleImageError = (e) => {
        e.target.src = 'https://via.placeholder.com/200x300';
        e.target.onerror = null;
    };

    return (
        <>

            <div className="movie-card">
                <img className="movie-card__image" src={image ? `https://image.tmdb.org/t/p/w200/${image}` : 'https://via.placeholder.com/200x300'} onError={handleImageError} alt={movie.title} />
                <div className="movie-card__content">
                    <h2 className="movie-card__title">{title}</h2>
                    <h2 className="movie-card__title">genre</h2>
                    <p className="movie-card__description ">{overview}</p>
                </div>
            </div>

        </>

    );
};

export default MovieCard;
