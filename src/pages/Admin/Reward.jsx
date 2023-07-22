import { TabView, TabPanel } from 'primereact/tabview';
import CreateReward from './components/Reward/CreateReward';
import RemoveReward from './components/Reward/RemoveReward'

import MarketJson from "../../Marketplace.json"
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Web3 from "web3";

const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            loadBlockchainData()
        }
    }));

    const [rewardContract, setRewardContract] = useState(null);

    useEffect(() => {
        loadBlockchainData();
    }, []);

    async function loadBlockchainData() {
        const web3 = new Web3(Web3.givenProvider);
        const t = new web3.eth.Contract(MarketJson.reward_abi, MarketJson.reward_address);
        setRewardContract(t);
    }

    return (
        <div id="container">
            <TabView>
                <TabPanel header="Create" leftIcon="pi pi-upload mr-2">
                    <CreateReward ref={ref} />
                </TabPanel>
                <TabPanel header="Cancel" leftIcon="pi pi-times mr-2">
                    <RemoveReward ref={ref} />
                </TabPanel>
            </TabView>
        </div>
    )
});

export default Component