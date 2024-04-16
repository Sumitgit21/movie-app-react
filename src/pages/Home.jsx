import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar'
import Spinner from '../components/Spinner'
import MovieCard from '../components/MovieCard';
import '../assets/css/home.scss';
import useDetectScroll, { Axis, Direction } from '../common/hooks/useDetectScroll';
import { useGetMovieList } from '../services/queryHooks/home.hook';

const Home = () => {
    const { scrollDirection, scrollPosition } = useDetectScroll({
        thresholdValue: 100,
        axis: Axis.Y,
        scrollUp: Direction.Up,
        scrollDown: Direction.Down,
        still: Direction.Still
    });

    const topElementRef = useRef(null);
    const bottomElementRef = useRef(null);

    const [movies, setMovies] = useState([]);
    const [selectedGenreList, setSelectedGenreList] = useState([]);
    const [movieYears, setMovieYears] = useState([]);
    const [currentYear, setCurrentYear] = useState(2012);
    const [loading, setLoading] = useState(false)

    const onSuccess = (data) => {
        if (data?.results?.length > 0) {

            setMovies((prevMovies) => [...prevMovies, { year: currentYear, movies: data.results }]);
        }
    }
    const { data: moviesResponse, isLoading: isMovieLoading, refetch: refetchMovies } = useGetMovieList(currentYear, 1, selectedGenreList, onSuccess);

    const handleGenreSelection = (genreList) => {
        setMovieYears(2012);
        setMovies([])
        console.log("newSelectedList.toString()", genreList, genreList.toString());
        setSelectedGenreList(genreList.toString());
    };

    useEffect(() => {
        // refetchMovies()
    }, [selectedGenreList])

    useEffect(() => {
        setLoading(isMovieLoading)
    }, [isMovieLoading])

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        };

        const handleIntersection = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isMovieLoading) {
                    if (entry.target === topElementRef.current) {
                        // Top element is intersecting, decrement year
                        console.log("scroll down ", currentYear)
                        if (currentYear > 2012) {
                            setCurrentYear(currentYear - 1);
                        }
                    } else if (entry.target === bottomElementRef.current) {
                        // Bottom element is intersecting, increment year
                        if (currentYear < new Date().getFullYear()) {
                            setCurrentYear(currentYear + 1);
                        }
                    }
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, options);
        if (topElementRef.current) {
            observer.observe(topElementRef.current);
        }
        if (bottomElementRef.current) {
            observer.observe(bottomElementRef.current);
        }

        return () => {
            if (topElementRef.current) {
                observer.unobserve(topElementRef.current);
            }
            if (bottomElementRef.current) {
                observer.unobserve(bottomElementRef.current);
            }
        };
    }, [isMovieLoading]);

    const handleSearch = () => {

    }

    useEffect(() => {
        if (!movieYears.includes(currentYear) && !isMovieLoading) {
            // refetchMovies();
        }
    }, [isMovieLoading]);

    useEffect(() => {

        const years = movies.map((movie) => movie.year);
        const uniqueYears = [...new Set(years)];
        console.log("unique year", uniqueYears)
        setMovieYears(uniqueYears);
    }, [movies]);

    // console.log("movie year", movieYears);
    return (
        <>
            <Navbar
                onGenreSelect={handleGenreSelection}
                onSearch={handleSearch}
                className='sticky-navbar'
            />
            <>
                <div ref={topElementRef}></div>
                {movieYears?.length > 0 && movieYears.map((year, index) => {
                    const moviesOfYear = movies.find((movieGroup) => movieGroup.year === year)?.movies || [];
                    return (
                        <div key={index} className="movie-list">
                            <div className="movie-list__year">
                                <h2 className="movie-list__year-heading">{year}</h2>
                                <div className="movie-list__movies">
                                    {moviesOfYear.map((movie, index) => (
                                        <MovieCard key={`${movie.id}_${index}`} movie={movie} image={movie.poster_path} overview={movie.overview} title={movie.title} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomElementRef}></div>
            </>
            {isMovieLoading && (
                <div className='spinner-bottom'>
                    <Spinner />
                </div>
            )
            }

        </>
    );
};

export default Home;
