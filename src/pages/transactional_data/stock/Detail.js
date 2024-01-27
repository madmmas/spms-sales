import React, { useState, Suspense } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { lazyRetry } from '../../components/LazyWithRetry';

const StockStatus = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "stockStatus" */ './StockStatus'), "stockStatus"));
const StockIn = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "stockIn" */ './StockIn'), "stockIn"));
const StockOut = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "stockOut" */ './StockOut'), "stockOut"));
const StockAdjustment = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "stockAdjustment" */ './StockAdjustment'), "stockAdjustment"));
const DamagedStock = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "damagedStock" */ './DamagedStock'), "damagedStock"));

const Detail = () => {

    const tabs = [
        { component: StockStatus },
        // { component: BrandStockStatus },
        { component: StockIn },
        { component: StockOut },
        { component: StockAdjustment },
        { component: DamagedStock },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        {label: 'Current Stock', icon: 'pi pi-fw pi-home'},
        // {label: 'Brand-Wiese Stock', icon: 'pi pi-fw pi-home'},
        {label: 'Stock In', icon: 'pi pi-fw pi-home'},
        {label: 'Stock Out', icon: 'pi pi-fw pi-home'},
        {label: 'Stock Adjustments', icon: 'pi pi-fw pi-home'},
        {label: 'Damaged Stock', icon: 'pi pi-fw pi-home'},
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