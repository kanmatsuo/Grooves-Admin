import logo_dark from '../../../../assets/images/logo-dark.svg';
import logo_light from '../../../../assets/images/logo-white.svg';
import { Link } from 'react-router-dom';
import Switcher from '../../components/switcher';
import React, { useState , forwardRef, useImperativeHandle} from "react";
import { useGlobalService } from "../../../../GlobalServiceContext";
import { useForm } from "../../../global/useForm";
import config from "../../../global/constant";
import axios from "axios";
import Cookies from "js-cookie"

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);

    const { notify, refresh } = useGlobalService();
    const { setErrors, renderFieldError, message, setMessage, navigate } = useForm();

    const makeRequest = (e) => {
        e.preventDefault();

        setErrors(null);
        setMessage('');

        axios.get(config.get_csrf_token_addr).then((response) => {
            console.log(response)
            const payload = {
                email,
                password
            };

            if (remember) {
                payload.remember = true;
            }

            axios.post(config.backend_url + 'client/login', payload, { headers: { 'Accept': 'application/json' } }).then(response => {
                if (response.data.content.access_token) {
                    Cookies.set('_csrf', response.data.content.access_token, { expires: config.cookies_expire_time, path: '/' })
                    setTimeout(() => {
                        refresh();
                        notify("Successfully signed in!")
                        navigate('/');
                    }, 1000);
                }
            }).catch(error => {
                notify(error.message, 'error')
                if (error.response) {
                    if (error.response.data.errors) {
                        setErrors(error.response.data.errors);
                    }
                }
            });
        });
    };

    return (
        <>
            <section className="md:h-screen py-36 flex items-center bg-lgoin_form">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
                <div className="container">
                    <div className="flex justify-center">
                        <div className="max-w-[400px] w-full m-auto p-6 bg-white dark:bg-slate-900 shadow-md dark:shadow-gray-800 rounded-md">
                            <a href="">
                                <img src={logo_dark} className="mx-auto h-10 block dark:hidden" alt="" />
                                <img src={logo_light} className="mx-auto h-10 dark:block hidden" alt="" />
                            </a>
                            <h5 className="my-6 text-xl font-semibold">Login</h5>
                            <form className="text-start">
                                <div className="grid grid-cols-1">
                                    <div className="mb-4">
                                        <label className="font-semibold" htmlFor="LoginEmail">Email Address:</label>
                                        <input id="LoginEmail" type="email" className="form-input w-full text-[15px] py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0 mt-3" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} />

                                        {renderFieldError('email')}
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-semibold" htmlFor="LoginPassword">Password:</label>
                                        <input id="LoginPassword" type="password" className="form-input w-full text-[15px] py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0 mt-3" placeholder="Password:" value={password} onChange={e => setPassword(e.target.value)} />

                                        {renderFieldError('password')}
                                    </div>

                                    <div className="flex justify-between mb-4">
                                        <div className="inline-flex items-center mb-0">
                                            <input className="form-checkbox rounded border-gray-200 dark:border-gray-800 text-violet-600 focus:border-violet-600/30 focus:ring focus:ring-offset-0 focus:ring-violet-600/20 focus:ring-opacity-50 me-2" type="checkbox" id="RememberMe" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                                            <label className="form-checkbox-label text-slate-400" htmlFor="RememberMe">Remember me</label>
                                        </div>
                                        <p className="text-slate-400 mb-0"><Link to="/reset-password" className="text-slate-400">Forgot password ?</Link></p>
                                    </div>

                                    <div className="mb-4">
                                        <button onClick={makeRequest} className="btn bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white rounded-full w-full">Login / Sign in</button>
                                    </div>

                                    <div className="text-center">
                                        <span className="text-slate-400 me-2">Don't have an account ?</span> <Link to="/signup" className="text-black dark:text-white font-bold">Sign Up</Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Switcher />
        </>
    )
}
