import * as moment from 'moment';

export const getDate = (date) => {
    return moment(parseInt(date)).format('DD/MM/YYYY');
}

export const getDatetime = (date) => {
    return moment(parseInt(date)).format('DD/MM/YYYY hh:mm:ss');
}

export const getConstantNameById = (id, data) => {
    let item = data.find(item => item.id === id);
    return item ? item.name : '';
}