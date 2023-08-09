import React, { useRef, useEffect, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Chip } from 'primereact/chip';
        
import PackageProductView from './components/PackageProductView';

const View = ({ packageData }) => {


    const toast = useRef(null);

    const [products, setProducts] = useState([]);

    useEffect(() => {
        console.log("PACKAGE-DATA:::",packageData);
        if(packageData){                    
            setProducts(packageData.items);
        }
    }, [packageData]);

    return (

    <div className="grid h-screen">    
    <Toast ref={toast} />    
    <div className="card col-12">
        <div className="card col-12 md:col-12">
            <div className="p-fluid formgrid grid">
                <div className="field col-12 md:col-4">
                    <div className='field'>Name:</div>
                    <Chip label={packageData.name} />
                </div>
                <div className="field col-12 md:col-4">
                    <div className='field'>Code:</div>
                    <Chip label={packageData.code} />
                </div>
                <div className="field col-12 md:col-4">
                    <div className='field'>Price:</div>
                    <Chip label={packageData.price} />
                </div>
                <div className="field col-12 md:col-4">
                    <div className='field'>Warehouse:</div>
                    <Chip label={packageData.warehouse_id} />
                </div>
                <div className="field col-12 md:col-4">
                    <div className='field'>remarks:</div>
                    <Chip label={packageData.remarks} />
                </div>
                <div className="field col-12 md:col-4">
                    <div className='field'>Status:</div>
                    <Chip label={packageData.active?"Active":"Deactive"} />
                </div>
            </div>
        </div>
        <PackageProductView products={products} />
    </div>     
    </div>
    );
}
                 
export default View;