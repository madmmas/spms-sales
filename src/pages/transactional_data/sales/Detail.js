import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { TabMenu } from 'primereact/tabmenu';
import { lazyRetry } from '../../components/LazyWithRetry';

const SalesEditView = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "salesEditView" */ './Edit'), "salesEditView"));
const SalesInvoice = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "salesInvoice" */ './Invoice'), "salesInvoice"));

const Detail = () => {
    
    let { id } = useParams();

    let navigate = useNavigate();

    const tabs = [
        { component: SalesEditView },
        { component: SalesInvoice },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        {label: 'Edit', icon: 'pi pi-fw pi-home'},
        {label: 'Invoice', icon: 'pi pi-fw pi-home'},
        {label: 'Return', icon: 'pi pi-fw pi-home'},
    ];

    const gotoList = () => {
        navigate("/sales");
    };

    const renderSalesEditView = () => {
        return <SalesEditView />;
    };

    const renderTabPanel = () => {
        const TabPanel = tabs[activeIndex].component;
        return <TabPanel salesId={id}/>;
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />
                    {id!="new" && <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />}
                    <Suspense fallback={<div>Loading...</div>}>
                        {id=="new"?renderSalesEditView():renderTabPanel()}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default Detail;