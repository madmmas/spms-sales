import { classNames } from 'primereact/utils';
import SelectMasterData from '../SelectMasterData';

import { MasterDataDBService } from '../../../services/MasterDataDBService';
import { MFS_ACCOUNT_MODEL } from '../../../constants/models';

export default function MFSAccount({
    field, fieldState, onSelect,
}) {

    const masterDataDBService = new MasterDataDBService();

    const fields = ['dtMFS_id', 'accName', 'refNumber'];

    return (
        <>
        <SelectMasterData field={field} modelName={MFS_ACCOUNT_MODEL}
            // displayField="dtMFS_id_shortname"
            displayFunc={(data) => {
                return `${masterDataDBService.getShortnameById("dtMFS", data.dtMFS_id)} - [${data.refNumber}]`;
            }}
            // showFields={["dtMFS_id", "refNumber", "accName"]}
            onSelect={(e) => onSelect(e)}
            className={classNames({ 'p-invalid': fieldState.error })} 
            defaultFilters={{
                globalFilterFields: ["refNumber", "accName", "shortname"],
                fields: fields,
                first: 0,
                rows: 10,
                page: 1,
                sortField: null,
                sortOrder: null,
                filters: {
                    global: { value: null, matchMode: 'contains' }
                }
            }}
            columns={[
                {field: 'dtMFS_id_shortname', header: 'MFS Name'},
                {field: 'accName', header: 'Account Name'},
                {field: 'refNumber', header: 'MFS Number'},
            ]} />
        </>
    )
}