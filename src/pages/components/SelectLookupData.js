import React, { useState, useEffect } from "react";
import { Dropdown } from 'primereact/dropdown';

import { MasterDataDBService } from '../../services/MasterDataDBService';

export default function SelectLookupData( { field, className, model, onChangeItem, placeholder = "" }) {

    const [data, setData] = useState([]);

    const masterDataDBService = new MasterDataDBService();

    useEffect(() => {
        masterDataDBService.getAll(model).then(data => {
            setData(data.rows);
        });
    }, []);

    const onChange = (e) => {
        field.onChange(e.value);
        if(onChangeItem){
            onChangeItem(e.value);
        }
    }

    return (
        <Dropdown value={field.value} onChange={(e) => onChange(e)} filter
            options={data} optionValue="id" optionLabel="name" placeholder={placeholder}
            className={className} />
    )
}
        