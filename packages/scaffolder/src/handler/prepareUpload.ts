import { error } from '@fendy3002/qz-node';
import {
    handler
} from '../crudAssignerType';

let prepareUpload: handler.prepareUpload = ({ req, fields, onSave }) => {
    return async ({ ...params }) => {
        let files: any = {};
        for (let prop of fields.map(k => k.name)) {
            files[prop] = req.files[prop] || [];
        }
        await onSave({ ...params, files });
    };
};
export { prepareUpload };