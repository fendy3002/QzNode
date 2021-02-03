import * as types from '../types';

const service = (qzExcel: types.Qz.Excel.QzExcel, qzSheet: types.Qz.Excel.SheetObject) => {
    const readAllRows: types.Qz.Excel.ReadAllRows = (schema, option) => {
        let useOption = {
            skipRow: option.skipRow ?? 1,
            rowHasNext: option.rowHasNext ? option.rowHasNext : (row) => {
                return row.cell("A").v != null;
            }
        };
        let wsResult = [];
        let isContinue = true;
        while (isContinue) {
            let currentExcelRow = 1 + option.skipRow;
            let recordRow = 1;
            let rowObj = qzSheet.row(currentExcelRow);
            let rowRecord: types.Qz.Excel.ReadAllRowsRecord = {
                _row: recordRow,
                _excelRow: currentExcelRow
            };

            if (useOption.rowHasNext(rowObj)) {
                for (let propName of Object.keys(schema)) {
                    let propSchema = schema[propName];
                    if (typeof propSchema == "string") {
                        rowRecord[propName] = rowObj.cell(propSchema).v;
                    }
                    else {
                        rowRecord[propName] = propSchema(rowObj);
                    }
                }
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