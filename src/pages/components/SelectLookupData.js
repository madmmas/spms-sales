import React, { useState, useEffect } from "react";
import { Dropdown } from 'primereact/dropdown';
import { ConfigurationService } from '../../services/ConfigurationService';

export default function SelectLookupData( { field, className, model, placeholder = "" }) {

    const [data, setData] = useState([]);

    const configurationService = new ConfigurationService();

    useEffect(() => {
        configurationService.getAllWithoutParams(model).then(data => {
            setData(data);
        });
    }, []);

    const onChange = (e) => {
        field.onChange(e.value);
    }

    return (
        <Dropdown value={field.value} onChange={(e) => onChange(e)} 
            options={data} optionValue="_id" optionLabel="name" placeholder={placeholder}
            className={className} />
    )
}
        