import { useState, forwardRef, useImperativeHandle } from 'react'
import image from '../../../../assets/images/avatar/img_01.jpg';
import { Link } from 'react-router-dom';
import { useGlobalService } from "../../../../GlobalServiceContext";
import config from "../../../global/constant";
import { useForm } from "../../../global/useForm";
import axios from 'axios';
import Cookies from "js-cookie";

const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            console.log("empty blockchain")
        }
    }));


    const loadFile = (event) => {
        const image = document.getElementById(event.target.name);
        image.src = URL.createObjectURL(event.target.files[0]);
        setFile(event.target.files[0])
    };

    const { user, notify, refresh } = useGlobalService();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [file, setFile] = useState(null);

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [oldPassword, setOldPassword] = useState('');

    const { setErrors, renderFieldError, navigate } = useForm();

    const updateProfile = (e) => {
        e.preventDefault();

        setErrors(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        formData.append('email', email);

        const instance = axios.create({
            baseURL: config.backend_url,
            headers: { 'Authorization': `Bearer ${Cookies.get('_csrf')}` }
        });

        instance.post('client/profile/edit-profile', formData).then(response => {
            if (response.data.user) {
                notify("update")
                refresh()
            }
        }).catch(error => {
            notify(error.message, 'error')
            if (error.response) {
                if (error.response.data.errors) {
                    setErrors(error.response.data.errors);
                }
            }
        });
    };

    const updatePassword = (e) => {
        e.preventDefault();
        setErrors(null);

        instance.post('client/profile/edit-password', {
            old: oldPassword,
            password,
            password_confirmation: passwordConfirmation
        }).then(response => {
            if (response.data.user) {
                notify("update")
                refresh()
                console.log(user)
            }
        }).catch(error => {
            notify(error.message, 'error')
            if (error.response) {
                if (error.response.data.errors) {
                    setErrors(error.response.data.errors);
                }
            }
        });
    };

    return (
        <>
            <section className="relative table w-full py-36 bg-center bg-no-repeat profileEdit">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
                <div className="container">
                    <div className="grid grid-cols-1 pb-8 text-center mt-10">
                        <h3 className="md:text-3xl text-2xl md:leading-snug tracking-wide leading-snug font-medium text-white">Edit Profile / Settings</h3>

                    </div>
                </div>

                <div className="absolute text-center z-10 bottom-5 start-0 end-0 mx-3">
                    <ul className="breadcrumb tracking-[0.5px] breadcrumb-light mb-0 inline-block">
                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white/50 hover:text-white"><Link to="/">Grooves</Link></li>
                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white" aria-current="page"> Settings</li>
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
                    <div className="grid md:grid-cols-12 gap-[30px]">
                        <div className="lg:col-span-3 md:col-span-4">
                            <div className="group profile-pic w-[112px] mx-auto">
                                <input id="pro-img" name="profile-image" type="file" className="hidden" onChange={loadFile} />
                                <div>
                                    <div className="relative h-28 w-28 rounded-full shadow-md dark:shadow-gray-800 ring-4 ring-slate-50 dark:ring-slate-800 overflow-hidden">
                                        <img src={user?.avatar ? config.profile_url + user.avatar : image} className="rounded-full w-12" id="profile-image" alt="" />
                                        <div className="absolute inset-0 group-hover:bg-slate-900/40 transition duration-500"></div>
                                        <label className="absolute inset-0 cursor-pointer" htmlFor="pro-img"></label>
                                    </div>
                                </div>
                                {renderFieldError('file')}
                            </div>

                            <p className="text-slate-400 mt-3 text-center">Uploads profile image.</p>
                        </div>

                        <div className="lg:col-span-9 md:col-span-8">
                            <div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900">
                                <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
                                    <div>
                                        <h5 className="text-lg font-semibold mb-5">Personal Detail :</h5>

                                        <div>
                                            <div className="grid grid-cols-1 gap-5">
                                                <div>
                                                    <label className="form-label font-medium">Name : <span className="text-red-600">*</span></label><span className='text-xs text-current text-gray'> Current : {user?.name}</span>
                                                    <input type="text" className="form-input w-full text-[15px] py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0 mt-2" placeholder="Name :" id="name" name="name" value={name} onChange={e => setName(e.target.value)} />
                                                    {renderFieldError('name')}
                                                </div>

                                                <div>
                                                    <label className="form-label font-medium">Your Email : <span className="text-red-600">*</span></label> <span className='text-xs text-current text-gray'>Current : {user?.email}</span>
                                                    <input type="email" className="form-input w-full text-[15px] py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0 mt-2" placeholder="Email :" value={email} onChange={e => setEmail(e.target.value)} />
                                                    {renderFieldError('email')}
                                                </div>
                                            </div>

                                            <button onClick={updateProfile} className="btn bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white rounded-full mt-5">Save Changes</button>
                                        </div>
                                    </div>

                                    <div>
                                        <h5 className="text-lg font-semibold mb-5">Change password :</h5>
                                        <form>
                                            <div className="grid grid-cols-1 gap-5">
                                                <div>
                                                    <label className="form-label font-medium">Old password :</label>
                                                    <input type="password" className="form-input w-full text-[15px] py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0 mt-2" placeholder="Old password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                                                    {renderFieldError('old')}
                                                </div>

                                                <div>
                                                    <label className="form-label font-medium">New password :</label>
                                                    <input type="password" className="form-input w-full text-[15px] py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0 mt-2" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} />
                                                    {renderFieldError('password')}
                                                </div>

                                                <div>
                                                    <label className="form-label font-medium">Re-type New password :</label>
                                                    <input type="password" className="form-input w-full text-[15px] py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0 mt-2" placeholder="Re-type New password" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} />
                                                    {renderFieldError('password_confirmation')}
                                                </div>
                                            </div>

                                            <button onClick={updatePassword} className="btn bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white rounded-full mt-5">Save password</button>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900 mt-[30px]">
                                <h5 className="text-lg font-semibold mb-5 text-red-600">Delete Account :</h5>

                                <p className="text-slate-400 mb-4">Do you want to delete the account? Please press below "Delete" button</p>

                                <button className="btn bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700 text-white rounded-full">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
});
export default Component