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

        var user = await instance.get("user");
        user = user.data

        let userAndWallets = await instance.post("client/get/wallets-address", {
            user_id: user.id
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
            <section className="relative table w-full py-36 bar-bg-9 bg-center bg-no-repeat">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
                <div className="container">
                    <div className="grid grid-cols-1 pb-8 text-center mt-10">
                        <h3 className="md:text-3xl text-2xl md:leading-snug tracking-wide leading-snug font-medium text-white">Collected Items</h3>

                    </div>
                </div>

                <div className="absolute text-center z-10 bottom-5 start-0 end-0 mx-3">
                    <ul className="breadcrumb tracking-[0.5px] breadcrumb-light mb-0 inline-block">
                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white/50 hover:text-white"><Link to="/">G-rooves</Link></li>

                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white" aria-current="page"> Collection</li>
                    </ul>
                </div>
            </section>

            <section className="relative md:pb-24 pb-16">
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