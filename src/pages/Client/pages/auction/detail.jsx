import { Link } from 'react-router-dom';
import MarketJson from "../../../../Marketplace.json"
import Web3 from "web3";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useTimer from "../../../global/useTimer";
import moment from 'moment';
import { useGlobalService } from "../../../../GlobalServiceContext";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import config from "../../../global/constant";
import { Tag } from 'react-feather';
import truncateEthAddress from 'truncate-eth-address';
import { Button } from 'primereact/button';
import { useFormik } from 'formik';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import Cookies from "js-cookie";

const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            loadBlockchainData()
        }
    }));

    const { id } = useParams();
    const [auctionData, updateData] = useState({});
    const navigate = useNavigate();
    const { notify, history, emitSocket } = useGlobalService();

    const [account, setAccount] = useState('');
    const [marketContract, setMarketContract] = useState(null);
    const [auctionContract, setAuctionContract] = useState(null);
    const [tokenContract, setTokenContract] = useState(null);

    const [deadline, setDeadline] = useState("2023-12-31 23:59:59");
    const { days, hours, minutes, seconds, isend } = useTimer(deadline);

    const [loadingBid, setLoadingBid] = useState(false)
    const [loadingReceive, setLoadingReceive] = useState(false)

    const [activeIndex, setIndex] = useState(0);

    useEffect(() => {
        loadBlockchainData();
    }, []);

    async function loadBlockchainData() {
        const web3 = new Web3(Web3.givenProvider);
        const t1 = new web3.eth.Contract(MarketJson.market_abi, MarketJson.market_address);
        setMarketContract(t1)
        const t2 = new web3.eth.Contract(MarketJson.auction_abi, MarketJson.auction_address);
        setAuctionContract(t2)
        const t3 = new web3.eth.Contract(MarketJson.token_abi, MarketJson.token_address);
        setTokenContract(t3)

        setAccount(window.ethereum.selectedAddress);

        let auctionToken = await t1.methods.getTokenForId(id).call();
        let nftSymbol = await t1.methods.name().call();

        let items = await t2.methods.getBids(id).call();


        const bids = await Promise.all(items.map(async i => {

            var bidder = await instance.post("client/get/user-by-address", {
                wallet: i.bidder
            });

            var item = {
                bidder: bidder.data,
                time: moment(new Date(i.time * 1000)).format("yyyy-MM-DD HH:mm:ss"),
                amount: Web3.utils.fromWei(String(i.amount)),
            }
            return item;
        }));

        const auctionDetail = await t2.methods.getAuctionForId(id).call();
        let meta = await axios.get(auctionToken.tokenURI);

        let item = {
            ...auctionToken,
            ...auctionDetail,
            price: Web3.utils.fromWei(String(auctionDetail.price)),
            temporaryHighestBid: Web3.utils.fromWei(String(auctionDetail.temporaryHighestBid)),
            name: meta.data.name,
            description: meta.data.description,
            image: meta.data.image,
            link: meta.data.link,
            symbol: nftSymbol,
            bids: bids,
            currentWinner: auctionDetail.currentWinner.toLowerCase(),
            owner: auctionToken.owner.toLowerCase(),
            currency: auctionToken.paytype == 1 ? "GRVC" : "BNB"
        }

        let timestamp = (Number(auctionDetail.s_lastTimeStamp) + Number(auctionDetail.i_interval)) * 1000;
        var t4 = new Date(timestamp);
        var formatted = moment(t4).format("yyyy-MM-DD HH:mm:ss");
        setDeadline(formatted)
        updateData(item);
    }

    const handleBid = async (param) => {
        try {
            setLoadingBid(true)
            let wei = Web3.utils.toWei(String(param.price))
            if (auctionData.paytype == 1) {
                await tokenContract.methods.approve(auctionData.owner, wei).send({ from: account })
                var tx = await auctionContract.methods.makeBid(auctionData.id, wei).send({ from: account })
            } else {
                var tx = await auctionContract.methods.makeBid(auctionData.id, wei).send({ from: account, value: wei })
            }

            notify("Bid Successfully!");
            history({
                id: auctionData.id,
                from: account,
                action: 12,
                tx_link: config.tx_prefix + tx.transactionHash,
                price: param.price,
                paytype: auctionData.paytype
            })

            // loadBlockchainData();
            setLoadingBid(false)
            emitSocket(
                tx.transactionHash,
                'update',
                {
                    id: auctionData.id,
                    price: param.price,
                    paytype: auctionData.paytype
                }
            );
        } catch (error) {
            setLoadingBid(false)
        }
    }

    const handleReceiveNFT = async () => {
        try {
            setLoadingReceive(true)
            var tx = await auctionContract.methods.receiveNft(auctionData.id).send({ from: account });
            notify("Received Successfully!");
            history({
                id: auctionData.id,
                from: account,
                action: 11,
                tx_link: config.tx_prefix + tx.transactionHash,
                price: auctionData.price,
                paytype: auctionData.paytype
            })

            loadBlockchainData();
            setLoadingReceive(false)
            emitSocket(
                tx.transactionHash,
                'update',
                {
                    id: auctionData.id,
                    price: auctionData.temporaryHighestBid,
                    paytype: auctionData.paytype
                }
            );
            navigate("/collection/" + auctionData.id)
        } catch (error) {
            setLoadingReceive(false)
        }
    }

    const formik = useFormik({
        initialValues: {
            price: 0,
        },
        validate: (data) => {
            let errors = {};

            if (data.price <= 0) {
                errors.price = 'Positive is required.';
            }

            return errors;
        },
        onSubmit: (data) => {
            data && handleBid(data);
            formik.resetForm();
        }
    });

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };

    const instance = axios.create({
        baseURL: config.backend_url,
        headers: { 'Authorization': `Bearer ${Cookies.get('_csrf')}` }
    });

    const itemTemplate = (ele) => {
        return (
            <div className="flex items-center mb-2 pb-2">
                <div className="relative inline-block">
                    <Link to={"/profile/" + ele.bidder.id} >
                        <img src={config.profile_url + (ele.bidder.avatar ? ele.bidder.avatar : "admin_avatar.png")} className="h-16 rounded-md" alt="" />
                        <i className="mdi mdi-check-decagram text-emerald-600 text-lg absolute -top-2 -end-2"></i>
                    </Link>

                </div>

                <div className="ms-3">
                    <h6 className="font-semibold">{ele.amount} {auctionData.currency} <span className="text-slate-400">by</span> <Link to={"/profile/" + ele.bidder.id} className="hover:text-violet-600 duration-500 ease-in-out">{ele.bidder.name}</Link></h6>
                    <span className="text-slate-400 text-[16px]">{moment(ele.time).fromNow()}</span>
                </div>
            </div>
        )
    }

    return (
        <>
            <section className="relative table w-full py-36 bar-bg-7 bg-center bg-no-repeat">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
                <div className="container">
                    <div className="grid grid-cols-1 pb-8 text-center mt-10">
                        <h3 className="md:text-3xl text-2xl md:leading-snug tracking-wide leading-snug font-medium text-white">Live Auction</h3>

                    </div>
                </div>

                <div className="absolute text-center z-10 bottom-5 start-0 end-0 mx-3">
                    <ul className="breadcrumb tracking-[0.5px] breadcrumb-light mb-0 inline-block">
                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white/50 hover:text-white"><Link to="/">G-rooves</Link></li>
                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white/50 hover:text-white"><Link to="/auction"> Auction</Link></li>
                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white" aria-current="page"> #{auctionData.id} {auctionData.symbol}</li>
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
                            <img src={auctionData.image} className="rounded-md shadow dark:shadow-gray-700 col-12" alt="" />

                            <div className="bg-gray-50 dark:bg-slate-800 rounded-md shadow dark:shadow-gray-800 mt-[30px] p-6">
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
                                    <span className="font-medium block">#{auctionData.id}</span>
                                </div>

                                <div className="mt-4">
                                    <span className="font-medium text-slate-400 block mb-1">Blockchain</span>
                                    <span className="font-medium block">BSC</span>
                                </div>

                                <div className="mt-4">
                                    <span className="font-medium text-slate-400 block mb-1">Accept Currency</span>
                                    <span className="font-medium block">{auctionData.currency}</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-7 lg:ms-8">
                            <h5 className="md:text-2xl text-xl font-semibold">{auctionData.name} #{auctionData.id}</h5>

                            <span className="font-medium text-slate-400 block mt-2">More about this : <a target='_blank' to={auctionData.link} className="text-violet-600">{auctionData.link}</a></span>

                            <p className="text-slate-400 mt-4">
                                {auctionData.description}
                            </p>

                            <div className='flex'>
                                <div className="mt-4 col-6">
                                    <span className="text-lg font-medium text-slate-400 block text-violet-600">Start Price</span>
                                    <span className="tmd:text-2xl text-xl font-semibold block mt-2"><i className="pi pi-stopwatch mr-2"></i> {auctionData.price} {auctionData.currency} </span>
                                </div>

                                <div className="mt-4 col-6">
                                    <span className="text-lg font-medium text-slate-400 block text-violet-600">Highest Bid</span>
                                    <span className="tmd:text-2xl text-xl font-semibold block mt-2"><i className="pi pi-sort-amount-up mr-2"></i>
                                        {
                                            auctionData.auctionStarted ? auctionData.temporaryHighestBid + (auctionData.paytype == 1 ? 'GRVC' : 'BNB') : "No Bids"
                                        }

                                    </span>
                                </div>
                            </div>

                            <div className="mx-auto mt-5 text-center bg-gradient-to-r from-violet-600 to-red-600 text-white inline-table text-lg px-3 rounded-full">
                                <i className="pi pi-spin pi-hourglass align-middle mr-2"></i>
                                <small id="auction-item-2" className="font-bold">
                                    {isend ? (
                                        <>It's end!</>
                                    ) : (
                                        <>{days}:{hours}:{minutes}:{seconds}</>
                                    )}

                                </small>
                            </div>


                            <div className="grid grid-cols-1 mt-8">
                                <ul className="md:w-fit w-full flex-wrap justify-center text-center p-3 bg-white dark:bg-slate-900 shadow dark:shadow-gray-800 rounded-md" id="myTab" data-tabs-toggle="#StarterContent" role="tablist">
                                    <li role="presentation" className="md:inline-block block md:w-fit w-full">
                                        <button className={`px-6 py-2 font-semibold rounded-md w-full bg-transparent transition-all duration-500 ease-in-out ${activeIndex === 0 ? 'text-white bg-violet-600' : ''}`} id="wednesday-tab" data-tabs-target="#wednesday" type="button" role="tab" aria-controls="wednesday" aria-selected="true"
                                            onClick={() => setIndex(0)}
                                        >Bids History</button>
                                    </li>
                                    <li role="presentation" className="md:inline-block block md:w-fit w-full">
                                        <button className={`px-6 py-2 font-semibold rounded-md w-full bg-transparent transition-all duration-500 ease-in-out ${activeIndex === 1 ? 'text-white bg-violet-600' : ''}`} id="thursday-tab" data-tabs-target="#thursday" type="button"
                                            onClick={() => setIndex(1)}
                                            role="tab" aria-controls="thursday" aria-selected="false">Bid Now</button>
                                    </li>
                                </ul>

                                <div id="StarterContent" className="mt-6">
                                    <div className="" id="wednesday" role="tabpanel" aria-labelledby="wednesday-tab">
                                        {
                                            activeIndex === 0 ? (
                                                <div className="grid grid-cols-1">
                                                    <DataView value={auctionData.bids} itemTemplate={itemTemplate} paginator rows={3} />
                                                </div>
                                            ) :
                                                (
                                                    <>
                                                        <div className="p-3 flex flex-column bg-gray-50 dark:bg-slate-800 rounded-lg shadow dark:shadow-gray-700">
                                                            <form onSubmit={formik.handleSubmit}>
                                                                <div className="col-12">
                                                                    <div className="text-start">
                                                                        <div className="form-icon relative mt-2">
                                                                            <Tag className="w-4 h-4 absolute top-3 start-4"></Tag>
                                                                            <input name="price" id="price" type="number" className="form-input w-full text-[15px] ps-11 p-4 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0" placeholder="Bid Amount :"
                                                                                disabled={isend}
                                                                                value={formik.values.price}
                                                                                onChange={(e) => {
                                                                                    formik.setFieldValue('price', e.target.value);
                                                                                }}
                                                                            />

                                                                            {getFormErrorMessage('price')}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex w-12 md:flex-row flex-column">
                                                                    <div className="col-12 md:col-6">
                                                                        <Button type='submit' disabled={isend} label="Bid Now" icon="mdi mdi-gavel" loading={loadingBid} className="gradientBtn03 w-12" />
                                                                    </div>
                                                                    <div className="col-12 md:col-6">
                                                                        <Button disabled={!isend || (auctionData.currentWinner != account) || (auctionData.currentWinner == auctionData.owner)} label={!(auctionData.owner == account) ? "Receive NFT" : "Already Received"} icon="pi pi-download" loading={loadingReceive} className="gradientBtn02 w-12" onClick={handleReceiveNFT} />
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </>
                                                )
                                        }
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

