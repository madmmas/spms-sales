import React, { useState, Suspense } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { lazyRetry } from '../../components/LazyWithRetry';

const CashRegister = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "allCashRegister" */ './CashRegister'), "allCashRegister"));
const BankRegister = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "allBankRegister" */ './BankRegister'), "allBankRegister"));
const MFSRegister = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "allMFSRegister" */ './MFSRegister'), "allMFSRegister"));

const Detail = () => {

    const tabs = [
        { component: CashRegister },
        { component: BankRegister },
        { component: MFSRegister },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        {label: 'Cash Transfer', icon: 'pi pi-fw pi-home'},
        {label: 'Bank Transfer', icon: 'pi pi-fw pi-home'},
        {label: 'MFS Transfer', icon: 'pi pi-fw pi-home'},
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