import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { TabMenu } from 'primereact/tabmenu';
import { lazyRetry } from '../../components/LazyWithRetry';
import { HRService } from '../../../services/HRService';
import { SALE_MODEL } from '../../../constants/models';

const SaleForm = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "saleProfile" */ './Form'), "saleProfile"));

const Detail = () => {
    
    let { id } = useParams();

    let navigate = useNavigate();

    const modelName = SALE_MODEL;

    const hrManagementService = new HRService();
    const [empData, setSaleData] = useState(null);

    const tabs = [
        { component: SaleForm },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        {label: 'Edit', icon: 'pi pi-fw pi-home'},
    ];

    useEffect(() => {
        console.log(id)
        if(id=="new"){
            setSaleData(null);
        }else{
            hrManagementService.getById(modelName, id).then(data => {
                setSaleData(data);
            });    
        }
    }, []);

    const gotoList = () => {
        navigate("/sales", { replace: true });
    };

    const renderSaleForm = () => {
        return <SaleForm />;
    };

    const renderTabPanel = () => {
        const TabPanel = tabs[activeIndex].component;
        return <TabPanel saleProfile={empData}/>;
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />
                    {id!="new" && <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />}
                    <Suspense fallback={<div>Loading...</div>}>
                        {id=="new"?renderSaleForm():(empData && renderTabPanel())}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default Detail;