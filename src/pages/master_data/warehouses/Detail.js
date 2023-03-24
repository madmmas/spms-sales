import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { TabMenu } from 'primereact/tabmenu';
import { lazyRetry } from '../../components/LazyWithRetry';
import { HRService } from '../../../services/HRService';
import { WAREHOUSES_MODEL } from '../../../constants/models';

const WarehouseForm = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "warehouseProfile" */ './Form'), "warehouseProfile"));

const Detail = () => {
    
    let { id } = useParams();

    let navigate = useNavigate();

    const modelName = WAREHOUSES_MODEL;

    const hrManagementService = new HRService();
    const [empData, setWarehouseData] = useState(null);

    const tabs = [
        { component: WarehouseForm },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        {label: 'Edit', icon: 'pi pi-fw pi-home'},
    ];

    useEffect(() => {
        console.log(id)
        if(id=="new"){
            setWarehouseData(null);
        }else{
            hrManagementService.getById(modelName, id).then(data => {
                setWarehouseData(data);
            });    
        }
    }, []);

    const gotoList = () => {
        navigate("/warehouses");
    };

    const renderWarehouseForm = () => {
        return <WarehouseForm />;
    };

    const renderTabPanel = () => {
        const TabPanel = tabs[activeIndex].component;
        return <TabPanel warehouseProfile={empData}/>;
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />
                    {id!="new" && <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />}
                    <Suspense fallback={<div>Loading...</div>}>
                        {id=="new"?renderWarehouseForm():(empData && renderTabPanel())}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default Detail;