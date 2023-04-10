import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import SelectMasterDataTable from './SelectMasterDataTable';

import { MasterDataService } from '../../services/MasterDataService';

export default function SelectMasterData({ field, displayField, showFields=[], modelName, className, columns, caption="Select", onSelect }) {

    const masterDataService = new MasterDataService();

    const [selectedRow, setSelectedRow] = useState('');
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        if(field.value==null || field.value=="") {
            setSelectedRow("");
            return;
        }
        masterDataService.getById(modelName, field.value).then(data => {
            setSelectedRow(data[displayField]);
        });
    }, [field.value]);

    const onSelection = (e) => {
        setSelectedRow(e.value[displayField]);
        field.onChange(e.value._id);
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
                    fieldName={field.name} fieldValue={field.value} fieldRef={field.ref}
                    modelName={modelName} caption={caption}
                    className={className} columns={columns} showFields={showFields}
                    onSelect={onSelection}/>
            </div>
            
        </>
    );
}