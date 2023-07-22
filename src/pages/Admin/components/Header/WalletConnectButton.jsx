import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import Web3 from "web3";
import config from "../../../global/constant";
import Swal from "sweetalert2";
import truncateEthAddress from 'truncate-eth-address';
import MarketJson from "../../../../Marketplace.json";
import { useGlobalService } from "../../../../GlobalServiceContext";

export default function WalletConnectButton() {
    const [walletStatus, setWalletStatus] = useState('Connect Wallet!');
    const [web3, setWeb3] = useState(null);
    const { notify } = useGlobalService();

    useEffect(() => {
        loadBlockChainData()
    }, []);

    function loadBlockChainData() {
        const w = new Web3(Web3.givenProvider);
        setWeb3(w)

        if (window.ethereum) {
            if (window.ethereum.selectedAddress !== null) {
                if (w.givenProvider.chainId != config.chain_id) {
                    setWalletStatus("Network error!")
                } else {
                    setWalletStatus(truncateEthAddress(window.ethereum.selectedAddress))
                }
            } else {
                setWalletStatus('Connect Wallet!')
            }
        } else {
            setWalletStatus('Non-Metamask browser!')
        }
    }

    const handleConnect = async () => {
        if (window.ethereum == null) {
            Swal.fire({
                title: "Metamask Not Found",
                text: "Please install MetaMask.",
                icon: "error",
                confirmButtonText: "OK",
            }).then(function () {
                window.location.href = "https://metamask.io/download/";
            });
            return;
        }

        else if (window.ethereum.selectedAddress == null) {
            Swal.fire({
                title: "No Connection",
                text: "Please connect the wallet",
                icon: "error",
                confirmButtonText: "OK",
            }).then(async () => {
                await ethereum.send('eth_requestAccounts')
                loadBlockChainData()
            });
            return
        }

        else if (web3.givenProvider.chainId != config.chain_id) {
            Swal.fire({
                title: "Netowrk Error",
                text: "Please select BSC network",
                icon: "error",
                confirmButtonText: "OK",
            }).then(async () => {

                try {
                    await ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: config.chain_id }],
                    });
                } catch (switchError) {
                    // This error code indicates that the chain has not been added to MetaMask.
                    if (switchError.code === 4902) {
                        try {
                            await ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                        chainId: config.chain_id,
                                        chainName: config.chain_name,
                                        rpcUrls: config.rpc_urls,
                                        blockExplorerUrls: config.explorer_urls,
                                        nativeCurrency: config.native_currency
                                    },
                                ],
                            });
                        } catch (err) {
                            notify(err.message , 'error')
                        }
                    }
                    // handle other "switch" errors
                }
                loadBlockChainData()
            });
            return;
        } else {
            setWalletStatus(truncateEthAddress(window.ethereum.selectedAddress))
            notify("Already Connected", "info")
        }
    }

    return (
        <>
            <div className="card mb-4 mt-4">
                <button onClick={handleConnect} className='walletConnect gradientBtn01'>
                    <i className='pi pi-wallet'></i>
                    {walletStatus}
                </button>
            </div>
        </>
    )
}