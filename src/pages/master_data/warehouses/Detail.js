import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { TabMenu } from 'primereact/tabmenu';

import { MasterDataDBService } from '../../../services/MasterDataDBService';

import { WAREHOUSE_MODEL } from '../../../constants/models';

import WarehouseForm from './Form';

const Detail = () => {
    
    let { id } = useParams();

    let navigate = useNavigate();

    const modelName = WAREHOUSE_MODEL;

    const masterDataDBService = new MasterDataDBService();
    
    const tabs = [
        { component: WarehouseForm },
    ];
    
    const [activeIndex, setActiveIndex] = useState(0);
    const [detailData, setDetailData] = useState(null);

    const items = [
        {label: 'Edit', icon: 'pi pi-fw pi-home'},
    ];

    useEffect(() => {
        if(id=="new"){
            setDetailData(null);
        }else {
            masterDataDBService.getById(modelName, id).then(data => {
                setDetailData(data);
            });
        }
    }, [id]);

    const gotoList = () => {
        navigate("/warehouses");
    };

    const renderWarehouseForm = () => {
        return <WarehouseForm />;
    };

    const renderTabPanel = () => {
        const TabPanel = tabs[activeIndex].component;
        return <TabPanel warehouseProfile={detailData}/>;
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />
                    {id!="new" && <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />}
                    <Suspense fallback={<div>Loading...</div>}>
                        {id=="new"?renderWarehouseForm():(detailData && renderTabPanel())}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default Detail;