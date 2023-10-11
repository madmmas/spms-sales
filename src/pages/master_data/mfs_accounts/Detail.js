import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { TabMenu } from 'primereact/tabmenu';
import { lazyRetry } from '../../components/LazyWithRetry';
import { HRService } from '../../../services/HRService';
import { MFS_ACCOUNT_MODEL } from '../../../constants/models';

const MFSAccountForm = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "mfsAccountProfile" */ './Form'), "mfsAccountProfile"));

const Detail = () => {
    
    let { id } = useParams();

    let navigate = useNavigate();

    const modelName = MFS_ACCOUNT_MODEL;

    const hrManagementService = new HRService();
    const [empData, setMFSAccountData] = useState(null);

    const tabs = [
        { component: MFSAccountForm },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        {label: 'Edit', icon: 'pi pi-fw pi-home'},
    ];

    useEffect(() => {
        console.log(id)
        if(id=="new"){
            setMFSAccountData(null);
        }else{
            hrManagementService.getById(modelName, id).then(data => {
                setMFSAccountData(data);
            });    
        }
    }, []);

    const gotoList = () => {
        navigate("/mfs_accounts");
    };

    const renderMFSAccountForm = () => {
        return <MFSAccountForm />;
    };

    const renderTabPanel = () => {
        const TabPanel = tabs[activeIndex].component;
        return <TabPanel mfsAccountProfile={empData}/>;
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />
                    {id!="new" && <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />}
                    <Suspense fallback={<div>Loading...</div>}>
                        {id=="new"?renderMFSAccountForm():(empData && renderTabPanel())}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default Detail;