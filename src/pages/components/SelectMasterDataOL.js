import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import SelectMasterDataTableOL from './SelectMasterDataTableOL';

import { PRODUCT_MODEL } from '../../constants/models';

import { MasterDataDBService } from '../../services/MasterDataDBService';

export default function SelectMasterDataOL({ field, displayField, showFields=[], defaultFilters, modelName, className, columns, caption="Select", onSelect }) {

    const masterDataDBService = new MasterDataDBService();

    const [selectedRow, setSelectedRow] = useState('');
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        if(field.value==null || field.value=="") {
            setSelectedRow("");
            return;
        }
        masterDataDBService.getById(PRODUCT_MODEL, field.value).then(data => {
            setSelectedRow(data[displayField]);
        });
    }, [field.value]);

    const onSelection = (e) => {
        setSelectedRow(e.value[displayField]);
        field.onChange(e.value.id);
        onSelect(e.value)
    }

    return (
        <>
            <InputText readonly="true" value={selectedRow} placeholder={caption}  
                className={className} 
                onClick={() => setTrigger((trigger) => trigger + 1)} 
                />
            <InputText hidden inputId={field.name} value={field.value} inputRef={field.ref} />
            <SelectMasterDataTableOL displayField={displayField} trigger={trigger}
                fieldName={field.name} fieldValue={field.value} fieldRef={field.ref}
                defaultFilters={defaultFilters}
                modelName={modelName} caption={caption}
                className={className} columns={columns} showFields={showFields}
                onSelect={onSelection}/>
        </>
    );
}