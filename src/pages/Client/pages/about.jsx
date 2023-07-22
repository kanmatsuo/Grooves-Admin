import React, { useState , forwardRef, useImperativeHandle} from 'react'
import Team from '../components/team'
import Blog from '../components/blog'
import about from '../../../assets/images/about-us/about-main-visual.jpg';
import { Link } from 'react-router-dom'

const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            console.log("empty blockchain")
        }
    }));

    const [isOpen, setOpen] = useState(false);
    return (
        <>
            <section className="relative table w-full py-36 bar-bg-1 bg-center bg-no-repeat">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
                <div className="container">
                    <div className="grid grid-cols-1 pb-8 text-center mt-10">
                        <h3 className="md:text-3xl text-2xl md:leading-snug tracking-wide leading-snug font-medium text-white">About Us</h3>

                    </div>
                </div>

                <div className="absolute text-center z-10 bottom-5 start-0 end-0 mx-3">
                    <ul className="breadcrumb tracking-[0.5px] breadcrumb-light mb-0 inline-block">
                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white/50 hover:text-white"><Link to="/">G-rooves</Link></li>
                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white" aria-current="page"> About Us</li>
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
                    <div className="grid lg:grid-cols-12 md:grid-cols-2 grid-cols-1 items-center gap-[30px]">
                        <div className="lg:col-span-5">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-violet-600 rounded-lg -mt-[15px] -ms-[15px] h-[98%] w-[98%] -z-1"></div>
                                <img src={about} className="rounded-lg shadow-md dark:shadow-gray-800" alt="" />
                                <div className="absolute bottom-2/4 translate-y-2/4 start-0 end-0 text-center">

                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-7">
                            <div className="lg:ms-5">
                                <span className="text-violet-600 font-medium">Creative Vision & Mission</span>
                                <h3 className="mb-4 md:text-3xl text-2xl md:leading-snug leading-snug font-semibold">We develop & create <br /> digital art.</h3>

                                <p className="text-slate-400 max-w-xl">We are a huge marketplace dedicated to connecting great artists of all G-rooves with their fans and unique token collectors!</p>
                                <p className="text-slate-400 max-w-xl mt-4">It seems that only fragments of the original text remain in the Lorem Ipsum texts used today. One may speculate that over the course of time certain letters were added or deleted at various positions within the text. This might also explain why one can now find slightly different versions.</p>

                                <div className="mt-6">
                                    <Link to="/contact" className="btn bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white rounded-full me-2 mt-2"><i className="uil uil-envelope"></i> Contact us</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container lg:mt-24 mt-16 lg:pt-24 pt-16">
                    <div className="absolute inset-0 opacity-25 dark:opacity-50 bg-no-repeat bg-center mapBg"></div>
                    <div className="relative grid grid-cols-1 pb-8 text-center z-1">
                        <h3 className="mb-4 md:text-3xl text-2xl md:leading-snug leading-snug font-semibold text-black dark:text-white">Trusted by more than 20K users</h3>

                        <p className="text-slate-400 max-w-xl mx-auto">We are a huge marketplace dedicated to connecting great artists of all G-rooves with their fans and unique token collectors!</p>
                    </div>

                    <div className="relative grid md:grid-cols-3 grid-cols-1 items-center mt-8 gap-[30px] z-1">
                        <div className="counter-box text-center">
                            <h1 className="lg:text-5xl text-4xl font-semibold mb-2">$<span className="counter-value" data-target="40">3</span>M</h1>
                            <h5 className="counter-head text-lg font-medium text-slate-400">Trading volume</h5>
                        </div>

                        <div className="counter-box text-center">
                            <h1 className="lg:text-5xl text-4xl font-semibold mb-2"><span className="counter-value" data-target="200">2</span>+</h1>
                            <h5 className="counter-head text-lg font-medium text-slate-400">NFTs created</h5>
                        </div>

                        <div className="counter-box text-center">
                            <h1 className="lg:text-5xl text-4xl font-semibold mb-2"><span className="counter-value" data-target="235">0</span>K</h1>
                            <h5 className="counter-head text-lg font-medium text-slate-400">Total users</h5>
                        </div>
                    </div>
                </div>

                <Team />
                <Blog />
            </section>
        </>
    )
});
export default Component
