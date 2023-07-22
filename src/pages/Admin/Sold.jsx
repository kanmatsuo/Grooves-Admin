import MarketJson from "../../Marketplace.json"
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Web3 from "web3";
import axios from "axios";
import config from "../global/constant";
import Cookies from "js-cookie";

import { TabView, TabPanel } from 'primereact/tabview';

import SearchForm from "./components/Header/SearchForm";
import Category from "./components/Sold/Category";

const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            loadBlockchainData()
        }
    }));
    const [account, setAccount] = useState('');
    const [marketContract, setMarketContract] = useState(null);

    useEffect(() => {
        loadBlockchainData();
    }, []);

    const instance = axios.create({
        baseURL: config.backend_url,
        headers: { 'Authorization': `Bearer ${Cookies.get('_csrf')}` }
    });

    async function loadBlockchainData() {
        setAccount(window.ethereum.selectedAddress);
        const web3 = new Web3(Web3.givenProvider);

        const t0 = new web3.eth.Contract(MarketJson.market_abi, MarketJson.market_address);
        setMarketContract(t0);


        let transaction = await t0?.methods.getTokens().call();
        let nftSymbol = await t0?.methods.name().call();

        try {
            const items = await Promise.all(transaction.map(async i => {
                let meta = await axios.get(i.tokenURI);
                meta = meta.data;

                if (i.paytype != 0) {
                    var curreny = i.paytype == 1 ? "GRVC" : "BNB"
                } else {
                    var curreny = ""
                }
                let item = {
                    ...i,

                    owner: i.owner.toLowerCase(),
                    name: meta.name,
                    description: meta.description,
                    image: meta.image,
                    link: meta.link,
                    symbol: nftSymbol,
                    price: Web3.utils.fromWei(i.price) + curreny,
                    // buyer: buyer
                }
                // var buyer = await instance.post("client/get/user-by-address", {
                //     wallet: item.owner
                // });

                // console.log(buyer.data)
                return item
            }))

            setProductsView(items.filter((c) => {
                if (c.status.includes(3) || c.status.includes(5) || c.status.includes(7) || c.status.includes(9) || c.status.includes(10)) {
                    return c
                }
            }))

            setProducts(items.filter((c) => {
                if (c.status.includes(3) || c.status.includes(5) || c.status.includes(7) || c.status.includes(9) || c.status.includes(10)) {
                    return c
                }
            }))
        } catch (err) {

        }
    }


    const [products, setProducts] = useState([]);
    const [productsView, setProductsView] = useState([]);

    const searchProcess = (result) => {
        console.log(result)
        setProductsView(result)
    };

    return (
        <div id="container">
            <SearchForm searchProcess={searchProcess} products={products} />

            <TabView>
                <TabPanel header="ALL" leftIcon="pi pi-shopping-bag mr-2">
                    <Category data={productsView.filter((c) => {
                        if (c.status != 10) {
                            return c
                        }
                    })} />
                </TabPanel>
                <TabPanel header="LISTING" leftIcon="pi pi-list mr-2">
                    <Category data={productsView.filter((c) => {
                        if (c.status.includes(3)) {
                            return c
                        }
                    })} />
                </TabPanel>
                <TabPanel header="AUCTION" leftIcon="pi pi-stopwatch mr-2">
                    <Category data={productsView.filter((c) => {
                        if (c.status.includes(5)) {
                            return c
                        }
                    })} />
                </TabPanel>
                <TabPanel header="GACHA" leftIcon="pi pi-box mr-2">
                    <Category data={productsView.filter((c) => {
                        if (c.status.includes(7)) {
                            return c
                        }
                    })} />
                </TabPanel>
                <TabPanel header="REWARD" leftIcon="pi pi-gift mr-2">
                    <Category data={productsView.filter((c) => {
                        if (c.status.includes(9)) {
                            return c
                        }
                    })} />
                </TabPanel>

                <TabPanel header="BURN" leftIcon="pi pi-gift mr-2">
                    <Category data={productsView.filter((c) => {
                        if (c.status.includes(10)) {
                            return c
                        }
                    })} />
                </TabPanel>
            </TabView>
        </div>
    )
});

export default Component