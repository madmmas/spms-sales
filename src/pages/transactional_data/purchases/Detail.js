import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { TabMenu } from 'primereact/tabmenu';
import { lazyRetry } from '../../components/LazyWithRetry';
import { HRService } from '../../../services/HRService';
import { PURCHASE_MODEL } from '../../../constants/models';

const PurchaseForm = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "purchaseProfile" */ './Form'), "purchaseProfile"));

const Detail = () => {
    
    let { id } = useParams();

    let navigate = useNavigate();

    const modelName = PURCHASE_MODEL;

    const hrManagementService = new HRService();
    const [empData, setPurchaseData] = useState(null);

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
            hrManagementService.getById(modelName, id).then(data => {
                setPurchaseData(data);
            });    
        }
    }, []);

    const gotoList = () => {
        navigate("/purchases");
    };

    const renderPurchaseForm = () => {
        return <PurchaseForm />;
    };

    const renderTabPanel = () => {
        const TabPanel = tabs[activeIndex].component;
        return <TabPanel purchaseProfile={empData}/>;
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />
                    {id!="new" && <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />}
                    <Suspense fallback={<div>Loading...</div>}>
                        {id=="new"?renderPurchaseForm():(empData && renderTabPanel())}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default Detail;