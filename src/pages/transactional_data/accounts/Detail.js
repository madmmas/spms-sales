import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { TabMenu } from 'primereact/tabmenu';
import { lazyRetry } from '../../components/LazyWithRetry';

const ACRecievable = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "acRecievable" */ './ACRecievable'), "acRecievable"));
const ACPayable = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "acPayable" */ './ACPayable'), "acPayable"));
const Payment = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "payment" */ './Payment'), "payment"));

const Detail = () => {

    const tabs = [
        { component: ACRecievable },
        { component: ACPayable },
        { component: Payment },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        {label: 'AC Recievable', icon: 'pi pi-fw pi-home'},
        {label: 'AC Payable', icon: 'pi pi-fw pi-home'},
        {label: 'Customer Payment', icon: 'pi pi-fw pi-home'},
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