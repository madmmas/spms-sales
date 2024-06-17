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

    async getReport(report_name, params) {
        // conver json into query string
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';
        let uri = `/report/${report_name}?` + queryParams;
        const resp = await axiosInstance.get(uri, {
            timeout: 15000,
            id: uri,
            cache: {
                ttl: 1000 * 1 // 20 seconds.
            }
        });
        console.log(resp.data);
        return resp.data;
    }

    async getReportBy(report_name, params) {
        // conver json into query string
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';
        let uri = `/report/${report_name}/by?` + queryParams;
        const resp = await axiosInstance.get(uri, {
            timeout: 15000,
            id: uri,
            cache: {
                ttl: 1000 * 1 // 20 seconds.
            }
        });
        console.log(resp.data);
        return resp.data;
    }

    async getLedgerReport(cacode, params) {
        // conver json into query string
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';
        let uri = `/report/ledger/${cacode}?` + queryParams;
        const resp = await axiosInstance.get(uri, {
            timeout: 15000,
            id: uri,
            cache: {
                ttl: 1000 * 1 // 20 seconds.
            }
        });
        console.log("LedgerReport::", resp.data);
        // sort by id
        resp.data.ledger.sort((a, b) => a.id - b.id);
        // add serial no
        resp.data.ledger.forEach((l, i) => l.sl = i + 1);
        return resp.data;
    }

    async getLedgerBalanceUpto(cacode, upto) {
        let uri = `/ledger/balance/${cacode}/${upto}`;
        const resp = await axiosInstance.get(uri, {
            timeout: 15000,
            id: uri,
            cache: {
                ttl: 1000 * 1 // 20 seconds.
            }
        });
        console.log(resp.data);
        return resp.data;
    }

    async getReportByQueryName(report_name, query_name, params) {
        // conver json into query string
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';
        let uri = `/report/${report_name}/${query_name}?` + queryParams;
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

    // TODO : remove this method
    async getLedgerByPartyId(partyId) {
        // let uri = `/ledger_by_id/${partyId}`;
        // const resp = await axiosInstance.get(uri, {
        //     timeout: 15000,
        //     id: uri,
        //     cache: {
        //         ttl: 1000 * 20 // 20 seconds.
        //     }
        // });
        // console.log(resp.data);
        // return resp.data;
        return []
    }

    async stockAdjustment(data) {
        const resp = await axiosInstance.post(`/stock_adjustment`, data);
        console.log(resp.data);
        return resp.data;
    }

    async damageStock(data) {
        const resp = await axiosInstance.post(`/damage_stock`, data);
        console.log(resp.data);
        return resp.data;
    }

    async generaleExpenses(data) {
        let resp = {}
        if(data.trx_no === null || data.trx_no === undefined || data.trx_no === "") {
            resp = await axiosInstance.post(`/expenses`, data);
        } else {
            resp = await axiosInstance.put(`/expenses/` + data.trx_no, data);
        }
        console.log(resp.data);
        return resp.data;
    }

    async generaleIncome(data) {
        let resp = {}
        if(data.trx_no === null || data.trx_no === undefined || data.trx_no === "") {
            resp = await axiosInstance.post(`/income`, data);
        } else {
            resp = await axiosInstance.put(`/income/` + data.trx_no, data);
        }
        console.log(resp.data);
        return resp.data;
    }

    async ledgerAdjustment(data) {
        const resp = await axiosInstance.post(`/adjustments`, data);
        console.log(resp.data);
        return resp.data;
    }

    async transferCash(to, data) {
        data.from_ref_type = 'CASH';
        data.to_ref_type = to;
        const resp = await axiosInstance.post(`/transfer/CASH/`+to, data);
        console.log(resp.data);
        return resp.data;
    }

    async transferBank(to, data) {
        data.from_ref_type = 'BANK';
        data.to_ref_type = to;
        const resp = await axiosInstance.post(`/transfer/BANK/`+to, data);
        console.log(resp.data);
        return resp.data;
    }

    async transferMFS(to, data) {
        data.from_ref_type = 'MFS';
        data.to_ref_type = to;
        const resp = await axiosInstance.post(`/transfer/MFS/`+to, data);
        console.log(resp.data);
        return resp.data;
    }

    async commitPayment(paymentType, payment) {
        const resp = await axiosInstance.post(`/payment/${paymentType}`, payment);
        console.log(resp.data);
        // delayed response
        // await new Promise(resolve => setTimeout(resolve, 1000));
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