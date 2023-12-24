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
            displayField="name"
            className={classNames({ 'p-invalid': fieldState.error })} 
            onSelect={(e) => {
                onSelect(e);
            }}
            columns={[
                {field: 'name', header: 'Warehouse', filterPlaceholder: 'Filter by Warehouse'}, 
            ]} />
        </>
    )
}