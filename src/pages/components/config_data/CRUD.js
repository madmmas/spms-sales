import React, { useEffect, useRef, useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';

import { MasterDataDBService } from '../../../services/MasterDataDBService';

const CRUD = ({ 
    modelName,
    headerTitle="Manage Data",
    emptyData = {
        id: null,
        name: '',
        description: '',
    },
    defaultFilters = {
        fields: ['name', 'description'],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            'name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        }
    }
}) => {

    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = '~';

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [profileData, setProfileData] = useState(null);
    const [empProfileDialog, setProfilesDialog] = useState(false);

    const [deleteProfilesDialog, setDeleteProfilesDialog] = useState(false);
    const [deleteProfilessDialog, setDeleteProfilessDialog] = useState(false);
    
    const [profiles, setProfiles] = useState(emptyData);
    const [selectedProfiless, setSelectedProfiless] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [createEdit, setCreateEdit] = useState(true);

    const [lazyParams, setLazyParams] = useState(defaultFilters);

    const masterDataDBService = new MasterDataDBService();

    useEffect(() => {
        initFilters();
    }, [modelName]);
    
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
            setProfileData(data.rows);
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
        setProfiles(emptyData);
        setSubmitted(false);
        setProfilesDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProfilesDialog(false);
    };

    const hideDeleteProfilesDialog = () => {
        setDeleteProfilesDialog(false);
    };

    const hideDeleteProfilessDialog = () => {
        setDeleteProfilessDialog(false);
    };

    const saveProfiles = () => {
        setSubmitted(true);

        if (profiles.name.trim()) {
            if (profiles.id) {
                masterDataDBService.update(modelName, profiles.id, profiles).then(data => {
                    console.log(data);
                    reloadData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Profiles Updated', life: 3000 });
                });
            } else {
                masterDataDBService.create(modelName, profiles).then(data => {
                    console.log(data);
                    reloadData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Profiles Created', life: 3000 });
                });
            }

            setProfilesDialog(false);
            setProfiles(emptyData);
        }
    };

    const editProfiles = (profiles) => {
        setCreateEdit(false);
        setProfiles({ ...profiles });
        setProfilesDialog(true);
    };

    const confirmDeleteProfiles = (profiles) => {
        setProfiles(profiles);
        setDeleteProfilesDialog(true);
    };

    const deleteProfiles = () => {
        masterDataDBService.delete(modelName, profiles.id).then(() => {
            reloadData();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Bank Deleted', life: 3000 });
        });
        setDeleteProfilesDialog(false);
        setProfiles(emptyData);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const deleteSelectedProfiless = () => {
        let _empProfiles = profileData.filter((val) => !selectedProfiless.includes(val));
        setProfileData(_empProfiles);
        setDeleteProfilessDialog(false);
        setSelectedProfiless(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Profiless Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _empProfile = { ...profiles };
        _empProfile[`${name}`] = val;

        setProfiles(_empProfile);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProfiles(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProfiles(rowData)} />
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">{headerTitle}</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    const empProfileDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProfiles} />
        </>
    );

    const deleteProfilesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProfilesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProfiles} />
        </>
    );

    const deleteProfilessDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProfilessDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProfiless} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt} value={profileData} dataKey="id" 
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

                    <Dialog visible={empProfileDialog} style={{ width: '450px' }} header={`${createEdit?"Create":"Edit"} Profiles`} modal className="p-fluid" footer={empProfileDialogFooter} onHide={hideDialog}>                    
                        {profiles.image && <img src={`${contextPath}/demo/images/profiles/${profiles.image}`} alt={profiles.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={profiles.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !profiles.name })} />
                            {submitted && !profiles.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={profiles.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProfilesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProfilesDialogFooter} onHide={hideDeleteProfilesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {profiles && (
                                <span>
                                    Are you sure you want to delete <b>{profiles.id}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProfilessDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProfilessDialogFooter} onHide={hideDeleteProfilessDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {profiles && <span>Are you sure you want to delete the selected items?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default CRUD;