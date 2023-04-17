import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { MasterDataService } from '../../services/MasterDataService';

export default function SelectMasterDataTableList({ defaultFilters, selectedItem, fieldValue, onSelect, modelName, columns, showFields=[]}) {

    const dt = useRef(null);
    const op = useRef(null);

    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyParams, setLazyParams] = useState(defaultFilters);
    const [tmpData, setTmpData] = useState([]);
    // const [selectedRow, setSelectedRow] = useState(selectedItem);

    const masterDataService = new MasterDataService();

    
    const loadLazyData = () => {
        setLoading(true);

        masterDataService.getAll(modelName, { params: JSON.stringify(lazyParams) }).then(data => {
            console.log(data)
            setTotalRecords(data.total);
            setTmpData(data.rows);
            setLoading(false);
        });
    }

    useEffect(() => {
        initFilters();
    }, []);

    useEffect(() => {
        loadLazyData();
    }, [lazyParams]);

    const initFilters = () => {
        setLazyParams(defaultFilters);
        setGlobalFilterValue('');
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

        if(value === null || value === undefined) {
            return;
        }

        _lazyParams['filters']['global'].value = value;
        _lazyParams['first'] = 0;
        setLazyParams(_lazyParams);
    };

    const onSelection = (e) => {
        if(op.current!==null && op !== undefined && op !== null){
            op.current.hide();
        }
        setGlobalFilterValue('');
        onSelect(e)
    }

    const isSelectable = (data) => data._id !== fieldValue;

    const isRowSelectable = (event) => (event.data ? isSelectable(event.data) : true);

    const rowClassName = (data) => (isSelectable(data) ? '' : 'p-disabled');

    return (
        <div style={{minHeight: '35rem'}}>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} 
                    onClick={(e) => {op.current.show(e)}}
                    onFocus={(e) => {e.target.select()}}
                    placeholder="Search" />
            </span>
                <DataTable
                    ref={dt} value={tmpData} dataKey="_id"
                    className="datatable-responsive" responsiveLayout="scroll"
                    lazy loading={loading} rows={lazyParams.rows}
                    onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                    onFilter={onFilter} filterDisplay="row"
                    filters={lazyParams.filters}
                    isDataSelectable={isRowSelectable} rowClassName={rowClassName}
                    columnResizeMode="expand" resizableColumns
                    scrollable scrollHeight="flex" tableStyle={{ minWidth: '50rem' }}
                    paginator totalRecords={totalRecords} onPage={onPage} first={lazyParams.first}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                    rowsPerPageOptions={[5,10, 15]}
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    globalFilterFields={['name']}
                    selectionMode="single" selection={selectedItem}
                    onSelectionChange={(e) => {
                        if(e.value){
                            onSelection(e)
                        }
                        console.log("SELECTED::"+e)
                    }} 

                    emptyMessage="No data found."
                >
                    <Column selectionMode="single" headerStyle={{ minWidth: '3rem' }}></Column>
                    {columns.map((col, index) => {
                        return (
                            <Column key={index} field={col.field} header={col.header} filter filterPlaceholder={col.filterPlaceholder} sortable headerStyle={{ minWidth: col.minWidth }}></Column>
                        )
                    })}
                </DataTable>
        </div>
    );
}