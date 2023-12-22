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
import { MasterDataDBService } from '../../services/MasterDataDBService';
import { BANK_MODEL } from '../../constants/models';

const Banks = () => {

    const modelName = BANK_MODEL;

    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = '~';

    let emptyBanks = {
        id: null,
        name: '',
        description: '',
    };

    let defaultFilters = {
        fields: ['name', 'description'],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            'name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        }
    };

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [empProfiles, setBankss] = useState(null);
    const [empProfileDialog, setBanksDialog] = useState(false);
    const [deleteBanksDialog, setDeleteBanksDialog] = useState(false);
    const [deleteBankssDialog, setDeleteBankssDialog] = useState(false);
    const [banks, setBanks] = useState(emptyBanks);
    const [selectedBankss, setSelectedBankss] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [createEdit, setCreateEdit] = useState(true);

    const [lazyParams, setLazyParams] = useState(defaultFilters);

    const configurationManagementService = new ConfigurationService();
    const masterDataDBService = new MasterDataDBService();

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

        masterDataDBService.getAll(modelName, lazyParams).then(data => {
            console.log(data)
            setTotalRecords(data.total);
            setBankss(data.rows);
            setLoading(false);
        });
    }

    const reloadData = () => {
        masterDataDBService.getAllUpto(modelName).then(()=> {
            loadLazyData();
        });
    };

    const openNew = () => {
        setCreateEdit(true);
        setBanks(emptyBanks);
        setSubmitted(false);
        setBanksDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setBanksDialog(false);
    };

    const hideDeleteBanksDialog = () => {
        setDeleteBanksDialog(false);
    };

    const hideDeleteBankssDialog = () => {
        setDeleteBankssDialog(false);
    };

    const saveBanks = () => {
        setSubmitted(true);

        if (banks.name.trim()) {
            if (banks.id) {
                configurationManagementService.update(modelName, banks.id, banks).then(data => {
                    console.log(data);
                    reloadData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Banks Updated', life: 3000 });
                });
            } else {
                configurationManagementService.create(modelName, banks).then(data => {
                    console.log(data);
                    reloadData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Banks Created', life: 3000 });
                });
            }

            setBanksDialog(false);
            setBanks(emptyBanks);
        }
    };

    const editBanks = (banks) => {
        setCreateEdit(false);
        setBanks({ ...banks });
        setBanksDialog(true);
    };

    const confirmDeleteBanks = (banks) => {
        setBanks(banks);
        setDeleteBanksDialog(true);
    };

    const deleteBanks = () => {
        configurationManagementService.delete(modelName, banks.id).then(data => {
            console.log(data);
            masterDataDBService.deleteFromModelTable(modelName, banks.id).then(() => {
                reloadData();
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Bank Deleted', life: 3000 });
            });
        });
        setDeleteBanksDialog(false);
        setBanks(emptyBanks);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const deleteSelectedBankss = () => {
        let _empProfiles = empProfiles.filter((val) => !selectedBankss.includes(val));
        setBankss(_empProfiles);
        setDeleteBankssDialog(false);
        setSelectedBankss(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Bankss Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _empProfile = { ...banks };
        _empProfile[`${name}`] = val;

        setBanks(_empProfile);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editBanks(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteBanks(rowData)} />
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Manage Banks</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    const empProfileDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveBanks} />
        </>
    );
    const deleteBanksDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteBanksDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteBanks} />
        </>
    );
    const deleteBankssDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteBankssDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedBankss} />
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
                        onFilter={onFilter} filters={lazyParams.filters} filterDisplay="row"

                        paginator totalRecords={totalRecords} onPage={onPage} first={lazyParams.first}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                        rowsPerPageOptions={[5,10,25,50]}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"

                        emptyMessage="No data found." header={renderHeader} 
                    >
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="name" header="Name" filter filterPlaceholder="Search by name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="description" header="Description" body={descriptionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                    </DataTable>

                    <Dialog visible={empProfileDialog} style={{ width: '450px' }} header={`${createEdit?"Create":"Edit"} Banks`} modal className="p-fluid" footer={empProfileDialogFooter} onHide={hideDialog}>                    
                        {banks.image && <img src={`${contextPath}/demo/images/banks/${banks.image}`} alt={banks.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={banks.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !banks.name })} />
                            {submitted && !banks.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={banks.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteBanksDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteBanksDialogFooter} onHide={hideDeleteBanksDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {banks && (
                                <span>
                                    Are you sure you want to delete <b>{banks.id}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteBankssDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteBankssDialogFooter} onHide={hideDeleteBankssDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {banks && <span>Are you sure you want to delete the selected items?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Banks;