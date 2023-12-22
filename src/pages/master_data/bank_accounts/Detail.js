import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { TabMenu } from 'primereact/tabmenu';
import { lazyRetry } from '../../components/LazyWithRetry';
import { HRService } from '../../../services/HRService';
import { BANK_ACCOUNT_MODEL } from '../../../constants/models';

const BankAccountForm = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "bankAccountProfile" */ './Form'), "bankAccountProfile"));

const Detail = () => {
    
    let { id } = useParams();

    let navigate = useNavigate();

    const modelName = BANK_ACCOUNT_MODEL;

    const hrManagementService = new HRService();
    const [empData, setBankAccountData] = useState(null);

    const tabs = [
        { component: BankAccountForm },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        {label: 'Edit', icon: 'pi pi-fw pi-home'},
    ];

    useEffect(() => {
        console.log(id)
        if(id=="new"){
            setBankAccountData(null);
        }else{
            hrManagementService.getById(modelName, id).then(data => {
                setBankAccountData(data);
            });
        }
    }, []);

    const gotoList = () => {
        navigate("/bank_accounts");
    };

    const renderBankAccountForm = () => {
        return <BankAccountForm />;
    };

    const renderTabPanel = () => {
        const TabPanel = tabs[activeIndex].component;
        return <TabPanel bankAccountProfile={empData}/>;
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />
                    {id!="new" && <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />}
                    <Suspense fallback={<div>Loading...</div>}>
                        {id=="new"?renderBankAccountForm():(empData && renderTabPanel())}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default Detail;