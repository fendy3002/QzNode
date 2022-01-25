import XLSX = require('xlsx');
import readAllRows from './readAllRows';
import * as types from '../types';


const rowObject = (ws, row) => {
    let obj: types.Excel.RowObject = {
        cell: (columnCode) => {
            return ws[columnCode + row];
        }
    };
    return obj;
};
const sheetObject = (qzExcel: types.Excel.QzExcel, ws, sheetName) => {
    let obj: types.Excel.SheetObject = {
        name: sheetName,
        row: (row) => {
            return rowObject(ws, row)
        },
        readAllRows: null
    };
    obj.readAllRows = readAllRows(qzExcel, obj);
    return obj;
};

class QzExcel implements types.Excel.QzExcel {
    private constructor(wb) {
        this.wb = wb;
    }
    wb;
    public static fromFilePath(path: string) {
        let wb = XLSX.readFile(path);
        return new QzExcel(wb);
    }
    getSheets() {
        let result: types.Excel.SheetObject[] = [];
        for (let sheetName of this.wb.SheetNames) {
            result.push(
                sheetObject(this, this.wb.Sheets[sheetName], sheetName)
            );
        }
        return result;
    }
    getSheetByName(sheetName) {
        return sheetObject(this, this.wb.Sheets[sheetName], sheetName);
    }
};

export default QzExcel;