import React from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

const PackageProductView = ({products, packageQuantity, showCurrentStock=false}) => {

    const rowClass = (data) => {
        return {
            'bg-red-100 text-red-900': (data.quantity * Number(packageQuantity)) > data.current_stock,
        };
    };

    return (
        <DataTable value={products} 
            rowClassName={rowClass}
            stripedRows showGridlines scrollable scrollHeight="25rem" 
        >
            <Column field="product_name" frozen header="Product Name"  headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="brand_name"  header="Brand Name"  headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="model_no"  header="Model No"  headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="part_number" header="Part Number" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="quantity" header="Quantity" headerStyle={{ minWidth: '10rem' }}></Column>
            {showCurrentStock && 
                <Column field="current_stock" header="Current Stock" headerStyle={{ minWidth: '10rem' }}></Column>
            }
        </DataTable>
    );
}

export default PackageProductView;