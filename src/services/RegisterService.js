import axiosInstance from "./AxiosService";

export class RegisterService {

    async getAll(registerType, params) {
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';

        return axiosInstance.get(`/register/${registerType}?` + queryParams).then(res => res.data);
    }
}