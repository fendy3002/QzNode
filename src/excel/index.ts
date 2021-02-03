import XLSX = require('xlsx');
import * as types from '../types';

class QzExcel implements types.Qz.Excel.QzExcel{
    private constructor(wb) { 
        this.wb = wb;
    }
    wb;
    public static fromFilePath(path: string) {
        let wb = XLSX.readFile(path);
        return new QzExcel(wb);
    }
    readAllRows(schema, option){
        return null;
    }
    getSheets() {
        return null;
    }
};

export default QzExcel;