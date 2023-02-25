import axiosInstance from "../AxiosService";

export class EmpAlledanceService {

    async getById(id) {
        const resp = await axiosInstance.get(`/data/emp_attendance/` + id);
        console.log(resp.data);
        return resp.data;
    }

    async getAll(params) {
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';

        return axiosInstance.get(`/data/emp_attendance?` + queryParams).then(res => res.data);
    }

    
    async create(data) {
        const resp = await axiosInstance.post(`/data/emp_attendance`, data);
        console.log(resp.data);
        return resp.data;
    }

    async update(id, data) {
        const resp = await axiosInstance.put(`/data/emp_attendance/` + id, data);
        console.log(resp.data);
        return resp.data;
    }

    async delete(id) {
        const resp = await axiosInstance.delete(`/data/emp_attendance/` + id);
        console.log(resp.data);
        return resp.data;
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