import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { TabMenu } from 'primereact/tabmenu';
import { lazyRetry } from '../../components/LazyWithRetry';

import { SALES_MODEL } from '../../../constants/models';
import { OrderService } from '../../../services/OrderService';
import { MasterDataDBService } from '../../../services/MasterDataDBService';

const SalesForm = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "salesForm" */ './Form'), "salesForm"));

const Detail = () => {

    let { id } = useParams();
    let navigate = useNavigate();
    
    const orderService = new OrderService();
    const masterDataDBService = new MasterDataDBService();
    const [sales, setSales] = useState(null);

    const tabs = [
        { component: SalesForm },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        {label: 'Edit', icon: 'pi pi-fw pi-home'},
    ];

    useEffect(() => {
        console.log(id)
        if(id=="new"){
            setSales(null);
        }else{
            orderService.getById(SALES_MODEL, id).then(async (data) => {
                // console.log("SALES-DETAIL:::",data);
                // populate sales items
                for(let i=0; i<data.items.length; i++){
                    let product = await masterDataDBService.getById('dtProduct', data.items[i].product_id);
                    // console.log("PRODUCT:::",product);
                    data.items[i].code = product.code;
                    data.items[i].part_number = product.part_number;
                    data.items[i].brand_name = masterDataDBService.getShortnameById('dtProductBrand', product.dtProductBrand_id);
                    data.items[i].model_no = masterDataDBService.getShortnameById('dtProductModel', product.dtProductModel_id);
                }
                setSales(data);
            });    
        }
    }, []);

    const gotoList = () => {
        navigate("/sales");
    };

    const renderSalesForm = () => {
        return <SalesForm sales={sales} />;
    };

    const renderTabPanel = () => {
        const TabPanel = tabs[activeIndex].component;
        return <TabPanel sales={sales}/>;
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />
                    {sales && sales.status!='draft' && <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />}
                    <Suspense fallback={<div>Loading...</div>}>
                        {sales && sales.status=='draft' ? renderSalesForm() : (sales && renderTabPanel())}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default Detail;