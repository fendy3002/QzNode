import * as types from '../types';

const service = (qzExcel: types.Qz.Excel.QzExcel, qzSheet: types.Qz.Excel.SheetObject) => {
    const readAllRows: types.Qz.Excel.ReadAllRows = async (schema, option) => {
        let useOption = {
            skipRow: option?.skipRow ?? 1,
            rowHasNext: option?.rowHasNext ? option.rowHasNext : (row) => {
                return row.cell("A")?.v != null;
            }
        };
        let wsResult = [];
        let isContinue = true;
        let currentExcelRow = 1 + useOption.skipRow;
        let recordRow = 1;
        while (isContinue) {
            let rowObj = qzSheet.row(currentExcelRow);
            if (useOption.rowHasNext(rowObj)) {
                let rowRecord: types.Qz.Excel.ReadAllRowsRecord = {
                    _row: recordRow,
                    _excelRow: currentExcelRow
                };
                for (let propName of Object.keys(schema)) {
                    let propSchema = schema[propName];
                    if (typeof propSchema == "string") {
                        rowRecord[propName] = rowObj.cell(propSchema).v;
                    }
                    else {
                        rowRecord[propName] = propSchema(rowObj);
                    }
                }
                wsResult.push(rowRecord);
                currentExcelRow++;
                recordRow++;
            }
            else {
                isContinue = false;
            }
        }
        return wsResult;
    };
    return readAllRows;
}
export default service;