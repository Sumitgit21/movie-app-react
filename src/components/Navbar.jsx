import React, { useState, useEffect, memo } from 'react';
import '../assets/css/navbar.scss'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useGetGenreFilter } from '../services/queryHooks/home.hook';
import { genre as dummyGenre } from '../data/genre';
const Navbar = ({ onGenreSelect }) => {
    const { data, isLoading } = useGetGenreFilter(false);
    const { genres } = dummyGenre; //data || { genres: [] };
    const [genreNameList, setGenreNameList] = useState([])


    const handleGenreClick = (genreId) => {
        let selectedGenreList = genres.filter((data) => (data.id == genreId)).map(item => item.id);
        if (genreNameList?.length > 0 && genreNameList[0] == genreId) {
            setGenreNameList([])
            onGenreSelect([]);
        } else {
            console.log("selected", selectedGenreList)
            setGenreNameList(selectedGenreList)
            onGenreSelect(selectedGenreList);
        }
    };
    const [showFilter, setShowFilter] = useState(false);

    const toggleFilter = () => {
        setShowFilter(!showFilter);
    };
    return (
        <>
            <div className="navigation">
                <div className="nav-container">
                    <div className="brand">
                        <a href="javascript:void(0)" >MOVIEFLIX</a>
                    </div>
                </div>
            </div>
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
