import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { TabMenu } from 'primereact/tabmenu';
import { lazyRetry } from '../../components/LazyWithRetry';

import { ProductService } from '../../../services/ProductService';

const PackageForm = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "packageProfile" */ './Form'), "packageProfile"));
const PackageView = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "packageProfileView" */ './View'), "packageProfileView"));
const PackageAddStock = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "packageAddStock" */ './AddStock'), "packageAddStock"));

const Detail = () => {
    
    let { id } = useParams();

    let navigate = useNavigate();

    const productService = new ProductService();
    const [packageData, setPackageData] = useState(null);

    const tabs = [
        { component: PackageView },
        { component: PackageAddStock },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        {label: 'View', icon: 'pi pi-fw pi-home'},
        {label: 'Add Stock', icon: 'pi pi-fw pi-home'},
    ];

    useEffect(() => {
        console.log(id)
        if(id=="new"){
            setPackageData(null);
        }else{
            productService.getById(id).then(data => {
                console.log("PACKAGE-DATA:::",data)

                setPackageData(data);
            });    
        }
    }, []);

    const gotoList = () => {
        navigate("/packages");
    };

    const renderPackageForm = () => {
        return <PackageForm />;
    };

    const renderTabPanel = () => {
        const TabPanel = tabs[activeIndex].component;
        return <TabPanel packageData={packageData}/>;
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />
                    {id!="new" && <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />}
                    <Suspense fallback={<div>Loading...</div>}>
                        {id=="new"?renderPackageForm():(packageData && renderTabPanel())}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default Detail;