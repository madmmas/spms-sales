import axiosInstance from "./AxiosService";
import CacheMasterDataService from './CacheMasterDataService';

export class HRService {

    async getById(modelName, id) {
        let uri = `/data/${modelName}/` + id;
        const resp = await axiosInstance.get(uri,{
            timeout: 15000,
            id: uri,
            cache: {
                ttl: 1000 * 20 // 60 seconds.
            }
        });
        console.log(resp.data);
        return resp.data;
    }

    async getAll(modelName, params) {
        await CacheMasterDataService.checkAndLoadAllMasterData();

        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';
        let uri = `/data/${modelName}?` + queryParams;
        return axiosInstance.get(uri,{
            timeout: 15000,
            id: uri,
            cache: {
                ttl: 1000 * 20 // 60 seconds.
            }
        }).then(res => res.data);
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