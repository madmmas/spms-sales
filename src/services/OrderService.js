import axiosInstance from "./AxiosService";

export class OrderService {

    async getById(orderType, id) {
        const resp = await axiosInstance.get(`/orders/${orderType}/${id}`);
        console.log(resp.data);
        return resp.data;
    }

    async getAll(orderType, params) {
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';

        return axiosInstance.get(`/orders/${orderType}?` + queryParams).then(res => res.data);
    }

    async create(orderType, data) {
        const resp = await axiosInstance.post(`/orders/${orderType}`, data);
        console.log(resp.data);
        return resp.data;
    }

    async update(orderType, id, data) {
        const resp = await axiosInstance.put(`/orders/${orderType}/` + id, data);
        console.log(resp.data);
        return resp.data;
    }

    async commit(orderType, id, data) {
        const resp = await axiosInstance.patch(`/orders/${orderType}/` + id, data);
        console.log(resp.data);
        return resp.data;
    }

    async cancel(orderType, id) {
        const resp = await axiosInstance.patch(`/orders/${orderType}/cancel/` + id);
        console.log(resp.data);
        return resp.data;
    }

    async return(orderType, id, data) {
        const resp = await axiosInstance.post(`/orders/${orderType}/returns/` + id, data);
        console.log(resp.data);
        return resp.data;
    }
}