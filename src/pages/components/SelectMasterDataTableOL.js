import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputText } from 'primereact/inputtext';
import { MasterDataService } from '../../services/MasterDataService';

export default function SelectMasterDataTableOL({ trigger, fieldValue, onSelect, modelName, columns, showFields=[], caption="Select", dialogHeight='70vh', dialogWidth='80vw'}) {

    const dt = useRef(null);
    const op = useRef(null);
    const isMounted = useRef(false);

    let defaultFilters = {
        fields: showFields,
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS }            
        }
    };

    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
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
        }, Math.random() * 250);
    }

    useEffect(() => {
        initFilters();
    }, []);

    useEffect(() => {
        loadLazyData();
    }, [lazyParams]);

    // useEffect(() => {
    //     if (trigger) {
    //         showDialog();
    //     }
    // }, [trigger]);

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

    const onGlobalFilterChange = (e) => {
        let _lazyParams = { ...lazyParams };
        console.log(_lazyParams);

        const value = e.target.value;
        
        setGlobalFilterValue(value);

        if(value === null || value === undefined || value === '' || value.length < 1) {
            return;
        }

        _lazyParams['filters']['global'].value = value;
        _lazyParams['first'] = 0;
        setLazyParams(_lazyParams);
    };

    const onSelection = (e) => {
        // setTableDialog(false);
        op.current.hide();
        setGlobalFilterValue('');
        onSelect(e)
    }

    const isSelectable = (data) => data._id !== fieldValue;

    const isRowSelectable = (event) => (event.data ? isSelectable(event.data) : true);

    const rowClassName = (data) => (isSelectable(data) ? '' : 'p-disabled');

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
            </div>
        );
    };

    const header = renderHeader();

    return (
        <>
            {/* <Button icon="pi pi-search" className="p-button-warning" onClick={(e)=>{e.preventDefault(); showDialog()}} /> */}
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} 
                    onClick={(e) => {op.current.show(e)}}
                    onFocus={(e) => {e.target.select()}}
                    placeholder="Product Search" />
            </span>
            <OverlayPanel ref={op} showCloseIcon>
                <DataTable
                    ref={dt} value={tmpData} dataKey="_id"
                    className="datatable-responsive" responsiveLayout="scroll"
                    lazy loading={loading} rows={lazyParams.rows}
                    onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                    // onFilter={onFilter} 
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
                            <Column key={index} field={col.field} header={col.header} sortable></Column>
                        )
                    })}
                </DataTable>
            </OverlayPanel>
        </>
    );
}