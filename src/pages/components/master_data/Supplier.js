import { classNames } from 'primereact/utils';
import SelectMasterData from '../SelectMasterData';

import { SUPPLIER_MODEL } from '../../../constants/models';

export default function Supplier({
    field, fieldState, onSelect,
}) {

    const fields = ["name","address","phone"];

    return (
        <>
        <SelectMasterData field={field} modelName={SUPPLIER_MODEL}
            caption='Select Supplier'
            displayField="name" showFields={["name"]}
            onSelect={(e) => {
                onSelect(e);
            }}
            defaultFilters={{
                globalFilterFields: ['name', 'phone'],
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
                {field: 'name', header: 'Name'},
                {field: 'address', header: 'Address'},
                {field: 'phone', header: 'phone'},
            ]} />
        </>
    )
}