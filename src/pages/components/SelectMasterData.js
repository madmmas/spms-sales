import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import SelectMasterDataTable from './SelectMasterDataTable';

import { MasterDataDBService } from '../../services/MasterDataDBService';

export default function SelectMasterData({ 
    field, displayField="shortname",
    showFields=[], modelName, className, 
    columns, caption="Select", onSelect,
    defaultFilters={
        globalFilterFields: ['name'],
        fields: [],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            global: { value: null, matchMode: 'contains' },
        }
    },
    displayFunc = (data) => {
        return data[displayField];
    }
}) {

    const masterDataDBService = new MasterDataDBService();

    const [selectedRow, setSelectedRow] = useState('');
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        if(field.value===null || field.value==="") {
            console.log("field.value is null");
            setSelectedRow("");
            return;
        }
        masterDataDBService.getById(modelName, field.value).then(data => {
            if(data===null || data.length===0) {
                console.log("data is null");
                setSelectedRow("");
                return;
            }
            setSelectedRow(displayFunc(data));
        });
    }, [field.value]);

    const onSelection = (e) => {
        setSelectedRow(displayFunc(e.value))
        field.onChange(e.value.id);
        onSelect(e.value)
    }

    return (
        <>
            <div className="p-inputgroup">
                <InputText readonly="true" value={selectedRow} placeholder={caption}  
                    className={className} 
                    onClick={() => setTrigger((trigger) => trigger + 1)} 
                    />
                <InputText hidden inputId={field.name} value={field.value} inputRef={field.ref} />
                <SelectMasterDataTable displayField={displayField} trigger={trigger}
                    defaultFilters={defaultFilters}
                    fieldName={field.name} fieldValue={field.value} fieldRef={field.ref}
                    modelName={modelName} caption={caption}
                    className={className} columns={columns} showFields={showFields}
                    onSelect={onSelection}/>
            </div>
        </>
    );
}