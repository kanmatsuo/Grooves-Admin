import React, { useEffect, useState, useRef } from 'react'

import logo_icon_28 from '../../../assets/images/logo-white.svg';
import logo_dark from '../../../assets/images/logo-dark.svg';
import logo_white from '../../../assets/images/logo-white.svg';
import image from '../../../assets/images/avatar/img_01.jpg';
import { Link, useNavigate } from "react-router-dom";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import truncateEthAddress from 'truncate-eth-address';
import { useGlobalService } from "../../../GlobalServiceContext";
import MarketJson from '../../../Marketplace.json';
import Web3 from "web3";
import Cookies from "js-cookie";
import config from "../../global/constant";
import axios from "axios";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

export default function Navbar() {
    const [isDropdown, openDropdown] = useState(true);
    const [isOpen, setMenu] = useState(true);
    const navigate = useNavigate();
    const { notify, user, refresh } = useGlobalService()
    const [account, setAccount] = useState('');
    const [walletStatus, setWalletStatus] = useState('Please connect the wallet!');
    const [tokenBalance, setTokenBalance] = useState(0);
    const [bnbBalance, setBnbBalance] = useState(0);
    const [web3, setWeb3] = useState(null);
    const [tokenContract, setTokenContract] = useState(null);
    const [visible, setVisible] = useState(false);
    const buttonEl = useRef(null);
    const dropdownRef = useRef(null);

    const location = useLocation();

    const instance = axios.create({
        baseURL: config.backend_url,
        headers: { 'Authorization': `Bearer ${Cookies.get('_csrf')}` }
    });


    useEffect(() => {
        activateMenu()
    }, [location.pathname])

    const accountWasChanged = () => {
        instance.post("client/add/wallets-address", {
            wallet: window.ethereum.selectedAddress
        })

        loadBlockchainData()

        // instance.get("client/get/wallets-address").then(res => {
        //     console.log(res)
        // })

        // instance.post("client/get/user-by-address", {
        //     wallet: window.ethereum.selectedAddress
        // }).then(res => {
        //     console.log(res)
        // })
    }

    useEffect(() => {
        activateMenu();
        loadBlockchainData();

        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                openDropdown(true);
            }
        };

        window.ethereum.on('accountsChanged', accountWasChanged);
        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            window.ethereum.removeListener("accountsChanged", accountWasChanged);
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    async function loadBlockchainData() {
        if (window.ethereum) {
            if (window.ethereum.selectedAddress !== null) {

                setAccount(window.ethereum.selectedAddress);

                const web3 = new Web3(Web3.givenProvider);
                setWeb3(web3)

                const t1 = new web3.eth.Contract(MarketJson.token_abi, MarketJson.token_address);
                setTokenContract(t1)

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

    const logout = () => {
        if (!Cookies.get('_csrf')) {
            notify("already logout!")
        } else {
            instance.post("client/logout").then(res => {
                Cookies.remove('_csrf', { path: '/' }) // removed!
                refresh();
                notify("Successfully logout!")
                navigate('/login')
            })
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

    window.addEventListener("scroll", windowScroll);
    function windowScroll() {
        const navbar = document.getElementById("topnav");
        if (
            document.body.scrollTop >= 50 ||
            document.documentElement.scrollTop >= 50
        ) {
            if (navbar !== null) {
                navbar?.classList.add("nav-sticky");
            }
        } else {
            if (navbar !== null) {
                navbar?.classList.remove("nav-sticky");
            }
        }

        const mybutton = document.getElementById("back-to-top");
        if (mybutton != null) {
            if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
                mybutton.classList.add("flex");
                mybutton.classList.remove("hidden");
            } else {
                mybutton.classList.add("hidden");
                mybutton.classList.remove("flex");
            }
        }
    }

    const toggleMenu = () => {
        setMenu(!isOpen)
        if (document.getElementById("navigation")) {
            const anchorArray = Array.from(document.getElementById("navigation").getElementsByTagName("a"));
            anchorArray.forEach(element => {
                element.addEventListener('click', (elem) => {
                    const target = elem.target.getAttribute("href")
                    if (target !== "") {
                        if (elem.target.nextElementSibling) {
                            var submenu = elem.target.nextElementSibling.nextElementSibling;
                            submenu.classList.toggle('open');
                        }
                    }
                })
            });
        }
    }

    const getClosest = (elem, selector) => {

        // Element.matches() polyfill
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function (s) {
                    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                        i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) { }
                    return i > -1;
                };
        }

        // Get the closest matching element
        for (; elem && elem !== document; elem = elem.parentNode) {
            if (elem.matches(selector)) return elem;
        }
        return null;
    };

    const activateMenu = () => {
        var menuItems = document.getElementsByClassName("sub-menu-item");
        if (menuItems) {

            var matchingMenuItem = null;
            for (var idx = 0; idx < menuItems.length; idx++) {
                if (menuItems[idx].classList.contains("active")) {
                    var current = menuItems[idx];
                    current.classList.remove('active');
                    var immediateParent = getClosest(current, 'li');
                    if (immediateParent) {
                        immediateParent.classList.remove('active');
                    }

                    var parent = getClosest(immediateParent, '.child-menu-item');
                    if (parent) {
                        parent.classList.remove('active');
                    }

                    var parent = getClosest(parent || immediateParent, '.parent-menu-item');

                    if (parent) {
                        parent.classList.remove('active');

                        var parentMenuitem = parent.querySelector('.menu-item');
                        if (parentMenuitem) {
                            parentMenuitem.classList.remove('active');
                        }
                    }
                }

                if (window.location.href.includes(menuItems[idx].href)) {
                    matchingMenuItem = menuItems[idx];
                }
            }

            if (matchingMenuItem) {

                matchingMenuItem.classList.add('active');
                var immediateParent = getClosest(matchingMenuItem, 'li');

                if (immediateParent) {
                    immediateParent.classList.add('active');
                }

                var parent = getClosest(immediateParent, '.child-menu-item');
                if (parent) {
                    parent.classList.add('active');
                }

                var parent = getClosest(parent || immediateParent, '.parent-menu-item');

                if (parent) {
                    parent.classList.add('active');

                    var parentMenuitem = parent.querySelector('.menu-item');
                    if (parentMenuitem) {
                        parentMenuitem.classList.add('active');
                    }
                }
            }
        }
    }

    const metamask = async () => {
        try {
            if (window.ethereum == null) {
                setWalletStatus("No installed Metamask")
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
                setWalletStatus("Please connect the wallet")
                Swal.fire({
                    title: "No Connection",
                    text: "Please connect the wallet",
                    icon: "error",
                    confirmButtonText: "OK",
                }).then(async () => {
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    instance.post("client/add/wallets-address", {
                        wallet: window.ethereum.selectedAddress
                    })
                    loadBlockchainData()
                });
                return
            }

            else if (web3.givenProvider.chainId != config.chain_id) {
                setWalletStatus("Please select BSC Network")
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
                                notify(err.message, 'error')
                            }
                        }
                    }
                    loadBlockchainData()
                });
                return;
            } else {
                setWalletStatus(truncateEthAddress(window.ethereum.selectedAddress))
                notify("Already Connected", "info")
                return;
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <nav id="topnav" className="defaultscroll is-sticky">
                <div className="container">
                    {/* <!-- Logo container--> */}
                    <Link className="logo ps-0" to="/">
                        <img src={logo_icon_28} className="inline-block sm:hidden" alt="" />
                        <div className="sm:block hidden">
                            <img src={logo_dark} className="inline-block dark:hidden h-10" alt="" />
                            <img src={logo_white} className="hidden dark:inline-block h-10" alt="" />
                        </div>
                    </Link>

                    <div className="menu-extras">
                        <div className="menu-item">
                            {/* <!-- Mobile menu toggle--> */}
                            <a className="navbar-toggle" id="isToggle" onClick={toggleMenu}>
                                <div className="lines">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* <!--Login button Start--> */}
                    <ul className="buy-button list-none mb-0">

                        <li className="inline-block mb-0">
                            <div className="form-icon relative">
                                <i className="uil uil-search text-lg absolute top-1/2 -translate-y-1/2 start-3"></i>
                                <input type="text" className="form-input sm:w-44 w-28 ps-10 py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-3xl outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0 bg-white" name="s" id="searchItem" placeholder="Search..." />
                            </div>
                        </li>

                        <li className="inline-block ps-1 mb-0">
                            <button onClick={metamask} id="connectWallet" className="btn btn-icon rounded-full bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white"><i className="uil uil-wallet"></i></button>
                        </li>

                        <li className="dropdown inline-block relative ps-1" ref={dropdownRef}>
                            <button onClick={() => openDropdown(!isDropdown)} data-dropdown-toggle="dropdown" className="dropdown-toggle btn btn-icon rounded-full bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white inline-flex" type="button">
                                <img src={user?.avatar ? config.profile_url + user.avatar : image} className="rounded-full h-9 w-9" alt="" />
                            </button>

                            <div className={`dropdown-menu absolute end-0 m-0 mt-4 z-10 w-48 rounded-md overflow-hidden bg-white dark:bg-slate-900 shadow dark:shadow-gray-800 ${isDropdown ? 'hidden' : 'block'}`} >
                                <div className="relative">
                                    <div className="py-8 bg-gradient-to-tr from-violet-600 to-red-600"></div>
                                    <div className="absolute px-4 -bottom-7 start-0">
                                        <div className="flex items-end">
                                            <img src={user?.avatar ? config.profile_url + user.avatar : image} className="rounded-full shadow dark:shadow-gray-700" style={{
                                                width: '70px',
                                                height: '70px',
                                            }} alt="" />
                                            <span className="font-semibold text-[15px] ms-1">{user ? user.name : "no login"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 px-4">
                                    <h5 className="font-semibold text-[15px]">Wallet:</h5>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] text-slate-400">{truncateEthAddress(account)}</span>

                                        <CopyToClipboard text={account}
                                            onCopy={() => notify("copied to clipboard: " + truncateEthAddress(account))}>
                                            <i className="uil uil-copy text-violet-600"></i>
                                        </CopyToClipboard>
                                    </div>
                                </div>

                                <div className="mt-3 px-4">
                                    <h5 className="font-semibold text-[15px]">NFT:</h5>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] text-slate-400">{truncateEthAddress(MarketJson.market_address)}</span>

                                        <CopyToClipboard text={MarketJson.market_address}
                                            onCopy={() => notify("copied to clipboard: " + truncateEthAddress(MarketJson.market_address))}>
                                            <i className="uil uil-copy text-violet-600"></i>
                                        </CopyToClipboard>
                                    </div>
                                </div>

                                <div className="mt-4 px-4">
                                    <h5 className="text-[15px] flex align-items-center">BNB: <span className="text-violet-600 font-semibold ml-auto">{bnbBalance}</span></h5>
                                </div>

                                <div className="mt-1 px-4">
                                    <h5 className="text-[15px] flex align-items-center">GRVC: <span className="text-violet-600 font-semibold ml-auto">{tokenBalance}</span></h5>
                                </div>

                                <ul className="py-2 text-start user-setting-dropdown">
                                    <li>
                                        <Link to={"/profile/" + user?.id} onClick={() => openDropdown(true)} className="block text-[14px] font-semibold py-1.5 px-4 hover:text-violet-600"><i className="uil uil-user text-[16px] align-middle me-1"></i> Profile</Link>
                                    </li>
                                    <li>
                                        <Link to="/profile-edit" onClick={() => openDropdown(true)} className="block text-[14px] font-semibold py-1.5 px-4 hover:text-violet-600"><i className="uil uil-setting text-[16px] align-middle me-1"></i> Settings</Link>
                                    </li>
                                    <li className="border-t border-gray-100 dark:border-gray-800 my-2 divider"></li>

                                    <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                                        message="Are you sure you want to logout?" icon="pi pi-exclamation-triangle" accept={logout} reject={() => notify("canceled")} />

                                    <li>
                                        <Link ref={buttonEl} onClick={() => setVisible(true)} className="block text-[14px] font-semibold py-1.5 px-4 hover:text-violet-600"><i className="uil uil-sign-out-alt text-[16px] align-middle me-1"></i> Logout</Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>

                    <div id="navigation" className={`${isOpen === true ? 'hidden' : 'block'}`}>
                        <ul className="navigation-menu justify-end">
                            <li><Link to="/" className="sub-menu-item">Home</Link></li>

                            <li className="has-submenu parent-menu-item">
                                <Link to="#">Marketplace</Link><span className="menu-arrow"></span>
                                <ul className="submenu">
                                    {/* <li><Link to="/store" className="sub-menu-item">Store</Link></li> */}
                                    <li><Link to="/list" className="sub-menu-item">Listing</Link></li>
                                    <li><Link to="/auction" className="sub-menu-item">Auction</Link></li>
                                    <li><Link to="/gacha" className="sub-menu-item">Gacha</Link></li>
                                    <li><Link to="/reward" className="sub-menu-item">Reward</Link></li>
                                    <li><Link to="/collection" className="sub-menu-item">Collection</Link></li>
                                </ul>
                            </li>

                            <li><Link to="/about-us" className="sub-menu-item">About Us</Link></li>

                            <li className="has-submenu parent-menu-item">
                                <Link to="#">Help Center</Link><span className="menu-arrow"></span>
                                <ul className="submenu">
                                    <li><Link to="/terms" className="sub-menu-item">Terms of Service</Link></li>
                                    <li><Link to="/privacy" className="sub-menu-item">Privacy policy</Link></li>
                                    <li><Link to="/faq" className="sub-menu-item">FAQs</Link></li>
                                </ul>
                            </li>
                            <li><Link to="/contact" className="sub-menu-item">Contact</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>

            {account && web3.givenProvider.chainId == config.chain_id ? (
                <></>
            ) : (
                <div className="walletConnectionAlert">
                    <i className='pi-bell pi mr-3'></i> {walletStatus}
                </div>
            )}

        </>
    )
}
