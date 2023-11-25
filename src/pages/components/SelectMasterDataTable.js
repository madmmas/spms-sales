import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MasterDataService } from '../../services/MasterDataService';
import { set } from 'react-hook-form';

export default function SelectMasterDataTable({ 
    trigger, fieldValue, onSelect, modelName, 
    columns, defaultFilters,
    showFields=[], caption="Select", 
    dialogHeight='70vh', dialogWidth='80vw'
}) {

    const dt = useRef(null);

    // let defaultFilters = {
    //     fields: showFields,
    //     first: 0,
    //     rows: 10,
    //     page: 1,
    //     sortField: null,
    //     sortOrder: null,
    //     filters: {
    //         global: { value: null, matchMode: FilterMatchMode.CONTAINS }            
    //     }
    // };

    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyParams, setLazyParams] = useState({});
    const [tmpData, setTmpData] = useState([]);
    const [selectedRow, setSelectedRow] = useState({});
    const [tableDialog, setTableDialog] = useState(false);

    const masterDataService = new MasterDataService();
    
    const loadLazyData = () => {
        setLoading(true);

        if(lazyParams!==null && lazyParams!==undefined){
            masterDataService.getAll(modelName, { params: JSON.stringify(lazyParams) }).then(data => {
                console.log(data)
                setTotalRecords(data.total);
                setTmpData(data.rows);
                setLoading(false);
            });    
        }
    }

    const hideDialog = () => {
        setTableDialog(false);
    };

    useEffect(() => {
        initFilters();
    }, []);

    useEffect(() => {
        loadLazyData();
    }, [lazyParams]);

    useEffect(() => {
        setLazyParams(defaultFilters);
    }, [defaultFilters]);

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

    const initFilters = () => {
        setLazyParams(defaultFilters);
        setGlobalFilterValue('');
    };

    const clearFilter = () => {
        initFilters();
    };

    const onPage = (event) => {
        if(lazyParams!==null && lazyParams!==undefined){
            let _lazyParams = { ...lazyParams, ...event };
            setLazyParams(_lazyParams);
        }
    }

    const onSort = (event) => {
        if(lazyParams!==null && lazyParams!==undefined){
            let _lazyParams = { ...lazyParams, ...event };
            setLazyParams(_lazyParams);
        }
    }

    const onFilter = (event) => {
        if(lazyParams!==null && lazyParams!==undefined){
            let _lazyParams = { ...lazyParams, ...event };
            _lazyParams['first'] = 0;
            setLazyParams(_lazyParams);
        }
    }

    const onGlobalFilterChange = (e) => {
        if(lazyParams!==null && lazyParams!==undefined){
            return
        }
        let _lazyParams = { ...lazyParams };
        console.log(_lazyParams);

        const value = e.target.value;
        
        setGlobalFilterValue(value);

        if(value === null || value === undefined) {
            return;
        }

        _lazyParams['filters']['global'].value = value;
        _lazyParams['first'] = 0;
        setLazyParams(_lazyParams);
    };

    const onSelection = (e) => {
        setTableDialog(false);
        onSelect(e)
    }

    const isSelectable = (data) => data._id !== fieldValue;

    const isRowSelectable = (event) => (event.data ? isSelectable(event.data) : true);

    const rowClassName = (data) => (isSelectable(data) ? '' : 'p-disabled');

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <>
            <Button icon="pi pi-search" className="p-button-warning" onClick={(e)=>{e.preventDefault(); showDialog()}} />
            <Dialog visible={tableDialog} header={header} modal 
            style={{ width: dialogWidth }} maximizable contentStyle={{ height: dialogHeight }}
            onHide={hideDialog}>
                <DataTable
                    ref={dt} value={tmpData} dataKey="_id"
                    className="datatable-responsive" responsiveLayout="scroll"
                    lazy loading={loading} rows={lazyParams.rows}
                    onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                    onFilter={onFilter} filterDisplay="row"
                    filters={lazyParams.filters}
                    isDataSelectable={isRowSelectable} rowClassName={rowClassName}
                    scrollable scrollHeight="flex" tableStyle={{ minWidth: '50rem' }}
                    paginator totalRecords={totalRecords} onPage={onPage} first={lazyParams.first}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                    rowsPerPageOptions={[5,10, 15]}
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    globalFilterFields={['name']}
                    selectionMode="single" selection={selectedRow}
                    onSelectionChange={(e) => {onSelection(e)}} 

                    emptyMessage="No data found."
                >
                    <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                    {columns.map((col, index) => {
                        return (
                            <Column key={index} field={col.field} header={col.header} body={col.body} filter filterPlaceholder={col.filterPlaceholder} sortable></Column>
                        )
                    })}
                </DataTable>
            </Dialog>
        </>
    );
}