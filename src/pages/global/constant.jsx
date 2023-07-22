var config = {
    chain_id: '0x61',
    chain_name: 'BNB Smart Chain Testnet',
    rpc_urls: ['https://endpoints.omniatech.io/v1/bsc/testnet/public'],
    explorer_urls: ['https://testnet.bscscan.com'],
    native_currency: {
        name: "BNB Smart Chain Testnet",
        symbol: "tBNB",
        decimals: 18,
    },
    tx_prefix: 'https://testnet.bscscan.com/tx/',

    assets_url: 'http://54.87.173.85/storage/uploads/',
    backend_url: 'http://54.87.173.85/api/v1/',
    profile_url: "http://54.87.173.85/storage/profile/users/",
    sanctum_api_url: 'http://54.87.173.85/api/v1/admin',
    cookies_expire_time: 1,
    get_csrf_token_addr: 'http://54.87.173.85/sanctum/csrf-cookie',
    token_symbol: "GRVC",
    socket_server_url: 'http://54.87.173.85:4000'
};

// var config = {
//     chain_id: '0x539',
//     chain_name: 'TestNet For NFT',
//     rpc_urls: ['http://localhost:7545'],
//     explorer_urls: ['https://bscscan.com'],
//     native_currency: {
//         name: "Binance Smart Chain",
//         symbol: "ETH",
//         decimals: 18,
//     },
//     tx_prefix: 'https://bscscan.com/tx/',

//     assets_url: 'http://127.0.0.1:8000/storage/uploads/',
//     backend_url: 'http://127.0.0.1:8000/api/v1/',
//     profile_url: "http://127.0.0.1:8000/storage/profile/users/",
//     sanctum_api_url: 'http://127.0.0.1:8000/api/v1/admin/',
//     cookies_expire_time: 1,
//     get_csrf_token_addr: 'http://127.0.0.1:8000/sanctum/csrf-cookie/',
//     token_symbol: "GRVC",

//     socket_server_url: 'http://127.0.0.1:4000'
// };

export default config;