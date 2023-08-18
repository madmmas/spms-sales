import * as moment from 'moment';

export const getDateFormatted = (date) => {
    return moment(date).format('DD/MM/YYYY');
}

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

export const roundNumber = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
};
