import MarketJson from "../../../../Marketplace.json"
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Web3 from "web3";
import axios from "axios";
import { useGlobalService } from "../../../../GlobalServiceContext";
import config from "../../../global/constant";

import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { PickList } from 'primereact/picklist';
import { Button } from 'primereact/button';

const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            loadBlockchainData()
        }
    }));
    const { notify, history, emitSocket } = useGlobalService();

    const [account, setAccount] = useState('');
    const [marketContract, setMarketContract] = useState(null);
    const [rewardContract, setRewardContract] = useState(null);

    const [source, setSource] = useState([]);
    const [target, setTarget] = useState([]);

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadBlockchainData();
    }, []);

    async function loadBlockchainData() {
        setAccount(window.ethereum.selectedAddress);
        const web3 = new Web3(Web3.givenProvider);

        const t1 = new web3.eth.Contract(MarketJson.market_abi, MarketJson.market_address);
        setMarketContract(t1);

        const t2 = new web3.eth.Contract(MarketJson.reward_abi, MarketJson.reward_address);
        setRewardContract(t2);


        let transaction = await t1?.methods.getTokens().call();
        let nftSymbol = await t1?.methods.name().call();

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
                    symbol: nftSymbol
                }
                return item;
            }))

            setSource(items.filter(c => c.status == 1));
        } catch (err) {

        }
    }

    const onChange = (event) => {
        setSource(event.source);
        setTarget(event.target);
    };

    const itemTemplate = (item) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <Avatar size="xlarge" className="p-overlay-badge" style={{ objectFit: "cover" }} image={item.image}>
                    <Badge value={item.id} />
                </Avatar>
                <div className="flex-1 flex flex-column gap-2 white-space-nowrap overflow-hidden text-overflow-ellipsis">
                    <span className="font-bold">{item.name}</span>
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-tag text-sm"></i>
                        <span>{item.description}</span>
                    </div>
                </div>
            </div>
        );
    };

    const addToRewardList = async () => {
        try {
            setLoading(true)
            const idsForCreate = [];
            target.map(t => {
                idsForCreate.push(t.id)
            })

            var tx = await rewardContract.methods.addAwardList(idsForCreate).send({ from: account });

            var count = idsForCreate.length;
            for (var i = 0; i < count; i++) {
                history({
                    id: idsForCreate[i],
                    from: account,
                    action: 14,
                    tx_link: config.tx_prefix + tx.transactionHash,
                    price: 0,
                    paytype: 0
                })
                var message = "#" + idsForCreate[i] + " Token Successfully add to Reward list!"
                notify(message);
            }

            setTarget([]);
            setLoading(false)
            loadBlockchainData()
            emitSocket(
                tx.transactionHash,
                'update',
                {
                    id: 0,
                    price: 0,
                    paytype: 0
                }
            );
        } catch (err) {
            notify(err.message, 'error')
            setLoading(false)
        }
    }

    return (
        <>
            <div className="card">
                <PickList source={source} target={target} onChange={onChange} itemTemplate={itemTemplate} filter filterBy="name" breakpoint="1000px"
                    sourceHeader="Available" targetHeader="Selected" sourceStyle={{ height: '30rem' }} targetStyle={{ height: '30rem' }}
                    sourceFilterPlaceholder="Search by name" targetFilterPlaceholder="Search by name" />

                <div className="flex justify-content-center">
                    <div className='flex justify-content-center my-5 pt-3'>
                        <Button label="ADD TO Reward" onClick={addToRewardList} loading={loading} className='gradientBtn03' icon="pi pi-check" />
                    </div>
                </div>
            </div>
        </>
    )
});

export default Component