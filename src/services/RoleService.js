import axiosInstance from "./AxiosService";

export class RoleService {
    
    async getRoles() {
        return axiosInstance.get(`/roles`).then(res => res.data.data);
    }
}