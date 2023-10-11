import axiosInstance from "./AxiosService";

export class TransactionService {

    async getById(modelName, id) {
        let uri = `/trxdata/${modelName}/` + id;
        const resp = await axiosInstance.get(uri, {
            timeout: 15000,
            id: uri,
            cache: {
                ttl: 1000 * 20 // 20 seconds.
            }
        });
        console.log(resp.data);
        return resp.data;
    }

    async getLedgerByParty(partyType) {
        let uri = `/ledger/${partyType}`;
        const resp = await axiosInstance.get(uri, {
            timeout: 15000,
            id: uri,
            cache: {
                ttl: 1000 * 20 // 20 seconds.
            }
        });
        console.log(resp.data);
        return resp.data;
    }

    async getLedgerByPartyTypeAndId(partyType, partyId) {
        let uri = `/ledger/${partyType}/${partyId}`;
        const resp = await axiosInstance.get(uri, {
            timeout: 15000,
            id: uri,
            cache: {
                ttl: 1000 * 20 // 20 seconds.
            }
        });
        console.log(resp.data);
        return resp.data;
    }

    async getLedgerByPartyId(partyId) {
        let uri = `/ledger_by_id/${partyId}`;
        const resp = await axiosInstance.get(uri, {
            timeout: 15000,
            id: uri,
            cache: {
                ttl: 1000 * 20 // 20 seconds.
            }
        });
        console.log(resp.data);
        return resp.data;
    }

    async transferCash(to, data) {
        const resp = await axiosInstance.post(`/transfer/CASH/`+to, data);
        console.log(resp.data);
        return resp.data;
    }

    async transferBank(to, data) {
        const resp = await axiosInstance.post(`/transfer/BANK/`+to, data);
        console.log(resp.data);
        return resp.data;
    }

    async transferMFS(to, data) {
        const resp = await axiosInstance.post(`/transfer/MFS/`+to, data);
        console.log(resp.data);
        return resp.data;
    }

    async commitPayment(paymentType, payment) {
        const resp = await axiosInstance.post(`/payment/${paymentType}`, payment);
        console.log(resp.data);
        return resp.data;
    }

    async getAll(modelName, params) {
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';
        let uri = `/trxdata/${modelName}?` + queryParams;
        return axiosInstance.get(uri, {
            timeout: 15000,
            id: uri,
            cache: {
                ttl: 1000 * 20 // 20 seconds.
            }
        }).then(res => res.data);
    }

    async processTransaction(trxName, data) {
        const resp = await axiosInstance.post(`/transaction/${trxName}`, data);
        console.log(resp.data);
        return resp.data;
    }
    
}