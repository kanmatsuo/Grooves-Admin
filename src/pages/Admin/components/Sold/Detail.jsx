
import MarketJson from "../../../../Marketplace.json"
import Web3 from "web3";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "../../../global/constant";
import moment from 'moment';

import { Card } from 'primereact/card'
import { Tag } from 'primereact/tag';
import Cookies from "js-cookie";

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

    const instance = axios.create({
        baseURL: config.backend_url,
        headers: { 'Authorization': `Bearer ${Cookies.get('_csrf')}` }
    });

    async function loadBlockchainData() {

        const web3 = new Web3(Web3.givenProvider);
        const t1 = new web3.eth.Contract(MarketJson.market_abi, MarketJson.market_address);
        let i = await t1.methods.getTokenForId(id).call();
        let nftSymbol = await t1.methods.name().call();

        let meta = await axios.get(i.tokenURI);
        meta = meta.data;

        if (i.paytype != 0) {
            var curreny = i.paytype == 1 ? "GRVC" : "BNB"
        } else {
            var curreny = ""
        }

        let status_desc = await axios.get(config.backend_url + "get/nft/status/label/" + i.status);

        var timestamp = new Date(i.time * 1000);
        var formatted = moment(timestamp).format("yyyy-MM-DD HH:mm:ss");

        var buyer = await instance.post("client/get/user-by-address", {
            wallet: i.owner
        });

        let item = {
            ...i,
            owner: i.owner.toLowerCase(),
            name: meta.name,
            description: meta.description,
            image: meta.image,
            link: meta.link,
            symbol: nftSymbol,
            price: Web3.utils.fromWei(i.price) + curreny,
            status_desc: status_desc.data,
            timestamp: formatted,
            buyer: buyer.data
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
                </div>

                <div className="col-12 md:col-7">
                    <Card title="Info">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{data.name}</div>

                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-pencil"></i>
                                    <span className="font-semibold">{data.description}</span>
                                </span>
                            </div>

                            <div className="flex align-items-center gap-3">
                                <a href={data.link} target="_blank" className="text-primary">
                                    <span className="flex align-items-center gap-2">
                                        <i className="pi pi-external-link"></i>
                                        <span className="font-semibold">{data.link}</span>
                                    </span>
                                </a>
                            </div>

                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2 text-900 font-bold ">
                                    <i className="pi pi-euro"></i>
                                    <span className="font-semibold">{data.price}</span>
                                </span>
                            </div>

                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-user"></i>
                                    <span className="font-semibold">
                                        {data.buyer?.avatar}
                                    </span>
                                    <span className="font-semibold">
                                        {data.buyer?.name}
                                    </span>
                                </span>
                            </div>

                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-shopping-bag"></i>
                                    <span className="font-semibold">{data.status_desc}</span>
                                </span>
                            </div>

                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-stopwatch"></i>
                                    <span className="font-semibold">{data.timestamp}</span>
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
});

export default Component