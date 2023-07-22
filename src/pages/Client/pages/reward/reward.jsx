import MarketJson from "../../../../Marketplace.json"
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Web3 from "web3";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import $ from "jquery";
import config from "../../../global/constant";
import { DataTable } from 'primereact/datatable';
import Cookies from "js-cookie";
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useGlobalService } from "../../../../GlobalServiceContext";

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
    const navigate = useNavigate();
    const [account, setAccount] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [rewardProducts, setRewardProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [disable, setDisable] = useState(true);

    const [rewardContract, setRewardContract] = useState(null);
    const [marketContract, setMarketContract] = useState(null);

    const { history, notify, emitSocket } = useGlobalService()

    useEffect(() => {
        loadBlockchainData();
    }, []);

    useEffect(() => {
        selectedProducts.length == 5 ? setDisable(false) : setDisable(true)
    }, [selectedProducts]);

    async function loadBlockchainData() {
        setLoading(true);

        const web3 = new Web3(Web3.givenProvider);

        setAccount(window.ethereum.selectedAddress);

        const t1 = new web3.eth.Contract(MarketJson.market_abi, MarketJson.market_address);
        setMarketContract(t1)

        const t2 = new web3.eth.Contract(MarketJson.reward_abi, MarketJson.reward_address);
        setRewardContract(t2)

        let transaction = await t1.methods.getTokens().call();
        let nftSymbol = await t1.methods.name().call();

        try {
            const items = await Promise.all(transaction.map(async i => {
                let meta = await axios.get(i.tokenURI);
                meta = meta.data;
                let item = {
                    props: {
                        ...i,
                        nftSymbol: nftSymbol,
                        name: meta.name,
                        description: meta.description,
                        image: meta.image,
                        link: meta.link,
                        currency: i.paytype == 1 ? "GRVC" : "BNB",
                        convertedPrice: Web3.utils.fromWei(i.price),
                    },
                    owner: i.owner.toLowerCase(),
                }

                return item;
            }))

            var user = await instance.get("user");
            user = user.data

            let userAndWallets = await instance.post("client/get/wallets-address", {
                user_id: user.id
            });

            var wallets = userAndWallets.data.wallets.map(str => str.toLowerCase());

            var all = items.filter(c => wallets.includes(c.owner) && c.props.status != 10);
            setProducts(all);

            var rewards = items.filter(c => c.props.status == 8);
            setRewardProducts(rewards)

        } catch (err) {
            console.error(err)
        }

        setLoading(false);
    }

    function getRewardNFTID() {
        const randomIndex = Math.floor(Math.random() * rewardProducts.length);
        return rewardProducts[randomIndex].props.id;
    }

    const handleBurn = async () => {
        try {
            if (rewardProducts.length == 0) {
                notify("Lack Rewards in Marketplace.", 'error');
                return
            } else {
                setLoadingBtn(true)
                let ids = []
                selectedProducts.map((item) => (
                    ids.push(item.props.id)
                ))


                let id = getRewardNFTID();

                console.log(rewardContract)

                var tx = await rewardContract.methods.execBurnReward(ids, id).send({ from: account });

                for (var i = 0; i < ids.length; i++) {
                    history({
                        id: ids[i],
                        from: account,
                        action: 16,
                        tx_link: config.tx_prefix + tx.transactionHash,
                        price: 0,
                        paytype: 0
                    })
                }

                history({
                    id: id,
                    from: account,
                    action: 17,
                    tx_link: config.tx_prefix + tx.transactionHash,
                    price: 0,
                    paytype: 0
                })

                notify("Burn & Rewards Successfully!")
                loadBlockchainData()
                setLoadingBtn(false)
                emitSocket(
                    tx.transactionHash,
                    'update',
                    {
                        id: id,
                        price: 0,
                        paytype: 0
                    }
                );
                navigate('/collection/' + id)
            }
        } catch (error) {
            console.error(error)
            setLoadingBtn(false)
        }
    }

    const propsTemplate = (rowData) => {
        const props = rowData.props;

        return (
            <div className="group rounded-xl bg-white dark:bg-slate-900 shadow hover:shadow-md dark:shadow-gray-800 dark:hover:shadow-gray-800 overflow-hidden ease-in-out duration-500 w-full">
                <div className="lg:flex">
                    <div className="relative md:shrink-0">
                        <img className="h-full w-full object-cover lg:w-48" src={props.image} alt="" />
                    </div>
                    <div className="p-6 w-full">
                        <ul className="flex justify-between items-center list-none pb-6">
                            <li className="block items-center">
                                <span className="bg-slate-900 text-white dark:bg-slate-800 text-[12px] px-2.5 py-1 font-semibold rounded-full h-5">{props.nftSymbol} #{props.id}</span>
                                <span className="text-slate-400 text-sm ms-2">{props.name}</span>
                            </li>
                            <li>
                                <Link to="#" className="text-lg rounded-full text-gray-300 dark:text-gray-800 hover:text-red-600 focus:text-red-600 dark:hover:text-red-600 dark:focus:text-red-600"><i className="mdi mdi-heart"></i></Link>
                            </li>
                        </ul>

                        <div className="font-semibold dark:text-white">{props.description}</div>

                        <div className="pt-6">
                            <a href={props.link} target="_blank" className="btn btn-sm rounded-full bg-violet-600/5 hover:bg-violet-600 border-violet-600/10 hover:border-violet-600 text-violet-600 hover:text-white">{props.link}</a>
                        </div>
                    </div>
                </div>
            </div>

        );
    }

    return (
        <>
            <section className="relative table w-full py-36 bar-bg-13 bg-center bg-no-repeat">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
                <div className="container">
                    <div className="grid grid-cols-1 pb-8 text-center mt-10">
                        <h3 className="md:text-3xl text-2xl md:leading-snug tracking-wide leading-snug font-medium text-white">Burn & Rewards</h3>
                    </div>
                </div>

                <div className="absolute text-center z-10 bottom-5 start-0 end-0 mx-3">
                    <ul className="breadcrumb tracking-[0.5px] breadcrumb-light mb-0 inline-block">
                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white/50 hover:text-white"><Link to="/">G-rooves</Link></li>
                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white" aria-current="page"> Rewards</li>
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
                        <div className="lg:col-span-4">
                            <div className="shadow dark:shadow-gray-700 p-6 rounded-md bg-white dark:bg-slate-900 sticky top-20">
                                <div className="grid grid-cols-1 gap-3">

                                    <div className="mt-2">
                                        <div className="col-12">
                                            <Button label={disable ? "SELECT 5 ITEMS" : "BURN & REWARD"} disabled={disable} icon="pi pi-bolt" className="gradientBtn03 w-12" onClick={handleBurn} loading={loadingBtn} />
                                        </div>
                                    </div>

                                    <div className="mt-1 text-center">
                                        <label className="form-label font-semibold dark:text-white text-[15px]">
                                            {selectedProducts.length} item selected
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8">
                            <DataTable value={products} loading={loading} selectionMode={'checkbox'} selection={selectedProducts} onSelectionChange={(e) => { setSelectedProducts(e.value); }} dataKey="props.id" tableStyle={{ minWidth: '50rem' }} paginator rows={5}>
                                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                                <Column field="symbol" body={propsTemplate} ></Column>
                            </DataTable>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
});

export default Component