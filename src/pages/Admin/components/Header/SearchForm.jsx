
import { InputText } from 'primereact/inputtext';

export default function SearchForm(props) {

    const onSearchProcess = (e) => {
        var keyword = e.target.value;
        var result = props.products.filter(
            c => c.name.toString().toLowerCase().indexOf(keyword.toLowerCase()) > -1 ||
                c.description.toString().toLowerCase().indexOf(keyword.toLowerCase()) > -1 ||
                c.link.toString().toLowerCase().indexOf(keyword.toLowerCase()) > -1 ||
                c.owner.toString().toLowerCase().indexOf(keyword.toLowerCase()) > -1 ||
                c.price.toString().toLowerCase().indexOf(keyword.toLowerCase()) > -1 ||
                c.id.toString().toLowerCase().indexOf(keyword.toLowerCase()) > -1
        )

        props.searchProcess(result);
    };

    return (
        <div className="card flex justify-content-start mb-5">
            <div className="p-inputgroup w-full md:w-30rem">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-search"></i>
                </span>
                <InputText placeholder="Search item, collections, and accounts" onChange={onSearchProcess} />
            </div>
        </div>
    )
}