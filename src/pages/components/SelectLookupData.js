import React, { useState, useEffect } from "react";
import { Dropdown } from 'primereact/dropdown';

import { MasterDataDBService } from '../../services/MasterDataDBService';

export default function SelectLookupData( { field, className, model, onChangeItem, showClear=false, placeholder = "" }) {

    const [data, setData] = useState([]);

    const masterDataDBService = new MasterDataDBService();

    useEffect(() => {
        console.log("SelectLookupData:useEffect", field.value, model)
        masterDataDBService.getAll(model, {
            first: 0,
            rows: 10000,
        }).then(data => {
            console.log("SelectLookupData:useEffect:data", data)
            setData(data.rows);
            // get the default value
            if((field.value===null || field.value===undefined || field.value==="") && onChangeItem){
                const item = data.rows.find(item => item._default === 1);
                console.log("SelectLookupData:useEffect:onChangeItem", item)
                if(item){
                    onChangeItem(item.id);
                }
            }
        });
    }, []);

    const onChange = (e) => {
        field.onChange(e.value);
    }

    return (
        <Dropdown value={field.value} onChange={(e) => onChange(e)} filter showClear={showClear}
            options={data} optionValue="id" optionLabel="name" placeholder={placeholder}
            className={className} />
    )
}
