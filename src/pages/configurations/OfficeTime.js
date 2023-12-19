import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputMask } from 'primereact/inputmask';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';

import { ConfigurationService } from '../../services/ConfigurationService';
import { OFFICE_TIME_MODEL } from '../../constants/models';

const OfficeTime = () => {

    const modelName = OFFICE_TIME_MODEL;

    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = '~';

    let emptyOfficeTime = {
        id: null,
        start_time: '',
        end_time: '',
        description: '',
        name: ''
    };

    let defaultFilters = {
        fields: ['name', 'description', 'start_time', 'end_time'],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            'name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'start_time': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            'end_time': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            'description': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        }
    };

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [empProfiles, setOfficeTimes] = useState(null);
    const [empProfileDialog, setOfficeTimeDialog] = useState(false);
    const [deleteOfficeTimeDialog, setDeleteOfficeTimeDialog] = useState(false);
    const [deleteOfficeTimesDialog, setDeleteOfficeTimesDialog] = useState(false);
    const [office_time, setOfficeTime] = useState(emptyOfficeTime);
    const [selectedOfficeTimes, setSelectedOfficeTimes] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [createEdit, setCreateEdit] = useState(true);

    const [lazyParams, setLazyParams] = useState(defaultFilters);

    const configurationManagementService = new ConfigurationService();

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

        configurationManagementService.getAll(modelName, { params: JSON.stringify(lazyParams) }).then(data => {
            console.log(data)
            setTotalRecords(data.total);
            setOfficeTimes(data.rows);
            setLoading(false);
        });
    }

    const openNew = () => {
        setCreateEdit(true);
        setOfficeTime(emptyOfficeTime);
        setSubmitted(false);
        setOfficeTimeDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setOfficeTimeDialog(false);
    };

    const hideDeleteOfficeTimeDialog = () => {
        setDeleteOfficeTimeDialog(false);
    };

    const hideDeleteOfficeTimesDialog = () => {
        setDeleteOfficeTimesDialog(false);
    };

    const saveOfficeTime = () => {
        setSubmitted(true);

        if (office_time.name.trim()) {
            if (office_time.id) {
                configurationManagementService.update(modelName, office_time.id, office_time).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Office Time Updated', life: 3000 });
                });
            } else {
                configurationManagementService.create(modelName, office_time).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Office Time Created', life: 3000 });
                });
            }

            setOfficeTimeDialog(false);
            setOfficeTime(emptyOfficeTime);
        }
    };

    const editOfficeTime = (office_time) => {
        setCreateEdit(false);
        setOfficeTime({ ...office_time });
        setOfficeTimeDialog(true);
    };

    const confirmDeleteOfficeTime = (office_time) => {
        setOfficeTime(office_time);
        setDeleteOfficeTimeDialog(true);
    };

    const deleteOfficeTime = () => {
        configurationManagementService.delete(modelName, office_time.id).then(data => {
            console.log(data);
            loadLazyData();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Employee Profile Deleted', life: 3000 });
        });
        setDeleteOfficeTimeDialog(false);
        setOfficeTime(emptyOfficeTime);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const deleteSelectedOfficeTimes = () => {
        let _empProfiles = empProfiles.filter((val) => !selectedOfficeTimes.includes(val));
        setOfficeTimes(_empProfiles);
        setDeleteOfficeTimesDialog(false);
        setSelectedOfficeTimes(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'OfficeTimes Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _empProfile = { ...office_time };
        _empProfile[`${name}`] = val;

        setOfficeTime(_empProfile);
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
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
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

    const startTimeBodyTemplate = (rowData) => {
        return rowData.start_time;
    }

    const startTimeFilterTemplate = (options) => {
        return <InputMask value={options.value} onChange={(e) => options.filterApplyCallback(e.value, options.index)}
                    mask="99:99" placeholder="23:59"/>   
    }

    const endTimeBodyTemplate = (rowData) => {
        return rowData.end_time;
    }

    const endTimeFilterTemplate = (options) => {
        return <InputMask value={options.value} onChange={(e) => options.filterApplyCallback(e.value, options.index)}
                    mask="99:99" placeholder="23:59"/>   
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const descriptionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Description</span>
                {rowData.description}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editOfficeTime(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteOfficeTime(rowData)} />
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Manage Office Time</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    const empProfileDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveOfficeTime} />
        </>
    );
    const deleteOfficeTimeDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteOfficeTimeDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteOfficeTime} />
        </>
    );
    const deleteOfficeTimesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteOfficeTimesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedOfficeTimes} />
        </>
    );

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
                        onFilter={onFilter} filters={lazyParams.filters} filterDisplay="menu"

                        paginator totalRecords={totalRecords} onPage={onPage} first={lazyParams.first}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                        rowsPerPageOptions={[5,10,25,50]}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"

                        emptyMessage="No data found." header={renderHeader} 
                    >
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="name" header="Name" filter filterPlaceholder="Search by name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="start_time" header="Start Time" filter filterPlaceholder="Search by Start Time" 
                            sortable body={startTimeBodyTemplate} filterElement={startTimeFilterTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="end_time" header="End Time" filter filterPlaceholder="Search by End Time" 
                            sortable body={endTimeBodyTemplate} filterElement={endTimeFilterTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="description" header="Description" body={descriptionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    </DataTable>

                    <Dialog visible={empProfileDialog} style={{ width: '450px' }} header={`${createEdit?"Create":"Edit"} Office Time`} modal className="p-fluid" footer={empProfileDialogFooter} onHide={hideDialog}>                                                                                
                        {office_time.image && <img src={`${contextPath}/demo/images/office_time/${office_time.image}`} alt={office_time.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Name*</label>
                            <InputText id="name" value={office_time.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !office_time.name })} />
                            {submitted && !office_time.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="start_time">Start Time*</label>
                            <InputMask id="start_time" value={office_time.start_time} onChange={(e) => onInputChange(e, 'start_time')}
                                required autoFocus className={classNames({ 'p-invalid': submitted && !office_time.start_time })} 
                                mask="99:99" placeholder="23:59"/>        
                            {submitted && !office_time.start_time && <small className="p-invalid">Start Time is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="end_time">End Time*</label>
                            <InputMask id="end_time" value={office_time.end_time} onChange={(e) => onInputChange(e, 'end_time')}
                                required autoFocus className={classNames({ 'p-invalid': submitted && !office_time.end_time })} 
                                mask="99:99" placeholder="23:59"/>        
                            {submitted && !office_time.end_time && <small className="p-invalid">End Time is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={office_time.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteOfficeTimeDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteOfficeTimeDialogFooter} onHide={hideDeleteOfficeTimeDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {office_time && (
                                <span>
                                    Are you sure you want to delete <b>{office_time.empID}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteOfficeTimesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteOfficeTimesDialogFooter} onHide={hideDeleteOfficeTimesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {office_time && <span>Are you sure you want to delete the selected items?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default OfficeTime;