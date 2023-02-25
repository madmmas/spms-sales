import axiosInstance from "./AxiosService";

export class HRService {

    async getAll(params) {
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';

        return axiosInstance.get(`/data/emp_attendance?` + queryParams).then(res => res.data);
    }

    async getEmpDailyAttendance(filter) {
        return axiosInstance.post(`/data/fetch/EmpDailyAttendance`, filter).then(res => res.data);
    }
    async getEmpInfo(filter) {
        return axiosInstance.post(`/data/fetch/EmpInfo`, filter).then(res => res.data);
    }
    // async getCdrs(params) {
    //     const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';

    //     // return axiosInstance.get(`/cdr?`+queryParams).then(res => res.data);
    //     return axiosInstance.post(`data/fetch/EmpDailyAttendance`, {
    //         "filter": {
    //             "date" : "25/11/2022"
    //         }
    //     }).then(res => res.data.data);
    // }
    async exportCSV(params) {
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';

        return axiosInstance.get(`/cdr/export?`+queryParams, { responseType: 'arraybuffer', timeout: 5000 }).then(res => res.data);
    }

}