
import MarketJson from "../../../../Marketplace.json"
import Web3 from "web3";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useTimer from "../../../global/useTimer";
import moment from 'moment';
import { useGlobalService } from "../../../../GlobalServiceContext";
import config from "../../../global/constant";

import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            loadBlockchainData()
        }
    }));

    const { id } = useParams();
    const [data, updateData] = useState({});
    const navigate = useNavigate();
    const { notify, history, emitSocket } = useGlobalService();

    const [account, setAccount] = useState('');
    const [marketContract, setMarketContract] = useState(null);
    const [auctionContract, setAuctionContract] = useState(null);

    const [deadline, setDeadline] = useState("2023-12-31 23:59:59");
    const { days, hours, minutes, seconds, isend } = useTimer(deadline);

    const [loading, setLoading] = useState(false)
    useEffect(() => {
        loadBlockchainData();
    }, []);

    async function loadBlockchainData() {
        const web3 = new Web3(Web3.givenProvider);
        const t1 = new web3.eth.Contract(MarketJson.market_abi, MarketJson.market_address);
        setMarketContract(t1)
        const t2 = new web3.eth.Contract(MarketJson.auction_abi, MarketJson.auction_address);
        setAuctionContract(t2)

        setAccount(window.ethereum.selectedAddress);

        let auctionToken = await t1.methods.getTokenForId(id).call();
        let nftSymbol = await t1.methods.name().call();

        let items = await t2.methods.getBids(id).call();
        const bids = await Promise.all(items.map(async i => {
            let item = {
                bidder: i.bidder,
                time: moment(new Date(i.time * 1000)).format("yyyy-MM-DD HH:mm:ss"),
                amount: Web3.utils.fromWei(String(i.amount))
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
            bids: bids
        }

        let timestamp = (Number(auctionDetail.s_lastTimeStamp) + Number(auctionDetail.i_interval)) * 1000;
        var t4 = new Date(timestamp);
        var formatted = moment(t4).format("yyyy-MM-DD HH:mm:ss");
        setDeadline(formatted)
        updateData(item)
    }

    const claimBids = async () => {
        try {
            setLoading(true)
            var tx = await auctionContract.methods.withdrawWinningBid(id).send({ from: account });
            var currency = data.paytype == '1' ? "GRVC" : "BNB";

            var message = "#" + id + "NFT Auction " + data.temporaryHighestBid + " " + currency + " Bid Successfully Claimed!";

            notify(message)
            history({
                id: id,
                from: account,
                action: 7,
                tx_link: config.tx_prefix + tx.transactionHash,
                price: data.temporaryHighestBid,
                paytype: data.paytype
            })
            setLoading(false)
            loadBlockchainData()

            emitSocket(
                tx.transactionHash,
                'update',
                {
                    id: id,
                    price: data.price,
                    paytype: data.paytype
                }
            );
        } catch (error) {
            notify(error.message, 'error')
            setLoading(false)
        }

    }

    const withdrawNft = async () => {
        try {
            setLoading(true)
            var tx = await auctionContract.methods.withdrawNft(id).send({ from: account });
            var message = "#" + id + "NFT Withdraw Successfully because no bids!";
            notify(message)
            history({
                id: id,
                from: account,
                action: 6,
                tx_link: config.tx_prefix + tx.transactionHash,
                price: data.price,
                paytype: data.paytype
            })
            emitSocket(
                tx.transactionHash,
                'update',
                {
                    id: id,
                    price: data.price,
                    paytype: data.paytype
                }
            );
            navigate('/admin/mynft/' + id)
            setLoading(false)
        } catch (err) {
            notify(err.message, 'error')
            setLoading(false)
        }
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
                    </div>

                    <div className="text-lg">
                        <a href={data.link} target="_blank" className="text-primary font-bold">{data.link}</a>
                    </div>

                    <div className="text-lg">
                        {data.description}
                    </div>

                    <div className="flex align-items-center gap-3">
                        <span className="flex align-items-center gap-2 text-blue-500">
                            <i className="pi pi-stopwatch"></i>
                            <span className="font-semibold">{data.price}{data.paytype == 1 ? 'GRVC' : 'BNB'}</span>
                        </span>

                        <span className="flex align-items-center gap-2 text-blue-500">
                            <i className="pi pi-sort-amount-up"></i>
                            <span className="font-semibold">
                                {
                                    data.auctionStarted ? data.temporaryHighestBid + (data.paytype == 1 ? 'GRVC' : 'BNB') : "No Bids"
                                }

                            </span>
                        </span>
                    </div>

                    <div className="flex align-items-center gap-3">
                        <span className="flex align-items-center gap-2 text-blue text-2xl font-bold">
                            <i className="pi pi-spin pi-hourglass"></i>
                            <span className="font-semibold">
                                {isend ? (
                                    <p>It's end!!!</p>
                                ) : (
                                    <p>{days}:{hours}:{minutes}:{seconds}</p>
                                )}
                            </span>
                        </span>
                    </div>
                </div>

                <div className="col-12 md:col-7">
                    <Card title="Bid History">
                        <DataTable value={data.bids} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                            <Column field="time" header="Time" sortable style={{ width: '25%' }}></Column>
                            <Column field="bidder" header="Bidder" sortable style={{ width: '50%' }}></Column>
                            <Column field="amount" header="Amount" sortable style={{ width: '25%' }}></Column>
                        </DataTable>

                        <div className="flex w-12 mt-5 md:flex-row flex-column">
                            <div className="col-12 md:col-6">
                                <Button label="Claim Bids" className='gradientBtn02 w-12' icon="pi pi-dollar" loading={!isend || loading && data.auctionStarted} disabled={!data.auctionStarted} onClick={claimBids} />
                            </div>
                            <div className="col-12 md:col-6">
                                <Button label="Withdraw NFT" className='gradientBtn03 w-12' icon="pi pi-download" loading={!isend || loading && !data.auctionStarted} disabled={data.auctionStarted} onClick={withdrawNft} />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
});

export default Component