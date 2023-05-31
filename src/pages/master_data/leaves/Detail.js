import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { TabMenu } from 'primereact/tabmenu';
import { lazyRetry } from '../../components/LazyWithRetry';
import { HRService } from '../../../services/HRService';
import { SUPPLIER_MODEL } from '../../../constants/models';

const SupplierForm = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "supplierProfile" */ './Form'), "supplierProfile"));

const Detail = () => {
    
    let { id } = useParams();

    let navigate = useNavigate();

    const modelName = SUPPLIER_MODEL;

    const hrManagementService = new HRService();
    const [empData, setSupplierData] = useState(null);

    const tabs = [
        { component: SupplierForm },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        {label: 'Edit', icon: 'pi pi-fw pi-home'},
        {label: 'Purchases', icon: 'pi pi-fw pi-home'},
        {label: 'AC Payables', icon: 'pi pi-fw pi-home'},
    ];

    useEffect(() => {
        console.log(id)
        if(id=="new"){
            setSupplierData(null);
        }else{
            hrManagementService.getById(modelName, id).then(data => {
                setSupplierData(data);
            });    
        }
    }, []);

    const gotoList = () => {
        navigate("/suppliers");
    };

    const renderSupplierForm = () => {
        return <SupplierForm />;
    };

    const renderTabPanel = () => {
        const TabPanel = tabs[activeIndex].component;
        return <TabPanel supplierProfile={empData}/>;
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />
                    {id!="new" && <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />}
                    <Suspense fallback={<div>Loading...</div>}>
                        {id=="new"?renderSupplierForm():(empData && renderTabPanel())}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default Detail;