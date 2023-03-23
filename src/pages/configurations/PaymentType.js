import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';

import { ConfigurationService } from '../../services/ConfigurationService';
import { PAYMENT_TYPE_MODEL } from '../../constants/models';

const PaymentType = () => {

    const modelName = PAYMENT_TYPE_MODEL;

    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = '~';

    let emptyPaymentType = {
        _id: null,
        description: '',
        name: ''
    };

    let defaultFilters = {
        fields: ['name', 'description'],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            'name': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        }
    };

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [empProfiles, setPaymentTypes] = useState(null);
    const [empProfileDialog, setPaymentTypeDialog] = useState(false);
    const [deletePaymentTypeDialog, setDeletePaymentTypeDialog] = useState(false);
    const [deletePaymentTypesDialog, setDeletePaymentTypesDialog] = useState(false);
    const [paymentType, setPaymentType] = useState(emptyPaymentType);
    const [selectedPaymentTypes, setSelectedPaymentTypes] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [createEdit, setCreateEdit] = useState(true);

    const [lazyParams, setLazyParams] = useState(defaultFilters);

    const configurationManagementService = new ConfigurationService();

    let loadLazyTimeout = null;

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

        if (loadLazyTimeout) {
            clearTimeout(loadLazyTimeout);
        }

        loadLazyTimeout = setTimeout(() => {
            configurationManagementService.getAll(modelName, { params: JSON.stringify(lazyParams) }).then(data => {
                console.log(data)
                setTotalRecords(data.total);
                setPaymentTypes(data.rows);
                setLoading(false);
            });
        }, Math.random() * 1000 + 250);
    }

    const openNew = () => {
        setCreateEdit(true);
        setPaymentType(emptyPaymentType);
        setSubmitted(false);
        setPaymentTypeDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPaymentTypeDialog(false);
    };

    const hideDeletePaymentTypeDialog = () => {
        setDeletePaymentTypeDialog(false);
    };

    const hideDeletePaymentTypesDialog = () => {
        setDeletePaymentTypesDialog(false);
    };

    const savePaymentType = () => {
        setSubmitted(true);

        if (paymentType.name.trim()) {
            if (paymentType._id) {
                configurationManagementService.update(modelName, paymentType._id, paymentType).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Payment Type Updated', life: 3000 });
                });
            } else {
                configurationManagementService.create(modelName, paymentType).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Payment Type Created', life: 3000 });
                });
            }

            setPaymentTypeDialog(false);
            setPaymentType(emptyPaymentType);
        }
    };

    const editPaymentType = (paymentType) => {
        setCreateEdit(false);
        setPaymentType({ ...paymentType });
        setPaymentTypeDialog(true);
    };

    const confirmDeletePaymentType = (paymentType) => {
        setPaymentType(paymentType);
        setDeletePaymentTypeDialog(true);
    };

    const deletePaymentType = () => {
        configurationManagementService.delete(modelName, paymentType._id).then(data => {
            console.log(data);
            loadLazyData();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Payment Type Deleted', life: 3000 });
        });
        setDeletePaymentTypeDialog(false);
        setPaymentType(emptyPaymentType);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const deleteSelectedPaymentTypes = () => {
        let _empProfiles = empProfiles.filter((val) => !selectedPaymentTypes.includes(val));
        setPaymentTypes(_empProfiles);
        setDeletePaymentTypesDialog(false);
        setSelectedPaymentTypes(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'PaymentTypes Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _empProfile = { ...paymentType };
        _empProfile[`${name}`] = val;

        setPaymentType(_empProfile);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editPaymentType(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeletePaymentType(rowData)} />
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Manage Payment Type</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    const empProfileDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={savePaymentType} />
        </>
    );
    const deletePaymentTypeDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePaymentTypeDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deletePaymentType} />
        </>
    );
    const deletePaymentTypesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePaymentTypesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedPaymentTypes} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt} value={empProfiles} dataKey="_id" 
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
                        <Column field="name" header="Name" filter filterPlaceholder="Search by name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="description" header="Description" body={descriptionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={empProfileDialog} style={{ width: '450px' }} header={`${createEdit?"Create":"Edit"} Payment Type`} modal className="p-fluid" footer={empProfileDialogFooter} onHide={hideDialog}>
                        {paymentType.image && <img src={`${contextPath}/demo/images/paymentType/${paymentType.image}`} alt={paymentType.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={paymentType.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !paymentType.name })} />
                            {submitted && !paymentType.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={paymentType.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>
                    </Dialog>

                    <Dialog visible={deletePaymentTypeDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePaymentTypeDialogFooter} onHide={hideDeletePaymentTypeDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {paymentType && (
                                <span>
                                    Are you sure you want to delete <b>{paymentType.empID}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePaymentTypesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePaymentTypesDialogFooter} onHide={hideDeletePaymentTypesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {paymentType && <span>Are you sure you want to delete the selected items?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default PaymentType;