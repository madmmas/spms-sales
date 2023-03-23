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
import { GROUP_MODEL } from '../../constants/models';

const Group = () => {

    const modelName = GROUP_MODEL;

    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = '~';

    let emptyGroup = {
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
    const [empProfiles, setGroups] = useState(null);
    const [empProfileDialog, setGroupDialog] = useState(false);
    const [deleteGroupDialog, setDeleteGroupDialog] = useState(false);
    const [deleteGroupsDialog, setDeleteGroupsDialog] = useState(false);
    const [group, setGroup] = useState(emptyGroup);
    const [selectedGroups, setSelectedGroups] = useState(null);
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
                setGroups(data.rows);
                setLoading(false);
            });
        }, Math.random() * 1000 + 250);
    }

    const openNew = () => {
        setCreateEdit(true);
        setGroup(emptyGroup);
        setSubmitted(false);
        setGroupDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setGroupDialog(false);
    };

    const hideDeleteGroupDialog = () => {
        setDeleteGroupDialog(false);
    };

    const hideDeleteGroupsDialog = () => {
        setDeleteGroupsDialog(false);
    };

    const saveGroup = () => {
        setSubmitted(true);

        if (group.name.trim()) {
            if (group._id) {
                configurationManagementService.update(modelName, group._id, group).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Group Updated', life: 3000 });
                });
            } else {
                configurationManagementService.create(modelName, group).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Group Created', life: 3000 });
                });
            }

            setGroupDialog(false);
            setGroup(emptyGroup);
        }
    };

    const editGroup = (group) => {
        setCreateEdit(false);
        setGroup({ ...group });
        setGroupDialog(true);
    };

    const confirmDeleteGroup = (group) => {
        setGroup(group);
        setDeleteGroupDialog(true);
    };

    const deleteGroup = () => {
        configurationManagementService.delete(modelName, group._id).then(data => {
            console.log(data);
            loadLazyData();
        });
        setDeleteGroupDialog(false);
        setGroup(emptyGroup);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const deleteSelectedGroups = () => {
        let _empProfiles = empProfiles.filter((val) => !selectedGroups.includes(val));
        setGroups(_empProfiles);
        setDeleteGroupsDialog(false);
        setSelectedGroups(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Groups Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _empProfile = { ...group };
        _empProfile[`${name}`] = val;

        setGroup(_empProfile);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editGroup(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteGroup(rowData)} />
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Manage Group</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    const empProfileDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveGroup} />
        </>
    );
    const deleteGroupDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteGroupDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteGroup} />
        </>
    );
    const deleteGroupsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteGroupsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedGroups} />
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

                    <Dialog visible={empProfileDialog} style={{ width: '450px' }} header={`${createEdit?"Create":"Edit"} Group`} modal className="p-fluid" footer={empProfileDialogFooter} onHide={hideDialog}>                    
                        {group.image && <img src={`${contextPath}/demo/images/group/${group.image}`} alt={group.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={group.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !group.name })} />
                            {submitted && !group.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={group.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteGroupDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteGroupDialogFooter} onHide={hideDeleteGroupDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {group && (
                                <span>
                                    Are you sure you want to delete <b>{group.empID}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteGroupsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteGroupsDialogFooter} onHide={hideDeleteGroupsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {group && <span>Are you sure you want to delete the selected items?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Group;