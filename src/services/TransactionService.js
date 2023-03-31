import axiosInstance from "./AxiosService";

export class TransactionService {

    async getById(modelName, id) {
        const resp = await axiosInstance.get(`/data/${modelName}/` + id);
        console.log(resp.data);
        return resp.data;
    }

    async getAll(modelName, params) {
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';

        return axiosInstance.get(`/data/${modelName}?` + queryParams).then(res => res.data);
    }

    async processTransaction(trxName, data) {
        const resp = await axiosInstance.post(`/transaction/${trxName}`, data);
        console.log(resp.data);
        return resp.data;
    }
    
}