import MarketJson from "../../../../Marketplace.json"
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Web3 from "web3";
import axios from "axios";
import { Link, useParams } from 'react-router-dom';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import $ from "jquery";
import { useGlobalService } from "../../../../GlobalServiceContext";
import config from "../../../global/constant";
import Cookies from "js-cookie";


import single from '../../../../assets/images/backgrounds/image_6.jpg';
import image from '../../../../assets/images/avatar/img_01.jpg';

const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            loadBlockchainData()
        }
    }));
    const instance = axios.create({
        baseURL: config.backend_url,
        headers: { 'Authorization': `Bearer ${Cookies.get('_csrf')}` }
    });

    const { id } = useParams();
    const [account, setAccount] = useState('');
    const [products, setProducts] = useState([]);
    const [burnProducts, setBurnProducts] = useState([]);
    const [productsTemp, setProductsTemp] = useState([]);
    const [profileUser, setProfileUser] = useState(null);
    const { user } = useGlobalService();
    const [wallets, setWallets] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(null);

    const matchCategory = (category) => {
        setSelectedCategory(category);
        var filteredData = []
        if (category == 0) {
            filteredData = burnProducts;
        } else {
            filteredData = category
                ? products?.filter((item) => item.status == category)
                : products;
        }

        setProductsTemp(filteredData)
    };


    useEffect(() => {
        $("[data-pc-section='grid']").removeClass().addClass("grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[30px]");
        loadBlockchainData();
    }, []);

    async function loadBlockchainData() {
        setAccount(window.ethereum.selectedAddress);
        const web3 = new Web3(Web3.givenProvider);

        const t1 = new web3.eth.Contract(MarketJson.market_abi, MarketJson.market_address);
        const t2 = new web3.eth.Contract(MarketJson.auction_abi, MarketJson.auction_address);

        let transaction = await t1.methods.getTokens().call();
        let nftSymbol = await t2.methods.name().call();

        let userAndWallets = await instance.post("client/get/wallets-address", {
            user_id: id
        });
        var wallets = userAndWallets.data.wallets.map(str => str.toLowerCase());
        setWallets(wallets)
        setProfileUser(userAndWallets.data.user)

        try {
            const items = await Promise.all(transaction.map(async i => {
                let meta = await axios.get(i.tokenURI);
                meta = meta.data;
                let item = {
                    ...i,
                    owner: i.owner.toLowerCase(),
                    name: meta.name,
                    description: meta.description,
                    image: meta.image,
                    link: meta.link,
                    symbol: nftSymbol,
                    price: Web3.utils.fromWei(i.price),
                }
                return item;
            }))

            var all = items.filter(c => wallets.includes(c.owner) && c.status != 10);
            var burn = items.filter(c => wallets.includes(c.owner) && c.status == 10);
            setBurnProducts(burn)
            setProducts(all);
            setProductsTemp(all);
        } catch (err) {
            console.error(err)
        }
    }

    const itemTemplate = (ele) => {
        return (
            <div className="group relative p-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 hover:shadow-md dark:shadow-md hover:dark:shadow-gray-700 transition-all duration-500 h-fit">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-violet-600 rounded-lg -mt-1 group-hover:-mt-2 -ms-1 group-hover:-ms-2 h-[98%] w-[98%] -z-1 transition-all duration-500"></div>
                <div className="relative overflow-hidden">

                    <div className="relative overflow-hidden rounded-lg">
                        <img src={ele.image} className="rounded-lg shadow-md dark:shadow-gray-700 group-hover:scale-110 transition-all duration-500" alt="" />
                    </div>

                    <div className="absolute -bottom-20 group-hover:bottom-1/2 group-hover:translate-y-1/2 start-0 end-0 mx-auto text-center transition-all duration-500">
                        <Link to={"/collection/" + ele.id} className="btn btn-sm rounded-full bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white"><i className="mdi mdi-eye"></i> View</Link>
                    </div>
                </div>

                <div className="mt-3">
                    <Link to={"/profile/" + profileUser?.id} className="flex items-center">
                        <img src={config.profile_url + (profileUser.avatar ? profileUser.avatar : "admin_avatar.png")} className="rounded-full h-8 w-8" alt="" />
                        <span className="ms-2 text-[15px] font-medium text-slate-400 hover:text-violet-600">{ele.symbol} #{ele.id}</span>
                    </Link>

                    <div className="my-3">
                        <Link to={"/collection/" + ele.id} className="font-semibold hover:text-violet-600">{ele.name}</Link>
                    </div>

                    <div className="flex justify-between p-2 bg-gray-50 dark:bg-slate-800 rounded-lg shadow dark:shadow-gray-700">
                        <div>
                            <span className="text-[16px] font-medium text-slate-400 block">Price</span>
                            <span className="text-[16px] font-semibold block">
                                <i className="mdi mdi-ethereum"></i>
                                {ele.price} {ele.paytype == 1 ? 'GRVC' : 'BNB'}
                            </span>
                        </div>

                        <div>
                            <span className="text-[16px] font-medium text-slate-400 block">Type</span>
                            <span className="text-[16px] font-semibold block">
                                {getType(ele)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const getType = (ele) => {
        if (ele.status == 3)
            return <div className="flex align-items-center gap-2">
                <i className="pi pi-list"></i>
                Listing
            </div>
        if (ele.status == 5)
            return <div className="flex align-items-center gap-2">
                <i className="pi pi-stopwatch"></i>
                Auction
            </div>
        if (ele.status == 7)
            return <div className="flex align-items-center gap-2">
                <i className="pi pi-box"></i>
                Gacha
            </div>

        if (ele.status == 9)
            return <div className="flex align-items-center gap-2">
                <i className="pi pi-gift"></i>
                Reward
            </div>

        if (ele.status == 10)
            return <div className="flex align-items-center gap-2">
                <i className="pi pi-bolt"></i>
                Burn
            </div>
    }

    return (
        <>
            <section className="relative md:pb-24 pb-16 lg:mt-24 mt-[74px]">
                <div className="lg:container container-fluid">
                    <div className="group profile-banner relative overflow-hidden text-transparent lg:rounded-xl shadow dark:shadow-gray-700">
                        <div className="relative shrink-0">
                            <img src={single} className="h-80 w-full object-cover" id="profile-banner" alt="" />
                            <div className="absolute inset-0 bg-slate/10 group-hover:bg-slate-900/40 transition duration-500" /></div>
                        <label className="absolute inset-0 cursor-pointer" htmlFor="pro-banner"></label>
                    </div>
                </div>

                <div className="md:flex justify-center">
                    <div className="md:w-full">
                        <div className="relative -mt-[60px] text-center">
                            <div className="group profile-pic w-[112px] mx-auto">
                                <div>
                                    <div className="relative h-28 w-28 mx-auto rounded-full shadow dark:shadow-gray-800 ring-4 ring-slate-50 dark:ring-slate-800 overflow-hidden">
                                        <img src={profileUser?.avatar ? config.profile_url + profileUser.avatar : image} className="rounded-full w-12" id="profile-image" alt="" />
                                        <div className="absolute inset-0 group-hover:bg-slate-900/40 transition duration-500"></div>
                                        <label className="absolute inset-0 cursor-pointer" htmlFor="pro-img"></label>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h5 className="text-xl font-semibold">{profileUser ? profileUser.name : "Loading"} <i className="mdi mdi-check-decagram text-emerald-600 align-middle text-lg"></i></h5>
                                <p className="text-slate-400 text-[16px] mt-1">Join at <a href="" className="text-violet-600 font-semibold">{profileUser?.created_at.substring(0, 10)}</a></p>

                                <ul className="dark:text-white">
                                    {wallets.map((w, i) => {
                                        return <li key={i}>{w}</li>
                                    })}
                                </ul>

                                <div className="mt-4">
                                    <Link to="#" className="btn btn-sm rounded-full bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white mx-1"><i className="mdi mdi-plus"></i> Follow me</Link>
                                    <Link to="#" className="btn btn-icon btn-sm rounded-full bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white mx-1"><i className="mdi mdi-account-plus"></i></Link>
                                    {user?.id == profileUser?.id ? (<Link to="/profile-edit" className="btn btn-icon btn-sm rounded-full bg-violet-600/5 hover:bg-violet-600 border-violet-600/10 hover:border-violet-600 text-violet-600 hover:text-white mx-1"><i className="mdi mdi-cog"></i></Link>) : ("")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="relative py-16">
                    <div className='container'>
                        <div className="grid grid-cols-1 items-center gap-[30px]">
                            <div className="filters-group-wrap text-center">
                                <div className="filters-group">
                                    <ul className="mb-8 list-none container-filter-box filter-options">
                                        <li onClick={() => matchCategory(null)} className={`${selectedCategory === null ? 'active' : ''} inline-block font-medium text-base mx-1.5 mb-3 py-1 px-3 cursor-pointer relative text-slate-400 border border-gray-100 dark:border-gray-700 rounded-full transition duration-500 `} style={{ border: '1px solid' }} data-group="all"><i className="uil uil-browser"></i>  All</li>
                                        <li onClick={() => matchCategory(3)} className={`${selectedCategory == 3 ? 'active' : ''} inline-block font-medium text-base mx-1.5 mb-3 py-1 px-3 cursor-pointer relative text-slate-400 border border-gray-100 dark:border-gray-700 rounded-full transition duration-500`} style={{ border: '1px solid' }} data-group="list"><i className="pi pi-list"></i> Listing</li>
                                        <li onClick={() => matchCategory(5)} className={`${selectedCategory == 5 ? 'active' : ''} inline-block font-medium text-base mx-1.5 mb-3 py-1 px-3 cursor-pointer relative text-slate-400 border border-gray-100 dark:border-gray-700 rounded-full transition duration-500`} style={{ border: '1px solid' }} data-group="auction"><i className="pi pi-stopwatch"></i> Auction</li>
                                        <li onClick={() => matchCategory(7)} className={`${selectedCategory == 7 ? 'active' : ''} inline-block font-medium text-base mx-1.5 mb-3 py-1 px-3 cursor-pointer relative text-slate-400 border border-gray-100 dark:border-gray-700 rounded-full transition duration-500`} style={{ border: '1px solid' }} data-group="gacha"><i className="pi pi-box"></i> Gacha</li>
                                        <li onClick={() => matchCategory(9)} className={`${selectedCategory == 9 ? 'active' : ''} inline-block font-medium text-base mx-1.5 mb-3 py-1 px-3 cursor-pointer relative text-slate-400 border border-gray-100 dark:border-gray-700 rounded-full transition duration-500`} style={{ border: '1px solid' }} data-group="gacha"><i className="pi pi-gift"></i> Rewards</li>
                                        <li onClick={() => matchCategory(0)} className={`${selectedCategory == 0 ? 'active' : ''} inline-block font-medium text-base mx-1.5 mb-3 py-1 px-3 cursor-pointer relative text-slate-400 border border-gray-100 dark:border-gray-700 rounded-full transition duration-500`} style={{ border: '1px solid' }} data-group="gacha"><i className="pi pi-bolt"></i> Burn</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <DataView value={productsTemp} itemTemplate={itemTemplate} paginator rows={8} />
                    </div>
                </section>
            </section>
        </>
    )

});

export default Component