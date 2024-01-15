import { classNames } from 'primereact/utils';
import SelectMasterData from '../SelectMasterData';

import { MasterDataDBService } from '../../../services/MasterDataDBService';
import { BANK_ACCOUNT_MODEL } from '../../../constants/models';

export default function BankAccount({
    field, fieldState, onSelect,
}) {

    const masterDataDBService = new MasterDataDBService();

    const fields = ["dtBank_id", "refNumber", "accName"];

    return (
        <>
        <SelectMasterData field={field} modelName={BANK_ACCOUNT_MODEL}
            // displayField="dtMFS_id_shortname"
            displayFunc={(data) => {
                return `${masterDataDBService.getShortnameById("dtBank", data.dtBank_id)} - [${data.accNumber}]`;
            }}
            onSelect={(e) => onSelect(e)}
            className={classNames({ 'p-invalid': fieldState.error })} 
            defaultFilters={{
                globalFilterFields: ["accNumber", "accName", 'shortname'],
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
                {field: 'dtBank_id_shortname', header: 'Bank Name'},
                {field: 'accName', header: 'Account Name'},
                {field: 'accNumber', header: 'Account Number'},
            ]} />
        </>
    )
}