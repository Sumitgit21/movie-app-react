import React, { useState, memo, useEffect } from 'react';
import '../assets/css/MovieCard.scss'
import { useInView } from 'react-intersection-observer';
import { useGetMovieCredits, useGetMovieDetails } from '../services/queryHooks/home.hook';
const MovieCard = ({ movie, id, title, image, cast, short_description, overview }) => {
    const [credits, setCredits] = useState([]);
    const [director, setDirector] = useState([]);

    const [cardRef, inView] = useInView({
        fallbackInView: true,
        threshold: 0
    });

    const onCreditGetSuccess = (data) => {
        console.log("credit data", id, data)
        const { cast, crew } = data || { cast: [], crew: [] };
        console.log("cast", cast?.slice(0, 3))
        console.log("crew", crew.filter(x => x.known_for_department === 'Directing')[0])
        setCredits(cast?.slice(0, 3));
        setDirector(crew.filter(x => x.known_for_department === 'Directing')[0])

    }
    const { data, isLoading: isMovieCreditLoading, refetch: refetchCredits } = useGetMovieCredits(id, false, onCreditGetSuccess)
    const { data: movieDetails, isLoading, refetch: getMovieDetails } = useGetMovieDetails(id, false)
    const { genres } = movieDetails || { genres: [] };

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const genreResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=2dca580c2a14b55200e784d157207b4d`);
                const genreData = await genreResponse.json();
                // setGenres(genreData.genres);

                const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=2dca580c2a14b55200e784d157207b4d`);
                const creditsData = await creditsResponse.json();
                setCredits(creditsData?.cast?.slice(0, 3));
                setDirector(creditsData?.crew.filter(x => x.known_for_department === 'Directing')[0])
            } catch (error) {
                console.error('Error fetching movie data:', error);
            }
        };

        if (inView && genres?.length <= 0) {
            getMovieDetails();
            refetchCredits();
        }
    }, [inView]);

    const handleImageError = (e) => {
        e.target.src = 'https://via.placeholder.com/200x300';
        e.target.onerror = null;
    };


    return (
        <>

            <div ref={cardRef} className="movie-card">
                <img className="movie-card__image" src={image ? `https://image.tmdb.org/t/p/w200/${image}` : 'https://via.placeholder.com/200x300'} onError={handleImageError} alt={movie.title} />
                <div className="movie-card__content">
                    {title && <h4 className="movie-card__title">{title}</h4>}
                    {genres?.length > 0 && <span className="movie-card__genre pill">{genres.map(genre => genre.name).join(', ')}</span>}
                    {overview && <p className="movie-card__description ">{overview}</p>}

                    <div className='movie-card__credit-section'>
                        {director && <span className="movie-card__director"><span>Director : </span> {director?.name ? director.name : 'not available'} </span>}
                        {credits?.length > 0 && <span className="movie-card__credit"><span>Credit :</span> {credits.map((actor) => actor.name).join(', ')}</span>}
                    </div>

                </div>
            </div>

        </>

    );
};

export default memo(MovieCard);
