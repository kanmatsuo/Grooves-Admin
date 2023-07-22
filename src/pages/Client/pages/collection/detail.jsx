import { Link } from 'react-router-dom';
import MarketJson from "../../../../Marketplace.json"
import Web3 from "web3";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGlobalService } from "../../../../GlobalServiceContext";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import config from "../../../global/constant";
import truncateEthAddress from 'truncate-eth-address';
import { Button } from 'primereact/button';
import Cookies from "js-cookie";

const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            loadBlockchainData()
        }
    }));
    const { id } = useParams();
    const [purcasedData, updateData] = useState({});
    const { notify } = useGlobalService();

    const [account, setAccount] = useState('');
    const [marketContract, setMarketContract] = useState(null);
    const [listingContract, setListingContract] = useState(null);
    const [tokenContract, setTokenContract] = useState(null);

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadBlockchainData();
    }, []);

    async function loadBlockchainData() {
        setAccount(window.ethereum.selectedAddress);

        const web3 = new Web3(Web3.givenProvider);
        const t1 = new web3.eth.Contract(MarketJson.market_abi, MarketJson.market_address);
        setMarketContract(t1)
        const t2 = new web3.eth.Contract(MarketJson.listing_abi, MarketJson.listing_address);
        setListingContract(t2)
        const t3 = new web3.eth.Contract(MarketJson.token_abi, MarketJson.token_address);
        setTokenContract(t3)

        let token = await t1.methods.getTokenForId(id).call();
        let nftSymbol = await t1.methods.name().call();

        let meta = await axios.get(token.tokenURI);

        let status_desc = await axios.get(config.backend_url + "get/nft/status/label/" + token.status);

        let item = {
            ...token,
            price: Web3.utils.fromWei(String(token.price)),
            name: meta.data.name,
            description: meta.data.description,
            image: meta.data.image,
            link: meta.data.link,
            symbol: nftSymbol,
            currency: token.paytype == 1 ? "GRVC" : "BNB",
            status_desc: status_desc.data,
        }

        updateData(item);
    }

    return (
        <>
            <section className="relative table w-full py-36 bar-bg-10 bg-center bg-no-repeat">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
                <div className="container">
                    <div className="grid grid-cols-1 pb-8 text-center mt-10">
                        <h3 className="md:text-3xl text-2xl md:leading-snug tracking-wide leading-snug font-medium text-white">Collected Items</h3>
                    </div>
                </div>

                <div className="absolute text-center z-10 bottom-5 start-0 end-0 mx-3">
                    <ul className="breadcrumb tracking-[0.5px] breadcrumb-light mb-0 inline-block">
                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white/50 hover:text-white"><Link to="/">G-rooves</Link></li>
                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white/50 hover:text-white"><Link to={"/collection"}> Collected</Link></li>
                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white" aria-current="page"> #{purcasedData.id} {purcasedData.symbol}</li>
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

            <section className="relative pt-28 md:pb-24 pb-16">
                <div className="container">
                    <div className="grid lg:grid-cols-12 md:grid-cols-2 grid-cols-1 gap-[30px]">
                        <div className="lg:col-span-5">
                            <img src={purcasedData.image} className="rounded-md shadow dark:shadow-gray-700 col-12 sticky top-20" alt="" />
                        </div>

                        <div className="lg:col-span-7 lg:ms-8">

                            <div className="bg-gray-50 dark:bg-slate-800 rounded-md shadow dark:shadow-gray-800 mb-5 p-6">
                                <div>
                                    <span className="font-medium text-slate-400 block mb-1">Contract Address</span>
                                    <CopyToClipboard text={MarketJson.market_address}
                                        onCopy={() => notify("copied to clipboard: " + truncateEthAddress(MarketJson.market_address))}>
                                        <div className="flex align-items-center">
                                            <i className="pi pi-copy mr-2 text-violet-600"></i>
                                            <Link to="#" className="font-medium text-violet-600 underline block white-space-nowrap overflow-hidden text-overflow-ellipsis">{MarketJson.market_address}</Link>
                                        </div>
                                    </CopyToClipboard>

                                </div>

                                <div className="mt-4">
                                    <span className="font-medium text-slate-400 block mb-1">Token ID</span>
                                    <span className="font-medium block">#{purcasedData.id}</span>
                                </div>

                                <div className="mt-4">
                                    <span className="font-medium text-slate-400 block mb-1">Blockchain</span>
                                    <span className="font-medium block">BSC</span>
                                </div>

                                <div className="mt-4">
                                    <span className="font-medium text-slate-400 block mb-1">Accept Currency</span>
                                    <span className="font-medium block">{purcasedData.currency}</span>
                                </div>

                                <div className="mt-4">
                                    <span className="font-medium text-slate-400 block mb-1">Accept Currency</span>
                                    <span className="font-medium block">{purcasedData.status_desc}</span>
                                </div>
                            </div>

                            <h5 className="md:text-2xl text-xl font-semibold">{purcasedData.name} #{purcasedData.id}</h5>

                            <span className="font-medium text-slate-400 block mt-2">More about this : <a target='_blank' to={purcasedData.link} className="text-violet-600">{purcasedData.link}</a></span>

                            <p className="text-slate-400 mt-4">
                                {purcasedData.description}
                            </p>

                            <div className='flex'>
                                <div className="mt-4 col-6">
                                    <span className="text-lg font-medium text-slate-400 block text-violet-600">Purcase Price</span>
                                    <span className="tmd:text-2xl text-xl font-semibold block mt-2"><i className="pi pi-pound mr-2"></i> {purcasedData.price} {purcasedData.currency} </span>
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