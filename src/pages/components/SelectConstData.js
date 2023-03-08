import React, { useEffect } from "react";
import { Dropdown } from 'primereact/dropdown';

export default function SelectConstData( { field, className, data, placeholder = "" }) {

    const onChange = (e) => {
        field.onChange(e.value);
    }

    return (
        <Dropdown value={field.value} onChange={(e) => onChange(e)} 
            options={data} optionValue="id" optionLabel="name" placeholder={placeholder}
            className={className} />
    )
}
        