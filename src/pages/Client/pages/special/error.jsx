import {forwardRef, useImperativeHandle} from 'react'
import logo_icon_64 from '../../../../assets/images/logo-dark.svg';
import error from '../../../../assets/images/pages/img_404.svg';
import { Link } from 'react-router-dom';

const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            console.log("empty blockchain")
        }
    }));
    return (
        <>
            <section className="relative">
                <div className="container-fluid relative">
                    <div className="grid grid-cols-1">
                        <div className="flex flex-col min-h-screen justify-center md:px-10 py-10 px-4">
                            <div className="text-center h-15">

                            </div>
                            <div className="title-heading text-center my-auto">
                                <div className="md:my-0 my-10">
                                    <img src={error} className="mx-auto" alt="" />
                                    <h1 className="my-6 md:text-5xl text-3xl font-bold">Page Not Found?</h1>
                                    <p className="text-slate-400">Whoops, this is embarassing. <br /> Looks like the page you were looking for wasn't found.</p>

                                    <div className="mt-6">
                                        <Link to="/" className="btn bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white rounded-full">Back to Home</Link>
                                    </div>
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