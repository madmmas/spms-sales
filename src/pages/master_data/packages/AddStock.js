import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { Chip } from 'primereact/chip';
import { Button } from 'primereact/button';

import PackageProductView from './components/PackageProductView';

import { ProductService } from '../../../services/ProductService';
import { MasterDataDBService } from '../../../services/MasterDataDBService';

const AddStock = ({ packageData }) => {

    let navigate = useNavigate();

    const toast = useRef(null);

    const [products, setProducts] = useState(null);
    const [packageQuantity, setPackageQuantity] = useState(0);

    const productService = new ProductService();
    const masterDataDBService = new MasterDataDBService();

    const fetchData = async (products) => {
        try {
            const response = await Promise.all(
                products.map(async (product) => {
                    let resp = await productService.getById(product.dtProduct_id);
                    product.current_stock = resp.current_stock;
                    return product;
                })
            )
          console.log("PRODUCTS:::",response);
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
        let pgkQty = Number(packageQuantity);
        let data = {
            quantity: pgkQty,
            items: [],
        }
        products.map((product) => {
            data.items.push({
                product_id: product.dtProduct_id,
                quantity: product.quantity * pgkQty,
            })
        })
        let id = packageData.id;
        // validate if package quantity is greater than 0

        if(pgkQty > 0){
            // valid each product quantity
            console.log("DATA:::",products);
            for(let i=0; i<products.length; i++){
                console.log("ITEM::",products[i].quantity * pgkQty > products[i].current_stock);
                if((products[i].quantity * pgkQty) > products[i].current_stock){
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Product quantity must be greater than 0', life: 3000 });
                    return;
                }
            }
            productService.addPackageToStock(id, data).then((response) => {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Stock Added', life: 3000 });
                navigate("/packages");
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
                    <Chip label={masterDataDBService.getShortnameById(packageData.warehouse_type, packageData.warehouse_id)} />
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