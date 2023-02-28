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

import { ConfigurationService } from '../../../services/ConfigurationService';
import { DAMAGED_GOODS_MODEL } from '../../../constants/models';

const DamagedGoods = () => {

    const modelName = DAMAGED_GOODS_MODEL;

    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = '~';

    let emptyDamagedGoods = {
        _id: null,
        empID: '',
        name: ''
    };

    let defaultFilters = {
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
    const [empProfiles, setDamagedGoodss] = useState(null);
    const [empProfileDialog, setDamagedGoodsDialog] = useState(false);
    const [deleteDamagedGoodsDialog, setDeleteDamagedGoodsDialog] = useState(false);
    const [deleteDamagedGoodssDialog, setDeleteDamagedGoodssDialog] = useState(false);
    const [damagedGoods, setDamagedGoods] = useState(emptyDamagedGoods);
    const [selectedDamagedGoodss, setSelectedDamagedGoodss] = useState(null);
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
                setDamagedGoodss(data.rows);
                setLoading(false);
            });
        }, Math.random() * 1000 + 250);
    }

    const openNew = () => {
        setCreateEdit(true);
        setDamagedGoods(emptyDamagedGoods);
        setSubmitted(false);
        setDamagedGoodsDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDamagedGoodsDialog(false);
    };

    const hideDeleteDamagedGoodsDialog = () => {
        setDeleteDamagedGoodsDialog(false);
    };

    const hideDeleteDamagedGoodssDialog = () => {
        setDeleteDamagedGoodssDialog(false);
    };

    const saveDamagedGoods = () => {
        setSubmitted(true);

        if (damagedGoods.name.trim()) {
            if (damagedGoods._id) {
                configurationManagementService.update(modelName, damagedGoods._id, damagedGoods).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Damaged Goods Updated', life: 3000 });
                });
            } else {
                configurationManagementService.create(modelName, damagedGoods).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Damaged Goods Created', life: 3000 });
                });
            }

            setDamagedGoodsDialog(false);
            setDamagedGoods(emptyDamagedGoods);
        }
    };

    const editDamagedGoods = (damagedGoods) => {
        setCreateEdit(false);
        setDamagedGoods({ ...damagedGoods });
        setDamagedGoodsDialog(true);
    };

    const confirmDeleteDamagedGoods = (damagedGoods) => {
        setDamagedGoods(damagedGoods);
        setDeleteDamagedGoodsDialog(true);
    };

    const deleteDamagedGoods = () => {
        configurationManagementService.delete(modelName, damagedGoods._id).then(data => {
            console.log(data);
            loadLazyData();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Damaged Goods Deleted', life: 3000 });
        });
        setDeleteDamagedGoodsDialog(false);
        setDamagedGoods(emptyDamagedGoods);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const deleteSelectedDamagedGoodss = () => {
        let _empProfiles = empProfiles.filter((val) => !selectedDamagedGoodss.includes(val));
        setDamagedGoodss(_empProfiles);
        setDeleteDamagedGoodssDialog(false);
        setSelectedDamagedGoodss(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Damaged Goodss Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _empProfile = { ...damagedGoods };
        _empProfile[`${name}`] = val;

        setDamagedGoods(_empProfile);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editDamagedGoods(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteDamagedGoods(rowData)} />
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Manage Damaged Goods</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    const empProfileDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveDamagedGoods} />
        </>
    );
    const deleteDamagedGoodsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDamagedGoodsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteDamagedGoods} />
        </>
    );
    const deleteDamagedGoodssDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDamagedGoodssDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedDamagedGoodss} />
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

                    <Dialog visible={empProfileDialog} style={{ width: '450px' }} header={`${createEdit?"Create":"Edit"} Damaged Goods`} modal className="p-fluid" footer={empProfileDialogFooter} onHide={hideDialog}>
                        {damagedGoods.image && <img src={`${contextPath}/demo/images/damagedGoods/${damagedGoods.image}`} alt={damagedGoods.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={damagedGoods.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !damagedGoods.name })} />
                            {submitted && !damagedGoods.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={damagedGoods.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteDamagedGoodsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDamagedGoodsDialogFooter} onHide={hideDeleteDamagedGoodsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {damagedGoods && (
                                <span>
                                    Are you sure you want to delete <b>{damagedGoods.empID}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteDamagedGoodssDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDamagedGoodssDialogFooter} onHide={hideDeleteDamagedGoodssDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {damagedGoods && <span>Are you sure you want to delete the selected items?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default DamagedGoods;