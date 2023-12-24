import { MasterDataDBService } from '../../services/MasterDataDBService';

export const shortnameBodyTemplate = (data, fieldName) => {

    const masterDataDBService = new MasterDataDBService();

    return (
        <>
            {masterDataDBService.getShortnameById(fieldName, data[fieldName])}
        </>
    );
};