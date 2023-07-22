
import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Card } from 'primereact/card';
import { useFormik } from 'formik';
import { classNames } from 'primereact/utils';
import { useGlobalService } from "../../GlobalServiceContext";

import Cookies from "js-cookie";
import MarketJson from "../../Marketplace.json"
import Web3 from "web3";
import config from './../global/constant';
import axios from "axios";

const Component = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        init() {
            loadBlockchainData()
        }
    }));

    const instance = axios.create({
        baseURL: config.backend_url,
        headers: { 'Authorization': `Bearer ${Cookies.get('_csrf')}` }
    });
    const { notify, history } = useGlobalService();

    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);

    const [account, setAccount] = useState('');
    const [marketContract, setMarketContract] = useState(null);

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadBlockchainData();
    }, []);

    async function loadBlockchainData() {
        setAccount(window.ethereum.selectedAddress);
        const web3 = new Web3(Web3.givenProvider);
        const t0 = new web3.eth.Contract(MarketJson.market_abi, MarketJson.market_address);
        setMarketContract(t0);
    }

    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
        formik.setFieldValue('file', e.files[0]);
    };

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, cancelButton } = options;
        const value = totalSize / 100000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 10 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag & drop your file.
                </span>
            </div>
        );
    };

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    const addTokenBaseUri = (data) => {

        const formData = new FormData();
        formData.append("file", data.file);
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("link", data.link);
        formData.append("quantity", data.quantity);
        formData.append("assets_url", config.assets_url);

        instance.post("admin/mint", formData).then((response) => {
            mintBlockChain(response.data.id);
        });

        const mintBlockChain = async (id) => {
            try {
                setLoading(true)
                let base_uri = config.backend_url + "get/nft/" + id;
                let from = await marketContract.methods.getCurrentId().call();
                let tx = await marketContract.methods.mintNFT(base_uri, data.quantity).send({ from: account });
                let to = await marketContract.methods.getCurrentId().call();
                let count = to - from;

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
                setLoading(false)
            } catch (error) {
                setLoading(false)
                notify(error.message, 'error')
            }
        }
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            link: '',
            quantity: 1,
            file: null
        },
        validate: (data) => {
            let errors = {};

            if (!data.name) {
                errors.name = 'Name is required.';
            }

            if (!data.link) {
                errors.link = 'Link is required.';
            }

            if (!data.description) {
                errors.description = 'Description is required.';
            }

            if (data.quantity < 0) {
                errors.quantity = 'Positive is required.';
            }

            if (!data.file) {
                errors.file = 'File is required.';
            }

            return errors;
        },
        onSubmit: (data) => {
            data && addTokenBaseUri(data);
            formik.resetForm();
        }
    });

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };

    return (
        <div id='container'>
            <form onSubmit={formik.handleSubmit} className="flex flex-column gap-2 createForm">
                <Card title="File Upload">
                    <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
                    <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

                    <FileUpload ref={fileUploadRef} accept="*" maxFileSize={10000000}
                        onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                        headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                        chooseOptions={chooseOptions} cancelOptions={cancelOptions}

                        id="file"
                        name="file"
                        value={formik.values.file}
                        className={classNames({ 'p-invalid': isFormFieldInvalid('file') })}
                    />
                    {getFormErrorMessage('file')}
                </Card>

                <Card title="Item Detail" className='mt-5'>
                    <div className="card">
                        <div className="flex flex-wrap gap-3 mb-4">
                            <div className="flex-auto">
                                <div>
                                    <label htmlFor="name" className="font-bold block mb-2">
                                        Product Name :
                                    </label>
                                    <InputText
                                        id="name"
                                        name="name"
                                        value={formik.values.name}
                                        onChange={(e) => {
                                            formik.setFieldValue('name', e.target.value);
                                        }}
                                        className={classNames({ 'p-invalid': isFormFieldInvalid('name') })}
                                    />
                                    {getFormErrorMessage('name')}
                                </div>

                                <div className='mt-4'>
                                    <label htmlFor="link" className="font-bold block mb-2">
                                        External Link :
                                    </label>
                                    <InputText
                                        id="link"
                                        name="link"
                                        value={formik.values.link}
                                        onChange={(e) => {
                                            formik.setFieldValue('link', e.target.value);
                                        }}
                                        className={classNames({ 'p-invalid': isFormFieldInvalid('link') })}
                                    />
                                    {getFormErrorMessage('link')}
                                </div>

                                <div className='mt-4'>
                                    <label htmlFor="quantity" className="font-bold block mb-2">
                                        Quantity :
                                    </label>
                                    <InputNumber
                                        showButtons
                                        id="quantity"
                                        name="quantity"
                                        value={formik.values.quantity}
                                        onChange={(e) => {
                                            formik.setFieldValue('quantity', e.value);
                                        }}
                                        className={classNames({ 'p-invalid': isFormFieldInvalid('quantity') })}
                                        style={{ width: '100%' }}
                                    />
                                    {getFormErrorMessage('quantity')}
                                </div>
                            </div>
                            <div className="flex-auto">
                                <label htmlFor="description" className="font-bold block mb-2">
                                    Description :
                                </label>
                                <InputTextarea
                                    id="description"
                                    name="description"
                                    value={formik.values.description}
                                    onChange={(e) => {
                                        formik.setFieldValue('description', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': isFormFieldInvalid('description') })}
                                    style={{ height: '85%', width: '100%' }}
                                />
                                {getFormErrorMessage('description')}
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-content-center my-3 pt-3'>
                        <Button label="CREATE" type="submit" loading={loading} className='gradientBtn02' icon="pi pi-check" />
                    </div>
                </Card>
            </form>
        </div>
    )
});

export default Component