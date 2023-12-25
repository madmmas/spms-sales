import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';
        
import SelectMasterDataTableOL from './SelectMasterDataTableOL';

import { MasterDataDBService } from '../../services/MasterDataDBService';

export default function SelectMasterDataAutoComplete({ field, displayField, showFields=[], modelName, className, columns, caption="Select", onSelect }) {

    const masterDataDBService = new MasterDataDBService();

    const [selectedRow, setSelectedRow] = useState('');
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        if(field.value==null || field.value=="") {
            setSelectedRow("");
            return;
        }
        masterDataDBService.getById(modelName, field.value).then(data => {
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
                modelName={modelName} caption={caption}
                className={className} columns={columns} showFields={showFields}
                onSelect={onSelection}/>

            <AutoComplete field="name" value={onSelection} suggestions={filteredCountries} 
                completeMethod={search} onChange={(e) => setSelectedCountry(e.value)} 
                itemTemplate={itemTemplate} />
     
        </>
    );
}