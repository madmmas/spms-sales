import React, { useState, useEffect } from "react";
import { Dropdown } from 'primereact/dropdown';
import { ConfigurationService } from '../../services/ConfigurationService';

export default function SelectLookupData( { field, className, model, onChangeItem, placeholder = "" }) {

    const [data, setData] = useState([]);

    const configurationService = new ConfigurationService();

    useEffect(() => {
        configurationService.getAllWithoutParams(model).then(data => {
            setData(data);
            // if(data.length > 0) { field.onChange(data[0]._id); }
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
            options={data} optionValue="_id" optionLabel="name" placeholder={placeholder}
            className={className} />
    )
}
        