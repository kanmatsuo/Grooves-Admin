import { TabView, TabPanel } from 'primereact/tabview';
import CreateGacha from './components/Gacha/CreateGacha';
import RemoveGacha from './components/Gacha/RemoveGacha'

import MarketJson from "../../Marketplace.json"
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Web3 from "web3";
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { useGlobalService } from '../../GlobalServiceContext';

const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            loadBlockchainData()
        }
    }));
    const [gachaContract, setGachaContract] = useState(null);

    const [spin1GrvcPrice, setspin1GrvcPrice] = useState(0);
    const [spin5GrvcPrice, setspin5GrvcPrice] = useState(0);
    const [spin10GrvcPrice, setspin10GrvcPrice] = useState(0);

    const [spin1BnbPrice, setspin1BnbPrice] = useState(0);
    const [spin5BnbPrice, setspin5BnbPrice] = useState(0);
    const [spin10BnbPrice, setspin10BnbPrice] = useState(0);

    const [loading, setLoading] = useState(false);
    const { notify } = useGlobalService()

    useEffect(() => {
        loadBlockchainData();
    }, []);

    async function loadBlockchainData() {
        const web3 = new Web3(Web3.givenProvider);
        const t = new web3.eth.Contract(MarketJson.gacha_abi, MarketJson.gacha_address);
        const spinPrices = await t.methods.getGachaSpinPrice().call()

        setspin1GrvcPrice(Web3.utils.fromWei(String(spinPrices[0])))
        setspin5GrvcPrice(Web3.utils.fromWei(String(spinPrices[1])))
        setspin10GrvcPrice(Web3.utils.fromWei(String(spinPrices[2])))
        setspin1BnbPrice(Web3.utils.fromWei(String(spinPrices[3])))
        setspin5BnbPrice(Web3.utils.fromWei(String(spinPrices[4])))
        setspin10BnbPrice(Web3.utils.fromWei(String(spinPrices[5])))

        setGachaContract(t);
    }

    const handleGachaPrices = async () => {
        try {
            setLoading(true)
            var arr = [
                Web3.utils.toWei(String(spin1GrvcPrice)),
                Web3.utils.toWei(String(spin5GrvcPrice)),
                Web3.utils.toWei(String(spin10GrvcPrice)),
                Web3.utils.toWei(String(spin1BnbPrice)),
                Web3.utils.toWei(String(spin5BnbPrice)),
                Web3.utils.toWei(String(spin10BnbPrice)),
            ];
            await gachaContract.methods.setGachaSpinPrice(arr).send({ from: window.ethereum.selectedAddress })
            notify("Price update Successfully");
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    return (
        <div id="container">
            <TabView>
                <TabPanel header="Price" leftIcon="pi pi-money-bill mr-2">
                    <>
                        <div className="flex flex-wrap gap-3 mb-4">
                            <div className="flex-auto">
                                <div className="col-12">
                                    <label className="font-bold block text-3xl font-bold">GRVC PRICE</label>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="spin1GrvcPrice" className="font-bold block mb-2">1 SPIN</label>
                                    <InputNumber inputId="spin1GrvcPrice" className='w-12' value={spin1GrvcPrice} onValueChange={(e) => setspin1GrvcPrice(e.value)} />
                                </div>
                                <div className="col-12">
                                    <label htmlFor="spin5GrvcPrice" className="font-bold block mb-2">5 SPIN</label>
                                    <InputNumber inputId="spin5GrvcPrice" className='w-12' value={spin5GrvcPrice} onValueChange={(e) => setspin5GrvcPrice(e.value)} />
                                </div>
                                <div className="col-12">
                                    <label htmlFor="spin10GrvcPrice" className="font-bold block mb-2">10 SPIN</label>
                                    <InputNumber inputId="spin10GrvcPrice" className='w-12' value={spin10GrvcPrice} onValueChange={(e) => setspin10GrvcPrice(e.value)} />
                                </div>
                            </div>

                            <div className="flex-auto">
                                <div className="col-12">
                                    <label className="font-bold block text-3xl font-bold">BNB PRICE</label>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="spin1BnbPrice" className="font-bold block mb-2">1 SPIN</label>
                                    <InputNumber inputId="spin1BnbPrice" className='w-12' value={spin1BnbPrice} onValueChange={(e) => setspin1BnbPrice(e.value)} />
                                </div>
                                <div className="col-12">
                                    <label htmlFor="spin5BnbPrice" className="font-bold block mb-2">5 SPIN</label>
                                    <InputNumber inputId="spin5BnbPrice" className='w-12' value={spin5BnbPrice} onValueChange={(e) => setspin5BnbPrice(e.value)} />
                                </div>
                                <div className="col-12">
                                    <label htmlFor="spin10BnbPrice" className="font-bold block mb-2">10 SPIN</label>
                                    <InputNumber inputId="spin10BnbPrice" className='w-12' value={spin10BnbPrice} onValueChange={(e) => setspin10BnbPrice(e.value)} />
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-content-center'>
                            <Button label="Update Price" onClick={handleGachaPrices} loading={loading} className='gradientBtn02' icon="pi pi-check" />
                        </div>
                    </>
                </TabPanel>
                <TabPanel header="Create" leftIcon="pi pi-upload mr-2">
                    <CreateGacha ref={ref} />
                </TabPanel>
                <TabPanel header="Cancel" leftIcon="pi pi-times mr-2">
                    <RemoveGacha ref={ref} />
                </TabPanel>
            </TabView>
        </div>
    )
});

export default Component