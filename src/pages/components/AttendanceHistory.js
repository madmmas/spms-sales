import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';

import { HRService } from '../../services/HRService';

const Attendance = ({empProfile}) => {

    const modelName = 'emp_attendance';

    const toast = useRef(null);
    const dt = useRef(null);

    let defaultFilters = {
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            'empId': { operator: FilterOperator.AND, constraints: [{ value: empProfile.empId, matchMode: FilterMatchMode.EQUALS }] },
        }
    };

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [empProfiles, setAttendances] = useState(null);

    const [lazyParams, setLazyParams] = useState(defaultFilters);

    const hrManagementService = new HRService();

    useEffect(() => {
        initFilters();
    }, []);
    
    const clearFilter = () => {
        initFilters();
    }

    const initFilters = () => {
        setLazyParams(defaultFilters);
    }

    useEffect(() => {
        loadLazyData();
    }, [lazyParams]);

    const loadLazyData = () => {
        setLoading(true);

        hrManagementService.getAll(modelName, { params: JSON.stringify(lazyParams) }).then(data => {
            console.log(data)
            setTotalRecords(data.total);
            setAttendances(data.rows);
            setLoading(false);
        });
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const onPage = (event) => {
        let _lazyParams = { ...lazyParams, ...event };
        setLazyParams(_lazyParams);
    }

    const onSort = (event) => {
        let _lazyParams = { ...lazyParams, ...event };
        setLazyParams(_lazyParams);
    }

    const onFilter = (event) => {
        let _lazyParams = { ...lazyParams, ...event };
        _lazyParams['first'] = 0;
        setLazyParams(_lazyParams);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="flex justify-content-between">
                    {/* <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} /> */}
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const punchIdBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Punch Id</span>
                {rowData.punchId}
            </>
        );
    };

    const dateBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Date</span>
                {rowData.date}
            </>
        );
    };

    const time_inBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">time_in</span>
                {rowData.time_in}
            </>
        );
    };

    const time_outBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">time_out</span>
                {rowData.time_out}
            </>
        );
    };

    const worktimeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">worktime</span>
                {rowData.worktime}
            </>
        );
    };

    const overtimeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">overtime</span>
                {rowData.overtime}
            </>
        );
    };

    const skeyBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">skey</span>
                {rowData.skey}
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Employee Attendance</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt} value={empProfiles} dataKey="id" 
                        className="datatable-responsive" responsiveLayout="scroll"
                        lazy loading={loading} rows={lazyParams.rows}
                        onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                        onFilter={onFilter} filters={lazyParams.filters} filterDisplay="row"

                        paginator totalRecords={totalRecords} onPage={onPage} first={lazyParams.first}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                        rowsPerPageOptions={[5,10,25,50]}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"

                        emptyMessage="No data found." header={renderHeader} 
                    >
                        <Column field="punchId" header="PunchId" filter filterPlaceholder="Search by punchId" sortable body={punchIdBodyTemplate} ></Column>
                        <Column field="date" header="Date" filter filterPlaceholder="Search by date" sortable body={dateBodyTemplate} ></Column>
                        <Column field="time_in" header="Time-In" filter filterPlaceholder="Search by time_in" sortable body={time_inBodyTemplate} ></Column>
                        <Column field="time_out" header="Time-Out" filter filterPlaceholder="Search by time_out" sortable body={time_outBodyTemplate} ></Column>
                        <Column field="worktime" header="Worktime" filter filterPlaceholder="Search by worktime" sortable body={worktimeBodyTemplate} ></Column>
                        <Column field="overtime" header="Overtime" filter filterPlaceholder="Search by overtime" sortable body={overtimeBodyTemplate} ></Column>
                        <Column field="skey" header="Skey" filter filterPlaceholder="Search by skey" sortable body={skeyBodyTemplate} ></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default Attendance;