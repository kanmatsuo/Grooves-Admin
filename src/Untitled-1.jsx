import { useGlobalService } from "../../../../GlobalServiceContext";
const { notify, history } = useGlobalService();
notify("This is a notification message!");


for (var i = 0; i < count; i++) {
    var token_id = Number(from) + i + 1;
    notify("#" + token_id + " Token Successfully Minted!");

    history({
        id: token_id,
        from: account,
        action: 1,
        tx_link: config.tx_prefix + tx.transactionHash,
        price: 0,
        paytype: 0
    })
}


import { useNavigate } from "react-router-dom";
const navigate = useNavigate();
navigate('/admin/')

// cd /var/www/GroovesAPI
// "build": "vite build --base=/admin/",

// useEffect(() => {
//     let e1 = gachaContract?.events?.GachaAdded(function (err, e) {
//         if (!err) {
//             const { length } = e.returnValues;
//             console.log(length)
//         }
//     })
//     let e2 = gachaContract?.events?.GachaCanceled(function (err, e) {
//         if (!err) {
//             const { length } = e.returnValues;
//             console.log(length)
//         }
//     })
//     return () => {
//         e1?.unsubscribe((error, success) => {
//             if (success) {
//                 console.log('Unsubscribed from event');
//             } else {
//                 console.error('Error unsubscribing from event:', error);
//             }
//         });
//         e2?.unsubscribe((error, success) => {
//             if (success) {
//                 console.log('Unsubscribed from event');
//             } else {
//                 console.error('Error unsubscribing from event:', error);
//             }
//         });
//     };
// }, [gachaContract]);


emitSocket(
    tx.transactionHash,
    'update',
    {
        id: tokenId,
        price: data.price,
        paytype: paytype
    }
);

// const Component = forwardRef((props, ref) => {
//     useImperativeHandle(ref, () => ({
//         init() {
//             loadBlockchainData()
//         }
//     }));

// });

// export default Component

const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            console.log("empty blockchain")
        }
    }));

});

export default Component