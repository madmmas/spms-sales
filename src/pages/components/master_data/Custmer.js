import { classNames } from 'primereact/utils';
import SelectMasterData from '../SelectMasterData';

import { CUSTOMER_MODEL } from '../../../constants/models';

export default function Customer({
    field, fieldState, onSelect,
}) {

    const fields = ["name","address","route","phone","contact_name"];

    return (
        <>
        <SelectMasterData field={field} modelName={CUSTOMER_MODEL}
            caption='Select Customer'
            displayField="name" showFields={["name"]}
            onSelect={(e) => {
                onSelect(e);
                // field.onChange(e.id);                                
            }}
            defaultFilters={{
                globalFilterFields: ['name', 'contact_name','address','route','phone'],
                fields: fields,
                first: 0,
                rows: 10,
                page: 1,
                sortField: null,
                sortOrder: null,
                filters: {
                    global: { value: null, matchMode: 'contains' },
                }
            }}
            className={classNames({ 'p-invalid': fieldState.error })} 
            columns={[
                {field: 'name', header: 'Shop Name'},
                {field: 'address', header: 'Address'},
                {field: 'route', header: 'Route'},
                {field: 'phone', header: 'phone'},
                {field: 'contact_name', header: 'Contact Person'},
            ]} />
        </>
    )
}