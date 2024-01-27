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
    
    if((Number(num2) === 0) || (num2 === undefined)){
      return numWords(num1);
    }

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

export const getDateTimeFormatted = (date) => {
    return moment(date).format('DD/MM/YYYY hh:mm:ss');
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

export const getLedgerFormattedNumber = (num, options = {
    style: 'decimal',  // Other options: 'currency', 'percent', etc.
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
}) => {
    if (num < 0) {
        return '(' + parseFloat(-num).toLocaleString('en-IN', options) + ')';
    }
    return parseFloat(num).toLocaleString('en-IN', options);
}

export const getFormattedNumber = (num, options = {
    style: 'decimal',  // Other options: 'currency', 'percent', etc.
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
}) => {
    return parseFloat(num).toLocaleString('en-IN', options);
}

export const roundNumber = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const exportDataInExcel = (filename, data) => {
    import('xlsx').then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ["Product-Stock"] };
        const excelBuffer = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });

        saveAsExcelFile(excelBuffer, filename);
    });
};

export const exportSheetDataInExcel = (filename, sheetcontents) => {
    import('xlsx').then((xlsx) => {
        // const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = xlsx.utils.book_new();

        sheetcontents.forEach((sheetcontent) => {
            const worksheet = xlsx.utils.json_to_sheet(sheetcontent.data);
            xlsx.utils.book_append_sheet(workbook, worksheet, sheetcontent.name);
        });

        const excelBuffer = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });

        saveAsExcelFile(excelBuffer, filename);
    });
};

export const saveAsExcelFile = (buffer, fileName) => {
    import('file-saver').then((module) => {
        if (module && module.default) {
            let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            let EXCEL_EXTENSION = '.xlsx';
            const data = new Blob([buffer], {
                type: EXCEL_TYPE
            });

            module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
        }
    });
};