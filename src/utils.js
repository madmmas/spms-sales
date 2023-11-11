import * as moment from 'moment';
import numWords from 'num-words';

export const numToDigits = (num) => {
    let numWords = {
        0: "zero",
        1: "one",
        2: "two",
        3: "three",
        4: "four", 
        5: "five",
        6: "six",
        7: "seven",
        8: "eight",
        9: "nine" 
    }
    let word = "";
    for(let i=0; i<num.length; i++){
        word += numWords[num[i]] + " ";
    }
    return word;
}

export const getNumToWords = (num) => {
    // convert number to string
    num = num.toString();
    // get the number before dicimal
    let num1 = num.split(".")[0];
    // get the number after dicimal
    let num2 = num.split(".")[1];

    return numWords(num1) + " point " + numToDigits(num2);
}

export const getDateWithFormat = (date, format) => {
    return moment(date).format(format);
}

export const getDateFormatted = (date) => {
    return moment(date).format('DD/MM/YYYY');
}

export const getTimeFormatted = (date) => {
    return moment(date).format('hh:mm:ss');
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
