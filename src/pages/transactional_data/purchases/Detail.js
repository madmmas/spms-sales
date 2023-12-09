import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { TabMenu } from 'primereact/tabmenu';
import { lazyRetry } from '../../components/LazyWithRetry';

import { PURCHASE_MODEL } from '../../../constants/models';

import { OrderService } from '../../../services/OrderService';

const PurchaseForm = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "purchaseProfile" */ './Form'), "purchaseProfile"));

const Detail = () => {
    
    let { id } = useParams();

    let navigate = useNavigate();

    const orderService = new OrderService();
    const [purchase, setPurchaseData] = useState({});

    const tabs = [
        { component: PurchaseForm },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        {label: 'Edit', icon: 'pi pi-fw pi-home'},
    ];

    useEffect(() => {
        console.log(id)
        if(id=="new"){
            setPurchaseData(null);
        }else{
            orderService.getById(PURCHASE_MODEL, id).then(data => {
                setPurchaseData(data);
            });    
        }
    }, []);

    const gotoList = () => {
        navigate("/purchases");
    };

    const renderPurchaseForm = () => {
        return <PurchaseForm purchase={purchase} />;
    };

    const renderTabPanel = () => {
        const TabPanel = tabs[activeIndex].component;
        return <TabPanel purchase={purchase}/>;
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />
                    {purchase && purchase.status!='draft' && <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />}
                    <Suspense fallback={<div>Loading...</div>}>
                        {purchase && purchase.status=='draft' ? renderPurchaseForm() : (purchase && renderTabPanel())}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default Detail;