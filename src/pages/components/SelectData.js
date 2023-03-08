import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { MasterDataService } from '../../services/MasterDataService';

export default function SelectProduct({ field, modelName, className }) {

    const dt = useRef(null);

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
    const [lazyParams, setLazyParams] = useState(defaultFilters);
    const [tmpData, setTmpData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [tableDialog, setTableDialog] = useState(false);

    const masterDataService = new MasterDataService();

    let loadLazyTimeout = null;

    useEffect(() => {
        masterDataService.getById(modelName, field.value).then(data => {
            setSelectedRow(data.supplierName);
        });
    }, []);
    
    const loadLazyData = () => {
        setLoading(true);

        if (loadLazyTimeout) {
            clearTimeout(loadLazyTimeout);
        }
        
        loadLazyTimeout = setTimeout(() => {
            masterDataService.getAll(modelName, { params: JSON.stringify(lazyParams) }).then(data => {
                console.log(data)
                setTotalRecords(data.total);
                setTmpData(data.rows);
                setLoading(false);
            });
        }, Math.random() * 1000 + 250);
    }

    const hideDialog = () => {
        setTableDialog(false);
    };

    const showDialog = () => {
        setLazyParams(defaultFilters);
        loadLazyData();
        setTableDialog(true);
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

    const onSelection = (e) => {
        field.onChange(e.value._id);
        setSelectedRow(e.value.supplierName);
        setTableDialog(false);
    }

    return (
        <>
            <div className="p-inputgroup">
                <InputText disabled value={selectedRow}  className={className} />
                <InputText hidden inputId={field.name} value={field.value} inputRef={field.ref} />
                <Button icon="pi pi-search" className="p-button-warning" onClick={(e)=>{e.preventDefault(); showDialog()}} />
            </div>
            <Dialog visible={tableDialog} header="Select" modal onHide={hideDialog}>
                <DataTable
                    ref={dt} value={tmpData} dataKey="_id"
                    className="datatable-responsive" responsiveLayout="scroll"
                    lazy loading={loading} rows={lazyParams.rows}
                    onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                    onFilter={onFilter} filters={lazyParams.filters} filterDisplay="row"

                    paginator totalRecords={totalRecords} onPage={onPage} first={lazyParams.first}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                    rowsPerPageOptions={[5,10, 15]}
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"

                    selectionMode="single" selection={selectedRow}
                    onSelectionChange={(e) => {onSelection(e)}} 

                    emptyMessage="No data found."
                >
                    <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="supplierName" header="Name" filter filterPlaceholder="Search by name" sortable></Column>
                </DataTable>
            </Dialog>
        </>
    );
}