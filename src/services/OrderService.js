import axiosInstance from "./AxiosService";

export class OrderService {

    async getById(orderType, id) {
        let uri = `/orders/${orderType}/${id}`;
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

    async getAll(orderType, params) {
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';
        let uri = `/orders/${orderType}?` + queryParams;
        return axiosInstance.get(uri,{
            timeout: 15000,
            id: uri,
            cache: {
                ttl: 1000 * 20 // 20 seconds.
            }
        }).then(res => res.data);
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

    async confirmPayment(id, data) {
        const resp = await axiosInstance.patch(`/confirm_order/` + id, data);
        console.log(resp.data);
        return resp.data;
    }

    async cancel(orderType, id, data) {
        const resp = await axiosInstance.patch(`/orders/${orderType}/cancel/` + id, data);
        console.log(resp.data);
        return resp.data;
    }

    async return(orderType, id, data) {
        const resp = await axiosInstance.post(`/orders/${orderType}/returns/` + id, data);
        console.log(resp.data);
        return resp.data;
    }

    async getOrderProductLastPrice(orderType, productId, customerId) {
        let uri = `/last_product_price/${orderType}/${customerId}/${productId}`;
        const resp = await axiosInstance.get(uri, {
            timeout: 15000,
            id: uri,
            cache: {
                ttl: 1000 * 20 // 20 seconds.
            }
        });
        console.log(resp.data);
        return resp.data? resp.data.last_price : 0;
    }

    async getLedgerBalance(ledgerType, partyId) {
        let uri = `/ledger_balance/${ledgerType}/${partyId}`;
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
}