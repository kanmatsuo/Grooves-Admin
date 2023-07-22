import {forwardRef, useImperativeHandle} from 'react'
import { Link } from 'react-router-dom'

const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            console.log("empty blockchain")
        }
    }));
    return (
        <>
            <section className="relative table w-full py-36 bar-bg-4 bg-center bg-no-repeat">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
                <div className="container">
                    <div className="grid grid-cols-1 pb-8 text-center mt-10">
                        <h3 className="md:text-3xl text-2xl md:leading-snug tracking-wide leading-snug font-medium text-white">Privacy Policy</h3>

                    </div>
                </div>

                <div className="absolute text-center z-10 bottom-5 start-0 end-0 mx-3">
                    <ul className="breadcrumb tracking-[0.5px] breadcrumb-light mb-0 inline-block">
                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white/50 hover:text-white"><Link to="/">G-rooves</Link></li>
                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white" aria-current="page"> Privacy Policy</li>
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
                    <div className="md:flex justify-center">
                        <div className="md:w-3/4">
                            <div className="p-6 bg-white dark:bg-slate-900 shadow dark:shadow-gray-800 rounded-md">
                                <h5 className="text-xl font-semibold mb-4">Overview :</h5>
                                <p className="text-slate-400">It seems that only fragments of the original text remain in the Lorem Ipsum texts used today. One may speculate that over the course of time certain letters were added or deleted at various positions within the text.</p>
                                <p className="text-slate-400">In the 1960s, the text suddenly became known beyond the professional circle of typesetters and layout designers when it was used for Letraset sheets (adhesive letters on transparent film, popular until the 1980s) Versions of the text were subsequently included in DTP programmes such as PageMaker etc.</p>
                                <p className="text-slate-400">There is now an abundance of readable dummy texts. These are usually used when a text is required purely to fill a space. These alternatives to the classic Lorem Ipsum texts are often amusing and tell short, funny or nonsensical stories.</p>

                                <h5 className="text-xl font-semibold mb-4 mt-8">We use your information to :</h5>
                                <ul className="list-none text-slate-400 mt-4">
                                    <li className="flex mt-2"><i className="uil uil-arrow-right text-violet-600 text-lg align-middle me-2"></i>Digital Marketing Solutions for Tomorrow</li>
                                    <li className="flex mt-2"><i className="uil uil-arrow-right text-violet-600 text-lg align-middle me-2"></i>Our Talented & Experienced Marketing Agency</li>
                                    <li className="flex mt-2"><i className="uil uil-arrow-right text-violet-600 text-lg align-middle me-2"></i>Create your own skin to match your brand</li>
                                    <li className="flex mt-2"><i className="uil uil-arrow-right text-violet-600 text-lg align-middle me-2"></i>Digital Marketing Solutions for Tomorrow</li>
                                    <li className="flex mt-2"><i className="uil uil-arrow-right text-violet-600 text-lg align-middle me-2"></i>Our Talented & Experienced Marketing Agency</li>
                                    <li className="flex mt-2"><i className="uil uil-arrow-right text-violet-600 text-lg align-middle me-2"></i>Create your own skin to match your brand</li>
                                </ul>

                                <h5 className="text-xl font-semibold mb-4 mt-8">Information Provided Voluntarily :</h5>
                                <p className="text-slate-400">In the 1960s, the text suddenly became known beyond the professional circle of typesetters and layout designers when it was used for Letraset sheets (adhesive letters on transparent film, popular until the 1980s) Versions of the text were subsequently included in DTP programmes such as PageMaker etc.</p>

                                <div className="mt-8">
                                    <a href="" className="btn bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white rounded-full">Print</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
});

export default Component