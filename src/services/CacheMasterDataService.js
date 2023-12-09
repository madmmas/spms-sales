import { axiosInstance } from "./AxiosService";
import moment from 'moment';

const loadUpdatedMasterData = async (masterDataCacheUpdatedTime) => {
    let resp = {data: {rows: []}};
    resp = await axiosInstance.get(`/allmaster/` + masterDataCacheUpdatedTime, {
        timeout: 15000,
        cache: {
            ttl: 1000 * 20 // 1 minute.
        }
    });        
    return resp.data;
}

const checkAndLoadAllMasterData = async () => {
    let masterData = window['__all_masterData'];
    if (masterData===undefined) {
        masterData = JSON.parse(localStorage.getItem("masterData"));
        window['__all_masterData'] = masterData;
    }

    let masterDataCacheUpdatedTime = JSON.parse(localStorage.getItem("masterDataCacheUpdatedTime"));
    if (!masterDataCacheUpdatedTime && (!masterData || masterData.length == 0)) {
        masterDataCacheUpdatedTime = 0;
    } else {
        if (masterDataCacheUpdatedTime && moment(masterDataCacheUpdatedTime).isAfter(moment().subtract(1, 'minutes'))) {
            console.log("masterData cache is updated less than 1 minutes ago");
            return masterData;
        }    
    }

    let data = await loadUpdatedMasterData(masterDataCacheUpdatedTime);

    if(masterDataCacheUpdatedTime == 0) {
        window['__all_masterData'] = data.rows;
        localStorage.setItem("masterData", JSON.stringify(data.rows));
        return data.rows;
    }
    
    let rows = data.rows;
    if (rows && rows.length > 0) {
        for (var i = 0; i < rows.length; i++) {
            let found = false;
            for (var j = 0; j < masterData.length; j++) {
                if (rows[i].id == masterData[j].id) {
                    masterData[j] = rows[i];
                    found = true;
                    break;
                }
            }
            if (!found) {
                masterData.push(rows[i]);
            }
        }
        localStorage.setItem("masterData", JSON.stringify(masterData));
    }
    // get momentjs datetime in yyyy-MM-dd HH:mm:ss format
    let updatedTime = moment().format('YYYY-MM-DD HH:mm:ss');
    localStorage.setItem("masterDataCacheUpdatedTime", JSON.stringify(updatedTime));

    return masterData;
}

const getShortnameById = (id) => {
    let masterData = window['__all_masterData'];
    if (masterData) {
        for (var i = 0; i < masterData.length; i++) {
            if (masterData[i].id == id) {
                return masterData[i].shortname;
            }
        }
    }
    return "";
}

const clearMasterDataCacheAndReload = async () => {
    localStorage.removeItem("masterDataCacheUpdatedTime");
    localStorage.removeItem("masterData");
    await checkAndLoadAllMasterData();
}

export default {
    getShortnameById,
    loadUpdatedMasterData,
    checkAndLoadAllMasterData,
    clearMasterDataCacheAndReload,
}