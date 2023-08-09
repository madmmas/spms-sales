import axiosInstance from "./AxiosService";

export class TransactionService {

    async getById(modelName, id) {
        const resp = await axiosInstance.get(`/trxdata/${modelName}/${id}`);
        console.log(resp.data);
        return resp.data;
    }

    async getLedgerByParty(partyType) {
        const resp = await axiosInstance.get(`/ledger/${partyType}`);
        console.log(resp.data);
        return resp.data;
    }

    async getLedgerByPartyId(partyType, partyId) {
        const resp = await axiosInstance.get(`/ledger/${partyType}/${partyId}`);
        console.log(resp.data);
        return resp.data;
    }

    async getAll(modelName, params) {
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';

        return axiosInstance.get(`/trxdata/${modelName}?` + queryParams).then(res => res.data);
    }

    async processTransaction(trxName, data) {
        const resp = await axiosInstance.post(`/transaction/${trxName}`, data);
        console.log(resp.data);
        return resp.data;
    }
    
}