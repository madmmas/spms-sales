import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { TabMenu } from 'primereact/tabmenu';
import { lazyRetry } from '../../components/LazyWithRetry';
import { HRService } from '../../../services/HRService';
import { PURCHASE_PACKAGES_MODEL } from '../../../constants/models';

const PuchasePackageForm = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "puchasePackageProfile" */ './Form'), "puchasePackageProfile"));

const Detail = () => {
    
    let { id } = useParams();

    let navigate = useNavigate();

    const modelName = PURCHASE_PACKAGES_MODEL;

    const hrManagementService = new HRService();
    const [empData, setPuchasePackageData] = useState(null);

    const tabs = [
        { component: PuchasePackageForm },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        {label: 'Edit', icon: 'pi pi-fw pi-home'},
    ];

    useEffect(() => {
        console.log(id)
        if(id=="new"){
            setPuchasePackageData(null);
        }else{
            hrManagementService.getById(modelName, id).then(data => {
                setPuchasePackageData(data);
            });    
        }
    }, []);

    const gotoList = () => {
        navigate("/purchase_packages");
    };

    const renderPuchasePackageForm = () => {
        return <PuchasePackageForm />;
    };

    const renderTabPanel = () => {
        const TabPanel = tabs[activeIndex].component;
        return <TabPanel puchasePackageProfile={empData}/>;
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />
                    {id!="new" && <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />}
                    <Suspense fallback={<div>Loading...</div>}>
                        {id=="new"?renderPuchasePackageForm():(empData && renderTabPanel())}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default Detail;