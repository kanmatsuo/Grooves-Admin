import { createContext, useContext, useRef } from "react";
import Web3 from "web3";
import axios from "axios";
import config from "./pages/global/constant";
import { useEffect, useState } from 'react';
import Cookies from "js-cookie"
import { Toast } from 'primereact/toast';
import socketIO from 'socket.io-client';

const GlobalServiceContext = createContext();

export function GlobalServiceProvider({ children }) {

    const toast = useRef(null);
    const [user, setUser] = useState(null);
    const web3 = new Web3(Web3.givenProvider);
    const [socket] = useState(socketIO.connect(config.socket_server_url));

    useEffect(() => {
        refresh();
    }, []);

    const notify = (message, severity = null) => {

        function internalFunc() {
            switch (severity) {
                case "success":
                    return { severity: "success", summary: "Success" }
                case "info":
                    return { severity: "info", summary: "Success" }
                case "warn":
                    return { severity: "warn", summary: "Warnming" }
                case "error":
                    return { severity: "error", summary: "Error" }
                case null:
                    return { severity: "success", summary: "Success" }
                default:
            }
        }

        const data = internalFunc();
        toast.current.show({ severity: data.severity, summary: data.summary, detail: message, life: 5000 });
    };

    const history = async (data) => {
        const instance = axios.create({
            baseURL: config.backend_url,
            headers: { 'Authorization': `Bearer ${Cookies.get('_csrf')}` }
        });
        await instance.post("admin/add/history", data).then((response) => {
            console.log(response)
        });
    }

    const refresh = async () => {
        const instance = axios.create({
            baseURL: config.backend_url,
            headers: { 'Authorization': `Bearer ${Cookies.get('_csrf')}` }
        });
        if (Cookies.get('_csrf')) {
            await instance.get("user").then((response) => {
                console.log(response.data)
                setUser(response.data);
            });
        }
    }

    const emitSocket = async (transactionHash, eventName, data) => {
        var receipt = await web3.eth.getTransactionReceipt(transactionHash);
        console.log('Transaction status:', receipt.status === true ? 'Success' : 'Failed');
        if (receipt.status === true) {
            const timer = setTimeout(() => {
                socket.emit(eventName, data)
            }, 10000);

            return () => clearTimeout(timer);
        }
    }

    return (
        <GlobalServiceContext.Provider value={{ notify, history, user, refresh, emitSocket, socket }}>
            {children}
            <Toast ref={toast} />
        </GlobalServiceContext.Provider>
    );
}

export function useGlobalService() {
    return useContext(GlobalServiceContext);
}

// const Child = forwardRef((props, ref) => {
//     useImperativeHandle(ref, () => ({
//         getAlert() {
//             alert("getAlert from Child");
//         }
//     }));
// });

// const Parent = () => {
//     const childRef = useRef();

//     return (
//         <div>
//             <Child ref={childRef} />
//             <button onClick={() => childRef.current.getAlert()}>Click</button>
//         </div>
//     );
// };