import axiosInstance from "./AxiosService";

export class RegisterService {

    async getAll(registerType, params) {
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';
        let uri = `/register/${registerType}?` + queryParams;
        return axiosInstance.get(uri, {
            timeout: 15000,
            id: uri,
            cache: {
                ttl: 1000 * 1 // 20 seconds.
            }
        }).then(res => res.data);
    }

    async getById(id) {
        let uri = `/register_by/` + id;
        return axiosInstance.get(uri, {
            timeout: 15000,
            id: uri,
            cache: {
                ttl: 1000 * 1 // 1 seconds.
            }
        }).then(res => res.data);
    }
}