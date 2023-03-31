import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';

import { HRService } from '../../../services/HRService';
import { TransactionService } from '../../../services/TransactionService';
import { CASH_REGISTER } from '../../../constants/models';

const CashRegister = () => {

    const modelName = CASH_REGISTER;

    const toast = useRef(null);
    const dt = useRef(null);

    let defaultFilters = {
        fields: [],
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
    const [dtCashRegister, setCashRegister] = useState(null);
    const [lazyParams, setLazyParams] = useState(defaultFilters);
    const hrManagementService = new HRService();

    let loadLazyTimeout = null;

    const transactionService = new TransactionService();

    useEffect(() => {
        initFilters();
        // transactionService.getAllWithoutParams(BANK_MODEL).then(data => {
        //     setCashRegister(data);
        // });
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
            hrManagementService.getAll(modelName, { params: JSON.stringify(lazyParams) }).then(data => {
                console.log(data)
                setTotalRecords(data.total);
                setCashRegister(data.rows);
                setLoading(false);
            });
        }, Math.random() * 500 );
    }

    const exportCSV = () => {
        dt.current.exportCSV();
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


    const nameBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.name}
            </>
        );
    };

    const addToCash = () => {
        // transfer bank to cash
    };

    const withdrawFromCash = () => {
        // transfer cash to bank
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button onClick={() => addToCash()} className="p-button p-button-primary mr-2" label="Add to Cash" />
                <Button onClick={() => withdrawFromCash()} className="p-button p-button-success mr-2" label="Withdraw from Cash" />
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

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Cash Register</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Refresh" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt} value={dtCashRegister} dataKey="_id" 
                        className="datatable-responsive" responsiveLayout="scroll"
                        lazy loading={loading} rows={lazyParams.rows}
                        onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                        onFilter={onFilter} filters={lazyParams.filters} filterDisplay="menu"
                        scrollable columnResizeMode="expand" resizableColumns showGridlines
                        paginator totalRecords={totalRecords} onPage={onPage} first={lazyParams.first}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                        rowsPerPageOptions={[5,10,25,50]}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        emptyMessage="No data found." header={renderHeader} 
                    >
                        <Column field="accName" header="Account Name" filter filterPlaceholder="Search by name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default CashRegister;