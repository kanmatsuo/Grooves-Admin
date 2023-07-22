import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import moment from "moment/moment";
import truncateEthAddress from 'truncate-eth-address';
import Web3 from "web3";
import MarketJson from "../../Marketplace.json"
import Cookies from "js-cookie";
import axios from "axios";
import config from "./../global/constant";

import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';

const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            loadBlockchainData()
        }
    }));
    const [histories, setHistories] = useState([])
    const [marketContract, setMarketContract] = useState(null);

    const [statusIds, setStatusIds] = useState([]);
    const [statusDescriptions, setStatusDescriptions] = useState([]);
    const [meta, setMeta] = useState([]);

    const instance = axios.create({
        baseURL: config.backend_url,
        headers: { 'Authorization': `Bearer ${Cookies.get('_csrf')}` }
    });

    useEffect(() => {
        loadBlockchainData();
    }, []);

    async function loadBlockchainData() {
        const web3 = new Web3(Web3.givenProvider);
        const t0 = new web3.eth.Contract(MarketJson.market_abi, MarketJson.market_address);
        setMarketContract(t0);

        instance.get("admin/get/history").then(async function (result) {
            const m = [];
            const items = await Promise.all(result.data.data.map(async h => {

                if (h.paytype != "0") {
                    var curreny = h.paytype == 1 ? "GRVC" : "BNB"
                } else {
                    var curreny = ""
                }

                let transaction = await t0.methods.getTokenForId(h.token_id).call();

                let meta = await axios.get(transaction.tokenURI);
                meta = meta.data;
                m.push(meta.image)

                let item = {
                    ...h,
                    status: h.action_description.id,
                    price: h.price + curreny,
                    time: moment(h.created_at).format("yyyy-MM-DD HH:mm:ss"),
                    from: truncateEthAddress(h.from),
                    tx: h.tx_link.substring(0, 29) + '...',
                    image: meta.image
                }

                return item
            }))

            const uniqueMetaVals = getUniqueValues(m)

            function getUniqueValues(arr) {
                return Array.from(new Set(arr));
            }

            setMeta(uniqueMetaVals)

            setStatusIds(result.data.status_ids)
            setStatusDescriptions(result.data.status_descriptions)
            setHistories(items);
            setLoading(false);
        })
    }

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        token_id: { value: null, matchMode: FilterMatchMode.CONTAINS },
        price: { value: null, matchMode: FilterMatchMode.CONTAINS },
        from: { value: null, matchMode: FilterMatchMode.CONTAINS },
        time: { value: null, matchMode: FilterMatchMode.CONTAINS },
        tx_link: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        image: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    const getSeverity = (status) => {
        switch (status) {
            case 1:
                return '#FF0000';

            case 2:
                return '#00FF00';

            case 3:
                return '#0000FF';

            case 4:
                return '#ffd64d';

            case 5:
                return '#FF00FF';

            case 6:
                return '#00FFFF';

            case 7:
                return '#FFA500';

            case 8:
                return '#800080';

            case 9:
                return '#008000';

            case 10:
                return '#000080';

            case 11:
                return '#FFC0CB';

            case 12:
                return '#00FF7F';

            case 13:
                return '#FF1493';

            case 14:
                return '#00FF00';

            case 15:
                return '#0000FF';

            case 16:
                return '#ffd64d';
        }
    };

    const statusRowFilterTemplate = (options) => {
        return (
            <Dropdown value={options.value} options={statusIds} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear style={{ minWidth: '12rem' }} />
        );
    };

    const statusItemTemplate = (option) => {
        return <Tag value={statusDescriptions[option - 1]} style={{ background: getSeverity(option) }} />;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={statusDescriptions[rowData.status - 1]} style={{ background: getSeverity(rowData.status) }} />;
    };

    const txBodyTemplate = (rowData) => {
        return <a href={rowData.tx_link} className="text-primary" target="_blank">{rowData.tx}</a>
    }

    const metaBodyTemplate = (rowData) => {
        const meta = rowData.image;
        return (
            <img src={meta} width="50" height="50" style={{ objectFit: "cover" }} />
        );
    };

    const metaItemTemplate = (option) => {
        return (
            <img src={option} width="50" height="50" style={{ objectFit: "cover" }} />
        );
    };

    const metaRowFilterTemplate = (options) => {
        return (
            <Dropdown value={options.value} options={meta} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={metaItemTemplate} placeholder="Select One" className="p-column-filter" showClear style={{ minWidth: '12rem' }} />
        );
    };

    return (
        <div id="container">
            <div className="card">
                <DataTable value={histories} paginator rows={10} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
                    globalFilterFields={['token_id', 'time', 'tx_link', 'price']} header={header} emptyMessage="No Hisyories found." removableSort>
                    <Column field="token_id" header="#" filter sortable />

                    <Column header="Meta" filterField="image" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                        body={metaBodyTemplate} filter filterElement={metaRowFilterTemplate} />

                    <Column field="time" header="TIME" filter sortable />
                    <Column field="from" header="OPERATOR" filter sortable />
                    <Column field="price" header="PRICE" filter sortable />
                    <Column field="status" header="ACTION" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} />
                    <Column field="tx_link" header="TX" filter sortable body={txBodyTemplate} />
                </DataTable>
            </div>
        </div>
    )
});

export default Component