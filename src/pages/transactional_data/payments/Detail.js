import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { TabMenu } from 'primereact/tabmenu';
import { lazyRetry } from '../../components/LazyWithRetry';

const PaymentRegister = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "paymentRegister" */ './PaymentRegister'), "paymentRegister"));

const Detail = () => {

    const tabs = [
        { component: PaymentRegister },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        {label: 'Payment Register', icon: 'pi pi-fw pi-home'},
        {label: 'Payment Received', icon: 'pi pi-fw pi-home'},
        {label: 'Payment Dispatched', icon: 'pi pi-fw pi-home'},
    ];

    const renderTabPanel = () => {
        const TabPanel = tabs[activeIndex].component;
        return <TabPanel />;
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                    <Suspense fallback={<div>Loading...</div>}>
                        {renderTabPanel()}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default Detail;