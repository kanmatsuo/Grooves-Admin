import React from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { animateScroll as scroll } from 'react-scroll';
import Cookies from "js-cookie";
import { useEffect, forwardRef, useImperativeHandle } from "react";

export default function Switcher() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname !== '/signup') {
            Cookies.get('_csrf') ? navigate(location.pathname) : navigate('/login')
        }
    }, []);

    const scrollToTop = () => {
        scroll.scrollToTop({
            duration: 500,
            smooth: true,
        });
    };

    function changeMode(mode, event) {
        switch (mode) {
            case 'mode':
                if (document.documentElement.className.includes("dark")) {
                    document.documentElement.className = 'light'
                } else {
                    document.documentElement.className = 'dark'
                }
                break;
            case 'layout':
                if (event.target?.innerText === "LTR") {
                    document.documentElement.dir = "ltr"
                }
                else {
                    document.documentElement.dir = "rtl"
                }
                break;

            default:
                break;
        }
    }

    return (
        <>
            <a onClick={scrollToTop} id="back-to-top" className="back-to-top fixed hidden text-lg rounded-full z-10 bottom-5 end-5 h-9 w-9 text-center bg-violet-600 text-white leading-9 justify-center"><i className="uil uil-arrow-up"></i></a>

            <div className="fixed top-[25%] -left-2 z-50 hidden sm:block">
                <span className="relative inline-block rotate-90">
                    <input type="checkbox" className="checkbox opacity-0 absolute" id="chk" onClick={(event) => changeMode('mode', event)} />
                    <label className="label bg-slate-900 dark:bg-white shadow dark:shadow-gray-800 cursor-pointer rounded-full flex justify-between items-center p-1 w-14 h-8" htmlFor="chk">
                        <i className="uil uil-moon text-[20px] text-yellow-500"></i>
                        <i className="uil uil-sun text-[20px] text-yellow-500"></i>
                        <span className="ball bg-white dark:bg-slate-900 rounded-full absolute top-[2px] left-[2px] w-7 h-7"></span>
                    </label>
                </span>
            </div>
        </>
    )
}
