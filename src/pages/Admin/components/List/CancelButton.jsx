import MarketJson from "../../../../Marketplace.json"
import Web3 from "web3";
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from "react-router-dom";
import { useGlobalService } from "../../../../GlobalServiceContext";
import config from "../../../global/constant";

import { Button } from 'primereact/button';


const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            loadBlockchainData()
        }
    }));


    const [account, setAccount] = useState('');
    const [listingContract, setListingContract] = useState(null);
    const navigate = useNavigate();
    const { notify, history, emitSocket } = useGlobalService();

    const tokenId = props.data.id

    const [loading, setLoading] = useState(false)
    useEffect(() => {
        loadBlockchainData();
    }, []);

    async function loadBlockchainData() {
        setAccount(window.ethereum.selectedAddress)
        const web3 = new Web3(Web3.givenProvider);
        const t1 = new web3.eth.Contract(MarketJson.listing_abi, MarketJson.listing_address);
        setListingContract(t1);
    }

    const handleCancel = async (data) => {
        try {
            setLoading(true)
            var tx = await listingContract.methods.cancelListedToken(tokenId).send({ from: account });
            var message = "#" + tokenId + "NFT Listing Canceld Successfully"
            notify(message);
            history({
                id: tokenId,
                from: account,
                action: 5,
                tx_link: config.tx_prefix + tx.transactionHash,
                price: 0,
                paytype: 0
            })
            navigate('/admin/mynft/' + tokenId)
            setLoading(false)

            emitSocket(
                tx.transactionHash,
                'update',
                {
                    id: tokenId,
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
        <div>

            <div className='flex justify-content-center my-3 pt-3'>
                <Button label="CANCEL" loading={loading} onClick={handleCancel} className='gradientBtn02' icon="pi pi-check" />
            </div>
        </div >
    )
});

export default Component