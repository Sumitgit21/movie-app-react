import React, { useState, useEffect, memo } from 'react';
import '../assets/css/navbar.scss'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useGetGenreFilter } from '../services/queryHooks/home.hook';
import { genre as dummyGenre } from '../data/genre';
const Navbar = ({ onGenreSelect }) => {
    const { data, isLoading } = useGetGenreFilter(false);
    const { genres } = data || { genres: [] };
    const [genreNameList, setGenreNameList] = useState([])


    const handleGenreClick = (genreId) => {

        let selectedGenreList = genres.filter((data) => (data.id == genreId)).map(item => item.id).concat(genreNameList);
        console.log("selected", selectedGenreList)
        setGenreNameList(selectedGenreList)
        onGenreSelect(selectedGenreList);
    };

    return (
        <>
            <section className="navigation">
                <div className="nav-container">
                    <div className="brand">
                        <a href="javascript:void(0)" >MOVIEFLIX</a>
                    </div>
                </div>
            </section>
            <div className="pill-filter" key={"pill-nav"}>
                {genres?.length > 0 && genres.map((genre, index) => (<>
                    <div
                        key={index}
                        //className={`pill `}
                        className={`pill ${genreNameList.includes(genre.id) ? 'active' : ''}`}
                        onClick={() => handleGenreClick(genre.id)}
                    >
                        {genre.name}
                    </div>

                </>))}

            </div>
        </>

    );
};

export default memo(Navbar);
