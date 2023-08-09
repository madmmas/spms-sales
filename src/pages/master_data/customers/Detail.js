import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { TabMenu } from 'primereact/tabmenu';
import { lazyRetry } from '../../components/LazyWithRetry';
import { HRService } from '../../../services/HRService';
import { CUSTOMER_MODEL } from '../../../constants/models';

const CustomerForm = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "customerProfile" */ './Form'), "customerProfile"));
const CustomerLedger = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "customerLedger" */ './Ledger'), "customerLedger"));

const Detail = () => {
    
    let { id } = useParams();

    let navigate = useNavigate();

    const modelName = CUSTOMER_MODEL;

    const hrManagementService = new HRService();
    const [customerData, setCustomerData] = useState(null);

    const tabs = [
        { component: CustomerForm },
        { component: CustomerLedger },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        {label: 'Edit', icon: 'pi pi-fw pi-home'},
        {label: 'Ledger', icon: 'pi pi-fw pi-home'},
    ];

    useEffect(() => {
        console.log(id)
        if(id=="new"){
            setCustomerData(null);
        }else{
            hrManagementService.getById(modelName, id).then(data => {
                setCustomerData(data);
            });    
        }
    }, []);

    const gotoList = () => {
        navigate("/customers");
    };

    const renderCustomerForm = () => {
        return <CustomerForm />;
    };

    const renderTabPanel = () => {
        const TabPanel = tabs[activeIndex].component;
        return <TabPanel customerProfile={customerData}/>;
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />
                    {id!="new" && <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />}
                    <Suspense fallback={<div>Loading...</div>}>
                        {id=="new"?renderCustomerForm():(customerData && renderTabPanel())}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default Detail;