import MarketJson from "../../../../Marketplace.json"
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Web3 from "web3";
import axios from "axios";
import { Link } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import config from "../../../global/constant";
import { useGlobalService } from "../../../../GlobalServiceContext";

const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            loadBlockchainData()
        }
    }));
    const [account, setAccount] = useState(null);

    const [products, setProducts] = useState([]);
    const [gachaContract, setGachaContract] = useState([]);
    const [marketContract, setMarketContract] = useState([]);
    const [tokenContract, setTokenContract] = useState([]);

    const [gachaIds, updateGachaIds] = useState([]);
    const [selectedIds, updateSelectedIds] = useState([]);
    const [spinStatus, setSpinStatus] = useState(1);
    const [payType, setPayType] = useState(1);

    const [disable, setDisable] = useState(false);
    const [loading, setLoading] = useState(false);

    const [speed, setspeed] = useState(1000);
    const [autoplayspeed, setautoplayspeed] = useState(1000);

    const { history, user, emitSocket } = useGlobalService();
    const [spinPrices, setSpinPrices] = useState([0, 0, 0, 0, 0, 0]);

    const closeDialog = () => {
        loadBlockchainData();
        setVisible(false);
    }

    const [visible, setVisible] = useState(false);
    const footerContent = (
        <div>
            <Button label="Got it!" icon="pi pi-check" onClick={closeDialog} autoFocus />
        </div>
    );


    useEffect(() => {
        let array = []
        products.map((item) => (
            array.push(item.id)
        ))
        updateGachaIds(array)
    }, [products]);

    const chooseRandomFromGachaIds = (arr, num = 1) => {
        const res = [];
        for (let i = 0; i < num;) {
            const random = Math.floor(Math.random() * arr.length);
            if (res.indexOf(arr[random]) !== -1) {
                continue;
            };
            res.push(arr[random]);
            i++;
        };
        return res;
    };

    const playGacha = async () => {
        try {
            setautoplayspeed(100)
            setspeed(100)
            setLoading(true)
            var amount = getCurrencyAmount(spinStatus, payType);
            var ids = chooseRandomFromGachaIds(gachaIds, spinStatus);
            updateSelectedIds(ids)
            if (payType == 1) {
                await tokenContract.methods.approve(MarketJson.gacha_address, amount).send({ from: account })
                var tx = await gachaContract.methods.execGacha(ids, payType).send({ from: account });
            } else {
                var tx = await gachaContract.methods.execGacha(ids, payType).send({ from: account, value: amount });
            }

            for (var i = 0; i < ids.length; i++) {
                history({
                    id: ids[i],
                    from: account,
                    action: 13,
                    tx_link: config.tx_prefix + tx.transactionHash,
                    price: Web3.utils.fromWei(String(amount)) / ids.length,
                    paytype: payType
                })
            }

            setLoading(false)
            setautoplayspeed(1000)
            setspeed(1000)
            setVisible(true)
            emitSocket(
                tx.transactionHash,
                'update',
                {
                    id: 0,
                    price: 0,
                    paytype: 0
                }
            );
            loadBlockchainData()

        } catch (error) {
            console.error(error)
            setLoading(false)
            setautoplayspeed(1000)
            setspeed(1000)
        }
    }

    useEffect(() => {
        loadBlockchainData();
    }, []);

    async function loadBlockchainData() {
        const web3 = new Web3(Web3.givenProvider);
        setAccount(window.ethereum.selectedAddress);

        const t1 = new web3.eth.Contract(MarketJson.market_abi, MarketJson.market_address);
        setMarketContract(t1)
        const t2 = new web3.eth.Contract(MarketJson.gacha_abi, MarketJson.gacha_address);
        setGachaContract(t2)
        const t3 = new web3.eth.Contract(MarketJson.token_abi, MarketJson.token_address);
        setTokenContract(t3)

        let prices = await t2.methods.getGachaSpinPrice().call();
        setSpinPrices(prices)

        let transaction = await t1.methods.getTokens().call();
        let nftSymbol = await t1.methods.name().call();

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
            shuffle(items);
            setProducts(items.filter(c => c.status == 6));
            items.filter(c => c.status == 6).length == 0 ? setDisable(true) : setDisable(false)
        } catch (err) {
            console.error(err)
        }
    }

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

    const settings = {
        dots: false,
        arrow: false,
        infinite: true,
        speed: speed,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: autoplayspeed,
        pauseOnHover: false,
        fade: true,
        cssEase: 'linear'
    };

    const changeSpin = (e) => {
        setSpinStatus(e.target.value)
        if (gachaIds.length < e.target.value) {
            setDisable(true)
        } else {
            setDisable(false)
        }
    }

    const changePayType = (e) => {
        setPayType(e.target.value)
    }

    const getCurrencyAmount = (spin, payType) => {

        if (payType == 1) {
            if (spin == 1) {
                return spinPrices[0];
            }
            if (spin == 5) {
                return spinPrices[1];
            }
            if (spin == 10) {
                return spinPrices[2];
            }
        } else {
            if (spin == 1) {
                return spinPrices[3];
            }
            if (spin == 5) {
                return spinPrices[4];
            }
            if (spin == 10) {
                return spinPrices[5];
            }
        }
    }

    return (
        <>
            <section className="relative table w-full py-36 bar-bg-11 bg-center bg-no-repeat">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
                <div className="container">
                    <div className="grid grid-cols-1 pb-8 text-center mt-10">
                        <h3 className="md:text-3xl text-2xl md:leading-snug tracking-wide leading-snug font-medium text-white">Play Gacha</h3>
                    </div>
                </div>

                <div className="absolute text-center z-10 bottom-5 start-0 end-0 mx-3">
                    <ul className="breadcrumb tracking-[0.5px] breadcrumb-light mb-0 inline-block">
                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white/50 hover:text-white"><Link to="/">G-rooves</Link></li>
                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white" aria-current="page"> Gacha</li>
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
                <div className='container'>
                    <div className="grid lg:grid-cols-12 md:grid-cols-2 grid-cols-1 gap-[30px]">
                        <div className="lg:col-span-6">
                            <div className="shadow dark:shadow-gray-700 p-6 rounded-md bg-white dark:bg-slate-900 sticky top-20">
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="mt-2">
                                        <label className="form-label font-semibold dark:text-white text-[15px]">Gacha Count:</label>
                                        <select onChange={changeSpin} value={spinStatus} className="form-select form-input mt-2 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0" name="spin">
                                            <option value="1">1 spin</option>
                                            <option value="5">5 spin</option>
                                            <option value="10">10 spin</option>
                                        </select>
                                    </div>

                                    <div className="mt-2">
                                        <label className="form-label font-semibold dark:text-white text-[15px]">Pay Type:</label>
                                        <select onChange={changePayType} value={payType} className="form-select form-input mt-2 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0" name="paytype">
                                            <option value="1">GRVC</option>
                                            <option value="2">BNB</option>
                                        </select>
                                    </div>

                                    <div className="mt-2">
                                        <label className="form-label font-semibold dark:text-white text-[15px]">Play Gacha:</label>

                                        <div className="col-12">
                                            <Button onClick={playGacha} disabled={disable} label={disable ? "LACK" : "PLAY"} icon="pi pi-box" loading={loading} className="gradientBtn03 w-12" />
                                        </div>
                                    </div>

                                    <div className="mt-1 text-center">
                                        <label className="form-label font-semibold dark:text-white text-[15px]">{spinStatus} spin with {Web3.utils.fromWei(String(getCurrencyAmount(spinStatus, payType)))} {payType == 1 ? "GRVC" : "BNB"}</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-6">
                            <Slider {...settings} className='gachabox'>
                                {products.map((el, index) => (
                                    <div className="tiny-slide" key={index}>
                                        <div className="p-3 bg-white dark:bg-slate-900 rounded-lg shadow dark:shadow-gray-800">
                                            <div className="group relative overflow-hidden rounded-lg">
                                                <img src={el.image} className="rounded-lg" alt="" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>

                    <Dialog header="Congratulation!!!" visible={visible} style={{ width: '90vw' }} onHide={() => setVisible(false)} footer={footerContent}>
                        <div className="container">
                            <div className="grid lg:grid-cols-3 grid-cols-1 gap-[30px]">
                                {
                                    products.filter(p => selectedIds.includes(p.id)).map((item, index) => (
                                        <div key={index} className="group relative p-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 hover:shadow-md dark:shadow-md hover:dark:shadow-gray-700 transition-all duration-500 h-fit">
                                            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-violet-600 rounded-lg -mt-1 group-hover:-mt-2 -ms-1 group-hover:-ms-2 h-[98%] w-[98%] -z-1 transition-all duration-500"></div>
                                            <div className="relative overflow-hidden">
                                                <div className="relative overflow-hidden rounded-lg">
                                                    <img src={item.image} className="rounded-lg shadow-md dark:shadow-gray-700 group-hover:scale-110 transition-all duration-500" alt="" />
                                                </div>

                                                <div className="absolute -bottom-20 group-hover:bottom-1/2 group-hover:translate-y-1/2 start-0 end-0 mx-auto text-center transition-all duration-500">
                                                    <Link to="/item-detail" className="btn btn-sm rounded-full bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white"><i className="mdi mdi-lightning-bolt"></i> Buy Now</Link>
                                                </div>

                                                <div className="absolute top-2 end-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                    <Link to="#" className="btn btn-icon btn-sm rounded-full bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white"><i className="mdi mdi-plus"></i></Link>
                                                </div>
                                            </div>

                                            <div className="mt-3">
                                                <div className="flex items-center">
                                                    <img src={user ? config.profile_url + user.avatar : ''} className="rounded-full h-8 w-8" alt="" />
                                                    <Link to="/creator-profile" className="ms-2 text-[15px] font-medium text-slate-400 hover:text-violet-600">{item.symbol} #{item.id}</Link>
                                                </div>

                                                <div className="my-3">
                                                    <Link to="/item-detail" className="font-semibold hover:text-violet-600 dark:text-white">{item.name}</Link>
                                                </div>

                                                <div className="flex justify-between p-2 bg-gray-50 dark:bg-slate-800 rounded-lg shadow dark:shadow-gray-700">
                                                    <div>
                                                        <span className="text-[16px] font-medium text-slate-400 block">Price</span>
                                                        <span className="text-[16px] font-semibold block dark:text-white"><i className="mdi mdi-ethereum"></i> {item.price}</span>
                                                    </div>

                                                    <div>
                                                        <span className="text-[16px] font-medium text-slate-400 block">Type</span>
                                                        <span className="text-[16px] font-semibold block dark:text-white"><i className="pi pi-box"></i> Gacha</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }

                            </div>
                        </div>

                    </Dialog>
                </div>
            </section>
        </>
    )
});

export default Component