import { classNames } from 'primereact/utils';
import SelectMasterData from '../SelectMasterData';

import { WAREHOUSE_MODEL } from '../../../constants/models';

export default function Warehouse({
    field, fieldState, onSelect,
}) {

    const fields = ["name","description", "_default"];

    return (
        <>
        <SelectMasterData field={field} modelName={WAREHOUSE_MODEL}
            caption='Select Warehouse'
            displayField="name" showFields={["name"]}
            className={classNames({ 'p-invalid': fieldState.error })} 
            onSelect={(e) => {
                onSelect(e);
            }}
            defaultFilters={{
                globalFilterFields: ['name', 'address', 'description'],
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
            columns={[
                {field: 'name', header: 'Warehouse', filterPlaceholder: 'Filter by Warehouse'},
                {field: 'address', header: 'Warehouse Address', filterPlaceholder: 'Filter by Warehouse Address'},
                {field: 'description', header: 'Warehouse Description', filterPlaceholder: 'Filter by Warehouse Description'},
            ]} />
        </>
    )
}