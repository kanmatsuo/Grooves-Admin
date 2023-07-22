import MarketJson from "../../../../Marketplace.json"
import Web3 from "web3";
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from "react-router-dom";
import { useGlobalService } from "../../../../GlobalServiceContext";
import config from "../../../global/constant";

import { useFormik } from 'formik';
import { classNames } from 'primereact/utils';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { RadioButton } from "primereact/radiobutton";


const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            loadBlockchainData()
        }
    }));
    const navigate = useNavigate();
    const { notify, history, emitSocket } = useGlobalService();

    const [account, setAccount] = useState('');
    const [auctionContract, setAuctionContract] = useState(null);

    const tokenId = props.data.id

    const [loading, setLoading] = useState(false)
    useEffect(() => {
        loadBlockchainData();
    }, []);

    async function loadBlockchainData() {
        setAccount(window.ethereum.selectedAddress)
        const web3 = new Web3(Web3.givenProvider);
        const t1 = new web3.eth.Contract(MarketJson.auction_abi, MarketJson.auction_address);
        setAuctionContract(t1);
    }

    const handleCreate = async (data) => {
        try {
            setLoading(true)
            var tx = await auctionContract.methods.InitializeAuction(tokenId, Web3.utils.toWei(String(data.price)), data.period, paytype).send({ from: account });

            var currency = paytype == '1' ? "GRVC" : "BNB";
            var message = "#" + tokenId + "NFT auction start as " + data.price + " " + currency + " period is " + data.period + " seconds";
            notify(message);
            history({
                id: tokenId,
                from: account,
                action: 3,
                tx_link: config.tx_prefix + tx.transactionHash,
                price: data.price,
                paytype: paytype
            })
            emitSocket(
                tx.transactionHash,
                'update',
                {
                    id: tokenId,
                    price: data.price,
                    paytype: paytype
                }
            );
            navigate('/admin/auction/' + tokenId);
            setLoading(false)


        } catch (err) {
            notify(err.message, 'error')
            setLoading(false)
        }
    }

    const [paytype, setPaytype] = useState('1');

    const formik = useFormik({
        initialValues: {
            price: 0,
            period: 0
        },
        validate: (data) => {
            let errors = {};

            if (data.price <= 0) {
                errors.price = 'Positive is required.';
            }

            if (data.period <= 0) {
                errors.period = 'Positive is required.';
            }

            return errors;
        },
        onSubmit: (data) => {
            data && handleCreate(data);
            formik.resetForm();
        }
    });

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div className="gap-5 flex flex-column w-12 mb-4">
                    <div className="flex-auto">
                        <div>
                            <label htmlFor="name" className="font-bold block mb-2">
                                Start Price :
                            </label>
                            <InputNumber
                                showButtons
                                id="price"
                                name="price"
                                value={formik.values.price}
                                onChange={(e) => {
                                    formik.setFieldValue('price', e.value);
                                }}
                                minFractionDigits={2}
                                maxFractionDigits={5}
                                className={classNames({ 'p-invalid': isFormFieldInvalid('price'), 'w-12': true })}
                            />
                            {getFormErrorMessage('price')}
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <div className="flex align-items-center">
                                <RadioButton inputId="grvc" name="paytype" value="1" onChange={(e) => setPaytype(e.value)} checked={paytype === '1'} />
                                <label htmlFor="grvc" className="ml-2">GRVC</label>
                            </div>
                            <div className="flex align-items-center">
                                <RadioButton inputId="bnb" name="paytype" value="2" onChange={(e) => setPaytype(e.value)} checked={paytype === '2'} />
                                <label htmlFor="bnb" className="ml-2">BNB</label>
                            </div>
                        </div>
                    </div>

                    <div className="flex-auto">
                        <div>
                            <label htmlFor="name" className="font-bold block mb-2">
                                Period :
                            </label>
                            <InputNumber
                                showButtons
                                id="period"
                                name="period"
                                value={formik.values.period}
                                onChange={(e) => {
                                    formik.setFieldValue('period', e.value);
                                }}
                                prefix="Expires in "
                                suffix=" seconds"
                                className={classNames({ 'p-invalid': isFormFieldInvalid('period'), 'w-12': true })}
                            />
                            {getFormErrorMessage('period')}
                        </div>
                    </div>

                    <div className='flex justify-content-center my-3 pt-3'>
                        <Button label="START AUCTION" type="submit" loading={loading} className='gradientBtn02' icon="pi pi-check" />
                    </div>
                </div>
            </form>
        </div >
    )
});

export default Component