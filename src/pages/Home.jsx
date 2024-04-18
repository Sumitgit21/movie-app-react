import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar'
import Spinner from '../components/Spinner'
import '../assets/css/home.scss';
import { useGetMovieList } from '../services/queryHooks/home.hook';
import MovieList from '../components/MovieList';

const Home = () => {
    const topElementRef = useRef(null);
    const bottomElementRef = useRef(null);
    const movies = useRef([]);
    const [rerender, setRerender] = useState(false);
    const [selectedGenreList, setSelectedGenreList] = useState('');
    const [movieYears, setMovieYears] = useState([]);
    const [currentYear, setCurrentYear] = useState(2012);

    const groupDataByYear = data => {
        const groupedData = {};
        data.forEach(item => {
            const year = new Date(item.release_date).getFullYear();
            if (!groupedData[year]) {
                groupedData[year] = [];
            }
            groupedData[year].push(item);
        });
        return Object.entries(groupedData);
    };

    const onSuccess = (data) => {
        if (data?.results?.length > 0) {
            const newDataYearwise = groupDataByYear(data.results);
            movies.current = [...movies.current, ...newDataYearwise]
            setRerender(!rerender);
        }
    }

    const { data: moviesResponse, isLoading: isMovieLoading, refetch: refetchMovies } = useGetMovieList(currentYear, 1, selectedGenreList, onSuccess);

    const handleGenreSelection = useCallback((genreList) => {
        movies.current = []
        setCurrentYear(2012)
        setMovieYears([2012]);
        setSelectedGenreList(genreList.toString());

    }, [selectedGenreList]);

    useEffect(() => {
        refetchMovies()
    }, [selectedGenreList])


    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '10px',
            threshold: 0.5,
        };

        const handleIntersection = (entries) => {
            console.group("handle Intersection")
            entries.forEach(entry => {
                if (entry.isIntersecting && !isMovieLoading) {
                    if (entry.target === topElementRef.current) {
                        // Top element is intersecting, decrement year
                        if (currentYear > 2012) {
                            setCurrentYear(currentYear - 1);
                        }
                        console.log("scroll up ", entry.target === topElementRef.current, currentYear)
                    } else if (entry.target === bottomElementRef.current) {
                        console.log("scroll down ", currentYear < new Date().getFullYear(), currentYear)
                        // Bottom element is intersecting, increment year
                        if (currentYear >= 2012 && currentYear < new Date().getFullYear()) {
                            setCurrentYear(currentYear + 1);
                        }
                    }
                }
            });
            console.groupEnd("handle Intersection")
        };

        const observer = new IntersectionObserver(handleIntersection, options);
        if (topElementRef.current && !isMovieLoading) {
            observer.observe(topElementRef.current);
        }
        if (bottomElementRef.current && !isMovieLoading) {
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
    }, [currentYear, isMovieLoading]);


    useEffect(() => {
        const tempUniqueYears = movieYears;
        if (tempUniqueYears && Array.isArray(tempUniqueYears) && !tempUniqueYears.includes(currentYear)) {
            tempUniqueYears.push(currentYear)
            setMovieYears(tempUniqueYears);
        }
    }, [movieYears, currentYear]);

    return (
        <>
            <Navbar
                onGenreSelect={handleGenreSelection}
                className='sticky-navbar'
            />
            <>
                <div id="top" ref={topElementRef}></div>
                <div key={1} className="movie-list">
                    {movies?.current?.length > 0 ? <MovieList movies={movies.current} /> : isMovieLoading ? <>
                        <div className='spinner-bottom'>
                            <Spinner />
                        </div>
                    </> : <><p>No Data Found</p></>}
                    {movies?.current?.length > 0 && isMovieLoading && <div className='spinner-bottom'>
                        <Spinner />
                    </div>}
                </div>
                {<div id="boootm" ref={bottomElementRef}></div>}
            </>
        </>
    );
};

export default Home;
