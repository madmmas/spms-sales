import axiosInstance from "./AxiosService";

export class ConfigurationService {

    async getNextId(modelName) {
        const resp = await axiosInstance.get(`/nextid/${modelName}`);
        // console.log(resp.data);
        return resp.data;
    }

    async getById(modelName, id) {
        const resp = await axiosInstance.get(`/data/${modelName}/` + id);
        console.log(resp.data);
        return resp.data;
    }

    async getAll(modelName, params) {
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';

        return axiosInstance.get(`/data/${modelName}?` + queryParams).then(res => res.data);
    }

    async getAllWithoutParams(modelName) {
        // const params = {"first":0,"rows":10,"page":1,"sortField":null,"sortOrder":null,"filters":{"name":{"operator":"or","constraints":[{"value":null,"matchMode":"startsWith"}]}}}
        const params = { params: JSON.stringify({"rows":100})};
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';

        return axiosInstance.get(`/data/${modelName}?` + queryParams).then(res => res.data.rows);
    }

    async create(modelName, data) {
        const resp = await axiosInstance.post(`/data/${modelName}`, data);
        console.log(resp.data);
        return resp.data;
    }

    async update(modelName, id, data) {
        const resp = await axiosInstance.put(`/data/${modelName}/` + id, data);
        console.log(resp.data);
        return resp.data;
    }

    async delete(modelName, id) {
        const resp = await axiosInstance.delete(`/data/${modelName}/` + id);
        console.log(resp.data);
        return resp.data;
    }
}