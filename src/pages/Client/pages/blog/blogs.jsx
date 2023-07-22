import {forwardRef, useImperativeHandle} from 'react'
import image from '../../../../assets/images/backgrounds/image_5.jpg';
import image1 from '../../../../assets/images/backgrounds/image_6.jpg';
import image2 from '../../../../assets/images/backgrounds/image_7.jpg';
import image3 from '../../../../assets/images/backgrounds/image_8.jpg';
import image4 from '../../../../assets/images/backgrounds/image_9.jpg';
import image5 from '../../../../assets/images/backgrounds/image_10.jpg';
import image6 from '../../../../assets/images/backgrounds/image_5.jpg';
import image7 from '../../../../assets/images/backgrounds/image_6.jpg';
import image8 from '../../../../assets/images/backgrounds/image_7.jpg';
import image9 from '../../../../assets/images/backgrounds/image_8.jpg';
import image10 from '../../../../assets/images/backgrounds/image_9.jpg';
import image11 from '../../../../assets/images/backgrounds/image_10.jpg';
import { Link } from 'react-router-dom';

const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            console.log("empty blockchain")
        }
    }));
    const blogData = [
        {
            title: 'Mindfulness Activities for Kids & Toddlers with NFT',
            image: image,
            category: 'Arts',
            subtext: '@StreetBoy'
        },
        {
            title: 'Save Thousands Of Lives Through This NFT',
            image: image2,
            category: 'Illustration',
            subtext: '@CutieGirl'
        },
        {
            title: 'A place where technology meets craftsmanship',
            image: image3,
            category: 'Music',
            subtext: '@ButterFly'
        },
        {
            title: 'NFT Market - A Compact Trike with the Big Benefits',
            image: image4,
            category: 'Video',
            subtext: '@NorseQueen'
        },
        {
            title: 'Honoring Black History Month with Toddlers',
            image: image5,
            category: 'Games',
            subtext: '@@BigBull'
        },
        {
            title: 'Setting Intentions Instead of Resolutions for 2021',
            image: image6,
            category: 'Memes',
            subtext: '@Angel'
        },
        {
            title: 'Clever Ways to Purchase Extraordinart Items',
            image: image7,
            categoty: 'GIFs',
            subtext: '@CrazyAnyone'
        },
        {
            title: 'How to Save Money on Baby Essentials for NFT',
            image: image8,
            categoty: 'Video',
            subtext: '@Princess'
        },
        {
            title: 'Liki Trike - A Compact Trike with the Big Benefits',
            image: image9,
            categoty: 'GIFs',
            subtext: '@CrazyAnyone'
        },
        {
            title: 'NFT Market - A Compact the Big Benefits',
            image: image10,
            categoty: 'Tech',
            subtext: '@Princess'
        },
        {
            title: 'Behind the Scenes of the creabik App',
            image: image11,
            categoty: 'Arts',
            subtext: '@PandaOne'
        },
        {
            title: 'Meet fennouni, Product Designer at GitHub',
            image: image1,
            categoty: 'GIFs',
            subtext: '@FunnyGuy'
        }
    ]
    return (
        <>
            <section className="relative table w-full py-36 bar-bg-8 bg-center bg-no-repeat">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
                <div className="container">
                    <div className="grid grid-cols-1 pb-8 text-center mt-10">
                        <h3 className="md:text-3xl text-2xl md:leading-snug tracking-wide leading-snug font-medium text-white">Blog & News</h3>
                    </div>
                </div>

                <div className="absolute text-center z-10 bottom-5 start-0 end-0 mx-3">
                    <ul className="breadcrumb tracking-[0.5px] breadcrumb-light mb-0 inline-block">
                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white/50 hover:text-white"><Link to="/">G-rooves</Link></li>
                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white" aria-current="page"> Blogs</li>
                    </ul>
                </div>
            </section>
            <div className="relative">
                <div className="shape absolute start-0 end-0 sm:-bottom-px -bottom-[2px] overflow-hidden z-1 text-white dark:text-slate-900">
                    <svg className="w-full h-auto" viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>
            <section className="relative md:py-24 py-16">
                <div className="container">
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[30px]">
                        {
                            blogData.map((ele, index) => (
                                <div key={index} className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-md shadow dark:shadow-gray-700 hover:shadow-md transition-all duration-500">
                                    <img src={ele.image} alt="" />

                                    <div className="relative p-6">
                                        <div className="absolute start-6 -top-4">
                                            <span className="bg-violet-600 text-white text-[12px] px-2.5 py-1 font-semibold rounded-full h-5">Arts</span>
                                        </div>

                                        <div className="">
                                            <div className="flex mb-4">
                                                <span className="text-slate-400 text-[16px]"><i className="uil uil-calendar-alt text-slate-900 dark:text-white me-2"></i>20th October, 2022</span>
                                                <span className="text-slate-400 text-[16px] ms-3"><i className="uil uil-clock text-slate-900 dark:text-white me-2"></i>5 min read</span>
                                            </div>

                                            <Link to="/blog-detail" className="title text-lg font-medium hover:text-violet-600 duration-500 ease-in-out">{ele.title}</Link>

                                            <div className="flex justify-between mt-4">
                                                <Link to="/blog-detail" className="btn btn-link text-[16px] font-medium hover:text-violet-600 after:bg-violet-600 duration-500 ease-in-out">Read More <i className="uil uil-arrow-right"></i></Link>
                                                <span className="text-slate-400 text-[16px]">by <Link to="/creator-profile" className="text-slate-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-600 font-medium">{ele.subtext}</Link></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="grid md:grid-cols-12 grid-cols-1 mt-8">
                    <div className="md:col-span-12 text-center">
                        <nav>
                            <ul className="inline-flex items-center -space-x-px">
                                <li>
                                    <a href="#" className="w-10 h-10 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 bg-white dark:bg-slate-900 hover:text-white shadow-sm dark:shadow-gray-700 hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600">
                                        <i className="uil uil-angle-left text-[20px]"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="w-10 h-10 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 hover:text-white bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700 hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600">1</a>
                                </li>
                                <li>
                                    <a href="#" className="w-10 h-10 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 hover:text-white bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700 hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600">2</a>
                                </li>
                                <li>
                                    <a href="#" aria-current="page" className="z-10 w-10 h-10 inline-flex justify-center items-center mx-1 rounded-full text-white bg-violet-600 shadow-sm dark:shadow-gray-700">3</a>
                                </li>
                                <li>
                                    <a href="#" className="w-10 h-10 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 hover:text-white bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700 hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600">4</a>
                                </li>
                                <li>
                                    <a href="#" className="w-10 h-10 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 bg-white dark:bg-slate-900 hover:text-white shadow-sm dark:shadow-gray-700 hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600">
                                        <i className="uil uil-angle-right text-[20px]"></i>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </section >
        </>
    )
});

export default Component