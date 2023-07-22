import MarketJson from "../../../../Marketplace.json"
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Web3 from "web3";
import axios from "axios";
import { Link } from 'react-router-dom';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import moment from 'moment';
import $ from "jquery";

const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            loadBlockchainData()
        }
    }));
    const [products, setProducts] = useState([]);

    useEffect(() => {
        $("[data-pc-section='grid']").removeClass().addClass("grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[30px]");
        loadBlockchainData();
    }, []);

    async function loadBlockchainData() {
        const web3 = new Web3(Web3.givenProvider);

        const t1 = new web3.eth.Contract(MarketJson.market_abi, MarketJson.market_address);
        const t2 = new web3.eth.Contract(MarketJson.auction_abi, MarketJson.auction_address);

        let transaction = await t1.methods.getTokens().call();
        let nftSymbol = await t2.methods.name().call();

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
                    price: Web3.utils.fromWei(t.price),
                    temporaryHighestBid: Web3.utils.fromWei(t.temporaryHighestBid)
                }
                return item;
            }))

            setProducts(items.filter(c => c.status == 4));
        } catch (err) {
            console.error(err)
        }
    }

    const itemTemplate = (ele) => {
        return (
            <div className="group relative overflow-hidden p-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 hover:shadow-md dark:shadow-md hover:dark:shadow-gray-700 transition-all duration-500 hover:-mt-2 h-fit">
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
        );
    };

    return (
        <>
            <section className="relative table w-full py-36 bar-bg-6 bg-center bg-no-repeat">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
                <div className="container">
                    <div className="grid grid-cols-1 pb-8 text-center mt-10">
                        <h3 className="md:text-3xl text-2xl md:leading-snug tracking-wide leading-snug font-medium text-white">Live Auction</h3>

                    </div>
                </div>

                <div className="absolute text-center z-10 bottom-5 start-0 end-0 mx-3">
                    <ul className="breadcrumb tracking-[0.5px] breadcrumb-light mb-0 inline-block">
                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white/50 hover:text-white"><Link to="/">G-rooves</Link></li>
                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white" aria-current="page"> Auction</li>
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
            <section className="relative py-16">
                <div className='md:mt-24 mt-16 container'>
                    <DataView value={products} itemTemplate={itemTemplate} paginator rows={8} />
                </div>
            </section>
        </>
    )
});

export default Component