import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import SelectMasterDataTable from './SelectMasterDataTable';

import { MasterDataService } from '../../services/MasterDataService';

export default function SelectMasterData({ field, displayField, modelName, className, columns, caption="Select" }) {

    const masterDataService = new MasterDataService();

    const [selectedRow, setSelectedRow] = useState('');

    useEffect(() => {
        masterDataService.getById(modelName, field.value).then(data => {
            setSelectedRow(data[displayField]);
        });
    }, []);

    const onSelection = (e) => {
        setSelectedRow(e.value[displayField]);
        field.onChange(e.value._id);
    }

    return (
        <>
            <div className="p-inputgroup">
                <InputText readonly="true" value={selectedRow} placeholder={caption}  
                    className={className} 
                    // onClick={()=>setShowDialog(true)}
                    />
                <InputText hidden inputId={field.name} value={field.value} inputRef={field.ref} />
                <SelectMasterDataTable displayField={displayField}
                    fieldName={field.name} fieldValue={field.value} fieldRef={field.ref}
                    modelName={modelName} caption={caption}
                    className={className} columns={columns} 
                    onSelect={onSelection}/>
            </div>
            
        </>
    );
}