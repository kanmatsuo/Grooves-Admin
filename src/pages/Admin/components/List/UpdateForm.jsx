import MarketJson from "../../../../Marketplace.json"
import Web3 from "web3";
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useGlobalService } from "../../../../GlobalServiceContext";
import config from "../../../global/constant";

import { useFormik } from 'formik';
import { classNames } from 'primereact/utils';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { RadioButton } from "primereact/radiobutton";
import socketIO from 'socket.io-client';

const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            loadBlockchainData()
        }
    }));

    const [account, setAccount] = useState('');
    const [listingContract, setListingContract] = useState(null);

    const tokenId = props.data.id;
    const { notify, history, emitSocket } = useGlobalService();
    const [loading, setLoading] = useState(false);

    const [socket] = useState(socketIO.connect(config.socket_server_url));

    useEffect(() => {
        loadBlockchainData();
    }, []);

    async function loadBlockchainData() {
        setAccount(window.ethereum.selectedAddress)
        const web3 = new Web3(Web3.givenProvider);
        const t1 = new web3.eth.Contract(MarketJson.listing_abi, MarketJson.listing_address);
        setListingContract(t1);
    }

    const handleUpdate = async (data) => {
        try {
            setLoading(true)
            var tx = await listingContract.methods.updateListPrice(props.data.id, paytype, Web3.utils.toWei(String(data.price))).send({ from: account });

            var currency = paytype == '1' ? "GRVC" : "BNB";
            var message = "#" + tokenId + "NFT Updated as " + data.price + " " + currency;
            notify(message);
            history({
                id: tokenId,
                from: account,
                action: 4,
                tx_link: config.tx_prefix + tx.transactionHash,
                price: data.price,
                paytype: paytype
            })

            props.onUpdateSuccess()
            setLoading(false)
            loadBlockchainData();
            
            emitSocket(
                tx.transactionHash,
                'update',
                {
                    id: tokenId,
                    price: data.price,
                    paytype: paytype
                }
            );

        } catch (err) {
            notify(err.message, 'error')
            console.log(err)
            setLoading(false)
        }
    }
    const [paytype, setPaytype] = useState('1');

    useEffect(() => {
        setPaytype(props.data.paytype)
    }, [props]);

    const formik = useFormik({
        initialValues: {
            price: 0,
        },
        validate: (data) => {
            let errors = {};

            if (data.price <= 0) {
                errors.price = 'Positive is required.';
            }

            return errors;
        },
        onSubmit: (data) => {
            data && handleUpdate(data);
            formik.resetForm();
        }
    });

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };

    return (
        <div>
            <div className="gap-5 flex flex-column w-12 mb-4">
                <form onSubmit={formik.handleSubmit}>

                    <div className="flex-auto">
                        <div>
                            <label htmlFor="name" className="font-bold block mb-2">
                                Price :
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

                    <div className='flex justify-content-center my-3 pt-3'>
                        <Button label="UPDATE" loading={loading} type="submit" className='gradientBtn02' icon="pi pi-check" />
                    </div>
                </form>
            </div>
        </div >
    )
})

export default Component;
