
import MarketJson from "../../../../Marketplace.json"
import Web3 from "web3";
import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { Tag } from 'primereact/tag';
import { TabView, TabPanel } from 'primereact/tabview';

import UpdateForm from "./UpdateForm"
import CancelButton from "./CancelButton"

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
        let listedToken = await t1.methods.getTokenForId(id).call();
        let nftSymbol = await t1.methods.name().call();

        let meta = await axios.get(listedToken.tokenURI);
        let item = {
            ...listedToken,

            price: Web3.utils.fromWei(String(listedToken.price)),
            owner: listedToken.owner.toLowerCase(),
            name: meta.data.name,
            description: meta.data.description,
            image: meta.data.image,
            link: meta.data.link,
            symbol: nftSymbol
        }
        updateData(item)
    }

    const onUpdate = () => {
        loadBlockchainData()
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

                    <div className="text-3xl font-bold flex align-items-center">
                        {data.name}

                        <div className="text-base text-primary font-bold text-900 ml-4">
                            {data.price} {data.paytype == 1 ? 'GRVC' : 'BNB'}
                        </div>
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
                            <TabPanel header="Update" leftIcon="pi pi-refresh mr-2">
                                <UpdateForm ref={ref} data={data} onUpdateSuccess={onUpdate} />
                            </TabPanel>
                            <TabPanel header="Cancel" leftIcon="pi pi-times mr-2">
                                <CancelButton ref={ref} data={data} />
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </div>
        </div>
    )
})
export default Component
