import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { TabMenu } from 'primereact/tabmenu';
import { lazyRetry } from '../../components/LazyWithRetry';

import { PRODUCT_MODEL } from '../../../constants/models';

import { ProductService } from '../../../services/ProductService';

const ProductForm = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "productForm" */ './Form'), "productForm"));

const Detail = () => {
    
    let { id } = useParams();

        // name, dtProductCategory_id, code, barCode, brandName, partNumber, unitOfMeasurement, 
    // lowStockQty, reorderQty, lastPurchasePrice, status, remarks
    let emptyProductData = {
        name: "",
        dtProductCategory_id: "",
        code: "",
        barCode: "",
        brandName: "",
        partNumber: "",
        unitOfMeasurement: "",
        lowStockQty: 0,
        reorderQty: 0,
        lastPurchasePrice: 0.00,
        status: true,
        remarks: "",
    };

    let navigate = useNavigate();

    const modelName = PRODUCT_MODEL;

    const productService = new ProductService();
    const [productData, setProductData] = useState(null);

    const tabs = [
        { component: ProductForm },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        {label: 'Edit', icon: 'pi pi-fw pi-home'},
        // {label: 'Suppliers', icon: 'pi pi-fw pi-home'},
        // {label: 'Purchase History', icon: 'pi pi-fw pi-home'},
        // {label: 'Sales History', icon: 'pi pi-fw pi-home'},
    ];

    useEffect(() => {
        console.log(id)
        if(id=="new"){
            setProductData(null);
        }else{
            productService.getById(id).then(data => {
                setProductData(data);
            });    
        }
    }, []);

    const gotoList = () => {
        navigate("/products");
    };

    const renderProductForm = () => {
        return <ProductForm />;
    };

    const renderTabPanel = () => {
        const TabPanel = tabs[activeIndex].component;
        return <TabPanel productData={productData}/>;
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />
                    {id!="new" && <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />}
                    <Suspense fallback={<div>Loading...</div>}>
                        {id=="new"?renderProductForm():(productData && renderTabPanel())}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default Detail;