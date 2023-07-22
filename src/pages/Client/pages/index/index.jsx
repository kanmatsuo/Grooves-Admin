import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import Web3 from "web3";
import MarketJson from "../../../../Marketplace.json"
import QA from '../../components/qa';
import GetTouch from '../../components/get-touch';
import { Link } from 'react-router-dom';
import Feature from '../../components/feature';
import axios from "axios";
import moment from 'moment';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link as Link2 } from 'react-scroll';

const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            loadBlockchainData()
        }
    }));

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    const getType = (ele) => {
        if (ele.status == 2)
            return <div className="flex align-items-center gap-2">
                <i className="pi pi-list"></i>
                Listing
            </div>
        if (ele.status == 4)
            return <div className="flex align-items-center gap-2">
                <i className="pi pi-stopwatch"></i>
                Auction
            </div>
        if (ele.status == 6)
            return <div className="flex align-items-center gap-2">
                <i className="pi pi-box"></i>
                Gacha
            </div>

        if (ele.status == 8)
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

    const AuctionTemplate = (ele, index) => {
        return (
            <div key={index} className='p-2'>
                <div className="group relative overflow-hidden p-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 hover:shadow-md dark:shadow-md hover:dark:shadow-gray-700 transition-all duration-500 hover:-mt-2 h-fit" >
                    <div className="relative overflow-hidden">
                        <div className="relative overflow-hidden rounded-lg">
                            <img src={ele.image} className="rounded-lg shadow-md dark:shadow-gray-700 group-hover:scale-110 transition-all duration-500" alt="" />
                        </div>

                        <div className="absolute -bottom-20 group-hover:bottom-1/2 group-hover:translate-y-1/2 start-0 end-0 mx-auto text-center transition-all duration-500">
                            <Link to={"/auction/" + ele.id} className="btn btn-sm rounded-full bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white"><i className="mdi mdi-lightning-bolt"></i> Bid Now</Link>
                        </div>

                        <div className="absolute top-2 end-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <Link to="#" className="btn btn-icon btn-sm rounded-full bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white"><i className="mdi mdi-plus"></i></Link>
                        </div>

                        <div className="absolute bottom-2 start-0 end-0 mx-auto text-center bg-gradient-to-r from-violet-600 to-red-600 text-white inline-table text-lg px-3 rounded-full">
                            <i className="uil uil-clock align-middle me-1"></i>
                            <small id="auction-item-2" className="font-bold">
                                {ele.isend ? "It's end" : ele.deadline}
                            </small>
                        </div>
                    </div>

                    <div className="mt-3">
                        <div className="flex items-center">
                            <i className="mdi mdi-bitcoin"></i>
                            <span className="ms-2 text-[15px] font-medium text-slate-400 hover:text-violet-600">{ele.symbol} #{ele.id}</span>
                        </div>

                        <div className="my-3">
                            <Link to={"/auction/" + ele.id} className="font-semibold hover:text-violet-600">{ele.name}</Link>
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
                                <span className="text-[16px] font-medium text-slate-400 block">Highest Bid</span>
                                <span className="text-[16px] font-semibold block">
                                    <i className="mdi mdi-ethereum"></i>
                                    {
                                        ele.auctionStarted ? ele.temporaryHighestBid + (ele.paytype == 1 ? 'GRVC' : 'BNB') : "No Bids"
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    };

    const ListingTemplate = (ele, index) => {
        return (
            <div key={index} className='p-2'>
                <div className="group relative p-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 hover:shadow-md dark:shadow-md hover:dark:shadow-gray-700 transition-all duration-500 h-fit">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-violet-600 rounded-lg -mt-1 group-hover:-mt-2 -ms-1 group-hover:-ms-2 h-[98%] w-[98%] -z-1 transition-all duration-500"></div>

                    <div className="relative overflow-hidden">
                        <div className="relative overflow-hidden rounded-lg">
                            <img src={ele.image} className="rounded-lg shadow-md dark:shadow-gray-700 group-hover:scale-110 transition-all duration-500" alt="" />
                        </div>

                        <div className="absolute -bottom-20 group-hover:bottom-1/2 group-hover:translate-y-1/2 start-0 end-0 mx-auto text-center transition-all duration-500">
                            <Link to={"/list/" + ele.id} className="btn btn-sm rounded-full bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white"><i className="mdi mdi-lightning-bolt"></i> Buy Now</Link>
                        </div>

                        <div className="absolute top-2 end-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <Link to="#" className="btn btn-icon btn-sm rounded-full bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white"><i className="mdi mdi-plus"></i></Link>
                        </div>
                    </div>

                    <div className="mt-3">
                        <div className="flex items-center">
                            <i className="mdi mdi-bitcoin"></i>
                            <span className="ms-2 text-[15px] font-medium text-slate-400 hover:text-violet-600">{ele.symbol} #{ele.id}</span>
                        </div>

                        <div className="my-3">
                            <Link to={"/auction/" + ele.id} className="font-semibold hover:text-violet-600">{ele.name}</Link>
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
            </div>

        );
    };

    const GachaTemplate = (ele, index) => {
        return (
            <div key={index} className='p-2'>
                <div className="group relative p-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 hover:shadow-md dark:shadow-md hover:dark:shadow-gray-700 transition-all duration-500 h-fit">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-violet-600 rounded-lg -mt-1 group-hover:-mt-2 -ms-1 group-hover:-ms-2 h-[98%] w-[98%] -z-1 transition-all duration-500"></div>

                    <div className="relative overflow-hidden">
                        <div className="relative overflow-hidden rounded-lg">
                            <img src={ele.image} className="rounded-lg shadow-md dark:shadow-gray-700 group-hover:scale-110 transition-all duration-500" alt="" />
                        </div>
                    </div>

                    <div className="mt-3">
                        <div className="flex items-center">
                            <i className="mdi mdi-bitcoin"></i>
                            <span className="ms-2 text-[15px] font-medium text-slate-400 hover:text-violet-600">{ele.symbol} #{ele.id}</span>
                        </div>

                        <div className="my-3">
                            <Link to={"/auction/" + ele.id} className="font-semibold hover:text-violet-600">{ele.name}</Link>
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
            </div>

        );
    };

    const RewardTemplate = (ele, index) => {
        return (
            <div key={index} className='p-2'>
                <div className="group relative overflow-hidden p-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 hover:shadow-md dark:shadow-md hover:dark:shadow-gray-700 transition-all duration-500 hover:-mt-2 h-fit" >
                    <div className="relative overflow-hidden">
                        <div className="relative overflow-hidden rounded-lg">
                            <img src={ele.image} className="rounded-lg shadow-md dark:shadow-gray-700 group-hover:scale-110 transition-all duration-500" alt="" />
                        </div>
                    </div>

                    <div className="mt-3">
                        <div className="flex items-center">
                            <i className="mdi mdi-bitcoin"></i>
                            <span className="ms-2 text-[15px] font-medium text-slate-400 hover:text-violet-600">{ele.symbol} #{ele.id}</span>
                        </div>

                        <div className="my-3">
                            <Link to={"/auction/" + ele.id} className="font-semibold hover:text-violet-600">{ele.name}</Link>
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
            </div>

        );
    };

    const [products, setProducts] = useState([]);

    function getSettings(len) {
        var settings = {
            dots: false,
            arrow: false,
            infinite: len > 4,
            speed: 1000,
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            pauseOnHover: false,
            row: 1,
            responsive: [
                {
                    breakpoint: 1024, // screen width at which 4 slides will be displayed
                    settings: {
                        slidesToShow: len > 3
                    }
                },
                {
                    breakpoint: 768, // screen width at which 3 slides will be displayed
                    settings: {
                        slidesToShow: len > 2
                    }
                },
                {
                    breakpoint: 480, // screen width at which 2 slides will be displayed
                    settings: {
                        slidesToShow: len > 1
                    }
                }
            ]
        };

        return settings;
    }

    useEffect(() => {
        loadBlockchainData();
    }, []);

    async function loadBlockchainData() {
        const web3 = new Web3(Web3.givenProvider);

        const t1 = new web3.eth.Contract(MarketJson.market_abi, MarketJson.market_address);
        const t2 = new web3.eth.Contract(MarketJson.auction_abi, MarketJson.auction_address);

        let transaction = await t1.methods.getTokens().call();
        let nftSymbol = await t1.methods.name().call();

        try {
            const items = await Promise.all(transaction.map(async i => {
                let meta = await axios.get(i.tokenURI);
                meta = meta.data;

                const t = await t2.methods.getAuctionForId(i.id).call();
                let timestamp = (Number(t.s_lastTimeStamp) + Number(t.i_interval)) * 1000;

                let date = new Date(timestamp);
                let formatted = moment(date).format("yyyy-MM-DD HH:mm:ss");

                let currentDateTime = new Date();
                let givenDateTime = new Date(formatted);
                let isend = givenDateTime < currentDateTime;
                let item = {
                    ...i,
                    ...t,
                    owner: i.owner.toLowerCase(),
                    name: meta.name,
                    description: meta.description,
                    image: meta.image,
                    link: meta.link,
                    symbol: nftSymbol,
                    deadline: formatted,
                    isend: isend,
                    price: Web3.utils.fromWei(i.price),
                    temporaryHighestBid: Web3.utils.fromWei(t.temporaryHighestBid)
                }
                return item;
            }))

            setProducts(items);

        } catch (err) {
            console.error(err)
        }
    }

    return (
        <>
            <section className="relative md:pt-48 pt-36 overflow-hidden">
                <div className="container">
                    <div className="grid grid-cols-1 justify-center text-center mt-10">
                        <div className="relative">
                            <div className="relative mb-5">
                                <h1 className="font-bold lg:leading-snug leading-snug text-4xl lg:text-6xl">Discover rate <br /> collection or <span className="bg-gradient-to-l from-red-600 to-violet-600 text-transparent bg-clip-text">Arts & NFTs</span></h1>

                                <div className="overflow-hidden after:content-[''] after:absolute after:h-10 after:w-10 after:bg-violet-600/10 dark:after:bg-violet-600/30 after:-top-[50px] after:start-[30%] after:-z-1 after:rounded-lg after:animate-[spin_10s_linear_infinite]"></div>

                                <div className="overflow-hidden after:content-[''] after:absolute after:h-10 after:w-10 after:bg-violet-600/20 dark:after:bg-violet-600/40 after:bottom-[0] after:end-[15%] after:-z-1 after:rounded-full after:animate-ping"></div>
                            </div>
                            <p className="text-slate-400 dark:text-white/70 text-lg max-w-xl mx-auto">We are a huge marketplace dedicated to connecting great artists of all G-rooves with their fans and unique token collectors!</p>

                            <div className="mt-8">
                                <Link2 to="Explore" spy={true} className="btn bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white rounded-full">Explore now</Link2>
                            </div>
                        </div>
                    </div>

                    <div className="relative animate-[spin_30s_linear_infinite] -z-1">
                        <span className="after:absolute after:start-0 after:bottom-1/2 after:translate-y-1/2 after:h-2 after:w-8 after:rounded-md after:bg-violet-600/20 relative after:z-10"></span>
                        <span className="after:absolute after:start-0 after:bottom-1/2 after:translate-y-1/2 after:rotate-90 after:h-2 after:w-8 after:rounded-md after:bg-violet-600/20 relative after:z-10"></span>
                    </div>
                </div>

            </section>
            <section className="relative md:pt-24 pt-16" id='Explore'>
                <Feature />

                <div className='container md:mt-24 mt-16'>
                    <div className="grid grid-cols-1 text-center mb-8"><h3 className="mb-4 md:text-3xl text-2xl md:leading-snug leading-snug font-semibold">Listing Items</h3><p className="text-slate-400 max-w-xl mx-auto">We are a huge marketplace dedicated to connecting great artists of all Giglink with their fans and unique token collectors!</p></div>

                    <Slider {...getSettings(shuffle(products).filter(c => c.status == 2).length)}>
                        {products.filter(c => c.status == 2).map((el, index) => (
                            ListingTemplate(el, index)
                        ))}
                    </Slider>

                    <div className="mt-8 text-center">
                        <Link to={"/list"} className="btn bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white rounded-full" >Explore More</Link>
                    </div>
                </div>

                <div className='container md:mt-24 mt-16'>
                    <div className="grid grid-cols-1 text-center mb-8"><h3 className="mb-4 md:text-3xl text-2xl md:leading-snug leading-snug font-semibold">Live Auctions</h3><p className="text-slate-400 max-w-xl mx-auto">We are a huge marketplace dedicated to connecting great artists of all Giglink with their fans and unique token collectors!</p></div>

                    <Slider {...getSettings(shuffle(products).filter(c => c.status == 4).length)}>
                        {products.filter(c => c.status == 4).map((el, index) => (
                            AuctionTemplate(el, index)
                        ))}
                    </Slider>

                    <div className="mt-8 text-center">
                        <Link to={"/auction"} className="btn bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white rounded-full" >Explore More</Link>
                    </div>
                </div>

                <div className='container md:mt-24 mt-16'>
                    <div className="grid grid-cols-1 text-center mb-8"><h3 className="mb-4 md:text-3xl text-2xl md:leading-snug leading-snug font-semibold">Play Gacha</h3><p className="text-slate-400 max-w-xl mx-auto">We are a huge marketplace dedicated to connecting great artists of all Giglink with their fans and unique token collectors!</p></div>

                    <Slider {...getSettings(shuffle(products).filter(c => c.status == 6).length)}>
                        {products.filter(c => c.status == 6).map((el, index) => (
                            GachaTemplate(el, index)
                        ))}
                    </Slider>

                    <div className="mt-8 text-center">
                        <Link to={"/gacha"} className="btn bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white rounded-full" >Explore More</Link>
                    </div>
                </div>

                <div className='container md:mt-24 mt-16'>
                    <div className="grid grid-cols-1 text-center mb-8"><h3 className="mb-4 md:text-3xl text-2xl md:leading-snug leading-snug font-semibold">Burn & Reward</h3><p className="text-slate-400 max-w-xl mx-auto">We are a huge marketplace dedicated to connecting great artists of all Giglink with their fans and unique token collectors!</p></div>

                    <Slider {...getSettings(shuffle(products).filter(c => c.status == 8).length)}>
                        {products.filter(c => c.status == 8).map((el, index) => (
                            RewardTemplate(el, index)
                        ))}
                    </Slider>

                    <div className="mt-8 text-center">
                        <Link to={"/reward"} className="btn bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white rounded-full" >Explore More</Link>
                    </div>
                </div>

                <QA />
                <GetTouch />
            </section>

        </>
    )
});

export default Component
