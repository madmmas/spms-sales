import React, { useRef, useEffect, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Chip } from 'primereact/chip';
import { Button } from 'primereact/button';

import PackageProductView from './components/PackageProductView';

import { ProductService } from '../../../services/ProductService';

const AddStock = ({ packageData }) => {


    const toast = useRef(null);

    const [products, setProducts] = useState(null);
    const [packageQuantity, setPackageQuantity] = useState(0);

    const productService = new ProductService();

    const fetchData = async (products) => {
        try {
            const response = await Promise.all(
                products.map(async (product) => {
                    let resp = await productService.getById(product.dtProduct_id);
                    product.current_stock = resp.current_stock;
                    return product;
                })
            )
        //   console.log(response)
          setProducts(response);
        } catch (error) {
          return products;
        }
    }

    useEffect(() => {
        console.log("PACKAGE-DATA:::",packageData);
        if(packageData){
            fetchData(packageData.items);
        }
    }, [packageData]);

    const addToStock = () => {
        let data = {
            dtProduct_id: packageData._id,
            quantity: packageQuantity,
            items: [],
        }
        products.map((product) => {
            data.items.push({
                dtProduct_id: product.dtProduct_id,
                quantity: product.quantity * packageQuantity,
            })
        })
        // validate if package quantity is greater than 0
        if(packageQuantity > 0){
            productService.addPackageToStock(data).then((response) => {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Stock Added', life: 3000 });
                // reset package quantity
                setPackageQuantity(0);
                // reset products
                fetchData(packageData.products);
            }).catch((error) => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });
            })
        }else{
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Package quantity must be greater than 0', life: 3000 });
        }
    }

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
                    <div className='field'>Trade Price:</div>
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
        <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-4">
                <div className='field'>Package Quantity:</div>
                <input type="number" className="w-full" value={packageQuantity} onChange={(e) => setPackageQuantity(e.target.value)} />
            </div>
            </div>
            <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-2">
                <Button type="submit" label="Save" className="p-button p-button-success" 
                    onClick={() => addToStock()}
                />
            </div>
        </div>

        {products!==null && 
        <PackageProductView 
            products={products} 
            packageQuantity={packageQuantity}
            showCurrentStock={true} />}
    </div>     
    </div>
    );
}
                 
export default AddStock;