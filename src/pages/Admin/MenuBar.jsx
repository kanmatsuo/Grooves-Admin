import GroovesLogo from "../../assets/G-rooves_logo.svg"
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import MarketJson from '../../Marketplace.json';
import Web3 from "web3";
import config from "./../global/constant";
import axios from "axios";
import WalletConnectButton from './components/Header/WalletConnectButton';
import Cookies from "js-cookie";
import { useGlobalService } from "../../GlobalServiceContext";
import truncateEthAddress from 'truncate-eth-address';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

export default function MenuBar(props) {

    const location = useLocation();
    const navigate = useNavigate();
    const { notify, user, refresh } = useGlobalService()

    const isActive = (pathname) => {
        return location.pathname.includes(pathname);
    };

    const [visible, setVisible] = useState(false);

    const [account, setAccount] = useState('');
    const [walletStatus, setWalletStatus] = useState('');
    const [tokenContract, setTokenContract] = useState(null);
    const [listingContract, setListingContract] = useState(null);
    const [auctionContract, setAuctionContract] = useState(null);
    const [gachaContract, setGachaContract] = useState(null);
    const [tokenBalance, setTokenBalance] = useState(0);
    const [bnbBalance, setBnbBalance] = useState(0);
    const [web3, setWeb3] = useState();

    const buttonEl = useRef(null);

    const instance = axios.create({
        baseURL: config.backend_url,
        headers: { 'Authorization': `Bearer ${Cookies.get('_csrf')}` }
    });

    useEffect(() => {
        loadBlockchainData();
    }, []);

    async function loadBlockchainData() {
        Cookies.get('_csrf') ? navigate(location.pathname) : navigate('/admin/login')
        if (window.ethereum) {
            await ethereum.send('eth_requestAccounts')

            if (window.ethereum.selectedAddress !== null) {

                setAccount(window.ethereum.selectedAddress);

                const web3 = new Web3(Web3.givenProvider);
                setWeb3(web3)

                const t1 = new web3.eth.Contract(MarketJson.token_abi, MarketJson.token_address);
                setTokenContract(t1)

                const t2 = new web3.eth.Contract(MarketJson.listing_abi, MarketJson.listing_address);
                setListingContract(t2)

                const t3 = new web3.eth.Contract(MarketJson.auction_abi, MarketJson.auction_address);
                setAuctionContract(t3)

                const t4 = new web3.eth.Contract(MarketJson.gacha_abi, MarketJson.gacha_address);
                setGachaContract(t4)

                let bnbVal = await web3.eth.getBalance(window.ethereum.selectedAddress);
                bnbVal = Number(web3.utils.fromWei(String(bnbVal))).toFixed(2)
                setBnbBalance(bnbVal)

                let tokenVal = await t1.methods.balanceOf(window.ethereum.selectedAddress).call();
                tokenVal = Number(web3.utils.fromWei(String(tokenVal))).toFixed(2);
                setTokenBalance(tokenVal);

                if (web3.givenProvider.chainId == config.chain_id) {
                    setWalletStatus(window.ethereum.selectedAddress);
                    setAccount(window.ethereum.selectedAddress);
                } else {
                    setWalletStatus("change network");
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: config.chain_id }]
                    });
                }
            } else {
                setWalletStatus('please connect metamask')
            }
        } else {
            setWalletStatus('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    web3?.eth.getAccounts().then(accounts => {
        return web3.eth.subscribe("newBlockHeaders", (err, result) => {
            if (err) {
                console.log(err);
            } else {
                web3.eth.getBalance(accounts[0]).then(async bal => {
                    setAccount(accounts[0]);

                    let bnbVal = Number(web3.utils.fromWei(String(bal))).toFixed(2)
                    setBnbBalance(bnbVal)

                    let tokenVal = await tokenContract.methods.balanceOf(window.ethereum.selectedAddress).call();
                    tokenVal = Number(web3.utils.fromWei(String(tokenVal))).toFixed(2);
                    setTokenBalance(tokenVal);
                });
            }
        })
    })

    const logout = () => {
        if (!Cookies.get('_csrf')) {
            notify("already logout!")
        } else {
            instance.post("admin/logout").then(res => {
                Cookies.remove('_csrf', { path: '/' }) // removed!
                refresh();
                notify("Successfully logout!")
                navigate('/admin/login')
            })
        }
    }

    const addToWatchList = async () => {
        await window.ethereum.request({
            "method": "wallet_watchAsset",
            "params": {
                "type": "ERC20",
                "options": {
                    "address": MarketJson.token_address,
                    "symbol": config.token_symbol,
                    "decimals": 18
                }
            }
        });
    }

    return (
        <div className="menuBar">
            <div className="logoWrapper">
                <img src={GroovesLogo} alt="" />
            </div>

            <WalletConnectButton />

            <div className="groovesAdminPanel">

                <div className="val">
                    <span>NAME : </span>
                    <span>{user ? user.name : "no login"}</span>
                </div>

                <div className="val">
                    <span>NFT : </span>
                    <span>{truncateEthAddress(MarketJson.market_address)}

                        <CopyToClipboard text={MarketJson.market_address}
                            onCopy={() => notify("copied to clipboard: " + truncateEthAddress(MarketJson.market_address))}>
                            <i className="pi pi-copy"></i>
                        </CopyToClipboard>
                    </span>
                </div>

                <div className="val">
                    <span>TOKEN : </span>
                    <span>
                        {truncateEthAddress(MarketJson.token_address)}

                        <CopyToClipboard text={MarketJson.token_address}
                            onCopy={() => notify("copied to clipboard: " + truncateEthAddress(MarketJson.token_address))}>
                            <i className="pi pi-copy mr-1"></i>
                        </CopyToClipboard>

                        <button onClick={addToWatchList}>
                            <i className="pi pi-wallet"></i>
                        </button>
                    </span>
                </div>

                <div className="val">
                    <span>BNB : </span>
                    <span>{bnbBalance}</span>
                </div>

                <div className="val">
                    <span>GRVC : </span>
                    <span>{tokenBalance}</span>
                </div>
            </div>

            {user ? (<ul className="groovesAdminMenu">

                <li>
                    <Link to="/admin" className={location.pathname === '/admin' || location.pathname.includes('mynft') ? 'active' : ''}><i className="pi pi-home"></i>MY NFT</Link>
                </li>

                <li>
                    <Link to="/admin/create" className={isActive('/admin/create') ? 'active' : ''}><i className="pi pi-wrench"></i>CREATE</Link>
                </li>

                <li>
                    <Link to="/admin/list" className={isActive('/admin/list') ? 'active' : ''}><i className="pi pi-list"></i>LIST</Link>
                </li>

                <li>
                    <Link to="/admin/auction" className={isActive('/admin/auction') ? 'active' : ''}><i className="pi pi-stopwatch"></i>AUCTION</Link>
                </li>

                <li>
                    <Link to="/admin/gacha" className={isActive('/admin/gacha') ? 'active' : ''}><i className="pi pi-box"></i>GACHA</Link>
                </li>

                <li>
                    <Link to="/admin/sold" className={isActive('/admin/sold') ? 'active' : ''}><i className="pi pi-shopping-bag"></i>SOLD</Link>
                </li>

                <li>
                    <Link to="/admin/reward" className={isActive('/admin/reward') ? 'active' : ''}><i className="pi pi-gift"></i>REWARD</Link>
                </li>

                <li>
                    <Link to="/admin/history" className={isActive('/admin/history') ? 'active' : ''}><i className="pi pi-history"></i>HISTORY</Link>
                </li>

                <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                    message="Are you sure you want to logout?" icon="pi pi-exclamation-triangle" accept={logout} reject={() => notify("canceled")} />

                <li>
                    <Link ref={buttonEl} onClick={() => setVisible(true)}><i className="pi pi-power-off"></i>LOGOUT</Link>
                </li>
            </ul>

            ) : (
                <p className="text-center text-white">Loading...</p>
            )}
        </div>
    );
}