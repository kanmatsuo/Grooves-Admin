import React from 'react'
import logo_white from '../../../assets/images/logo-white.svg';
import app from '../../../assets/images/logo-white.svg';
import playstore from '../../../assets/images/logo-white.svg';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'react-feather';

export default function Footer() {
    return (
        <footer className="footer relative text-gray-200 dark:text-gray-200 mt-24">
            <div className="container bg-footer">
                <div className="grid grid-cols-1">
                    <div className="relative py-16">
                        <div className="relative w-full">
                            <div className="relative -top-40 bg-white dark:bg-slate-900 lg:px-8 px-6 py-10 rounded-xl shadow dark:shadow-gray-800 overflow-hidden">
                                <div className="grid md:grid-cols-2 grid-cols-1 items-center gap-[30px]">
                                    <div className="md:text-start text-center z-1">
                                        <h3 className="text-[26px] font-semibold text-slate-900 dark:text-white">Stay in the loop</h3>
                                        <p className="text-slate-400 max-w-xl mx-auto">Subscribe to get latest updates and information.</p>
                                    </div>

                                    <div className="subcribe-form z-1">
                                        <div className="relative max-w-lg md:ms-auto">
                                            <input type="email" id="subcribe" name="email" className="pt-4 pe-40 pb-4 ps-6 w-full h-[50px] outline-none text-slate-900 dark:text-white rounded-full bg-white dark:bg-slate-900 shadow dark:shadow-gray-800" placeholder="Enter your email :" />
                                            <button className="btn absolute top-[2px] end-[3px] h-[46px] bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white rounded-full">Subscribe</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -top-5 -start-5">
                                    <div className="uil uil-envelope lg:text-[150px] text-7xl text-slate-900/5 dark:text-white/5 -rotate-45"></div>
                                </div>

                                <div className="absolute -bottom-5 -end-5">
                                    <div className="uil uil-pen lg:text-[150px] text-7xl text-slate-900/5 dark:text-white/5"></div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-12 grid-cols-1 gap-[30px] -mt-24">
                                <div className="lg:col-span-4 md:col-span-12">
                                    <Link to="/" className="text-[22px] focus:outline-none">
                                        <img src={logo_white} alt="" />
                                    </Link>
                                    <p className="mt-6 text-gray-300">The world’s first and largest digital marketplace for crypto collectibles and non-fungible tokens (NFTs). Buy, sell, and discover exclusive digital items.</p>

                                </div>

                                <div className="lg:col-span-2 md:col-span-4">
                                    <h5 className="tracking-[1px] text-lg text-gray-100 font-semibold">Marketplace</h5>
                                    <ul className="list-none footer-list mt-6">
                                        <li><Link to="/store" className="text-[16px] text-gray-300 hover:text-gray-400 duration-500 ease-in-out"><i className="uil uil-angle-right-b me-1"></i> Store</Link></li>
                                        <li className="mt-[10px] "><Link to="/item" className="text-[16px] text-gray-300 hover:text-gray-400 duration-500 ease-in-out"><i className="uil uil-angle-right-b me-1"></i> Item</Link></li>
                                        <li className="mt-[10px] "><Link to="/auction" className="text-[16px] text-gray-300 hover:text-gray-400 duration-500 ease-in-out"><i className="uil uil-angle-right-b me-1"></i> Auction</Link></li>
                                        <li className="mt-[10px] "><Link to="/gacha" className="text-[16px] text-gray-300 hover:text-gray-400 duration-500 ease-in-out"><i className="uil uil-angle-right-b me-1"></i> Gacha</Link></li>
                                        <li className="mt-[10px] "><Link to="/collected" className="text-[16px] text-gray-300 hover:text-gray-400 duration-500 ease-in-out"><i className="uil uil-angle-right-b me-1"></i> Collected</Link></li>
                                    </ul>
                                </div>

                                <div className="lg:col-span-3 md:col-span-4">
                                    <h5 className="tracking-[1px] text-lg text-gray-100 font-semibold">Company</h5>
                                    <ul className="list-none footer-list mt-6">
                                        <li><Link to="/about-us" className="text-[16px] text-gray-300 hover:text-gray-400 duration-500 ease-in-out"><i className="uil uil-angle-right-b me-1"></i> About Us</Link></li>
                                        <li className="mt-[10px] "><Link to="/terms" className="text-[16px] text-gray-300 hover:text-gray-400 duration-500 ease-in-out"><i className="uil uil-angle-right-b me-1"></i> Terms of Service</Link></li>
                                        <li className="mt-[10px] "><Link to="/privacy" className="text-[16px] text-gray-300 hover:text-gray-400 duration-500 ease-in-out"><i className="uil uil-angle-right-b me-1"></i> Privacy policy</Link></li>
                                        <li className="mt-[10px] "><Link to="/faq" className="text-[16px] text-gray-300 hover:text-gray-400 duration-500 ease-in-out"><i className="uil uil-angle-right-b me-1"></i> FAQs</Link></li>
                                        <li className="mt-[10px] "><Link to="/contact" className="text-[16px] text-gray-300 hover:text-gray-400 duration-500 ease-in-out"><i className="uil uil-angle-right-b me-1"></i> Contact Us</Link></li>
                                    </ul>
                                </div>

                                <div className="lg:col-span-3 md:col-span-4">
                                    <div className="">
                                        <h5 className="tracking-[1px] text-lg text-gray-100 font-semibold">Contact Details</h5>

                                        <div className="flex mt-6">
                                            <Mail className="w-5 h-5 text-violet-600 me-3 mt-1"></Mail>
                                            <div className="">
                                                <Link to="mailto:g.rooves.coin@gmail.com" className="text-[16px] text-gray-300 hover:text-gray-400 duration-500 ease-in-out">g.rooves.coin@gmail.com</Link>
                                            </div>
                                        </div>

                                        <div className="flex mt-6">
                                            <Phone className="w-5 h-5 text-violet-600 me-3 mt-1"></Phone>
                                            <div className="">
                                                <Link to="tel:050-5375-8695" className="text-[16px] text-gray-300 hover:text-gray-400 duration-500 ease-in-out">050-5375-8695</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-[30px] px-0 copyright">
                <div className="container text-center">
                    <div className="grid md:grid-cols-2 items-center gap-6">
                        <div className="md:text-start text-center">
                            <p className="mb-0 text-gray-300">© {(new Date().getFullYear())}{" "} G-rooves. All Rights Reserved.</p>
                        </div>

                        <ul className="list-none md:text-end text-center">
                            <li className="inline"><Link to="https://dribbble.com/grooves" target="_blank" className="btn btn-icon btn-sm border border-gray-800 rounded-md hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600"><i className="uil uil-dribbble align-middle" title="dribbble"></i></Link></li>
                            <li className="inline"><Link to="https://www.behance.net/grooves" target="_blank" className="btn btn-icon btn-sm border border-gray-800 rounded-md hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600"><i className="uil uil-behance" title="Behance"></i></Link></li>
                            <li className="inline"><Link to="http://linkedin.com/company/grooves" target="_blank" className="btn btn-icon btn-sm border border-gray-800 rounded-md hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600"><i className="uil uil-linkedin" title="Linkedin"></i></Link></li>
                            <li className="inline"><Link to="https://www.facebook.com/grooves" target="_blank" className="btn btn-icon btn-sm border border-gray-800 rounded-md hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600"><i className="uil uil-facebook-f align-middle" title="facebook"></i></Link></li>
                            <li className="inline"><Link to="https://www.instagram.com/grooves/" target="_blank" className="btn btn-icon btn-sm border border-gray-800 rounded-md hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600"><i className="uil uil-instagram align-middle" title="instagram"></i></Link></li>
                            <li className="inline"><Link to="https://twitter.com/grooves" target="_blank" className="btn btn-icon btn-sm border border-gray-800 rounded-md hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600"><i className="uil uil-twitter align-middle" title="twitter"></i></Link></li>
                            <li className="inline"><Link to="mailto:support@grooves.in" className="btn btn-icon btn-sm border border-gray-800 rounded-md hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600"><i className="uil uil-envelope align-middle" title="email"></i></Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}
