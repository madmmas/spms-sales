import React, { useState, useEffect } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';

import { MasterDataDBService } from '../../../../services/MasterDataDBService';

const PackageProductDetail = ({products, totalPrice, onEdit, onDelete}) => {

    const [productDetails, setProductDetails] = useState([]);
    const masterDataDBService = new MasterDataDBService();

    useEffect(() => {
        console.log(products);
        // get products by ids
        let productIds = products.map(product => product.dtProduct_id);
        console.log("productIds::", products, productIds);
        masterDataDBService.getAllByIds("dtProduct", productIds).then(data => {
            console.log("getAllByIds::", data);
            // add brand name, model no, part number to products
            let productsWithDetails = products.map(product => {
                let productDetail = data.find(productDetail => productDetail.id == product.dtProduct_id);
                return {
                    ...product,
                    brand_name: productDetail.dtProductBrand_id_shortname,
                    model_no: productDetail.dtProductModel_id_shortname,
                    part_number: productDetail.part_number,
                };
            });

            setProductDetails(productsWithDetails);
        });
    }, [products]);

    const roundNumber = (num) => {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    };

    const footer = (
        <table  className="col-12"><tbody>
            <tr>
                <td><b>Total Amount:</b></td><td><Badge value={roundNumber(totalPrice)} size="large" severity="success"></Badge></td>
            </tr>
        </tbody></table>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => onEdit(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => onDelete(rowData)} />
            </>
        );
    };

    return (
        <DataTable value={productDetails} 
            stripedRows showGridlines scrollable scrollHeight="25rem" 
            header={footer} 
        >
            <Column body={actionBodyTemplate} frozen headerStyle={{ minWidth: '6.4rem' }} />
            <Column field="product_name" frozen header="Product Name"  headerStyle={{ minWidth: '10rem' }} />
            <Column field="code" frozen header="Product Code"  headerStyle={{ minWidth: '10rem' }} />
            <Column field="brand_name"  header="Brand Name"  headerStyle={{ minWidth: '10rem' }} />
            <Column field="model_no"  header="Model No"  headerStyle={{ minWidth: '10rem' }} />
            <Column field="part_number" header="Part Number" headerStyle={{ minWidth: '10rem' }} />
            <Column field="quantity" header="Quantity" headerStyle={{ minWidth: '10rem' }} />
            <Column field="price" header="Trade Price" headerStyle={{ minWidth: '10rem' }} />
            <Column field="totalPrice" header="total Cost" headerStyle={{ minWidth: '10rem' }} />
        </DataTable>
    );
}

export default PackageProductDetail;