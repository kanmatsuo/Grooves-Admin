
import MarketJson from "../../../../Marketplace.json"
import Web3 from "web3";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { Tag } from 'primereact/tag';
import { TabView, TabPanel } from 'primereact/tabview';
import ListForm from "./ListForm"
import AuctionForm from "./AuctionForm"

const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            loadBlockchainData()
        }
    }));
    const { id } = useParams();
    const [data, updateData] = useState({});

    useEffect(() => {
        loadBlockchainData();
    }, []);

    async function loadBlockchainData() {

        const web3 = new Web3(Web3.givenProvider);
        const t1 = new web3.eth.Contract(MarketJson.market_abi, MarketJson.market_address);
        let mintedToken = await t1.methods.getTokenForId(id).call();
        let nftSymbol = await t1.methods.name().call();

        let meta = await axios.get(mintedToken.tokenURI);
        let item = {
            ...mintedToken,

            owner: mintedToken.owner.toLowerCase(),
            name: meta.data.name,
            description: meta.data.description,
            image: meta.data.image,
            link: meta.data.link,
            symbol: nftSymbol
        }
        updateData(item)
    }

    return (
        <div id='container'>
            <div className="grid">
                <div className="col-12 md:col-5 flex flex-column gap-3 md:pr-5">
                    <div className="relative w-12">
                        <div className="top-0 absolute">
                            <Tag value={data.symbol + " #" + data.id} severity='success'></Tag>
                        </div>

                        <img src={data.image} alt="" className="w-12 border-round shadow-2" />
                    </div>

                    <div className="text-3xl font-bold">
                        {data.name}
                    </div>

                    <div className="text-lg">
                        <a href={data.link} target="_blank" className="text-primary font-bold">{data.link}</a>
                    </div>

                    <div className="text-lg">
                        {data.description}
                    </div>
                </div>

                <div className="col-12 md:col-7">
                    <div className="card">
                        <TabView>
                            <TabPanel header="List" leftIcon="pi pi-list mr-2">
                                <ListForm data={data} ref={ref} />
                            </TabPanel>
                            <TabPanel header="Auction" leftIcon="pi pi-stopwatch mr-2">
                                <AuctionForm data={data} ref={ref} />
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </div>
        </div>
    )
});

export default Component