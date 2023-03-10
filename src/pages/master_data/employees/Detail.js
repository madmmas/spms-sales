import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { TabMenu } from 'primereact/tabmenu';
import { lazyRetry } from '../../components/LazyWithRetry';
import { HRService } from '../../../services/HRService';
import { EMPLOYEE_MODEL } from '../../../constants/models';

const EmpForm = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "empProfile" */ './Form'), "empProfile"));
// const EmpAttendance = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "empAttendance" */ '../components/AttendanceHistory'), "empAttendance"));

const Detail = () => {
    
    let { id } = useParams();

    let navigate = useNavigate();

    const modelName = EMPLOYEE_MODEL;

    const hrManagementService = new HRService();
    const [empData, setEmpData] = useState(null);

    const tabs = [
        { component: EmpForm },
        // { component: EmpAttendance },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        {label: 'Edit', icon: 'pi pi-fw pi-home'},
        // {label: 'Attendance', icon: 'pi pi-fw pi-calendar'},
    ];

    useEffect(() => {
        console.log(id)
        if(id=="new"){
            setEmpData(null);
        }else{
            hrManagementService.getById(modelName, id).then(data => {
                setEmpData(data);
            });    
        }
    }, []);

    const gotoList = () => {
        navigate("/employees");
    };

    const renderEmpForm = () => {
        return <EmpForm />;
    };

    const renderTabPanel = () => {
        const TabPanel = tabs[activeIndex].component;
        return <TabPanel empProfile={empData}/>;
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />
                    {id!="new" && <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />}
                    <Suspense fallback={<div>Loading...</div>}>
                        {id=="new"?renderEmpForm():(empData && renderTabPanel())}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default Detail;