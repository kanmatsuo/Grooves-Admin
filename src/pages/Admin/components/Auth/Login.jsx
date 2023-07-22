import React, { useState , forwardRef, useImperativeHandle} from "react";
import { useForm } from "../../../global/useForm";
import axios from "axios";
import Cookies from "js-cookie"
import config from "../../../global/constant";
import { useGlobalService } from "../../../../GlobalServiceContext";
import GroovesLogo from "../../../../assets/G-rooves_logo.svg";
import { Tilt } from 'react-tilt'
import { InputSwitch } from "primereact/inputswitch";

export default function Login(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);

    const { notify, refresh } = useGlobalService();
    const { setErrors, renderFieldError, message, setMessage, navigate } = useForm();

    const makeRequest = (e) => {
        e.preventDefault();

        setErrors(null);
        setMessage('');

        // make request first to sanctum/csrf-cookie
        axios.get(config.get_csrf_token_addr).then((response) => {
            const payload = {
                email,
                password
            };

            if (remember) {
                payload.remember = true;
            }

            axios.post(config.backend_url + 'admin/login', payload, { headers: { 'Accept': 'application/json' } }).then(response => {
                if (response.data.content.access_token) {
                    Cookies.set('_csrf', response.data.content.access_token, { expires: config.cookies_expire_time, path: '/' })

                    setTimeout(() => {
                        refresh();
                        notify("Successfully signed in!")
                        navigate('/admin');
                    }, 1000);
                }
            }).catch(error => {
                console.log(error);
                notify(error.message, 'error')
                if (error.response) {
                    if (error.response.data.errors) {
                        setErrors(error.response.data.errors);
                    }
                }
            });
        });
    };

    const defaultOptions = {
        reverse: false,  // reverse the tilt direction
        max: 125,     // max tilt rotation (degrees)
        perspective: 10000,   // Transform perspective, the lower the more extreme the tilt gets.
        scale: 1.1,    // 2 = 200%, 1.5 = 150%, etc..
        speed: 1000,   // Speed of the enter/exit transition
        transition: true,   // Set a transition on enter/exit.
        axis: null,   // What axis should be disabled. Can be X or Y.
        reset: true,    // If the tilt effect has to be reset on exit.
        easing: "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
    }


    return (

        <div className="limiter loginForm">
            <div className="container-login100">
                <div className="wrap-login100">
                    <div className="login100-pic js-tilt" data-tilt>

                        <Tilt options={defaultOptions} style={{ width: '100%' }}>
                            <img src={GroovesLogo} alt="IMG" />
                        </Tilt>
                    </div>

                    <form className="login100-form validate-form " onSubmit={makeRequest}>
                        <span className="login100-form-title">
                            Admin Login
                        </span>

                        {
                            message && <div className="alert alert-danger">{message}</div>
                        }
                        <div className="wrap-input100 validate-input">
                            <input id="email" type="email"
                                className="input100" name="email"
                                required autoComplete="email" autoFocus value={email} onChange={e => setEmail(e.target.value)} />
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                                <i className="pi pi-envelope" aria-hidden="true"></i>
                            </span>

                        </div>

                        <div className="mb-3">
                            {renderFieldError('email')}
                        </div>

                        <div className="wrap-input100 validate-input">
                            <input id="password" type="password"
                                className="input100" name="password"
                                required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                                <i className="pi pi-lock" aria-hidden="true"></i>
                            </span>
                        </div>

                        <div className="mb-3">
                            {renderFieldError('password')}
                        </div>

                        <div className="form-check flex align-items-center mt-4 justify-content-center">

                            <InputSwitch checked={remember} id="remember" onChange={(e) => setRemember(e.value)} />

                            <label className="form-check-label ml-4" htmlFor="remember">
                                Remember Me
                            </label>
                        </div>

                        <div className="container-login100-form-btn">
                            <button className="login100-form-btn" type="submit">
                                Login
                            </button>
                        </div>
                        <div className="text-center mt-5">
                            <span className="txt1 mr-2">
                                Forgot
                            </span>
                            <a className="txt2" href="#">
                                Username / Password?
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};