import MarketJson from "../../Marketplace.json"
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Web3 from "web3";
import axios from "axios";

import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { Link } from "react-router-dom";
import moment from 'moment';
import SearchForm from "./components/Header/SearchForm";

const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            loadBlockchainData()
        }
    }));

    const [account, setAccount] = useState('');
    const [marketContract, setMarketContract] = useState(null);
    const [auctionContract, setAuctionContract] = useState(null);

    useEffect(() => {
        loadBlockchainData();
    }, []);

    async function loadBlockchainData() {
        setAccount(window.ethereum.selectedAddress);
        const web3 = new Web3(Web3.givenProvider);

        const t1 = new web3.eth.Contract(MarketJson.market_abi, MarketJson.market_address);
        setMarketContract(t1);

        const t2 = new web3.eth.Contract(MarketJson.auction_abi, MarketJson.auction_address);
        setAuctionContract(t2);


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
                    isend: isend
                }
                console.log(item)
                return item;
            }))

            setProducts(items.filter(c => c.status.includes(4)));
            setProductsView(items.filter(c => c.status.includes(4)))

        } catch (err) {
            console.log(err)
        }
    }

    const [products, setProducts] = useState([]);
    const [productsView, setProductsView] = useState([]);

    const [layout, setLayout] = useState('grid');

    const listItem = (product) => {
        return (
            <Link to={"/admin/auction/" + product.id} className="col-12">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                    <img className="md:col-3 col-12 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={product.image} alt={product.name} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <Tag value={product.symbol + " #" + product.id} severity='success'></Tag>

                            <div className="text-2xl font-bold text-900 flex align-items-center">
                                {product.name}
                            </div>

                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-pencil"></i>
                                    <span className="font-semibold">{product.description}</span>
                                </span>
                            </div>

                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-external-link"></i>
                                    <span className="font-semibold">{product.link}</span>
                                </span>
                            </div>

                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2 text-blue-500">
                                    <i className="pi pi-stopwatch"></i>
                                    <span className="font-semibold">{Web3.utils.fromWei(product.price)}{product.paytype == 1 ? 'GRVC' : 'BNB'}</span>
                                </span>

                                <span className="flex align-items-center gap-2 text-blue-500">
                                    <i className="pi pi-sort-amount-up"></i>
                                    <span className="font-semibold">
                                        {
                                            product.auctionStarted ? (product.temporaryHighestBid + (product.paytype == 1 ? 'GRVC' : 'BNB')) : "No Bids"
                                        }

                                        {product.paytype}

                                    </span>
                                </span>
                            </div>

                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2 text-blue text-2xl font-bold">
                                    <i className="pi pi-spin pi-hourglass"></i>
                                    <span className="font-semibold">{product.isend ? "Auction END" : product.deadline}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    };

    const gridItem = (product) => {
        return (
            <Link to={"/admin/auction/" + product.id} className="col-12 sm:col-6 xl:col-3 p-2">
                <div className="border-1 surface-border surface-card border-round relative">
                    <div className="top-0 absolute">
                        <Tag value={product.symbol + " #" + product.id} severity='success'></Tag>
                    </div>

                    <img className="w-12 gridItemImage" src={product.image} alt={product.name} />

                    <div className="p-4 flex flex-column align-items-start gap-3 py-5">

                        <div className="flex w-12 justify-content-between align-items-center">
                            <div className="text-2xl font-bold text-900">
                                {product.name}
                            </div>
                        </div>

                        <div className="font-bold w-12 white-space-nowrap overflow-hidden text-overflow-ellipsis">{product.description}</div>
                        <div className="w-12 white-space-nowrap overflow-hidden text-overflow-ellipsis">{product.link}</div>

                        <div className="flex align-items-center gap-3">
                            <span className="flex align-items-center gap-2 text-blue-500">
                                <i className="pi pi-stopwatch"></i>
                                <span className="font-semibold">{Web3.utils.fromWei(product.price)}{product.paytype == 1 ? 'GRVC' : 'BNB'}</span>
                            </span>

                            <span className="flex align-items-center gap-2 text-blue-500">
                                <i className="pi pi-sort-amount-up"></i>
                                <span className="font-semibold">{product.auctionStarted == false ? 'No bids ' : Web3.utils.fromWei(product.temporaryHighestBid)}{product.paytype == 1 ? 'GRVC' : 'BNB'}</span>
                            </span>
                        </div>

                        <div className="flex align-items-center gap-3">
                            <span className="flex align-items-center gap-2 text-blue text-2xl font-bold">
                                <i className="pi pi-spin pi-hourglass"></i>
                                <span className="font-semibold">{product.isend ? "Auction END" : product.deadline}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        );
    };

    const itemTemplate = (product, layout) => {
        if (!product) {
            return;
        }

        if (layout === 'list') return listItem(product);
        else if (layout === 'grid') return gridItem(product);
    };

    const header = () => {
        return (
            <div className="flex justify-content-between">
                <div className="text-4xl font-bold">AUCTION ITEMS</div>
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>
        );
    };

    const searchProcess = (result) => {
        setProductsView(result)
    };

    return (
        <div id="container">
            <SearchForm searchProcess={searchProcess} products={products} />

            <div className="card">
                <DataView value={productsView} itemTemplate={itemTemplate} layout={layout} header={header()} paginator rows={8} />
            </div>
        </div>
    )
});

export default Component