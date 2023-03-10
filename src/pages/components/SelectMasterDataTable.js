import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { MasterDataService } from '../../services/MasterDataService';

export default function SelectMasterDataTable({ trigger, fieldValue, onSelect, modelName, columns, caption="Select"}) {

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
    const [selectedRow, setSelectedRow] = useState({});
    const [tableDialog, setTableDialog] = useState(false);

    const masterDataService = new MasterDataService();

    let loadLazyTimeout = null;
    
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

    useEffect(() => {
        if (trigger) {
            showDialog();
        }
    }, [trigger]);

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
        setTableDialog(false);
        onSelect(e)
    }

    const isSelectable = (data) => data._id !== fieldValue;

    const isRowSelectable = (event) => (event.data ? isSelectable(event.data) : true);

    const rowClassName = (data) => (isSelectable(data) ? '' : 'p-disabled');

    return (
        <>
            <Button icon="pi pi-search" className="p-button-warning" onClick={(e)=>{e.preventDefault(); showDialog()}} />
            <Dialog visible={tableDialog} header={caption} modal 
            style={{ width: '75vw' }} maximizable contentStyle={{ height: '300px' }}
            onHide={hideDialog}>
                <DataTable
                    ref={dt} value={tmpData} dataKey="_id"
                    className="datatable-responsive" responsiveLayout="scroll"
                    lazy loading={loading} rows={lazyParams.rows}
                    onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                    onFilter={onFilter} filters={lazyParams.filters} filterDisplay="row"
                    isDataSelectable={isRowSelectable} rowClassName={rowClassName}
                    scrollable scrollHeight="flex" tableStyle={{ minWidth: '50rem' }}
                    paginator totalRecords={totalRecords} onPage={onPage} first={lazyParams.first}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                    rowsPerPageOptions={[5,10, 15]}
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"

                    selectionMode="single" selection={selectedRow}
                    onSelectionChange={(e) => {onSelection(e)}} 

                    emptyMessage="No data found."
                >
                    <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                    {columns.map((col, index) => {
                        return (
                            <Column key={index} field={col.field} header={col.header} filter filterPlaceholder={col.filterPlaceholder} sortable></Column>
                        )
                    })}
                </DataTable>
            </Dialog>
        </>
    );
}