import image from '../../../assets/images/blog/img_01.jpg';
import image1 from '../../../assets/images/blog/img_02.jpg';
import image2 from '../../../assets/images/blog/img_03.jpg';
import { Link } from 'react-router-dom';

export default function blog() {
    return (
        <div className="container lg:mt-24 mt-16">
            <div className="grid grid-cols-1 pb-8 text-center">
                <h3 className="mb-4 md:text-3xl text-2xl md:leading-snug leading-snug font-semibold">Latest Blog or News</h3>

                <p className="text-slate-400 max-w-xl mx-auto">We are a huge marketplace dedicated to connecting great artists of all G-rooves with their fans and unique token collectors!</p>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mt-8 gap-[30px]">
                <div className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-md shadow dark:shadow-gray-700 hover:shadow-md transition-all duration-500">
                    <img src={image} alt="" />

                    <div className="relative p-6">
                        <div className="absolute start-6 -top-4">
                            <span className="bg-violet-600 text-white text-[12px] px-2.5 py-1 font-semibold rounded-full h-5">Arts</span>
                        </div>

                        <div className="">
                            <div className="flex mb-4">
                                <span className="text-slate-400 text-[16px]"><i className="uil uil-calendar-alt text-slate-900 dark:text-white me-2"></i>20th October, 2022</span>
                                <span className="text-slate-400 text-[16px] ms-3"><i className="uil uil-clock text-slate-900 dark:text-white me-2"></i>5 min read</span>
                            </div>

                            <Link to="/blog-detail" className="title text-lg font-medium hover:text-violet-600 duration-500 ease-in-out">Mindfulness Activities for Kids & Toddlers with NFT</Link>

                            <div className="flex justify-between mt-4">
                                <Link to="/blog-detail" className="btn btn-link text-[16px] font-medium hover:text-violet-600 after:bg-violet-600 duration-500 ease-in-out">Read More <i className="uil uil-arrow-right"></i></Link>
                                <span className="text-slate-400 text-[16px]">by <Link to="/creator-profile" className="text-slate-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-600 font-medium">@StreetBoy</Link></span>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-md shadow dark:shadow-gray-700 hover:shadow-md transition-all duration-500">
                    <img src={image1} alt="" />

                    <div className="relative p-6">
                        <div className="absolute start-6 -top-4">
                            <span className="bg-violet-600 text-white text-[12px] px-2.5 py-1 font-semibold rounded-full h-5">Illustration</span>
                        </div>

                        <div className="">
                            <div className="flex mb-4">
                                <span className="text-slate-400 text-[16px]"><i className="uil uil-calendar-alt text-slate-900 dark:text-white me-2"></i>20th October, 2022</span>
                                <span className="text-slate-400 text-[16px] ms-3"><i className="uil uil-clock text-slate-900 dark:text-white me-2"></i>5 min read</span>
                            </div>

                            <Link to="/blog-detail" className="title text-lg font-medium hover:text-violet-600 duration-500 ease-in-out">Save Thousands Of Lives Through This NFT</Link>

                            <div className="flex justify-between mt-4">
                                <Link to="/blog-detail" className="btn btn-link text-[16px] font-medium hover:text-violet-600 after:bg-violet-600 duration-500 ease-in-out">Read More <i className="uil uil-arrow-right"></i></Link>
                                <span className="text-slate-400 text-[16px]">by <Link to="/creator-profile" className="text-slate-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-600 font-medium">@CutieGirl</Link></span>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-md shadow dark:shadow-gray-700 hover:shadow-md transition-all duration-500">
                    <img src={image2} alt="" />

                    <div className="relative p-6">
                        <div className="absolute start-6 -top-4">
                            <span className="bg-violet-600 text-white text-[12px] px-2.5 py-1 font-semibold rounded-full h-5">Music</span>
                        </div>

                        <div className="">
                            <div className="flex mb-4">
                                <span className="text-slate-400 text-[16px]"><i className="uil uil-calendar-alt text-slate-900 dark:text-white me-2"></i>20th October, 2022</span>
                                <span className="text-slate-400 text-[16px] ms-3"><i className="uil uil-clock text-slate-900 dark:text-white me-2"></i>5 min read</span>
                            </div>

                            <Link to="/blog-detail" className="title text-lg font-medium hover:text-violet-600 duration-500 ease-in-out">A place where technology meets craftsmanship</Link>

                            <div className="flex justify-between mt-4">
                                <Link to="/blog-detail" className="btn btn-link text-[16px] font-medium hover:text-violet-600 after:bg-violet-600 duration-500 ease-in-out">Read More <i className="uil uil-arrow-right"></i></Link>
                                <span className="text-slate-400 text-[16px]">by <Link to="/creator-profile" className="text-slate-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-600 font-medium">@ButterFly</Link></span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}