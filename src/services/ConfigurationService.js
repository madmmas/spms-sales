import axiosInstance from "./AxiosService";

export class ConfigurationService {

    async getNextId(modelName) {
        
        const resp = await axiosInstance.get(`/nextid/${modelName}`,{ cache: false });
        // console.log(resp.data);
        return resp.data;
    }

    async getAllWithoutParams(modelName) {
        // const params = {"first":0,"rows":10,"page":1,"sortField":null,"sortOrder":null,"filters":{"name":{"operator":"or","constraints":[{"value":null,"matchMode":"startsWith"}]}}}
        const params = { params: JSON.stringify({"rows":1000})};
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';

        let uri = `/data/${modelName}?` + queryParams;
        return axiosInstance.get(uri,{
            timeout: 15000,
            id: uri,
            cache: {
                ttl: 1000 * 10 // 10 seconds.
            }
        }).then(res => res.data.rows);
    }
}